
// // frontend/src/Pages/dashboard/automation/Campaigns.jsx - WITHOUT SMS AND BOOK AN APPOINTMENT

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { 
//   Plus, Save, Play, Trash2, Edit, X, MessageSquare, Zap, HelpCircle,
//   ArrowLeft, Check, AlertCircle
// } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { flowService } from '../../../services/flow';
// import Card from '../../../Components/ui/Card';
// import Button from '../../../Components/ui/Button';

// const Campaigns = () => {
//   // State for workflow list
//   const [workflows, setWorkflows] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
  
//   // State for builder (modal/section)
//   const [showBuilder, setShowBuilder] = useState(false);
//   const [editingFlow, setEditingFlow] = useState(null);
  
//   // Builder state
//   const [nodes, setNodes] = useState([]);
//   const [connections, setConnections] = useState([]);
//   const [flowName, setFlowName] = useState('');
//   const [flowDescription, setFlowDescription] = useState('');
//   const [isDragging, setIsDragging] = useState(null);
//   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
//   const [isConnecting, setIsConnecting] = useState(null);
//   const [editingNodeMessage, setEditingNodeMessage] = useState(null);
//   const [editingNodeTitle, setEditingNodeTitle] = useState(null);
//   const [editingTransition, setEditingTransition] = useState(null);
//   const [tempMessageValue, setTempMessageValue] = useState('');
//   const [tempTitleValue, setTempTitleValue] = useState('');
//   const [tempTransitionValue, setTempTransitionValue] = useState('');
//   const [isSaving, setIsSaving] = useState(false);
  
//   // Simulation modal
//   const [showSimulation, setShowSimulation] = useState(false);
//   const [simulationInput, setSimulationInput] = useState('');
//   const [simulationResult, setSimulationResult] = useState('');
  
//   const canvasRef = useRef(null);

//   // Load workflows on mount
//   useEffect(() => {
//     loadWorkflows();
//   }, []);

//   const loadWorkflows = async () => {
//     try {
//       setIsLoading(true);
//       const response = await flowService.getFlows();
//       setWorkflows(response.flows || []);
//       console.log('✅ Loaded workflows:', response.flows?.length || 0);
//     } catch (error) {
//       console.error('❌ Failed to load workflows:', error);
//       toast.error('Failed to load workflows');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ============================================================================
//   // BUILDER FUNCTIONS
//   // ============================================================================

//   const openBuilder = (flow = null) => {
//     if (flow) {
//       // Edit existing flow
//       setEditingFlow(flow);
//       setFlowName(flow.name);
//       setFlowDescription(flow.description || '');
//       setNodes(flow.nodes || []);
//       setConnections(flow.connections || []);
//       console.log('📝 Editing flow:', flow.name);
//     } else {
//       // Create new flow
//       setEditingFlow(null);
//       setFlowName('New Campaign Flow');
//       setFlowDescription('');
      
//       // Initialize with default nodes
//       const defaultNodes = [
//         {
//           id: 'begin-1',
//           type: 'begin',
//           x: 120,
//           y: 120,
//           data: { title: 'Begin' }
//         },
//         {
//           id: 'welcome-1',
//           type: 'welcome',
//           x: 400,
//           y: 220,
//           data: { 
//             title: 'Welcome Message',
//             message: 'Hello! How can I help you today?',
//             transitions: []
//           }
//         }
//       ];
      
//       setNodes(defaultNodes);
//       setConnections([
//         { id: 'conn-1', from: 'begin-1', to: 'welcome-1' }
//       ]);
//       console.log('➕ Creating new flow');
//     }
    
//     setShowBuilder(true);
//   };

//   const closeBuilder = () => {
//     setShowBuilder(false);
//     setEditingFlow(null);
//     setNodes([]);
//     setConnections([]);
//     setFlowName('');
//     setFlowDescription('');
//   };

//   const saveWorkflow = async () => {
//     try {
//       setIsSaving(true);

//       if (!flowName.trim()) {
//         toast.error('Please enter a workflow name');
//         return;
//       }

//       if (nodes.length === 0) {
//         toast.error('Please add some nodes to your workflow');
//         return;
//       }

//       // Prepare data matching backend schema
//       const flowData = {
//         name: flowName.trim(),
//         description: flowDescription.trim() || null,
//         nodes: nodes,
//         connections: connections,
//         active: true
//       };

//       console.log('💾 Saving workflow:', flowData);

//       if (editingFlow) {
//         // Update existing
//         await flowService.updateFlow(editingFlow._id, flowData);
//         toast.success('Workflow updated successfully!');
//         console.log('✅ Updated flow:', editingFlow._id);
//       } else {
//         // Create new
//         const result = await flowService.createFlow(flowData);
//         toast.success('Workflow created successfully!');
//         console.log('✅ Created flow:', result);
//       }

//       // Reload list and close builder
//       await loadWorkflows();
//       closeBuilder();

//     } catch (error) {
//       console.error('❌ Save error:', error);
//       const errorMessage = error.response?.data?.detail || error.message || 'Failed to save workflow';
//       toast.error(errorMessage);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const deleteWorkflow = async (flowId) => {
//     if (!confirm('Are you sure you want to delete this workflow?')) return;

//     try {
//       await flowService.deleteFlow(flowId);
//       toast.success('Workflow deleted successfully');
//       console.log('🗑️ Deleted flow:', flowId);
//       loadWorkflows();
//     } catch (error) {
//       console.error('❌ Failed to delete workflow:', error);
//       toast.error(error.response?.data?.detail || 'Failed to delete workflow');
//     }
//   };

//   const addNode = (type, x, y) => {
//     const defaultTitles = {
//       welcome: 'Welcome Message',
//       query: 'Question Node',
//       conversation: 'Response Node'
//     };

//     const newNode = {
//       id: `${type}-${Date.now()}`,
//       type,
//       x: x || 600,
//       y: y || 300,
//       data: {
//         title: defaultTitles[type] || 'New Node',
//         message: type === 'query' ? 
//           'What specific query would you like help with?' : 
//           'Enter your message here...',
//         transitions: []
//       }
//     };
//     setNodes([...nodes, newNode]);
//     console.log('➕ Added node:', newNode.id);
//     return newNode;
//   };

//   const deleteNode = (nodeId) => {
//     setNodes(nodes.filter(n => n.id !== nodeId));
//     setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId));
//     console.log('🗑️ Deleted node:', nodeId);
//   };

//   const updateNodeData = (nodeId, updates) => {
//     setNodes(prev => prev.map(node => 
//       node.id === nodeId 
//         ? { ...node, data: { ...node.data, ...updates } }
//         : node
//     ));
//   };

//   const addTransition = (nodeId) => {
//     const node = nodes.find(n => n.id === nodeId);
//     if (node) {
//       const currentTransitions = node.data.transitions || [];
//       updateNodeData(nodeId, {
//         transitions: [...currentTransitions, 'new_keyword']
//       });
//     }
//   };

//   const updateTransition = (nodeId, oldTransition, newTransition) => {
//     const node = nodes.find(n => n.id === nodeId);
//     if (node) {
//       const updatedTransitions = node.data.transitions.map(t => 
//         t === oldTransition ? newTransition : t
//       );
//       updateNodeData(nodeId, { transitions: updatedTransitions });
      
//       // Update connection transitions
//       setConnections(prev => prev.map(conn => 
//         conn.from === nodeId && conn.transition === oldTransition
//           ? { ...conn, transition: newTransition }
//           : conn
//       ));
//     }
//   };

//   const deleteTransition = (nodeId, transition) => {
//     const node = nodes.find(n => n.id === nodeId);
//     if (node) {
//       const updatedTransitions = node.data.transitions.filter(t => t !== transition);
//       updateNodeData(nodeId, { transitions: updatedTransitions });
      
//       // Delete associated connections
//       setConnections(prev => prev.filter(conn => 
//         !(conn.from === nodeId && conn.transition === transition)
//       ));
//     }
//   };

//   const startConnection = (nodeId, transition = null) => {
//     setIsConnecting({ from: nodeId, transition });
//   };

//   const completeConnection = (toNodeId) => {
//     if (isConnecting && isConnecting.from !== toNodeId) {
//       const newConnection = {
//         id: `conn-${Date.now()}`,
//         from: isConnecting.from,
//         to: toNodeId,
//         transition: isConnecting.transition
//       };
//       setConnections([...connections, newConnection]);
//       console.log('🔗 Connected:', newConnection);
//     }
//     setIsConnecting(null);
//   };

//   const deleteConnection = (connectionId) => {
//     setConnections(connections.filter(c => c.id !== connectionId));
//     console.log('🗑️ Deleted connection:', connectionId);
//   };

//   // ============================================================================
//   // MOUSE HANDLERS
//   // ============================================================================

//   const handleMouseDown = (e, nodeId) => {
//     if (e.target.closest('.node-control')) return;
    
//     const node = nodes.find(n => n.id === nodeId);
//     if (!node) return;
    
//     const rect = e.currentTarget.getBoundingClientRect();
//     setIsDragging(nodeId);
//     setDragOffset({
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top
//     });
//   };

//   const handleMouseMove = (e) => {
//     if (!isDragging || !canvasRef.current) return;
    
//     const canvasRect = canvasRef.current.getBoundingClientRect();
//     const newX = e.clientX - canvasRect.left - dragOffset.x;
//     const newY = e.clientY - canvasRect.top - dragOffset.y;
    
//     setNodes(prev => prev.map(node =>
//       node.id === isDragging
//         ? { ...node, x: Math.max(0, newX), y: Math.max(0, newY) }
//         : node
//     ));
//   };

//   const handleMouseUp = () => {
//     setIsDragging(null);
//   };

//   // ============================================================================
//   // SIMULATION
//   // ============================================================================

//   const runSimulation = () => {
//     if (!simulationInput.trim()) {
//       toast.error('Please enter a test message');
//       return;
//     }

//     // Simple simulation logic
//     const inputLower = simulationInput.toLowerCase();
//     let currentNode = nodes.find(n => n.type === 'begin');
//     let response = '';

//     // Follow connections based on keywords
//     for (let i = 0; i < 10; i++) {
//       if (!currentNode) break;

//       // Add response from current node
//       if (currentNode.data.message && currentNode.type !== 'begin') {
//         response += currentNode.data.message + '\n\n';
//       }

//       // Find next node
//       const outgoingConnections = connections.filter(c => c.from === currentNode.id);
//       let nextConnection = null;

//       // Match keyword
//       for (const conn of outgoingConnections) {
//         if (conn.transition && inputLower.includes(conn.transition.toLowerCase())) {
//           nextConnection = conn;
//           break;
//         }
//       }

//       // If no keyword match, take first connection
//       if (!nextConnection && outgoingConnections.length > 0) {
//         nextConnection = outgoingConnections[0];
//       }

//       if (!nextConnection) break;

//       currentNode = nodes.find(n => n.id === nextConnection.to);
//     }

//     setSimulationResult(response || 'No response generated');
//   };

//   // ============================================================================
//   // RENDER
//   // ============================================================================

//   if (!showBuilder) {
//     // List view
//     return (
//       <div className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">AI Campaign Builder</h1>
//             <p className="text-gray-600 mt-1">Create conversation workflows for your AI agents</p>
//           </div>
//           <Button onClick={() => openBuilder()}>
//             <Plus size={20} className="mr-2" />
//             New Campaign Flow
//           </Button>
//         </div>

//         {isLoading ? (
//           <div className="flex items-center justify-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f2070d]"></div>
//           </div>
//         ) : workflows.length === 0 ? (
//           <Card className="p-12 text-center">
//             <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No Workflows Yet</h3>
//             <p className="text-gray-600 mb-4">Create your first AI conversation workflow to get started</p>
//             <Button onClick={() => openBuilder()}>
//               <Plus size={20} className="mr-2" />
//               Create First Workflow
//             </Button>
//           </Card>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {workflows.map(flow => (
//               <Card key={flow._id} className="p-6 hover:shadow-lg transition-shadow">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex-1">
//                     <h3 className="text-lg font-bold text-gray-900">{flow.name}</h3>
//                     <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
//                       flow.active 
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-gray-100 text-gray-800'
//                     }`}>
//                       {flow.active ? 'Active' : 'Inactive'}
//                     </span>
//                   </div>
//                 </div>

//                 {flow.description && (
//                   <p className="text-sm text-gray-600 mb-4">{flow.description}</p>
//                 )}

//                 {/* Stats */}
//                 <div className="grid grid-cols-2 gap-4 mb-4">
//                   <div className="bg-gray-50 p-3 rounded-lg">
//                     <p className="text-xs text-gray-600">Nodes</p>
//                     <p className="text-lg font-semibold text-gray-900">
//                       {flow.nodes?.length || 0}
//                     </p>
//                   </div>
//                   <div className="bg-gray-50 p-3 rounded-lg">
//                     <p className="text-xs text-gray-600">Connections</p>
//                     <p className="text-lg font-semibold text-gray-900">
//                       {flow.connections?.length || 0}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex items-center space-x-2">
//                   <button
//                     onClick={() => openBuilder(flow)}
//                     className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
//                   >
//                     <Edit size={16} />
//                     <span className="text-sm">Edit</span>
//                   </button>
                  
//                   <button
//                     onClick={() => deleteWorkflow(flow._id)}
//                     className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>

//                 <div className="mt-4 pt-4 border-t text-xs text-gray-500">
//                   Created {new Date(flow.created_at).toLocaleDateString()}
//                 </div>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }

//   // Builder view
//   return (
//     <div className="fixed inset-0 bg-white z-50 flex flex-col">
//       {/* Header */}
//       <div className="bg-white border-b px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={closeBuilder}
//               className="p-2 hover:bg-gray-100 rounded-lg"
//             >
//               <ArrowLeft className="w-5 h-5" />
//             </button>
//             <div>
//               <input
//                 type="text"
//                 value={flowName}
//                 onChange={(e) => setFlowName(e.target.value)}
//                 className="text-2xl font-bold text-gray-900 border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 outline-none"
//                 placeholder="Workflow Name"
//               />
//               <input
//                 type="text"
//                 value={flowDescription}
//                 onChange={(e) => setFlowDescription(e.target.value)}
//                 className="text-sm text-gray-600 border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none w-full mt-1"
//                 placeholder="Description (optional)"
//               />
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() => setShowSimulation(true)}
//               className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//             >
//               <Play className="w-4 h-4" />
//               <span>Test</span>
//             </button>
//             <button
//               onClick={saveWorkflow}
//               disabled={isSaving}
//               className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//             >
//               <Save className="w-4 h-4" />
//               <span>{isSaving ? 'Saving...' : 'Save'}</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Builder Content */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <div className="w-64 bg-white border-r p-4 space-y-4 overflow-y-auto">
//           <div>
//             <h3 className="font-semibold text-gray-900 mb-3">Add Node</h3>
//             <div className="space-y-2">
//               <button
//                 onClick={() => addNode('welcome')}
//                 className="w-full flex items-center space-x-3 px-4 py-3 bg-pink-50 border-2 border-pink-200 rounded-lg hover:bg-pink-100"
//               >
//                 <MessageSquare className="w-5 h-5 text-pink-600" />
//                 <div className="text-left">
//                   <div className="font-medium text-gray-900">Welcome</div>
//                   <div className="text-xs text-gray-600">Initial greeting</div>
//                 </div>
//               </button>

