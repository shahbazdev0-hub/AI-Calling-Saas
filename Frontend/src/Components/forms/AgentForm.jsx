// // frontend/src/Components/forms/AgentForm.jsx - FIXED VERSION

// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Bot, Save, Upload, X, Plus, Phone, Mail, MessageSquare, Play } from "lucide-react";
// import Input from "../ui/Input";
// import Button from "../ui/Button";
// import Textarea from "../ui/Textarea";
// import { voiceService } from "../../services/voice";
// import toast from "react-hot-toast";  // ✅ CORRECT IMPORT


// // Define DEFAULT_AI_SCRIPT
// const DEFAULT_AI_SCRIPT = `You are a professional and friendly AI assistant for customer support.

// Your key responsibilities:
// - Greet customers warmly and professionally
// - Listen carefully to understand their needs
// - Provide clear and helpful solutions
// - Offer relevant products or services
// - Schedule appointments when appropriate
// - Handle objections with empathy
// - Thank customers for their time

// Tone: Professional yet approachable
// Style: Clear, concise, and helpful
// Goal: Convert leads and provide excellent service`;

// // Agent Schema
// const agentSchema = z.object({
//   name: z.string().min(1, 'Agent name is required').max(100),
//   description: z.string().optional(),
//   calling_mode: z.enum(['single', 'bulk']),
  
//   // Single call fields
//   contact_name: z.string().optional(),
//   contact_phone: z.string().optional(),
//   contact_email: z.string().email().optional().or(z.literal('')),
  
//   // AI Script
//   ai_script: z.string()
//     .min(50, 'AI script must be at least 50 characters')
//     .max(2000, 'AI script cannot exceed 2000 characters'),
    
  
//   // Voice Selection
//   voice_id: z.string().min(1, 'Voice selection is required'),
  
//   // Configuration
//   logic_level: z.enum(['low', 'medium', 'high']),
//   contact_frequency: z.number().min(1).max(30),
//   enable_calls: z.boolean(),
//   enable_emails: z.boolean(),
//   enable_sms: z.boolean(),
// });

// const AgentForm = ({ agent = null, onSuccess, onCancel }) => {
//   const [voices, setVoices] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingVoices, setIsLoadingVoices] = useState(true);
//   const [isTesting, setIsTesting] = useState(false);
  
//   // Bulk calling state
//   const [callingMode, setCallingMode] = useState('single');
//   const [bulkContacts, setBulkContacts] = useState([]);
//   const [uploadedFile, setUploadedFile] = useState(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//     setValue
//   } = useForm({
//     resolver: zodResolver(agentSchema),
//     defaultValues: agent ? {
//       name: agent.name || '',
//       description: agent.description || '',
//       calling_mode: agent.calling_mode || 'single',
//       contact_name: agent.contacts?.[0]?.name || '',
//       contact_phone: agent.contacts?.[0]?.phone || '',
//       contact_email: agent.contacts?.[0]?.email || '',
//       ai_script: agent.ai_script || DEFAULT_AI_SCRIPT,
//       voice_id: agent.voice_id || '',
//       logic_level: agent.logic_level || 'medium',
//       contact_frequency: agent.contact_frequency || 7,
//       enable_calls: agent.enable_calls !== false,
//       enable_emails: agent.enable_emails || false,
//       enable_sms: agent.enable_sms || false,
//     } : {
//       name: '',
//       description: '',
//       calling_mode: 'single',
//       contact_name: '',
//       contact_phone: '',
//       contact_email: '',
//       ai_script: DEFAULT_AI_SCRIPT,
//       voice_id: '',
//       logic_level: 'medium',
//       contact_frequency: 7,
//       enable_calls: true,
//       enable_emails: false,
//       enable_sms: false,
//     }
//   });

//   // Watch fields
//   const selectedVoiceId = watch('voice_id');
//   const enableCalls = watch('enable_calls');
//   const enableEmails = watch('enable_emails');
//   const enableSms = watch('enable_sms');

//   // Load voices on mount
//   useEffect(() => {
//     loadVoices();
//   }, []);

//   // Update calling mode when it changes
//   useEffect(() => {
//     const subscription = watch((value, { name }) => {
//       if (name === 'calling_mode') {
//         setCallingMode(value.calling_mode);
//       }
//     });
//     return () => subscription.unsubscribe();
//   }, [watch]);

//   // Load bulk contacts if editing agent
//   useEffect(() => {
//     if (agent?.contacts && agent.contacts.length > 1) {
//       setBulkContacts(agent.contacts);
//       setCallingMode('bulk');
//       setValue('calling_mode', 'bulk');
//     }
//   }, [agent]);

//   const loadVoices = async () => {
//     try {
//       setIsLoadingVoices(true);
//       console.log('📡 Fetching available voices...');
      
//       const response = await voiceService.getAvailableVoices();
//       console.log('✅ Voices response:', response);
      
//       if (response.voices && Array.isArray(response.voices)) {
//         setVoices(response.voices);
//         console.log(`✅ Loaded ${response.voices.length} voices`);
        
//         // Set first voice as default if no voice selected
//         if (response.voices.length > 0 && !selectedVoiceId) {
//           setValue('voice_id', response.voices[0].voice_id);
//         }
//       } else {
//         console.error('❌ Invalid voices response:', response);
//         toast.error('Failed to load voices');
//       }
//     } catch (error) {
//       console.error('❌ Error loading voices:', error);
//       toast.error('Failed to load available voices');
//     } finally {
//       setIsLoadingVoices(false);
//     }
//   };

