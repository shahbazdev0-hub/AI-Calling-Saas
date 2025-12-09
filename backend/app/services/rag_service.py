# backend/app/services/rag_service.py - RAG SERVICE FOR DOCUMENT TRAINING

import os
import logging
import hashlib
from datetime import datetime
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
import aiofiles
import numpy as np

# Document processing
import PyPDF2
from docx import Document as DocxDocument
import io

# OpenAI for embeddings
import openai
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)


class RAGService:
    """
    Retrieval-Augmented Generation Service
    Handles document upload, processing, embedding generation, and similarity search
    """
    
    def __init__(self):
        self.openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.upload_base_path = Path("uploads/agent_documents")
        self.upload_base_path.mkdir(parents=True, exist_ok=True)
        
        # RAG Configuration
        self.chunk_size = 500  # Characters per chunk
        self.chunk_overlap = 50  # Overlap between chunks
        self.embedding_model = "text-embedding-ada-002"  # OpenAI embedding model
        self.similarity_threshold = 0.75  # Minimum cosine similarity for relevant results
        self.max_results = 3  # Maximum number of chunks to return
    
    
    # ============================================
    # DOCUMENT UPLOAD & PROCESSING
    # ============================================
    
    async def upload_and_process_document(
        self,
        file_content: bytes,
        filename: str,
        content_type: str,
        agent_id: str,
        user_id: str,
        db: AsyncIOMotorDatabase
    ) -> Dict[str, Any]:
        """
        Upload document and process it for RAG
        
        Steps:
        1. Validate file
        2. Save to disk
        3. Extract text
        4. Create chunks
        5. Generate embeddings
        6. Store in database
        """
        try:
            logger.info(f"📄 Starting document upload for agent {agent_id}")
            
            # Step 1: Validate file
            validation = self._validate_file(filename, content_type, len(file_content))
            if not validation['valid']:
                return {
                    "success": False,
                    "error": validation['error']
                }
            
            # Step 2: Save file to disk
            file_path = await self._save_file(
                file_content,
                filename,
                agent_id,
                user_id
            )
            
            # Step 3: Create document record
            doc_id = await self._create_document_record(
                agent_id=agent_id,
                user_id=user_id,
                filename=filename,
                file_path=str(file_path),
                file_type=content_type,
                file_size=len(file_content),
                db=db
            )
            
            # Step 4: Extract text from document
            logger.info(f"📖 Extracting text from {filename}")
            extracted_text = await self._extract_text(
                file_content,
                content_type
            )
            
            if not extracted_text:
                await self._update_document_status(
                    doc_id,
                    "failed",
                    "Failed to extract text from document",
                    db
                )
                return {
                    "success": False,
                    "error": "Failed to extract text from document"
                }
            
            # Step 5: Create text chunks
            logger.info(f"✂️ Creating text chunks")
            chunks = self._create_chunks(extracted_text)
            
            # Step 6: Generate embeddings for chunks
            logger.info(f"🧠 Generating embeddings for {len(chunks)} chunks")
            chunks_with_embeddings = await self._generate_embeddings(chunks)
            
            # Step 7: Store chunks with embeddings in database
            await self._store_chunks(
                doc_id=doc_id,
                agent_id=agent_id,
                chunks=chunks_with_embeddings,
                extracted_text=extracted_text,
                db=db
            )
            
            # Step 8: Update agent's has_training_docs flag
            await self._update_agent_training_status(agent_id, doc_id, db)
            
            logger.info(f"✅ Document processed successfully: {filename}")
            
            return {
                "success": True,
                "document_id": doc_id,
                "filename": filename,
                "file_size": len(file_content),
                "total_chunks": len(chunks_with_embeddings),
                "processing_status": "completed"
            }
            
        except Exception as e:
            logger.error(f"❌ Error processing document: {e}", exc_info=True)
            return {
                "success": False,
                "error": str(e)
            }
    
    
    # ============================================
    # TEXT EXTRACTION
    # ============================================
    
    async def _extract_text(
        self,
        file_content: bytes,
        content_type: str
    ) -> Optional[str]:
        """Extract text from different file types"""
        try:
            if content_type == "application/pdf":
                return await self._extract_text_from_pdf(file_content)
            
            elif content_type in [
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/msword"
            ]:
                return await self._extract_text_from_docx(file_content)
            
            elif content_type in ["text/plain", "text/markdown"]:
                return file_content.decode('utf-8', errors='ignore')
            
            else:
                logger.error(f"Unsupported content type: {content_type}")
                return None
                
        except Exception as e:
            logger.error(f"Error extracting text: {e}")
            return None
    
    
    async def _extract_text_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF"""
        try:
            pdf_file = io.BytesIO(file_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text_parts = []
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text = page.extract_text()
                if text:
                    text_parts.append(text)
            
            full_text = "\n\n".join(text_parts)
            return full_text.strip()
            
        except Exception as e:
            logger.error(f"Error extracting PDF text: {e}")
            return ""
    
    
    async def _extract_text_from_docx(self, file_content: bytes) -> str:
        """Extract text from DOCX"""
        try:
            docx_file = io.BytesIO(file_content)
            doc = DocxDocument(docx_file)
            
            text_parts = []
            for paragraph in doc.paragraphs:
                if paragraph.text.strip():
                    text_parts.append(paragraph.text.strip())
            
            full_text = "\n\n".join(text_parts)
            return full_text.strip()
            
        except Exception as e:
            logger.error(f"Error extracting DOCX text: {e}")
            return ""
    
    
    # ============================================
    # TEXT CHUNKING
    # ============================================
    
    def _create_chunks(self, text: str) -> List[str]:
        """
        Split text into overlapping chunks
        
        Strategy:
        - Split by sentences first
        - Combine sentences into chunks of ~500 characters
        - Add 50 character overlap between chunks
        """
        try:
            # Split into sentences
            sentences = self._split_into_sentences(text)
            
            chunks = []
            current_chunk = ""
            
            for sentence in sentences:
                # If adding this sentence exceeds chunk size, save current chunk
                if len(current_chunk) + len(sentence) > self.chunk_size and current_chunk:
                    chunks.append(current_chunk.strip())
                    
                    # Start new chunk with overlap
                    overlap_text = current_chunk[-self.chunk_overlap:] if len(current_chunk) > self.chunk_overlap else current_chunk
                    current_chunk = overlap_text + " " + sentence
                else:
                    current_chunk += " " + sentence
            
            # Add last chunk
            if current_chunk.strip():
                chunks.append(current_chunk.strip())
            
            logger.info(f"Created {len(chunks)} chunks from text")
            return chunks
            
        except Exception as e:
            logger.error(f"Error creating chunks: {e}")
            return []
    
    
    def _split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences"""
        import re
        
        # Simple sentence splitting
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        return sentences
    
    
    # ============================================
    # EMBEDDING GENERATION
    # ============================================
    
    async def _generate_embeddings(
        self,
        chunks: List[str]
    ) -> List[Dict[str, Any]]:
        """Generate OpenAI embeddings for text chunks"""
        try:
            chunks_with_embeddings = []
            
            # Process chunks in batches to avoid rate limits
            batch_size = 10
            for i in range(0, len(chunks), batch_size):
                batch = chunks[i:i + batch_size]
                
                # Call OpenAI API
                response = await self.openai_client.embeddings.create(
                    model=self.embedding_model,
                    input=batch
                )
                
                # Extract embeddings
                for idx, chunk_text in enumerate(batch):
                    embedding = response.data[idx].embedding
                    
                    chunks_with_embeddings.append({
                        "chunk_id": f"chunk_{i + idx}",
                        "text": chunk_text,
                        "embedding": embedding,
                        "chunk_index": i + idx
                    })
            
            logger.info(f"Generated {len(chunks_with_embeddings)} embeddings")
            return chunks_with_embeddings
            
        except Exception as e:
            logger.error(f"Error generating embeddings: {e}")
            raise
    
    
    # ============================================
    # SIMILARITY SEARCH
    # ============================================
    
    async def query_documents(
        self,
        agent_id: str,
        query: str,
        db: AsyncIOMotorDatabase,
        top_k: int = 3
    ) -> Dict[str, Any]:
        """
        Search agent's documents for relevant information
        
        Returns:
        - relevant chunks
        - confidence score
        - combined answer
        """
        try:
            logger.info(f"🔍 Querying documents for agent {agent_id}: '{query}'")
            
            # Step 1: Get agent's documents
            documents = await db.agent_documents.find({
                "agent_id": agent_id,
                "processing_status": "completed"
            }).to_list(length=None)
            
            if not documents:
                logger.info(f"No documents found for agent {agent_id}")
                return {
                    "found": False,
                    "confidence": 0.0,
                    "answer": None,
                    "sources": []
                }
            
            # Step 2: Generate query embedding
            query_embedding = await self._generate_query_embedding(query)
            
            # Step 3: Search all document chunks
            all_matches = []
            
            for doc in documents:
                chunks = doc.get("chunks", [])
                
                for chunk in chunks:
                    chunk_embedding = chunk.get("embedding", [])
                    
                    if not chunk_embedding:
                        continue
                    
                    # Calculate cosine similarity
                    similarity = self._cosine_similarity(
                        query_embedding,
                        chunk_embedding
                    )
                    
                    if similarity >= self.similarity_threshold:
                        all_matches.append({
                            "text": chunk["text"],
                            "similarity": similarity,
                            "document_id": str(doc["_id"]),
                            "filename": doc["filename"],
                            "chunk_id": chunk.get("chunk_id")
                        })
            
            # Step 4: Sort by similarity and get top K
            all_matches.sort(key=lambda x: x["similarity"], reverse=True)
            top_matches = all_matches[:top_k]
            
            if not top_matches:
                logger.info(f"No relevant matches found (threshold: {self.similarity_threshold})")
                return {
                    "found": False,
                    "confidence": 0.0,
                    "answer": None,
                    "sources": []
                }
            
            # Step 5: Combine top matches into answer
            avg_confidence = sum(m["similarity"] for m in top_matches) / len(top_matches)
            combined_text = "\n\n".join([m["text"] for m in top_matches])
            
            # Step 6: Update usage stats
            for match in top_matches:
                await db.agent_documents.update_one(
                    {"_id": ObjectId(match["document_id"])},
                    {
                        "$inc": {"usage_count": 1},
                        "$set": {"last_used": datetime.utcnow()}
                    }
                )
            
            logger.info(f"✅ Found {len(top_matches)} relevant chunks (confidence: {avg_confidence:.2f})")
            
            return {
                "found": True,
                "confidence": avg_confidence,
                "answer": combined_text,
                "sources": top_matches,
                "total_matches": len(all_matches)
            }
            
        except Exception as e:
            logger.error(f"❌ Error querying documents: {e}", exc_info=True)
            return {
                "found": False,
                "confidence": 0.0,
                "answer": None,
                "error": str(e)
            }
    
    
    async def _generate_query_embedding(self, query: str) -> List[float]:
        """Generate embedding for search query"""
        try:
            response = await self.openai_client.embeddings.create(
                model=self.embedding_model,
                input=[query]
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error generating query embedding: {e}")
            raise
    
    
    def _cosine_similarity(
        self,
        vec1: List[float],
        vec2: List[float]
    ) -> float:
        """Calculate cosine similarity between two vectors"""
        try:
            vec1_np = np.array(vec1)
            vec2_np = np.array(vec2)
            
            dot_product = np.dot(vec1_np, vec2_np)
            norm1 = np.linalg.norm(vec1_np)
            norm2 = np.linalg.norm(vec2_np)
            
            if norm1 == 0 or norm2 == 0:
                return 0.0
            
            return float(dot_product / (norm1 * norm2))
        except Exception as e:
            logger.error(f"Error calculating cosine similarity: {e}")
            return 0.0
    
    
    # ============================================
    # FILE MANAGEMENT
    # ============================================
    
    def _validate_file(
        self,
        filename: str,
        content_type: str,
        file_size: int
    ) -> Dict[str, Any]:
        """Validate uploaded file"""
        
        # Check file size (max 10MB)
        max_size = 10 * 1024 * 1024  # 10MB
        if file_size > max_size:
            return {
                "valid": False,
                "error": f"File size exceeds maximum allowed size of 10MB (got {file_size / 1024 / 1024:.2f}MB)"
            }
        
        # Check file type
        allowed_types = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
            "text/plain",
            "text/markdown"
        ]
        
        if content_type not in allowed_types:
            return {
                "valid": False,
                "error": f"Unsupported file type: {content_type}. Allowed: PDF, DOCX, TXT, MD"
            }
        
        return {"valid": True}
    
    
    async def _save_file(
        self,
        file_content: bytes,
        filename: str,
        agent_id: str,
        user_id: str
    ) -> Path:
        """Save uploaded file to disk"""
        try:
            # Create directory structure: uploads/agent_documents/{user_id}/{agent_id}/
            agent_dir = self.upload_base_path / user_id / agent_id
            agent_dir.mkdir(parents=True, exist_ok=True)
            
            # Generate unique filename with hash
            file_hash = hashlib.md5(file_content).hexdigest()[:8]
            safe_filename = f"{file_hash}_{filename}"
            
            file_path = agent_dir / safe_filename
            
            # Write file asynchronously
            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(file_content)
            
            logger.info(f"💾 Saved file to {file_path}")
            return file_path
            
        except Exception as e:
            logger.error(f"Error saving file: {e}")
            raise
    
    
    async def delete_document(
        self,
        document_id: str,
        agent_id: str,
        user_id: str,
        db: AsyncIOMotorDatabase
    ) -> Dict[str, Any]:
        """Delete document and its file"""
        try:
            # Get document record
            doc = await db.agent_documents.find_one({
                "_id": ObjectId(document_id),
                "agent_id": agent_id,
                "user_id": user_id
            })
            
            if not doc:
                return {
                    "success": False,
                    "error": "Document not found"
                }
            
            # Delete file from disk
            file_path = Path(doc["file_path"])
            if file_path.exists():
                file_path.unlink()
                logger.info(f"🗑️ Deleted file: {file_path}")
            
            # Delete database record
            await db.agent_documents.delete_one({"_id": ObjectId(document_id)})
            
            # Update agent's training doc list
            await db.voice_agents.update_one(
                {"_id": ObjectId(agent_id)},
                {
                    "$pull": {"training_doc_ids": document_id},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
            
            # Check if agent still has docs
            remaining_docs = await db.agent_documents.count_documents({
                "agent_id": agent_id
            })
            
            if remaining_docs == 0:
                await db.voice_agents.update_one(
                    {"_id": ObjectId(agent_id)},
                    {"$set": {"has_training_docs": False}}
                )
            
            logger.info(f"✅ Document {document_id} deleted successfully")
            
            return {
                "success": True,
                "message": "Document deleted successfully"
            }
            
        except Exception as e:
            logger.error(f"Error deleting document: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    
    # ============================================
    # DATABASE OPERATIONS
    # ============================================
    
    async def _create_document_record(
        self,
        agent_id: str,
        user_id: str,
        filename: str,
        file_path: str,
        file_type: str,
        file_size: int,
        db: AsyncIOMotorDatabase
    ) -> str:
        """Create initial document record"""
        doc_data = {
            "agent_id": agent_id,
            "user_id": user_id,
            "filename": filename,
            "file_path": file_path,
            "file_type": file_type,
            "file_size": file_size,
            "processing_status": "processing",
            "processing_started_at": datetime.utcnow(),
            "chunks": [],
            "total_chunks": 0,
            "usage_count": 0,
            "upload_date": datetime.utcnow(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.agent_documents.insert_one(doc_data)
        return str(result.inserted_id)
    
    
    async def _store_chunks(
        self,
        doc_id: str,
        agent_id: str,
        chunks: List[Dict[str, Any]],
        extracted_text: str,
        db: AsyncIOMotorDatabase
    ):
        """Store processed chunks in database"""
        await db.agent_documents.update_one(
            {"_id": ObjectId(doc_id)},
            {
                "$set": {
                    "chunks": chunks,
                    "total_chunks": len(chunks),
                    "extracted_text": extracted_text[:10000],  # Store first 10K chars
                    "processing_status": "completed",
                    "processing_completed_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                    "metadata": {
                        "word_count": len(extracted_text.split()),
                        "char_count": len(extracted_text)
                    }
                }
            }
        )
    
    
    async def _update_document_status(
        self,
        doc_id: str,
        status: str,
        error_message: Optional[str],
        db: AsyncIOMotorDatabase
    ):
        """Update document processing status"""
        update_data = {
            "processing_status": status,
            "updated_at": datetime.utcnow()
        }
        
        if error_message:
            update_data["processing_error"] = error_message
        
        await db.agent_documents.update_one(
            {"_id": ObjectId(doc_id)},
            {"$set": update_data}
        )
    
    
    async def _update_agent_training_status(
        self,
        agent_id: str,
        doc_id: str,
        db: AsyncIOMotorDatabase
    ):
        """Update agent's training document flags"""
        await db.voice_agents.update_one(
            {"_id": ObjectId(agent_id)},
            {
                "$set": {
                    "has_training_docs": True,
                    "updated_at": datetime.utcnow()
                },
                "$addToSet": {
                    "training_doc_ids": doc_id
                }
            }
        )
    
    
    # ============================================
    # UTILITY METHODS
    # ============================================
    
    async def get_agent_documents(
        self,
        agent_id: str,
        user_id: str,
        db: AsyncIOMotorDatabase
    ) -> List[Dict[str, Any]]:
        """Get all documents for an agent"""
        try:
            documents = await db.agent_documents.find({
                "agent_id": agent_id,
                "user_id": user_id
            }).to_list(length=None)
            
            # Convert ObjectId to string
            for doc in documents:
                doc["_id"] = str(doc["_id"])
                doc["upload_date"] = doc["upload_date"].isoformat()
                
                # Remove embeddings from response (too large)
                if "chunks" in doc:
                    for chunk in doc["chunks"]:
                        chunk.pop("embedding", None)
            
            return documents
            
        except Exception as e:
            logger.error(f"Error getting agent documents: {e}")
            return []


# Create singleton instance
rag_service = RAGService()