//               <button
//                 onClick={() => addNode('query')}
//                 className="w-full flex items-center space-x-3 px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100"
//               >
//                 <HelpCircle className="w-5 h-5 text-purple-600" />
//                 <div className="text-left">
//                   <div className="font-medium text-gray-900">Query</div>
//                   <div className="text-xs text-gray-600">Specific questions</div>
//                 </div>
//               </button>
              
//               <button
//                 onClick={() => addNode('conversation')}
//                 className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100"
//               >
//                 <MessageSquare className="w-5 h-5 text-blue-600" />
//                 <div className="text-left">
//                   <div className="font-medium text-gray-900">Response</div>
//                   <div className="text-xs text-gray-600">AI responses</div>
//                 </div>
//               </button>
//             </div>
//           </div>

//           <div className="pt-4 border-t">
//             <h4 className="font-medium text-gray-700 mb-2">Tips</h4>
//             <ul className="text-xs text-gray-600 space-y-1">
//               <li>• Click message to edit</li>
//               <li>• Click title to rename node</li>
//               <li>• Add keywords for matching</li>
//               <li>• Click 🔗 to connect nodes</li>
//               <li>• Click + on connections</li>
//               <li>• Drag nodes to reposition</li>
//               <li>• Use Query nodes for specific questions</li>
//             </ul>
//           </div>