//   // Add manual contact
//   const addManualContact = () => {
//     const newContact = {
//       name: '',
//       phone: '',
//       email: ''
//     };
//     setBulkContacts([...bulkContacts, newContact]);
//   };

//   // Update bulk contact
//   const updateBulkContact = (index, field, value) => {
//     const updated = [...bulkContacts];
//     updated[index][field] = value;
//     setBulkContacts(updated);
//   };

//   // Remove bulk contact
//   const removeBulkContact = (index) => {
//     setBulkContacts(bulkContacts.filter((_, i) => i !== index));
//   };

//   // ✅ FIXED: handleFileUpload function with correct toast usage
//   const handleFileUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) {
//       console.log('❌ No file selected');
//       return;
//     }

//     console.log('📄 File selected:', file.name, file.type, file.size);

//     // Validate file type
//     const allowedTypes = ['.csv', '.xlsx', '.xls'];
//     const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
//     if (!allowedTypes.includes(fileExtension)) {
//       toast.error(`Invalid file type. Please upload ${allowedTypes.join(', ')} file`);
//       e.target.value = ''; // Reset input
//       return;
//     }

//     // Validate file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error('File size must be less than 5MB');
//       e.target.value = ''; // Reset input
//       return;
//     }

//     setUploadedFile(file);
//     toast.loading('📄 Processing file...', { id: 'file-upload' }); // ✅ FIXED: Use toast.loading instead of toast.info

//     // Parse CSV/Excel file
//     try {
//       const contacts = await parseContactsFile(file);
//       console.log('📋 Parsed contacts:', contacts);
      
//       if (contacts.length === 0) {
//         toast.error('No valid contacts found in file', { id: 'file-upload' });
//         setUploadedFile(null);
//         e.target.value = ''; // Reset input
//         return;
//       }

//       setBulkContacts(contacts);
//       toast.success(`✅ Loaded ${contacts.length} contacts from ${file.name}`, { id: 'file-upload' }); // ✅ FIXED
//     } catch (error) {
//       console.error('❌ Error parsing file:', error);
//       toast.error(`Failed to parse file: ${error.message}`, { id: 'file-upload' }); // ✅ FIXED
//       setUploadedFile(null);
//       e.target.value = ''; // Reset input
//     }
//   };

//   // Parse CSV/Excel contacts file
//   const parseContactsFile = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
      
//       reader.onload = (e) => {
//         try {
//           const text = e.target.result;
//           console.log('📄 File content loaded, length:', text.length);
          
//           // Split into lines
//           const lines = text.split(/\r?\n/).filter(line => line.trim());
//           console.log('📋 Total lines:', lines.length);
          
//           if (lines.length < 2) {
//             reject(new Error('File must contain at least a header row and one data row'));
//             return;
//           }
          
//           // Skip header row (first line)
//           const dataLines = lines.slice(1);
//           console.log('📋 Data lines:', dataLines.length);
          
//           const contacts = [];
          
//           dataLines.forEach((line, index) => {
//             // Handle both comma and tab-separated values
//             const values = line.split(/[,\t]/).map(val => val.trim().replace(/^["']|["']$/g, ''));
            
//             const [name, phone, email] = values;
            
//             // Validate required fields
//             if (!name || !phone) {
//               console.warn(`⚠️ Skipping invalid row ${index + 2}: missing name or phone`, values);
//               return;
//             }

//             // Validate phone format
//             let cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
//             if (!cleanPhone.startsWith('+')) {
//               // If no country code, assume US (+1)
//               if (cleanPhone.length === 10) {
//                 cleanPhone = `+1${cleanPhone}`;
//               } else {
//                 cleanPhone = `+${cleanPhone}`;
//               }
//             }

//             contacts.push({
//               name: name,
//               phone: cleanPhone,
//               email: email || ''
//             });
//           });

//           console.log('✅ Parsed contacts:', contacts);
//           resolve(contacts);
//         } catch (error) {
//           console.error('❌ Parse error:', error);
//           reject(error);
//         }
//       };

//       reader.onerror = () => {
//         reject(new Error('Failed to read file'));
//       };

//       // Read as text
//       reader.readAsText(file);
//     });
//   };

//   // ✅ FIXED: Test voice function with improved audio URL handling
//   const handleTestVoice = async () => {
//     if (!selectedVoiceId) {
//       toast.error('Please select a voice first');
//       return;
//     }

//     try {
//       setIsTesting(true);
//       console.log('🎵 Testing voice:', selectedVoiceId);
      
//       const result = await voiceService.testVoice(selectedVoiceId);
//       console.log('✅ Test result:', result);
      
//       if (result.success) {
//         // ✅ FIX: Construct proper audio URL
//         const audioUrl = result.audio_url.startsWith('http') 
//           ? result.audio_url 
//           : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${result.audio_url}`;
        
//         console.log('🔊 Playing audio from:', audioUrl);
        
//         const audio = new Audio(audioUrl);
//         audio.play()
//           .then(() => {
//             toast.success('✅ Voice test playing!');
//           })
//           .catch((error) => {
//             console.error('❌ Audio playback failed:', error);
//             toast.error('Audio playback failed. File may not be ready yet.');
//           });
//       } else {
//         toast.error('Failed to generate voice test');
//       }
//     } catch (error) {
//       console.error('❌ Voice test failed:', error);
//       toast.error('Failed to test voice. Please try again.');
//     } finally {
//       setIsTesting(false);
//     }
//   };

//   // Submit form
//   const onSubmit = async (data) => {
//     try {
//       setIsLoading(true);
//       console.log('📤 Submitting agent data:', data);

//       // Build contacts array
//       let contacts = [];
      
//       if (data.calling_mode === 'single') {
//         // Single contact
//         if (data.contact_name && data.contact_phone) {
//           contacts = [{
//             name: data.contact_name,
//             phone: data.contact_phone,
//             email: data.contact_email || ''
//           }];
//         }
//       } else {
//         // Bulk contacts
//         contacts = bulkContacts.filter(c => c.name && c.phone);
        
//         if (contacts.length === 0) {
//           toast.error('Please add at least one contact');
//           setIsLoading(false);
//           return;
//         }
//       }

//       const agentData = {
//         name: data.name,
//         description: data.description || '',
//         voice_id: data.voice_id,
//         calling_mode: data.calling_mode,
//         contacts: contacts,
//         ai_script: data.ai_script || DEFAULT_AI_SCRIPT,
//         system_prompt: data.ai_script || DEFAULT_AI_SCRIPT,
//         greeting_message: "Hello! Thanks for taking my call today.",
//         personality_traits: ["friendly", "professional", "helpful"],
//         logic_level: data.logic_level || 'medium',
//         contact_frequency: parseInt(data.contact_frequency) || 7,
//         enable_calls: data.enable_calls !== false,
//         enable_emails: data.enable_emails === true,
//         enable_sms: data.enable_sms === true,
//         is_active: true,
//         workflow_id: null
//       };

//       console.log('📤 Final agent data:', agentData);

//       let result;
//       if (agent?._id) {
//         result = await voiceService.updateAgent(agent._id, agentData);
//         toast.success('✅ Agent updated successfully!');
//       } else {
//         result = await voiceService.createAgent(agentData);
//         toast.success('✅ Agent created successfully!');
//       }

//       console.log('✅ Agent saved:', result);
      
//       if (onSuccess) {
//         onSuccess(result);
//       }
//     } catch (error) {
//       console.error('❌ Failed to save agent:', error);
      
//       // ✅ FIXED: Handle validation errors properly
//       if (error.response?.status === 422 && error.response?.data?.detail) {
//         const errors = error.response.data.detail;
//         if (Array.isArray(errors)) {
//           const errorMessages = errors.map(err => err.msg || JSON.stringify(err)).join(', ');
//           toast.error(`Validation Error: ${errorMessages}`);
//         } else {
//           toast.error(`Error: ${JSON.stringify(errors)}`);
//         }
//       } else if (error.response?.data?.detail) {
//         toast.error(`Error: ${error.response.data.detail}`);
//       } else {
//         toast.error('Failed to save agent. Please check all fields and try again.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
//       {/* SECTION 1: Basic Info */}
//       <div className="space-y-4">
//         <div className="flex items-center gap-3 pb-4 border-b">
//           <div className="p-2 bg-[#f2070d]/10 rounded-lg">
//             <Bot className="w-6 h-6 text-[#f2070d]" />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
//             <p className="text-sm text-gray-500">Configure your AI voice agent</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Agent Name *
//             </label>
//             <Input
//               {...register('name')}
//               placeholder="e.g., Customer Support Agent"
//               error={errors.name?.message}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Description
//             </label>
//             <Input
//               {...register('description')}
//               placeholder="Brief description of agent's purpose"
//             />
//           </div>
//         </div>
//       </div>

//       {/* SECTION 2: Voice Selection - DROPDOWN VERSION */}
//       <div className="space-y-4 pt-6 border-t">
//         <h3 className="text-lg font-semibold text-gray-900">🎤 Voice Selection</h3>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Select Voice *
//           </label>
          
//           {isLoadingVoices ? (
//             <div className="text-center py-4">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f2070d] mx-auto"></div>
//               <p className="text-sm text-gray-500 mt-2">Loading voices...</p>
//             </div>
//           ) : voices.length === 0 ? (
//             <div className="text-center py-4 bg-red-50 rounded-lg">
//               <p className="text-sm text-red-600">No voices available. Please check your ElevenLabs API configuration.</p>
//             </div>
//           ) : (
//             <>
//               {/* Dropdown Select */}
//               <select
//                 {...register('voice_id')}
//                 className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-[#f2070d] transition-all"
//               >
//                 <option value="">-- Select a voice --</option>
//                 {voices.map((voice) => (
//                   <option key={voice.voice_id} value={voice.voice_id}>
//                     {voice.name} ({voice.category})
//                   </option>
//                 ))}
//               </select>
              
//               {errors.voice_id && (
//                 <p className="text-sm text-red-600 mt-1">{errors.voice_id.message}</p>
//               )}
//               {/* Test Voice Button */}
//               {selectedVoiceId && (
//                 <div className="mt-3 flex items-center gap-3">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={handleTestVoice}
//                     disabled={isTesting}
//                   >
//                     {isTesting ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#f2070d] mr-2" />
//                         Testing...
//                       </>
//                     ) : (
//                       <>
//                         <Play size={16} className="mr-2" />
//                         Test Voice
//                       </>
//                     )}
//                   </Button>
                  
//                   {selectedVoiceId && (
//                     <span className="text-sm text-gray-600">
//                       Selected: {voices.find(v => v.voice_id === selectedVoiceId)?.name}
//                     </span>
//                   )}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* SECTION 3: Calling Mode */}
//       <div className="space-y-4 pt-6 border-t">
//         <h3 className="text-lg font-semibold text-gray-900">📞 Calling Mode</h3>

//         <div className="grid grid-cols-2 gap-4">
//           <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
//             callingMode === 'single' ? 'border-[#f2070d] bg-[#f2070d]/5' : 'border-gray-200'
//           }`}>
//             <input
//               type="radio"
//               {...register('calling_mode')}
//               value="single"
//               className="mr-3"
//             />
//             <div>
//               <div className="font-medium text-gray-900">Single Call</div>
//               <div className="text-xs text-gray-500">One contact at a time</div>
//             </div>
//           </label>