//           <div className="pt-4 border-t">
//             <h4 className="font-medium text-gray-700 mb-2">Stats</h4>
//             <div className="text-sm text-gray-600">
//               <div>Nodes: {nodes.length}</div>
//               <div>Connections: {connections.length}</div>
//             </div>
//           </div>
//         </div>

//         {/* Canvas */}
//         <div 
//           ref={canvasRef}
//           className="flex-1 bg-gray-50 relative overflow-auto"
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//         >
//           {/* Render connections */}
//           <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
//             {connections.map(conn => {
//               const fromNode = nodes.find(n => n.id === conn.from);
//               const toNode = nodes.find(n => n.id === conn.to);
              
//               if (!fromNode || !toNode) return null;
              
//               const startX = fromNode.x + 150;
//               const startY = fromNode.y + 60;
//               const endX = toNode.x;
//               const endY = toNode.y + 60;
              
//               return (
//                 <g key={conn.id}>
//                   <line
//                     x1={startX}
//                     y1={startY}
//                     x2={endX}
//                     y2={endY}
//                     stroke="#3B82F6"
//                     strokeWidth="2"
//                     markerEnd="url(#arrowhead)"
//                   />
//                   {conn.transition && (
//                     <text
//                       x={(startX + endX) / 2}
//                       y={(startY + endY) / 2 - 5}
//                       fill="#1F2937"
//                       fontSize="12"
//                       fontWeight="500"
//                       textAnchor="middle"
//                       className="pointer-events-auto cursor-pointer"
//                       onClick={() => deleteConnection(conn.id)}
//                     >
//                       {conn.transition} ✕
//                     </text>
//                   )}
//                 </g>
//               );
//             })}
//             <defs>
//               <marker
//                 id="arrowhead"
//                 markerWidth="10"
//                 markerHeight="10"
//                 refX="9"
//                 refY="3"
//                 orient="auto"
//               >
//                 <polygon points="0 0, 10 3, 0 6" fill="#3B82F6" />
//               </marker>
//             </defs>
//           </svg>