//           <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
//             callingMode === 'bulk' ? 'border-[#f2070d] bg-[#f2070d]/5' : 'border-gray-200'
//           }`}>
//             <input
//               type="radio"
//               {...register('calling_mode')}
//               value="bulk"
//               className="mr-3"
//             />
//             <div>
//               <div className="font-medium text-gray-900">Bulk Campaign</div>
//               <div className="text-xs text-gray-500">Multiple contacts</div>
//             </div>
//           </label>
//         </div>
//       </div>

//       {/* SECTION 3A: Single Contact */}
//       {callingMode === 'single' && (
//         <div className="space-y-4 pt-6 border-t">
//           <h3 className="text-lg font-semibold text-gray-900">👤 Contact Information</h3>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Name
//               </label>
//               <Input
//                 {...register('contact_name')}
//                 placeholder="John Doe"
//                 error={errors.contact_name?.message}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Phone *
//               </label>
//               <Input
//                 {...register('contact_phone')}
//                 placeholder="+1234567890"
//                 error={errors.contact_phone?.message}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email
//               </label>
//               <Input
//                 {...register('contact_email')}
//                 type="email"
//                 placeholder="john@example.com"
//                 error={errors.contact_email?.message}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* SECTION 3B: Bulk Contacts - FIXED FILE UPLOAD */}
//       {callingMode === 'bulk' && (
//         <div className="space-y-4 pt-6 border-t">
//           <h3 className="text-lg font-semibold text-gray-900">📤 Bulk Contacts</h3>

//           {/* File Upload */}
//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#f2070d] transition-colors">
//             <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
//             <p className="text-sm text-gray-600 mb-2">Upload CSV or Excel file</p>
//             <p className="text-xs text-gray-500 mb-4">Expected format: Name, Phone, Email</p>
            
//             {/* ✅ FIXED: Direct input element with proper handling */}
//             <input
//               type="file"
//               accept=".csv,.xlsx,.xls"
//               onChange={handleFileUpload}
//               className="hidden"
//               id="bulk-upload-input"
//             />
            
//             {/* ✅ FIXED: Use regular button instead of Button component */}
//             <label htmlFor="bulk-upload-input" className="cursor-pointer">
//               <span className="inline-flex items-center px-4 py-2 border-2 border-[#f2070d] text-[#f2070d] rounded-lg hover:bg-[#f2070d] hover:text-white transition-colors font-medium">
//                 <Upload size={16} className="mr-2" />
//                 Choose File
//               </span>
//             </label>
            
//             {uploadedFile && (
//               <div className="mt-3">
//                 <p className="text-xs text-green-600">
//                   ✓ {uploadedFile.name} uploaded
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   {bulkContacts.length} contacts loaded
//                 </p>
//               </div>
//             )}
//           </div>

//           <div className="text-center text-sm text-gray-500">
//             ─────── OR ───────
//           </div>

//           {/* Manual Entry */}
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <h4 className="text-sm font-medium text-gray-700">Manual Entry</h4>
//               <button
//                 type="button"
//                 onClick={addManualContact}
//                 className="inline-flex items-center px-3 py-1.5 text-sm border-2 border-[#f2070d] text-[#f2070d] rounded-lg hover:bg-[#f2070d] hover:text-white transition-colors"
//               >
//                 <Plus size={16} className="mr-1" />
//                 Add Contact
//               </button>
//             </div>

//             {bulkContacts.length > 0 && (
//               <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3">
//                 {/* Header */}
//                 <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 pb-2 border-b sticky top-0 bg-white">
//                   <div className="col-span-1">#</div>
//                   <div className="col-span-4">Name *</div>
//                   <div className="col-span-4">Phone *</div>
//                   <div className="col-span-2">Email</div>
//                   <div className="col-span-1"></div>
//                 </div>

//                 {/* Contact Rows */}
//                 {bulkContacts.map((contact, index) => (
//                   <div key={index} className="grid grid-cols-12 gap-2 items-center">
//                     <div className="col-span-1 text-sm text-gray-500 font-medium">
//                       {index + 1}
//                     </div>
//                     <div className="col-span-4">
//                       <input
//                         type="text"
//                         value={contact.name}
//                         onChange={(e) => updateBulkContact(index, 'name', e.target.value)}
//                         placeholder="John Doe"
//                         className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#f2070d] focus:border-[#f2070d]"
//                         required
//                       />
//                     </div>
//                     <div className="col-span-4">
//                       <input
//                         type="text"
//                         value={contact.phone}
//                         onChange={(e) => updateBulkContact(index, 'phone', e.target.value)}
//                         placeholder="+1234567890"
//                         className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#f2070d] focus:border-[#f2070d]"
//                         required
//                       />
//                     </div>
//                     <div className="col-span-2">
//                       <input
//                         type="email"
//                         value={contact.email}
//                         onChange={(e) => updateBulkContact(index, 'email', e.target.value)}
//                         placeholder="email@example.com"
//                         className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#f2070d] focus:border-[#f2070d]"
//                       />
//                     </div>
//                     <div className="col-span-1 flex justify-center">
//                       <button
//                         type="button"
//                         onClick={() => removeBulkContact(index)}
//                         className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
//                         title="Remove contact"
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {bulkContacts.length === 0 && (
//               <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
//                 <p className="text-sm text-gray-500">No contacts added yet</p>
//                 <p className="text-xs text-gray-400 mt-1">Upload a file or add manually</p>
//               </div>
//             )}
//           </div>

//           {/* Contact Count */}
//           {bulkContacts.length > 0 && (
//             <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//                   <span className="text-white text-sm font-bold">{bulkContacts.length}</span>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-blue-900">
//                     {bulkContacts.length} contact{bulkContacts.length !== 1 ? 's' : ''} ready
//                   </p>
//                   <p className="text-xs text-blue-700">
//                     {bulkContacts.filter(c => c.name && c.phone).length} valid contacts
//                   </p>
//                 </div>
//               </div>
              
//               <button
//                 type="button"
//                 onClick={() => {
//                   if (confirm('Clear all contacts?')) {
//                     setBulkContacts([]);
//                     setUploadedFile(null);
//                   }
//                 }}
//                 className="text-sm text-red-600 hover:text-red-700 font-medium"
//               >
//                 Clear All
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* SECTION 4: AI Script */}
//       <div className="space-y-4 pt-6 border-t">
//         <h3 className="text-lg font-semibold text-gray-900">🤖 AI Script</h3>
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Custom AI Script *
//           </label>
//           <Textarea
//             {...register('ai_script')}
//             rows={8}
//             placeholder="Enter the AI agent's script and personality..."
//             error={errors.ai_script?.message}
//             className="font-mono text-sm"
//           />
//           {errors.ai_script && (
//             <p className="text-sm text-red-600 mt-1">{errors.ai_script.message}</p>
//           )}
//         </div>
//       </div>

//       {/* SECTION 5: Settings */}
//       <div className="space-y-4 pt-6 border-t">
//         <h3 className="text-lg font-semibold text-gray-900">⚙️ Agent Settings</h3>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Logic Level
//             </label>
//             <select
//               {...register('logic_level')}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-transparent"
//             >
//               <option value="low">Low - Basic responses</option>
//               <option value="medium">Medium - Balanced</option>
//               <option value="high">High - Advanced reasoning</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Contact Frequency (days)
//             </label>
//             <Input
//               type="number"
//               {...register('contact_frequency', { valueAsNumber: true })}
//               min="1"
//               max="30"
//               error={errors.contact_frequency?.message}
//             />
//           </div>
//         </div>
//       </div>

//       {/* SECTION 6: Communication Channels */}
//       <div className="space-y-4 pt-6 border-t">
//         <h3 className="text-lg font-semibold text-gray-900">📡 Communication Channels</h3>

//         <div className="space-y-3">
//           {/* Enable Calls */}
//           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//             <div className="flex items-center gap-3">
//               <div className={`p-2 rounded-lg ${enableCalls ? 'bg-[#f2070d]/10' : 'bg-gray-100'}`}>
//                 <Phone size={18} className={enableCalls ? 'text-[#f2070d]' : 'text-gray-600'} />
//               </div>
//               <div>
//                 <div className="font-medium text-sm text-gray-900">Enable Voice Calls</div>
//                 <div className="text-xs text-gray-500">Make outbound calls to contacts</div>
//               </div>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 {...register('enable_calls')}
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f2070d]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2070d]"></div>
//             </label>
//           </div>

//           {/* Enable Emails */}
//           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//             <div className="flex items-center gap-3">
//               <div className={`p-2 rounded-lg ${enableEmails ? 'bg-[#f2070d]/10' : 'bg-gray-100'}`}>
//                 <Mail size={18} className={enableEmails ? 'text-[#f2070d]' : 'text-gray-600'} />
//               </div>
//               <div>
//                 <div className="font-medium text-sm text-gray-900">Enable Emails</div>
//                 <div className="text-xs text-gray-500">Send email campaigns</div>
//               </div>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 {...register('enable_emails')}
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f2070d]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2070d]"></div>
//             </label>
//           </div>

//           {/* Enable SMS */}
//           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//             <div className="flex items-center gap-3">
//               <div className={`p-2 rounded-lg ${enableSms ? 'bg-[#f2070d]/10' : 'bg-gray-100'}`}>
//                 <MessageSquare size={18} className={enableSms ? 'text-[#f2070d]' : 'text-gray-600'} />
//               </div>
//               <div>
//                 <div className="font-medium text-sm text-gray-900">Enable SMS</div>
//                 <div className="text-xs text-gray-500">Send text messages</div>
//               </div>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 {...register('enable_sms')}
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f2070d]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2070d]"></div>
//             </label>
//           </div>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex items-center justify-end space-x-3 pt-6 border-t sticky bottom-0 bg-white">
//         {onCancel && (
//           <Button type="button" onClick={onCancel} variant="outline">
//             Cancel
//           </Button>
//         )}
//         <Button type="submit" disabled={isLoading}>
//           {isLoading ? (
//             <>
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
//               Saving...
//             </>
//           ) : (
//             <>
//               <Save size={20} className="mr-2" />
//               {agent ? 'Update Agent' : 'Create Agent'}
//             </>
//           )}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default AgentForm;



// frontend/src/Components/forms/AgentForm.jsx - ✅ FIXED PAYLOAD STRUCTURE

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, Save, Upload, X, Plus, Phone, Mail, MessageSquare, Play } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import { voiceService } from "../../services/voice";
import toast from "react-hot-toast";

// Define DEFAULT_AI_SCRIPT
const DEFAULT_AI_SCRIPT = `You are a professional and friendly AI assistant for customer support.

Your key responsibilities:
- Greet customers warmly and professionally
- Listen carefully to understand their needs
- Provide clear and helpful solutions
- Offer relevant products or services
- Schedule appointments when appropriate
- Handle objections with empathy
- Thank customers for their time

Tone: Professional yet approachable
Style: Clear, concise, and helpful
Goal: Convert leads and provide excellent service`;