//           {/* Render nodes */}
//           {nodes.map(node => (
//             <div
//               key={node.id}
//               className={`absolute bg-white rounded-lg shadow-lg border-2 p-4 cursor-move ${
//                 node.type === 'begin' ? 'border-purple-400 w-32' : 
//                 node.type === 'welcome' ? 'border-pink-400 w-64' : 
//                 node.type === 'query' ? 'border-purple-400 w-64' :
//                 'border-blue-400 w-64'
//               }`}
//               style={{ left: node.x, top: node.y }}
//               onMouseDown={(e) => handleMouseDown(e, node.id)}
//               onClick={() => {
//                 if (isConnecting) {
//                   completeConnection(node.id);
//                 }
//               }}
//             >
//               {/* Node header */}
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center space-x-2">
//                   {node.type === 'query' ? (
//                     <HelpCircle className="w-4 h-4 text-purple-600" />
//                   ) : (
//                     <MessageSquare className="w-4 h-4" />
//                   )}
                  
//                   {editingNodeTitle === node.id ? (
//                     <div className="node-control flex items-center space-x-2">
//                       <input
//                         value={tempTitleValue}
//                         onChange={(e) => setTempTitleValue(e.target.value)}
//                         className="text-sm font-semibold border rounded px-1 w-32"
//                         autoFocus
//                         onKeyDown={(e) => {
//                           if (e.key === 'Enter') {
//                             updateNodeData(node.id, { title: tempTitleValue });
//                             setEditingNodeTitle(null);
//                           } else if (e.key === 'Escape') {
//                             setEditingNodeTitle(null);
//                           }
//                         }}
//                       />
//                       <button
//                         onClick={() => {
//                           updateNodeData(node.id, { title: tempTitleValue });
//                           setEditingNodeTitle(null);
//                         }}
//                         className="text-green-500 hover:text-green-700"
//                       >
//                         <Check className="w-3 h-3" />
//                       </button>
//                       <button
//                         onClick={() => setEditingNodeTitle(null)}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     </div>
//                   ) : (
//                     <span 
//                       className="font-semibold text-sm cursor-pointer hover:bg-gray-50 px-1 rounded"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setEditingNodeTitle(node.id);
//                         setTempTitleValue(node.data.title);
//                       }}
//                     >
//                       {node.data.title}
//                     </span>
//                   )}
//                 </div>
//                 {node.type !== 'begin' && (
//                   <button
//                     className="node-control text-red-500 hover:text-red-700"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       deleteNode(node.id);
//                     }}
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>

//               {/* Node content */}
//               {node.type !== 'begin' && (
//                 <>
//                   {editingNodeMessage === node.id ? (
//                     <div className="node-control">
//                       <textarea
//                         value={tempMessageValue}
//                         onChange={(e) => setTempMessageValue(e.target.value)}
//                         className="w-full p-2 border rounded text-sm"
//                         rows={3}
//                         autoFocus
//                         onKeyDown={(e) => {
//                           if (e.key === 'Enter' && e.ctrlKey) {
//                             updateNodeData(node.id, { message: tempMessageValue });
//                             setEditingNodeMessage(null);
//                           } else if (e.key === 'Escape') {
//                             setEditingNodeMessage(null);
//                           }
//                         }}
//                       />
//                       <div className="flex space-x-2 mt-2">
//                         <button
//                           onClick={() => {
//                             updateNodeData(node.id, { message: tempMessageValue });
//                             setEditingNodeMessage(null);
//                           }}
//                           className="px-2 py-1 bg-green-500 text-white rounded text-xs"
//                         >
//                           Save
//                         </button>
//                         <button
//                           onClick={() => setEditingNodeMessage(null)}
//                           className="px-2 py-1 bg-gray-300 rounded text-xs"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <div
//                       className="node-control text-xs text-gray-600 mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setEditingNodeMessage(node.id);
//                         setTempMessageValue(node.data.message);
//                       }}
//                     >
//                       {node.data.message}
//                     </div>
//                   )}

//                   {/* Keywords/Transitions */}
//                   <div className="node-control space-y-1 mb-2">
//                     {(node.data.transitions || []).map((transition, idx) => (
//                       <div key={idx} className="flex items-center space-x-2">
//                         {editingTransition === `${node.id}-${idx}` ? (
//                           <>
//                             <input
//                               value={tempTransitionValue}
//                               onChange={(e) => setTempTransitionValue(e.target.value)}
//                               className="flex-1 px-2 py-1 border rounded text-xs"
//                               autoFocus
//                               onKeyDown={(e) => {
//                                 if (e.key === 'Enter') {
//                                   updateTransition(node.id, transition, tempTransitionValue);
//                                   setEditingTransition(null);
//                                 } else if (e.key === 'Escape') {
//                                   setEditingTransition(null);
//                                 }
//                               }}
//                             />
//                             <button
//                               onClick={() => {
//                                 updateTransition(node.id, transition, tempTransitionValue);
//                                 setEditingTransition(null);
//                               }}
//                               className="text-green-500 hover:text-green-700"
//                             >
//                               <Check className="w-3 h-3" />
//                             </button>
//                           </>
//                         ) : (
//                           <>
//                             <span 
//                               className="flex-1 text-xs bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setEditingTransition(`${node.id}-${idx}`);
//                                 setTempTransitionValue(transition);
//                               }}
//                             >
//                               {transition}
//                             </span>
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 startConnection(node.id, transition);
//                               }}
//                               className="text-blue-500 hover:text-blue-700"
//                               title="Connect to another node"
//                             >
//                               🔗
//                             </button>
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 deleteTransition(node.id, transition);
//                               }}
//                               className="text-red-500 hover:text-red-700"
//                             >
//                               <X className="w-3 h-3" />
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     ))}
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         addTransition(node.id);
//                       }}
//                       className="text-xs text-blue-600 hover:text-blue-800"
//                     >
//                       + Add Keyword
//                     </button>
//                   </div>
//                 </>
//               )}

//               {/* Connect button */}
//               <button
//                 className="node-control w-full mt-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   startConnection(node.id);
//                 }}
//               >
//                 🔗 Connect
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Simulation Modal */}
//       {showSimulation && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <Card className="w-full max-w-2xl p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-xl font-bold">Test Workflow</h3>
//               <button onClick={() => setShowSimulation(false)}>
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Test Message</label>
//                 <input
//                   type="text"
//                   value={simulationInput}
//                   onChange={(e) => setSimulationInput(e.target.value)}
//                   placeholder="e.g., I need help with my order"
//                   className="w-full px-3 py-2 border rounded-lg"
//                 />
//               </div>

//               <Button onClick={runSimulation} className="w-full">
//                 <Play className="w-4 h-4 mr-2" />
//                 Run Test
//               </Button>

//               {simulationResult && (
//                 <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//                   <h4 className="font-semibold mb-2">AI Response:</h4>
//                   <p className="text-sm whitespace-pre-wrap">{simulationResult}</p>
//                 </div>
//               )}
//             </div>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Campaigns;


// frontend/src/Pages/dashboard/automation/Campaigns.jsx - COMPLETE UPDATED VERSION

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Plus, Save, Play, Trash2, Edit, X, MessageSquare, Zap, HelpCircle,
  ArrowLeft, Check, AlertCircle, CheckCircle  // ✅ ADDED CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { flowService } from '../../../services/flow';
import Card from '../../../Components/ui/Card';
import Button from '../../../Components/ui/Button';