// ✅ UPDATED: Agent Schema with email_template and sms_template
const agentSchema = z.object({
  name: z.string().min(1, 'Agent name is required').max(100),
  description: z.string().optional(),
  calling_mode: z.enum(['single', 'bulk']),
  
  // Single call fields
  contact_name: z.string().optional(),
  contact_phone: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal('')),
  
  // AI Script
  ai_script: z.string()
    .min(50, 'AI script must be at least 50 characters')
    .max(2000, 'AI script cannot exceed 2000 characters'),
  
  // Voice Selection
  voice_id: z.string().min(1, 'Voice selection is required'),
  
  // Configuration
  logic_level: z.enum(['low', 'medium', 'high']),
  contact_frequency: z.number().min(1).max(30),
  enable_calls: z.boolean(),
  enable_emails: z.boolean(),
  enable_sms: z.boolean(),
  
  // ✅ NEW: Email & SMS Templates
  email_template: z.string().max(2000).optional(),
  sms_template: z.string().max(500).optional(),
});

const AgentForm = ({ agent = null, onSuccess, onCancel }) => {
  const [voices, setVoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  
  // Bulk calling state
  const [callingMode, setCallingMode] = useState('single');
  const [bulkContacts, setBulkContacts] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  // ✅ UPDATED: useForm with email_template and sms_template
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(agentSchema),
    defaultValues: agent ? {
      name: agent.name || '',
      description: agent.description || '',
      calling_mode: agent.calling_mode || 'single',
      contact_name: agent.contacts?.[0]?.name || '',
      contact_phone: agent.contacts?.[0]?.phone || '',
      contact_email: agent.contacts?.[0]?.email || '',
      ai_script: agent.ai_script || DEFAULT_AI_SCRIPT,
      voice_id: agent.voice_id || '',
      logic_level: agent.logic_level || 'medium',
      contact_frequency: agent.contact_frequency || 7,
      enable_calls: agent.enable_calls !== false,
      enable_emails: agent.enable_emails || false,
      enable_sms: agent.enable_sms || false,
      email_template: agent.email_template || '',
      sms_template: agent.sms_template || '',
    } : {
      name: '',
      description: '',
      calling_mode: 'single',
      contact_name: '',
      contact_phone: '',
      contact_email: '',
      ai_script: DEFAULT_AI_SCRIPT,
      voice_id: '',
      logic_level: 'medium',
      contact_frequency: 7,
      enable_calls: true,
      enable_emails: false,
      enable_sms: false,
      email_template: '',
      sms_template: '',
    }
  });

  // Watch fields
  const selectedVoiceId = watch('voice_id');
  const enableCalls = watch('enable_calls');
  const enableEmails = watch('enable_emails');
  const enableSms = watch('enable_sms');
  const contactFrequency = watch('contact_frequency');

  // Load voices on mount
  useEffect(() => {
    loadVoices();
  }, []);

  // Update calling mode when it changes
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'calling_mode') {
        setCallingMode(value.calling_mode);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const loadVoices = async () => {
    try {
      setIsLoadingVoices(true);
      console.log('📡 Fetching available voices...');
      
      const response = await voiceService.getAvailableVoices(); // ✅ CHANGED: getAvailableVoices instead of getVoices
      console.log('✅ Voices response:', response);
      
      if (response.voices && Array.isArray(response.voices)) {
        setVoices(response.voices);
        console.log(`✅ Loaded ${response.voices.length} voices`);
        
        // Set first voice as default if no voice selected
        if (response.voices.length > 0 && !selectedVoiceId) {
          setValue('voice_id', response.voices[0].voice_id);
        }
      } else {
        console.error('❌ Invalid voices response:', response);
        toast.error('Failed to load voices');
      }
    } catch (error) {
      console.error('❌ Error loading voices:', error);
      toast.error('Failed to load available voices');
    } finally {
      setIsLoadingVoices(false);
    }
  };

  const handleAddContact = () => {
    setBulkContacts([...bulkContacts, { name: '', phone: '', email: '' }]);
  };

  const handleRemoveContact = (index) => {
    const updated = bulkContacts.filter((_, i) => i !== index);
    setBulkContacts(updated);
  };

  const handleContactChange = (index, field, value) => {
    const updated = [...bulkContacts];
    updated[index][field] = value;
    setBulkContacts(updated);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        const contacts = lines.slice(1).map(line => {
          const [name, phone, email] = line.split(',').map(item => item.trim());
          return { name, phone, email: email || '' };
        });
        
        setBulkContacts(contacts);
        toast.success(`${contacts.length} contacts loaded`);
      } catch (error) {
        console.error('Failed to parse file:', error);
        toast.error('Failed to parse file');
      }
    };
    
    reader.readAsText(file);
  };

  const handleTestVoice = async () => {
    if (!selectedVoiceId) {
      toast.error('Please select a voice first');
      return;
    }

    try {
      setIsTesting(true);
      const testText = "Hello! This is a test of the selected voice. How does it sound?";
      
      console.log('🎤 Testing voice:', selectedVoiceId);
      
      const result = await voiceService.testVoice(selectedVoiceId, testText);
      
      if (result.audio_url) {
        const audioUrl = result.audio_url.startsWith('http') 
          ? result.audio_url 
          : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${result.audio_url}`;
        
        console.log('🔊 Playing audio from:', audioUrl);
        
        const audio = new Audio(audioUrl);
        audio.play()
          .then(() => {
            toast.success('✅ Voice test playing!');
          })
          .catch((error) => {
            console.error('❌ Audio playback failed:', error);
            toast.error('Audio playback failed. File may not be ready yet.');
          });
      } else {
        toast.error('Failed to generate voice test');
      }
    } catch (error) {
      console.error('❌ Voice test failed:', error);
      toast.error('Failed to test voice. Please try again.');
    } finally {
      setIsTesting(false);
    }
  };

  // ✅ FIXED: Submit form with correct payload structure
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      console.log('📤 Submitting agent data:', data);

      // Build contacts array
      let contacts = [];
      
      if (data.calling_mode === 'single') {
        // Single contact
        if (data.contact_name && data.contact_phone) {
          contacts = [{
            name: data.contact_name,
            phone: data.contact_phone,
            email: data.contact_email || ''
          }];
        }
      } else {
        // Bulk contacts
        contacts = bulkContacts.filter(c => c.name && c.phone);
        
        if (contacts.length === 0) {
          toast.error('Please add at least one contact');
          setIsLoading(false);
          return;
        }
      }

      // ✅ CORRECTED: Build payload matching VoiceAgentCreateExtended schema
      const agentData = {
        // Required fields from VoiceAgentCreate
        name: data.name,
        description: data.description || '',
        voice_id: data.voice_id,
        calling_mode: data.calling_mode,
        contacts: contacts,
        ai_script: data.ai_script,
        logic_level: data.logic_level,
        contact_frequency: parseInt(data.contact_frequency),
        is_active: true,
        
        // Extended fields from VoiceAgentCreateExtended
        enable_calls: data.enable_calls !== false,
        enable_emails: data.enable_emails === true,
        enable_sms: data.enable_sms === true,
        
        // ✅ NEW: Email & SMS Templates (only if emails/SMS are enabled)
        ...(data.enable_emails && { email_template: data.email_template || '' }),
        ...(data.enable_sms && { sms_template: data.sms_template || '' }),
        
        // Optional fields (only send if updating)
        ...(agent?._id && {
          system_prompt: data.ai_script,
          greeting_message: "Hello! Thanks for taking my call today.",
          personality_traits: ["friendly", "professional", "helpful"]
        })
      };

      console.log('📤 Final agent data:', agentData);

      let result;
      if (agent?._id) {
        result = await voiceService.updateAgent(agent._id, agentData);
        toast.success('✅ Agent updated successfully!');
      } else {
        result = await voiceService.createAgent(agentData);
        toast.success('✅ Agent created successfully!');
      }

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('❌ Error saving agent:', error);
      
      // ✅ Better error handling
      const errorMessage = error.response?.data?.detail 
        ? (Array.isArray(error.response.data.detail) 
            ? error.response.data.detail.map(e => `${e.loc?.join('.')}: ${e.msg}`).join(', ')
            : error.response.data.detail)
        : 'Failed to save agent';
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Agent Name */}
      <div>
        <Input
          label="Agent Name"
          {...register('name')}
          error={errors.name?.message}
          placeholder="e.g., Customer Support Agent"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          {...register('description')}
          rows="2"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-transparent"
          placeholder="Brief description of this agent's purpose..."
        />
      </div>

      {/* Calling Mode */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Calling Mode
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
            callingMode === 'single' ? 'border-[#f2070d] bg-[#f2070d]/5' : 'border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="radio"
              value="single"
              {...register('calling_mode')}
              className="sr-only"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Phone size={18} className={callingMode === 'single' ? 'text-[#f2070d]' : 'text-gray-600'} />
                <span className="font-medium text-gray-900">Single Call</span>
              </div>
              <p className="text-xs text-gray-500">Call one contact at a time</p>
            </div>
          </label>

          <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
            callingMode === 'bulk' ? 'border-[#f2070d] bg-[#f2070d]/5' : 'border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="radio"
              value="bulk"
              {...register('calling_mode')}
              className="sr-only"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Phone size={18} className={callingMode === 'bulk' ? 'text-[#f2070d]' : 'text-gray-600'} />
                <span className="font-medium text-gray-900">Bulk Calling</span>
              </div>
              <p className="text-xs text-gray-500">Call multiple contacts</p>
            </div>
          </label>
        </div>
      </div>

      {/* Contact Information */}
      {callingMode === 'single' ? (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-900">Contact Information</h3>
          
          <Input
            label="Contact Name"
            {...register('contact_name')}
            error={errors.contact_name?.message}
            placeholder="John Doe"
          />
          
          <Input
            label="Phone Number"
            {...register('contact_phone')}
            error={errors.contact_phone?.message}
            placeholder="+1234567890"
          />
          
          <Input
            label="Email (Optional)"
            type="email"
            {...register('contact_email')}
            error={errors.contact_email?.message}
            placeholder="john@example.com"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Bulk Contacts</h3>
          
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#f2070d] transition-colors">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 mb-2">Upload CSV or Excel file</p>
            <p className="text-xs text-gray-500 mb-4">Expected format: Name, Phone, Email</p>
            
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="bulk-upload-input"
            />
            
            <label htmlFor="bulk-upload-input" className="cursor-pointer">
              <span className="inline-flex items-center px-4 py-2 border-2 border-[#f2070d] text-[#f2070d] rounded-lg hover:bg-[#f2070d] hover:text-white transition-colors font-medium">
                <Upload size={16} className="mr-2" />
                Choose File
              </span>
            </label>
            
            {uploadedFile && (
              <div className="mt-3">
                <p className="text-xs text-green-600">
                  ✓ {uploadedFile.name} uploaded
                </p>
                <p className="text-xs text-gray-500">
                  {bulkContacts.length} contacts loaded
                </p>
              </div>
            )}
          </div>

          <div className="text-center text-sm text-gray-500">
            ─────── OR ───────
          </div>

          {/* Manual Entry */}
          <div className="space-y-3">
            {bulkContacts.map((contact, index) => (
              <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                  placeholder="Name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-transparent"
                />
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                  placeholder="+1234567890"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-transparent"
                />
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                  placeholder="email@example.com"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveContact(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleAddContact}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#f2070d] hover:text-[#f2070d] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add Contact
            </button>
          </div>
        </div>
      )}

      {/* AI Script */}
      <div>
        <Textarea
          label="AI Agent Script"
          {...register('ai_script')}
          error={errors.ai_script?.message}
          rows={8}
          placeholder={DEFAULT_AI_SCRIPT}
        />
        <p className="mt-1 text-xs text-gray-500">
          Define how your AI agent should behave and respond
        </p>
      </div>

      {/* Voice Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Voice Selection
        </label>
        
        {isLoadingVoices ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f2070d] mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading voices...</p>
          </div>
        ) : (
          <>
            <select
              {...register('voice_id')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-transparent"
            >
              <option value="">Select a voice</option>
              {voices.map((voice) => (
                <option key={voice.voice_id} value={voice.voice_id}>
                  {voice.name}
                </option>
              ))}
            </select>
            {errors.voice_id && (
              <p className="mt-1 text-sm text-red-600">{errors.voice_id.message}</p>
            )}
            
            {selectedVoiceId && (
              <button
                type="button"
                onClick={handleTestVoice}
                disabled={isTesting}
                className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {isTesting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play size={16} className="mr-2" />
                    Test Voice
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logic Level
          </label>
          <select
            {...register('logic_level')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-transparent"
          >
            <option value="low">Low - Simple responses</option>
            <option value="medium">Medium - Balanced</option>
            <option value="high">High - Complex reasoning</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Frequency (days)
          </label>
          <input
            type="number"
            {...register('contact_frequency', { valueAsNumber: true })}
            min="1"
            max="30"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-transparent"
          />
          {errors.contact_frequency && (
            <p className="mt-1 text-sm text-red-600">{errors.contact_frequency.message}</p>
          )}
        </div>
      </div>

      {/* Communication Channels */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">Communication Channels</h3>
        
        {/* Enable Calls */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${enableCalls ? 'bg-[#f2070d]/10' : 'bg-gray-100'}`}>
              <Phone size={18} className={enableCalls ? 'text-[#f2070d]' : 'text-gray-600'} />
            </div>
            <div>
              <div className="font-medium text-sm text-gray-900">Enable Voice Calls</div>
              <div className="text-xs text-gray-500">Make phone calls to contacts</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register('enable_calls')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f2070d]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2070d]"></div>
          </label>
        </div>

        {/* Enable Emails */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${enableEmails ? 'bg-[#f2070d]/10' : 'bg-gray-100'}`}>
              <Mail size={18} className={enableEmails ? 'text-[#f2070d]' : 'text-gray-600'} />
            </div>
            <div>
              <div className="font-medium text-sm text-gray-900">Enable Emails</div>
              <div className="text-xs text-gray-500">Send follow-up emails</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register('enable_emails')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f2070d]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2070d]"></div>
          </label>
        </div>

        {/* ✅ NEW: Email Template Field */}
        {enableEmails && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              📧 Email Message Template
            </label>
            <textarea
              {...register('email_template')}
              placeholder="Hi {name}, this is a follow-up message about our services. We wanted to reach out on {date} to see if you're still interested..."
              rows="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <div className="mt-2 flex items-start gap-2 text-xs text-gray-600">
              <div className="bg-white px-2 py-1 rounded border border-gray-200">
                <code>{"{name}"}</code> = Customer name
              </div>
              <div className="bg-white px-2 py-1 rounded border border-gray-200">
                <code>{"{date}"}</code> = Current date
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              📅 This email will be sent to all contacts every {contactFrequency} days at 10 AM Canada time
            </p>
          </div>
        )}

        {/* Enable SMS */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${enableSms ? 'bg-[#f2070d]/10' : 'bg-gray-100'}`}>
              <MessageSquare size={18} className={enableSms ? 'text-[#f2070d]' : 'text-gray-600'} />
            </div>
            <div>
              <div className="font-medium text-sm text-gray-900">Enable SMS</div>
              <div className="text-xs text-gray-500">Send text messages</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register('enable_sms')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f2070d]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2070d]"></div>