const Campaigns = () => {
  // State for workflow list
  const [workflows, setWorkflows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for builder (modal/section)
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingFlow, setEditingFlow] = useState(null);
  
  // Builder state
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [flowName, setFlowName] = useState('');
  const [flowDescription, setFlowDescription] = useState('');
  const [isDragging, setIsDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(null);
  const [editingNodeMessage, setEditingNodeMessage] = useState(null);
  const [editingNodeTitle, setEditingNodeTitle] = useState(null);
  const [editingTransition, setEditingTransition] = useState(null);
  const [tempMessageValue, setTempMessageValue] = useState('');
  const [tempTitleValue, setTempTitleValue] = useState('');
  const [tempTransitionValue, setTempTransitionValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Simulation modal
  const [showSimulation, setShowSimulation] = useState(false);
  const [simulationInput, setSimulationInput] = useState('');
  const [simulationResult, setSimulationResult] = useState('');
  
  const canvasRef = useRef(null);

  // Load workflows on mount
  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setIsLoading(true);
      const response = await flowService.getFlows();
      setWorkflows(response.flows || []);
      console.log('✅ Loaded workflows:', response.flows?.length || 0);
    } catch (error) {
      console.error('❌ Failed to load workflows:', error);
      toast.error('Failed to load workflows');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // BUILDER FUNCTIONS
  // ============================================================================

  const openBuilder = (flow = null) => {
    if (flow) {
      // Edit existing flow
      setEditingFlow(flow);
      setFlowName(flow.name);
      setFlowDescription(flow.description || '');
      setNodes(flow.nodes || []);
      setConnections(flow.connections || []);
      console.log('📝 Editing flow:', flow.name);
    } else {
      // Create new flow
      setEditingFlow(null);
      setFlowName('New Campaign Flow');
      setFlowDescription('');
      
      // Initialize with default nodes
      const defaultNodes = [
        {
          id: 'begin-1',
          type: 'begin',
          x: 120,
          y: 120,
          data: { title: 'Begin' }
        },
        {
          id: 'welcome-1',
          type: 'welcome',
          x: 400,
          y: 220,
          data: { 
            title: 'Welcome Message',
            message: 'Hello! How can I help you today?',
            transitions: []
          }
        }
      ];
      
      setNodes(defaultNodes);
      setConnections([
        { id: 'conn-1', from: 'begin-1', to: 'welcome-1' }
      ]);
      console.log('➕ Creating new flow');
    }
    
    setShowBuilder(true);
  };

  const closeBuilder = () => {
    setShowBuilder(false);
    setEditingFlow(null);
    setNodes([]);
    setConnections([]);
    setFlowName('');
    setFlowDescription('');
  };

  const saveWorkflow = async () => {
    try {
      setIsSaving(true);

      if (!flowName.trim()) {
        toast.error('Please enter a workflow name');
        return;
      }

      if (nodes.length === 0) {
        toast.error('Please add some nodes to your workflow');
        return;
      }

      // Prepare data matching backend schema
      const flowData = {
        name: flowName.trim(),
        description: flowDescription.trim() || null,
        nodes: nodes,
        connections: connections,
        active: true
      };

      console.log('💾 Saving workflow:', flowData);

      if (editingFlow) {
        // Update existing
        await flowService.updateFlow(editingFlow._id, flowData);
        toast.success('Workflow updated successfully!');
        console.log('✅ Updated flow:', editingFlow._id);
      } else {
        // Create new
        const result = await flowService.createFlow(flowData);
        toast.success('Workflow created successfully!');
        console.log('✅ Created flow:', result);
      }

      // Reload list and close builder
      await loadWorkflows();
      closeBuilder();

    } catch (error) {
      console.error('❌ Save error:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to save workflow';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteWorkflow = async (flowId) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      await flowService.deleteFlow(flowId);
      toast.success('Workflow deleted successfully');
      console.log('🗑️ Deleted flow:', flowId);
      loadWorkflows();
    } catch (error) {
      console.error('❌ Failed to delete workflow:', error);
      toast.error(error.response?.data?.detail || 'Failed to delete workflow');
    }
  };

  // ✅ UPDATED: Added confirmation node type
  const addNode = (type, x, y) => {
    const defaultTitles = {
      welcome: 'Welcome Message',
      query: 'Question Node',
      conversation: 'Response Node',
      confirmation: 'Final Confirmation'  // ✅ ADDED
    };

    const defaultMessages = {
      welcome: 'Hello! How can I help you today?',
      query: 'What specific query would you like help with?',
      conversation: 'Enter your message here...',
      confirmation: 'Thank you! Your appointment is confirmed. You\'ll receive a confirmation email shortly. Is there anything else I can help you with?'  // ✅ ADDED
    };

    const newNode = {
      id: `${type}-${Date.now()}`,
      type,  // ✅ Ensures type is set correctly
      x: x || 600,
      y: y || 300,
      data: {
        title: defaultTitles[type] || 'New Node',
        message: defaultMessages[type] || 'Enter your message here...',
        transitions: []
      }
    };
    setNodes([...nodes, newNode]);
    console.log('➕ Added node:', newNode.id, 'Type:', newNode.type);
    return newNode;
  };

  const deleteNode = (nodeId) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId));
    console.log('🗑️ Deleted node:', nodeId);
  };

  const updateNodeData = (nodeId, updates) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, ...updates } }
        : node
    ));
  };

  const addTransition = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      const currentTransitions = node.data.transitions || [];
      updateNodeData(nodeId, {
        transitions: [...currentTransitions, 'new_keyword']
      });
    }
  };

  const updateTransition = (nodeId, oldTransition, newTransition) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      const updatedTransitions = node.data.transitions.map(t => 
        t === oldTransition ? newTransition : t
      );
      updateNodeData(nodeId, { transitions: updatedTransitions });
      
      // Update connection transitions
      setConnections(prev => prev.map(conn => 
        conn.from === nodeId && conn.transition === oldTransition
          ? { ...conn, transition: newTransition }
          : conn
      ));
    }
  };

  const deleteTransition = (nodeId, transition) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      const updatedTransitions = node.data.transitions.filter(t => t !== transition);
      updateNodeData(nodeId, { transitions: updatedTransitions });
      
      // Delete associated connections
      setConnections(prev => prev.filter(conn => 
        !(conn.from === nodeId && conn.transition === transition)
      ));
    }
  };

  const startConnection = (nodeId, transition = null) => {
    setIsConnecting({ from: nodeId, transition });
  };

  const completeConnection = (toNodeId) => {
    if (isConnecting && isConnecting.from !== toNodeId) {
      const newConnection = {
        id: `conn-${Date.now()}`,
        from: isConnecting.from,
        to: toNodeId,
        transition: isConnecting.transition
      };
      setConnections([...connections, newConnection]);
      console.log('🔗 Connected:', newConnection);
    }
    setIsConnecting(null);
  };

  const deleteConnection = (connectionId) => {
    setConnections(connections.filter(c => c.id !== connectionId));
    console.log('🗑️ Deleted connection:', connectionId);
  };

  // ============================================================================
  // MOUSE HANDLERS
  // ============================================================================

  const handleMouseDown = (e, nodeId) => {
    if (e.target.closest('.node-control')) return;
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setIsDragging(nodeId);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - dragOffset.x;
    const newY = e.clientY - canvasRect.top - dragOffset.y;
    
    setNodes(prev => prev.map(node =>
      node.id === isDragging
        ? { ...node, x: Math.max(0, newX), y: Math.max(0, newY) }
        : node
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  // ============================================================================
  // SIMULATION
  // ============================================================================

  const runSimulation = () => {
    if (!simulationInput.trim()) {
      toast.error('Please enter a test message');
      return;
    }

    // Simple simulation logic
    const inputLower = simulationInput.toLowerCase();
    let currentNode = nodes.find(n => n.type === 'begin');
    let response = '';

    // Follow connections based on keywords
    for (let i = 0; i < 10; i++) {
      if (!currentNode) break;

      // Add response from current node
      if (currentNode.data.message && currentNode.type !== 'begin') {
        response += currentNode.data.message + '\n\n';
      }

      // Find next node
      const outgoingConnections = connections.filter(c => c.from === currentNode.id);
      let nextConnection = null;

      // Match keyword
      for (const conn of outgoingConnections) {
        if (conn.transition && inputLower.includes(conn.transition.toLowerCase())) {
          nextConnection = conn;
          break;
        }
      }

      // If no keyword match, take first connection
      if (!nextConnection && outgoingConnections.length > 0) {
        nextConnection = outgoingConnections[0];
      }

      if (!nextConnection) break;

      currentNode = nodes.find(n => n.id === nextConnection.to);
    }

    setSimulationResult(response || 'No response generated');
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!showBuilder) {
    // List view
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Campaign Builder</h1>
            <p className="text-gray-600 mt-1">Create conversation workflows for your AI agents</p>
          </div>
          <Button onClick={() => openBuilder()}>
            <Plus size={20} className="mr-2" />
            New Campaign Flow
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f2070d]"></div>
          </div>
        ) : workflows.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Workflows Yet</h3>
            <p className="text-gray-600 mb-4">Create your first AI conversation workflow to get started</p>
            <Button onClick={() => openBuilder()}>
              <Plus size={20} className="mr-2" />
              Create First Workflow
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map(flow => (
              <Card key={flow._id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{flow.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                      flow.active 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {flow.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {flow.description && (
                  <p className="text-sm text-gray-600 mb-4">{flow.description}</p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Nodes</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {flow.nodes?.length || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Connections</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {flow.connections?.length || 0}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openBuilder(flow)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                  >
                    <Edit size={16} />
                    <span className="text-sm">Edit</span>
                  </button>
                  
                  <button
                    onClick={() => deleteWorkflow(flow._id)}
                    className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                  Created {new Date(flow.created_at).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Builder view
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={closeBuilder}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <input
                type="text"
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                className="text-2xl font-bold text-gray-900 border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 outline-none"
                placeholder="Workflow Name"
              />
              <input
                type="text"
                value={flowDescription}
                onChange={(e) => setFlowDescription(e.target.value)}
                className="text-sm text-gray-600 border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none w-full mt-1"
                placeholder="Description (optional)"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSimulation(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Play className="w-4 h-4" />
              <span>Test</span>
            </button>
            <button
              onClick={saveWorkflow}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Builder Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* ✅ UPDATED SIDEBAR - Added Confirmation Node Button */}
        <div className="w-64 bg-white border-r p-4 space-y-4 overflow-y-auto">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Add Node</h3>
            <div className="space-y-2">
              <button
                onClick={() => addNode('welcome')}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-pink-50 border-2 border-pink-200 rounded-lg hover:bg-pink-100"
              >
                <MessageSquare className="w-5 h-5 text-pink-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Welcome</div>
                  <div className="text-xs text-gray-600">Initial greeting</div>
                </div>
              </button>

              <button
                onClick={() => addNode('query')}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100"
              >
                <HelpCircle className="w-5 h-5 text-purple-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Query</div>
                  <div className="text-xs text-gray-600">Ask questions</div>
                </div>
              </button>
              
              <button
                onClick={() => addNode('conversation')}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100"
              >
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Response</div>
                  <div className="text-xs text-gray-600">AI responses</div>
                </div>
              </button>

              {/* ✅ NEW: Confirmation Node Button */}
              <button
                onClick={() => addNode('confirmation')}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100"
              >
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Confirmation</div>
                  <div className="text-xs text-gray-600">Final booking node</div>
                </div>
              </button>
            </div>
          </div>

          {/* ✅ UPDATED TIPS */}
          <div className="pt-4 border-t">
            <h4 className="font-medium text-gray-700 mb-2">Tips</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Click message to edit</li>
              <li>• Click title to rename node</li>
              <li>• Add keywords for matching</li>
              <li>• Click 🔗 to connect nodes</li>
              <li>• <strong className="text-green-600">Use Confirmation as last node</strong></li>
              <li>• Drag nodes to reposition</li>
              <li>• Use Query for questions</li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium text-gray-700 mb-2">Stats</h4>
            <div className="text-sm text-gray-600">
              <div>Nodes: {nodes.length}</div>
              <div>Connections: {connections.length}</div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="flex-1 bg-gray-50 relative overflow-auto"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Render connections */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
            {connections.map(conn => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              
              if (!fromNode || !toNode) return null;
              
              const startX = fromNode.x + 150;
              const startY = fromNode.y + 60;
              const endX = toNode.x;
              const endY = toNode.y + 60;
              
              return (
                <g key={conn.id}>
                  <line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="#3B82F6"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                  {conn.transition && (
                    <text
                      x={(startX + endX) / 2}
                      y={(startY + endY) / 2 - 5}
                      fill="#1F2937"
                      fontSize="12"
                      fontWeight="500"
                      textAnchor="middle"
                      className="pointer-events-auto cursor-pointer"
                      onClick={() => deleteConnection(conn.id)}
                    >
                      {conn.transition} ✕
                    </text>
                  )}
                </g>
              );
            })}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#3B82F6" />
              </marker>
            </defs>
          </svg>

          {/* ✅ UPDATED: Render nodes with confirmation styling */}
          {nodes.map(node => (
            <div
              key={node.id}
              className={`absolute bg-white rounded-lg shadow-lg border-2 p-4 cursor-move ${
                node.type === 'begin' ? 'border-purple-400 w-32' : 
                node.type === 'welcome' ? 'border-pink-400 w-64' : 
                node.type === 'query' ? 'border-purple-400 w-64' :
                node.type === 'confirmation' ? 'border-green-400 w-64' :  // ✅ ADDED
                'border-blue-400 w-64'
              }`}
              style={{ left: node.x, top: node.y }}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              onClick={() => {
                if (isConnecting) {
                  completeConnection(node.id);
                }
              }}
            >
              {/* ✅ UPDATED: Node header with confirmation icon */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {node.type === 'confirmation' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : node.type === 'query' ? (
                    <HelpCircle className="w-4 h-4 text-purple-600" />
                  ) : (
                    <MessageSquare className="w-4 h-4" />
                  )}
                  
                  {editingNodeTitle === node.id ? (
                    <div className="node-control flex items-center space-x-2">
                      <input
                        value={tempTitleValue}
                        onChange={(e) => setTempTitleValue(e.target.value)}
                        className="text-sm font-semibold border rounded px-1 w-32"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateNodeData(node.id, { title: tempTitleValue });
                            setEditingNodeTitle(null);
                          } else if (e.key === 'Escape') {
                            setEditingNodeTitle(null);
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          updateNodeData(node.id, { title: tempTitleValue });
                          setEditingNodeTitle(null);
                        }}
                        className="text-green-500 hover:text-green-700"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setEditingNodeTitle(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span 
                      className="font-semibold text-sm cursor-pointer hover:bg-gray-50 px-1 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingNodeTitle(node.id);
                        setTempTitleValue(node.data.title);
                      }}
                    >
                      {node.data.title}
                    </span>
                  )}
                </div>
                {node.type !== 'begin' && (
                  <button
                    className="node-control text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNode(node.id);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Node content */}
              {node.type !== 'begin' && (
                <>
                  {editingNodeMessage === node.id ? (
                    <div className="node-control">
                      <textarea
                        value={tempMessageValue}
                        onChange={(e) => setTempMessageValue(e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        rows={3}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.ctrlKey) {
                            updateNodeData(node.id, { message: tempMessageValue });
                            setEditingNodeMessage(null);
                          } else if (e.key === 'Escape') {
                            setEditingNodeMessage(null);
                          }
                        }}
                      />
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => {
                            updateNodeData(node.id, { message: tempMessageValue });
                            setEditingNodeMessage(null);
                          }}
                         className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNodeMessage(null)}
                          className="px-2 py-1 bg-gray-300 rounded text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="node-control text-xs text-gray-600 mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingNodeMessage(node.id);
                        setTempMessageValue(node.data.message);
                      }}
                    >
                      {node.data.message}
                    </div>
                  )}

                  {/* Keywords/Transitions */}
                  <div className="node-control space-y-1 mb-2">
                    {(node.data.transitions || []).map((transition, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        {editingTransition === `${node.id}-${idx}` ? (
                          <>
                            <input
                              value={tempTransitionValue}
                              onChange={(e) => setTempTransitionValue(e.target.value)}
                              className="flex-1 px-2 py-1 border rounded text-xs"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  updateTransition(node.id, transition, tempTransitionValue);
                                  setEditingTransition(null);
                                } else if (e.key === 'Escape') {
                                  setEditingTransition(null);
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                updateTransition(node.id, transition, tempTransitionValue);
                                setEditingTransition(null);
                              }}
                              className="text-green-500 hover:text-green-700"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <>
                            <span 
                              className="flex-1 text-xs bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTransition(`${node.id}-${idx}`);
                                setTempTransitionValue(transition);
                              }}
                            >
                              {transition}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startConnection(node.id, transition);
                              }}
                              className="text-blue-500 hover:text-blue-700"
                              title="Connect to another node"
                            >
                              🔗
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTransition(node.id, transition);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addTransition(node.id);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      + Add Keyword
                    </button>
                  </div>
                </>
              )}

              {/* Connect button */}
              <button
                className="node-control w-full mt-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                onClick={(e) => {
                  e.stopPropagation();
                  startConnection(node.id);
                }}
              >
                🔗 Connect
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Simulation Modal */}
      {showSimulation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Test Workflow</h3>
              <button onClick={() => setShowSimulation(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Test Message</label>
                <input
                  type="text"
                  value={simulationInput}
                  onChange={(e) => setSimulationInput(e.target.value)}
                  placeholder="e.g., I need help with my order"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <Button onClick={runSimulation} className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Run Test
              </Button>

              {simulationResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">AI Response:</h4>
                  <p className="text-sm whitespace-pre-wrap">{simulationResult}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Campaigns;