</label>
</div>{/* ✅ NEW: SMS Template Field */}
    {enableSms && (
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          💬 SMS Message Template
        </label>
        <textarea
          {...register('sms_template')}
          placeholder="Hi {name}, just a quick reminder from our team. We hope you're doing well on {date}!"
          rows="3"
          maxLength="500"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
        />
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <div className="bg-white px-2 py-1 rounded border border-gray-200">
              <code>{"{name}"}</code> = Customer name
            </div>
            <div className="bg-white px-2 py-1 rounded border border-gray-200">
              <code>{"{date}"}</code> = Current date
            </div>
          </div>
          <span className="text-xs text-gray-500">
            Max 500 characters
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          📅 This SMS will be sent to all contacts every {contactFrequency} days at 10 AM Canada time
        </p>
      </div>
    )}
  </div>

  {/* Actions */}
  <div className="flex items-center justify-end space-x-3 pt-6 border-t sticky bottom-0 bg-white">
    {onCancel && (
      <Button type="button" onClick={onCancel} variant="outline">
        Cancel
      </Button>
    )}
    <Button type="submit" disabled={isLoading}>
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          Saving...
        </>
      ) : (
        <>
          <Save size={20} className="mr-2" />
          {agent ? 'Update Agent' : 'Create Agent'}
        </>
      )}
    </Button>
  </div>
</form>);
};
export default AgentForm;