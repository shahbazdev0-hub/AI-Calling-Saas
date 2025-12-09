// // frontend/src/Pages/dashboard/calls/VoiceAgents.jsx
// import React, { useState, useEffect } from "react";
// import { 
//   Bot, Plus, Settings, MessageSquare, Activity, Upload, 
//   Phone, Mail, MessageSquareText, TrendingUp, Trash2, Brain,
//   Target, Zap, BarChart3, GraduationCap, BookOpen
// } from "lucide-react";
// import Card from "../../../Components/ui/Card";
// import Button from "../../../Components/ui/Button";
// import Modal from "../../../Components/ui/Modal";
// import AgentForm from "../../../Components/forms/AgentForm";
// import { voiceService } from "../../../services/voice";
// import toast from "react-hot-toast";

// // ✅ Separate component for Agent Card to properly use hooks
// const AgentCard = ({ agent, onConfigure, onChat, onDelete, onConfigSaved }) => {
//   const [activeTab, setActiveTab] = useState('stats');

//   const statusConfig = (() => {
//     if (agent.is_active && agent.in_call) {
//       return { label: "In Call", color: "text-red-600", bg: "bg-red-100" };
//     } else if (agent.is_active) {
//       return { label: "Online", color: "text-red-600", bg: "bg-red-100" };
//     } else {
//       return { label: "Idle", color: "text-red-600", bg: "bg-red-100" };
//     }
//   })();

//   return (
//     <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#f2070d]/20 relative">
//       <div className="p-6">
//         {/* Header with Avatar and Status */}
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex items-center">
//             <div className="p-3 bg-[#f2070d]/10 rounded-lg mr-3">
//               <Bot className="text-[#f2070d]" size={28} />
//             </div>
//             <div>
//               <h3 className="font-bold text-gray-900 text-lg">
//                 {agent.name}
//               </h3>
//               <p className="text-xs text-gray-500">
//                 {agent.description || 'AI Sales Agent'}
//               </p>
//             </div>
//           </div>
//           <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
//             <span className="w-2 h-2 rounded-full bg-current mr-1"></span>
//             {statusConfig.label}
//           </span>
//         </div>

//         {/* Configuration Controls */}
//         <div className="space-y-3 mb-4">
//           {/* Logic Level */}
//           <div className="space-y-1">
//             <label className="text-xs text-gray-600 font-medium">Logic Level</label>
//             <select 
//               value={agent.logic_level || 'medium'}
//               onChange={(e) => {
//                 const updatedAgent = { ...agent, logic_level: e.target.value };
//                 onConfigSaved(updatedAgent);
//               }}
//               className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-transparent"
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>
//           </div>

//           {/* Contact Frequency */}
//           <div className="space-y-1">
//             <label className="text-xs text-gray-600 font-medium">
//               Contact Frequency: Every {agent.contact_frequency || 3} days
//             </label>
//             <input
//               type="range"
//               min="1"
//               max="7"
//               value={agent.contact_frequency || 3}
//               onChange={(e) => {
//                 const updatedAgent = { ...agent, contact_frequency: parseInt(e.target.value) };
//                 onConfigSaved(updatedAgent);
//               }}
//               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#f2070d]"
//             />
//           </div>

//           {/* ⭐ Communication Toggles - UPDATED WITH TOGGLE SWITCHES */}
//           <div className="flex items-center justify-between gap-2 pt-2">
//             {/* Calls Toggle */}
//             <div className="flex items-center gap-1">
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={agent.enable_calls !== false}
//                   onChange={(e) => {
//                     const updatedAgent = { ...agent, enable_calls: e.target.checked };
//                     onConfigSaved(updatedAgent);
//                   }}
//                   className="sr-only peer"
//                 />
//                 <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#f2070d]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#f2070d]"></div>
//               </label>
//               <span className="text-xs text-gray-700 font-medium ml-1">Calls</span>
//             </div>

//             {/* Emails Toggle */}
//             <div className="flex items-center gap-1">
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={agent.enable_emails !== false}
//                   onChange={(e) => {
//                     const updatedAgent = { ...agent, enable_emails: e.target.checked };
//                     onConfigSaved(updatedAgent);
//                   }}
//                   className="sr-only peer"
//                 />
//                 <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#f2070d]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#f2070d]"></div>
//               </label>
//               <span className="text-xs text-gray-700 font-medium ml-1">Emails</span>
//             </div>

//             {/* SMS Toggle */}
//             <div className="flex items-center gap-1">
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={agent.enable_sms !== false}
//                   onChange={(e) => {
//                     const updatedAgent = { ...agent, enable_sms: e.target.checked };
//                     onConfigSaved(updatedAgent);
//                   }}
//                   className="sr-only peer"
//                 />
//                 <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#f2070d]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#f2070d]"></div>
//               </label>
//               <span className="text-xs text-gray-700 font-medium ml-1">SMS</span>
//             </div>
//           </div>
//         </div>

//         {/* Stats/Activity Tabs */}
//         <div className="border-t pt-3">
//           <div className="flex border-b mb-3">
//             <button
//               onClick={() => setActiveTab('stats')}
//               className={`flex-1 pb-2 text-xs font-medium transition-colors ${
//                 activeTab === 'stats'
//                   ? 'text-[#f2070d] border-b-2 border-[#f2070d]'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Stats
//             </button>
//             <button
//               onClick={() => setActiveTab('activity')}
//               className={`flex-1 pb-2 text-xs font-medium transition-colors ${
//                 activeTab === 'activity'
//                   ? 'text-[#f2070d] border-b-2 border-[#f2070d]'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Activity
//             </button>
//           </div>

//           {activeTab === 'stats' ? (
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Calls Today:</span>
//                 <span className="font-semibold text-gray-900">
//                   {agent.calls_today || 0}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Leads Closed:</span>
//                 <span className="font-semibold text-[#f2070d]">
//                   {agent.leads_closed || 0}
//                 </span>
//               </div>
//               <div className="space-y-1">
//                 <div className="flex justify-between text-xs">
//                   <span className="text-gray-600">Efficiency:</span>
//                   <span className="font-semibold text-gray-900">
//                     {agent.efficiency || 85}%
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className="bg-[#f2070d] h-2 rounded-full transition-all duration-300"
//                     style={{ width: `${agent.efficiency || 85}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-2 max-h-24 overflow-y-auto">
//               {agent.recent_activity && agent.recent_activity.length > 0 ? (
//                 agent.recent_activity.map((activity, idx) => (
//                   <div key={idx} className="flex items-start gap-2 text-xs">
//                     <Activity className="w-3 h-3 text-[#f2070d] mt-0.5 flex-shrink-0" />
//                     <span className="text-gray-600">{activity}</span>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-4 text-xs text-gray-500">
//                   No recent activity
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Action Buttons */}
//         <div className="grid grid-cols-2 gap-2 mt-4">
//           <button
//             onClick={() => onConfigure(agent)}
//             className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//           >
//             <Settings size={16} />
//             Configure
//           </button>
//           <button
//             onClick={() => onChat(agent)}
//             className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//           >
//             <MessageSquare size={16} />
//             Chat
//           </button>
//         </div>

//         {/* Delete Button (Top Right) */}
//         <button
//           onClick={() => onDelete(agent._id)}
//           className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
//           title="Delete Agent"
//         >
//           <Trash2 size={16} />
//         </button>
//       </div>
//     </Card>
//   );
// };

// // ✅ Training Section Component
// const TrainingSection = ({ agents }) => {
//   const [selectedAgent, setSelectedAgent] = useState(null);
//   const [uploadedFiles, setUploadedFiles] = useState({});
//   const [trainingProgress, setTrainingProgress] = useState({
//     knowledgeScore: 91,
//     objectionHandling: 88,
//     conversionEfficiency: 83,
//     qAggressiveScore: 21999,
//     lastTraining: "2h ago"
//   });

//   // Training modules - ONLY 3 document uploads as requested
//   const trainingModules = [
//     {
//       id: "knowledge",
//       title: "Upload Knowledge Base",
//       description: "AI learns your products, services, and procedures",
//       icon: BookOpen,
//       type: "file",
//       accept: ".pdf,.docx,.txt,.md",
//       placeholder: "Upload knowledge base documents"
//     },
//     {
//       id: "training",
//       title: "Upload Training Materials",
//       description: "AI learns from employee training materials",
//       icon: GraduationCap,
//       type: "file",
//       accept: ".pdf,.pptx,.docx,.txt",
//       placeholder: "Upload training materials"
//     },
//     {
//       id: "reports",
//       title: "Upload Performance Reports",
//       description: "AI learns from historical performance data",
//       icon: BarChart3,
//       type: "file",
//       accept: ".xlsx,.csv,.pdf",
//       placeholder: "Upload performance reports"
//     }
//   ];

//   // Graph data similar to the example code
//   const improvementData = [
//     { month: "Jan", score: 65 },
//     { month: "Feb", score: 72 },
//     { month: "Mar", score: 78 },
//     { month: "Apr", score: 83 },
//     { month: "May", score: 88 },
//     { month: "Jun", score: 91 },
//   ];

//   const handleFileUpload = (moduleId, files) => {
//     setUploadedFiles(prev => ({
//       ...prev,
//       [moduleId]: files
//     }));
    
//     const moduleTitle = trainingModules.find(m => m.id === moduleId)?.title;
//     toast.success(`Uploaded ${files.length} file(s) to ${moduleTitle}`);
    
//     // Simulate training progress update
//     if (files.length > 0) {
//       setTimeout(() => {
//         setTrainingProgress(prev => ({
//           ...prev,
//           knowledgeScore: Math.min(prev.knowledgeScore + 3, 100),
//           lastTraining: "Just now"
//         }));
//         toast.success("Training in progress... AI is learning from new documents!");
//       }, 1000);
//     }
//   };

//   const startTraining = () => {
//     toast.loading("Starting AI training process...");
//     setTimeout(() => {
//       toast.dismiss();
//       toast.success("AI training started successfully!");
      
//       setTrainingProgress(prev => ({
//         ...prev,
//         knowledgeScore: Math.min(prev.knowledgeScore + 5, 100),
//         objectionHandling: Math.min(prev.objectionHandling + 4, 100),
//         conversionEfficiency: Math.min(prev.conversionEfficiency + 3, 100),
//         qAggressiveScore: prev.qAggressiveScore + 1000,
//         lastTraining: "In progress"
//       }));
//     }, 2000);
//   };

//   return (
//     <div className="space-y-8">
//       {/* Header Section */}
//       <div className="bg-gradient-to-r from-[#f2070d]/10 to-white rounded-xl p-6">
//         <div className="flex items-start justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
//               <Brain className="w-6 h-6 text-[#f2070d]" />
//               AI Training Center
//             </h2>
//             <p className="text-gray-600 max-w-2xl">
//               Exhibit your AI team navigating to a leading team knowledge, service, and our world data.
//             </p>
//           </div>
//           <Button 
//             onClick={startTraining}
//             className="bg-[#f2070d] hover:bg-[#d5060b] flex items-center gap-2"
//           >
//             <Zap size={18} />
//             Train Now
//           </Button>
//         </div>
//       </div>

//       {/* Learning Dashboard - Like the example code */}
//       <Card className="border-2 border-[#f2070d]/20 bg-white">
//         <div className="p-6">
//           <div className="flex items-center gap-2 mb-6">
//             <Brain className="w-6 h-6 text-[#f2070d]" />
//             <h3 className="text-xl font-bold text-gray-900">Learning Dashboard</h3>
//           </div>
//           <p className="text-gray-600 mb-6">Track your AI team's knowledge growth over time</p>
          
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//             <div className="space-y-2">
//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <Target className="w-4 h-4" />
//                 Knowledge Score
//               </div>
//               <div className="space-y-1">
//                 <div className="text-2xl font-bold text-gray-900">{trainingProgress.knowledgeScore}%</div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-[#f2070d] h-2 rounded-full transition-all duration-300"
//                     style={{ width: `${trainingProgress.knowledgeScore}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="space-y-2">
//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <Zap className="w-4 h-4" />
//                 Q-Aggressive Rating
//               </div>
//               <div className="space-y-1">
//                 <div className="text-2xl font-bold text-gray-900">{trainingProgress.objectionHandling}%</div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-[#f2070d] h-2 rounded-full transition-all duration-300"
//                     style={{ width: `${trainingProgress.objectionHandling}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="space-y-2">
//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <TrendingUp className="w-4 h-4" />
//                 Q-Aggressive Ranking
//               </div>
//               <div className="space-y-1">
//                 <div className="text-2xl font-bold text-gray-900">{trainingProgress.conversionEfficiency}%</div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-[#f2070d] h-2 rounded-full transition-all duration-300"
//                     style={{ width: `${trainingProgress.conversionEfficiency}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="space-y-2">
//               <div className="text-sm text-gray-600">Q-Aggressive Ranking</div>
//               <div className="space-y-1">
//                 <div className="text-2xl font-bold text-gray-900">{trainingProgress.qAggressiveScore.toLocaleString()}</div>
//                 <Button 
//                   onClick={startTraining}
//                   size="sm" 
//                   className="w-full mt-2 bg-[#f2070d] hover:bg-[#d5060b]"
//                 >
//                   <Zap size={14} className="mr-2" />
//                   Train Now
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Graph - Improved Version */}
//           <div className="mt-8">
//             <h4 className="text-lg font-semibold text-gray-900 mb-6">Improvement Over Time</h4>
//             <div className="bg-gray-50 rounded-lg p-6">
//               <div className="relative h-80">
//                 {/* Y-axis labels */}
//                 <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-600">
//                   <span>100</span>
//                   <span>75</span>
//                   <span>50</span>
//                   <span>25</span>
//                   <span>0</span>
//                 </div>
                
//                 {/* Graph area */}
//                 <div className="absolute left-16 right-0 top-0 bottom-8">
//                   {/* Horizontal grid lines */}
//                   <div className="absolute inset-0">
//                     {[0, 25, 50, 75, 100].map((value, index) => (
//                       <div
//                         key={value}
//                         className="absolute w-full border-t border-gray-200"
//                         style={{ bottom: `${value}%` }}
//                       />
//                     ))}
//                   </div>
                  
//                   {/* Line chart */}
//                   <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
//                     {/* Draw line */}
//                     <polyline
//                       fill="none"
//                       stroke="#f2070d"
//                       strokeWidth="3"
//                       points={improvementData.map((point, index) => {
//                         const x = (index / (improvementData.length - 1)) * 100;
//                         const y = 100 - point.score;
//                         return `${x}%,${y}%`;
//                       }).join(' ')}
//                     />
                    
//                     {/* Draw points */}
//                     {improvementData.map((point, index) => {
//                       const x = (index / (improvementData.length - 1)) * 100;
//                       const y = 100 - point.score;
//                       return (
//                         <g key={index}>
//                           <circle
//                             cx={`${x}%`}
//                             cy={`${y}%`}
//                             r="6"
//                             fill="#f2070d"
//                             stroke="white"
//                             strokeWidth="3"
//                           />
//                         </g>
//                       );
//                     })}
//                   </svg>
                  
//                   {/* Hover tooltips */}
//                   {improvementData.map((point, index) => {
//                     const x = (index / (improvementData.length - 1)) * 100;
//                     const y = 100 - point.score;
//                     return (
//                       <div
//                         key={index}
//                         className="absolute transform -translate-x-1/2 -translate-y-full group cursor-pointer"
//                         style={{ left: `${x}%`, top: `${y}%` }}
//                       >
//                         <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded py-1 px-2 -mt-12 whitespace-nowrap">
//                           {point.month}<br />
//                           score: {point.score}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
                
//                 {/* X-axis labels */}
//                 <div className="absolute left-16 right-0 bottom-0 flex justify-between text-xs text-gray-600">
//                   {improvementData.map((point, index) => (
//                     <div key={index} className="text-center">
//                       <div className="font-medium">{point.month}</div>
//                       <div className="text-[#f2070d] text-xs mt-1">score: {point.score}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Card>

//       {/* Document Upload Section */}
//       <div>
//         <h3 className="text-xl font-bold text-gray-900 mb-6">Upload Training Documents</h3>
//         <p className="text-gray-600 mb-6">
//           Upload documents to train your AI agents. Each document type helps improve specific skills.
//         </p>
        
//         <div className="grid gap-6 md:grid-cols-3">
//           {trainingModules.map((module) => (
//             <Card key={module.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#f2070d]/50 bg-white">
//               <div className="p-6">
//                 <div className="p-3 rounded-lg bg-[#f2070d]/10 w-fit mb-4">
//                   <module.icon className="w-6 h-6 text-[#f2070d]" />
//                 </div>
                
//                 <h4 className="text-lg font-bold text-gray-900 mb-2">{module.title}</h4>
//                 <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                
//                 <div className="space-y-3">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Upload Files ({module.accept})
//                   </label>
                  
//                   <div className="relative">
//                     <input
//                       id={`file-${module.id}`}
//                       type="file"
//                       accept={module.accept}
//                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                       multiple
//                       onChange={(e) => handleFileUpload(module.id, Array.from(e.target.files))}
//                     />
                    
//                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#f2070d] transition-colors cursor-pointer">
//                       <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
//                       <p className="text-sm text-gray-600 mb-1">
//                         No file chosen
//                       </p>
//                       <p className="text-xs text-gray-500 mb-2">
//                         Drag & drop or click to upload
//                       </p>
//                       <p className="text-xs text-gray-400">
//                         {module.placeholder}
//                       </p>
//                     </div>
//                   </div>
                  
//                   {uploadedFiles[module.id] && (
//                     <div className="mt-3 space-y-2">
//                       <p className="text-xs font-medium text-gray-700">Uploaded files:</p>
//                       <div className="space-y-1">
//                         {Array.from(uploadedFiles[module.id]).map((file, idx) => (
//                           <div key={idx} className="flex items-center justify-between text-xs bg-[#f2070d]/5 p-2 rounded">
//                             <span className="truncate text-gray-700">{file.name}</span>
//                             <span className="text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {/* Additional Information Section */}
//       <Card className="border-2 border-[#f2070d]/20 bg-white">
//         <div className="p-6">
//           <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h3>
//           <div className="space-y-3">
//             <div className="flex items-start gap-2">
//               <div className="w-5 h-5 border-2 border-gray-300 rounded mt-0.5 flex-shrink-0"></div>
//               <div className="text-sm text-gray-600">Training documentation and guidelines</div>
//             </div>
//             <div className="flex items-start gap-2">
//               <div className="w-5 h-5 border-2 border-gray-300 rounded mt-0.5 flex-shrink-0"></div>
//               <div className="text-sm text-gray-600">Performance metrics and analytics</div>
//             </div>
//             <div className="flex items-start gap-2">
//               <div className="w-5 h-5 border-2 border-gray-300 rounded mt-0.5 flex-shrink-0"></div>
//               <div className="text-sm text-gray-600">Agent improvement suggestions</div>
//             </div>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// };

// const VoiceAgents = () => {
//   const [activeTab, setActiveTab] = useState('agents'); // 'agents' or 'training'
//   const [agents, setAgents] = useState([]);
//   const [selectedAgent, setSelectedAgent] = useState(null);
//   const [showAgentModal, setShowAgentModal] = useState(false);
//   const [showConfigModal, setShowConfigModal] = useState(false);
//   const [showChatModal, setShowChatModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // Stats summary
//   const [stats, setStats] = useState({
//     totalAgents: 0,
//     avgEfficiency: 0,
//     totalCalls: 0,
//     leadsClosed: 0
//   });

//   useEffect(() => {
//     loadAgents();
//   }, []);

//   const loadAgents = async () => {
//     setIsLoading(true);
//     try {
//       const data = await voiceService.getAgents();
      
//       if (Array.isArray(data)) {
//         setAgents(data);
//         calculateStats(data);
//       } else if (data && data.agents && Array.isArray(data.agents)) {
//         setAgents(data.agents);
//         calculateStats(data.agents);
//       } else {
//         console.error('Unexpected data format:', data);
//         setAgents([]);
//         toast.error('Received unexpected data format from server');
//       }
//     } catch (error) {
//       console.error('Failed to load agents:', error);
//       toast.error('Failed to load voice agents');
//       setAgents([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const calculateStats = (agentsList) => {
//     const totalAgents = agentsList.length;
//     const activeAgents = agentsList.filter(a => a.is_active).length;
    
//     setStats({
//       totalAgents: totalAgents,
//       avgEfficiency: activeAgents > 0 ? Math.round((activeAgents / totalAgents) * 100) : 0,
//       totalCalls: agentsList.reduce((sum, a) => sum + (a.calls_today || 0), 0),
//       leadsClosed: agentsList.reduce((sum, a) => sum + (a.leads_closed || 0), 0)
//     });
//   };

//   const handleCreateAgent = () => {
//     setSelectedAgent(null);
//     setShowAgentModal(true);
//   };

//   const handleConfigureAgent = (agent) => {
//     setSelectedAgent(agent);
//     setShowConfigModal(true);
//   };

//   const handleChatWithAgent = (agent) => {
//     setSelectedAgent(agent);
//     setShowChatModal(true);
//   };

//   const handleDeleteAgent = async (agentId) => {
//     if (!window.confirm('Are you sure you want to delete this agent?')) return;

//     try {
//       await voiceService.deleteAgent(agentId);
//       toast.success('Agent deleted successfully');
//       loadAgents();
//     } catch (error) {
//       console.error('Failed to delete agent:', error);
//       toast.error('Failed to delete agent');
//     }
//   };

//   const handleAgentSaved = () => {
//     setShowAgentModal(false);
//     setSelectedAgent(null);
//     loadAgents();
//   };

//   const handleConfigSaved = async (updatedConfig) => {
//     try {
//       await voiceService.updateAgent(updatedConfig._id, updatedConfig);
//       toast.success('Configuration updated successfully');
//       loadAgents();
//     } catch (error) {
//       console.error('Failed to update configuration:', error);
//       toast.error('Failed to update configuration');
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
//           <p className="text-gray-600 mt-1">
//             Manage, discover, and train your AI sales team
//           </p>
//         </div>
        
//         <div className="flex items-center gap-3">
//           <Button 
//             onClick={handleCreateAgent} 
//             className="flex items-center bg-[#f2070d] hover:bg-[#d5060b]"
//           >
//             <Plus size={20} className="mr-2" />
//             Add New Agent
//           </Button>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="border-b border-gray-200">
//         <nav className="flex space-x-8">
//           <button
//             onClick={() => setActiveTab('agents')}
//             className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
//               activeTab === 'agents'
//                 ? 'border-[#f2070d] text-[#f2070d]'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             <Bot size={20} />
//             <span>All Agents</span>
//           </button>
//           <button
//             onClick={() => setActiveTab('training')}
//             className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
//               activeTab === 'training'
//                 ? 'border-[#f2070d] text-[#f2070d]'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             <Brain size={20} />
//             <span>AI Training Center</span>
//           </button>
//         </nav>
//       </div>

//       {/* Content based on active tab */}
//       {activeTab === 'agents' ? (
//         <div className="space-y-6">
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <Card className="p-5 hover:shadow-lg transition-shadow bg-white">
//               <div className="text-sm text-gray-600 mb-1">Total Agents</div>
//               <div className="text-2xl font-bold text-gray-900">{stats.totalAgents}</div>
//               <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
//                 <div className="bg-[#f2070d] h-1.5 rounded-full" style={{ width: '100%' }}></div>
//               </div>
//             </Card>
//             <Card className="p-5 hover:shadow-lg transition-shadow bg-white">
//               <div className="text-sm text-gray-600 mb-1">Avg Efficiency</div>
//               <div className="text-2xl font-bold text-gray-900">{stats.avgEfficiency}%</div>
//               <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
//                 <div className="bg-[#f2070d] h-1.5 rounded-full" style={{ width: `${stats.avgEfficiency}%` }}></div>
//               </div>
//             </Card>
//             <Card className="p-5 hover:shadow-lg transition-shadow bg-white">
//               <div className="text-sm text-gray-600 mb-1">Total Calls</div>
//               <div className="text-2xl font-bold text-gray-900">{stats.totalCalls}</div>
//               <div className="text-xs text-gray-600 mt-1">Today</div>
//             </Card>
//             <Card className="p-5 hover:shadow-lg transition-shadow bg-white">
//               <div className="text-sm text-gray-600 mb-1">Leads Closed</div>
//               <div className="text-2xl font-bold text-gray-900">{stats.leadsClosed}</div>
//               <div className="text-xs text-[#f2070d] mt-1">35% conversion</div>
//             </Card>
//           </div>

//           {/* Loading State */}
//           {isLoading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f2070d]"></div>
//             </div>
//           ) : agents.length === 0 ? (
//             /* Empty State */
//             <Card className="p-12 text-center border-2 border-dashed border-gray-300 hover:border-[#f2070d] transition-colors bg-white">
//               <Bot size={64} className="mx-auto text-gray-400 mb-4" />
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                 No Voice Agents Yet
//               </h3>
//               <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                 Create your first AI voice agent to start handling calls automatically. Train it to become an expert in your business.
//               </p>
//               <Button onClick={handleCreateAgent} className="bg-[#f2070d] hover:bg-[#d5060b]">
//                 <Plus size={20} className="mr-2" />
//                 Create Your First Agent
//               </Button>
//             </Card>
//           ) : (
//             /* Agents Grid */
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {agents.map((agent) => (
//                 <AgentCard
//                   key={agent._id}
//                   agent={agent}
//                   onConfigure={handleConfigureAgent}
//                   onChat={handleChatWithAgent}
//                   onDelete={handleDeleteAgent}
//                   onConfigSaved={handleConfigSaved}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       ) : (
//         <TrainingSection agents={agents} />
//       )}

//       {/* Agent Form Modal */}
//       <Modal
//         isOpen={showAgentModal}
//         onClose={() => {
//           setShowAgentModal(false);
//           setSelectedAgent(null);
//         }}
//         title={selectedAgent ? 'Edit Agent' : 'Create New Agent'}
//         size="large"
//       >
//         <AgentForm
//           agent={selectedAgent}
//           onSuccess={handleAgentSaved}
//           onCancel={() => {
//             setShowAgentModal(false);
//             setSelectedAgent(null);
//           }}
//         />
//       </Modal>

//       {/* Configure Modal */}
//       <Modal
//         isOpen={showConfigModal}
//         onClose={() => {
//           setShowConfigModal(false);
//           setSelectedAgent(null);
//         }}
//         title="Agent Configuration"
//         size="medium"
//       >
//         {selectedAgent && (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Logic Level
//               </label>
//               <select
//                 defaultValue={selectedAgent.logic_level || 'medium'}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2070d]"
//               >
//                 <option value="low">Low - Simple responses</option>
//                 <option value="medium">Medium - Balanced approach</option>
//                 <option value="high">High - Sophisticated handling</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Contact Frequency
//               </label>
//               <input
//                 type="range"
//                 min="1"
//                 max="30"
//                 defaultValue={selectedAgent.contact_frequency || 3}
//                 className="w-full accent-[#f2070d]"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Communication Channels
//               </label>
//               <div className="space-y-3">
//                 {/* Calls Toggle */}
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-700">Enable Calls</span>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       defaultChecked={selectedAgent.enable_calls !== false}
//                       className="sr-only peer"
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f2070d]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2070d]"></div>
//                   </label>
//                 </div>

//                 {/* Emails Toggle */}
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-700">Enable Emails</span>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       defaultChecked={selectedAgent.enable_emails !== false}
//                       className="sr-only peer"
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f2070d]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2070d]"></div>
//                   </label>
//                 </div>

//                 {/* SMS Toggle */}
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-700">Enable SMS</span>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       defaultChecked={selectedAgent.enable_sms !== false}
//                       className="sr-only peer"
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f2070d]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2070d]"></div>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end gap-2 pt-4">
//               <Button
//                 onClick={() => setShowConfigModal(false)}
//                 variant="outline"
//               >
//                 Cancel
//               </Button>
//               <Button onClick={() => {
//                 handleConfigSaved(selectedAgent);
//                 setShowConfigModal(false);
//               }} className="bg-[#f2070d] hover:bg-[#d5060b]">
//                 Save Configuration
//               </Button>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* Chat Modal */}
//       <Modal
//         isOpen={showChatModal}
//         onClose={() => {
//           setShowChatModal(false);
//           setSelectedAgent(null);
//         }}
//         title={`Chat with ${selectedAgent?.name}`}
//         size="medium"
//       >
//         {selectedAgent && (
//           <div className="space-y-4">
//             <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
//               <div className="flex items-start gap-3 mb-4">
//                 <div className="p-2 bg-[#f2070d]/10 rounded-lg">
//                   <Bot className="text-[#f2070d]" size={20} />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-gray-900">
//                     {selectedAgent.name}
//                   </p>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Hello! I'm ready to provide you with updates on my recent activity.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 placeholder="Ask your AI agent anything..."
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2070d]"
//               />
//               <Button className="bg-[#f2070d] hover:bg-[#d5060b]">Send</Button>
//             </div>

//             <div className="grid grid-cols-2 gap-2">
//               <Button variant="outline" className="w-full">
//                 <Phone size={16} className="mr-2" />
//                 Call Agent
//               </Button>
//               <Button variant="outline" className="w-full">
//                 <MessageSquareText size={16} className="mr-2" />
//                 Text Agent
//               </Button>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default VoiceAgents;


// frontend/src/pages/dashboard/calls/VoiceAgents.jsx
import React, { useState, useEffect } from "react";
import { 
  Bot, Plus, Settings, MessageSquare, Activity, Upload, 
  Phone, Mail, MessageSquareText, TrendingUp, Trash2, Brain,
  Target, Zap, BarChart3, GraduationCap, BookOpen, Clock
} from "lucide-react";
import Card from "../../../Components/ui/Card";
import Button from "../../../Components/ui/Button";
import Modal from "../../../Components/ui/Modal";
import AgentForm from "../../../Components/forms/AgentForm";
import { voiceService } from "../../../services/voice";
import toast from "react-hot-toast";

// ✅ Separate component for Agent Card to properly use hooks
const AgentCard = ({ agent, onConfigure, onChat, onDelete, onConfigSaved }) => {
  const [activeTab, setActiveTab] = useState('stats');

  const statusConfig = (() => {
    if (agent.is_active && agent.in_call) {
      return { label: "In Call", color: "text-red-600", bg: "bg-red-100" };
    } else if (agent.is_active) {
      return { label: "Online", color: "text-red-600", bg: "bg-red-100" };
    } else {
      return { label: "Idle", color: "text-red-600", bg: "bg-red-100" };
    }
  })();

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#f2070d]/20 relative">
      <div className="p-6">
        {/* Header with Avatar and Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="p-3 bg-[#f2070d]/10 rounded-lg mr-3">
              <Bot className="text-[#f2070d]" size={28} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                {agent.name}
              </h3>
              <p className="text-xs text-gray-500">
                {agent.description || 'AI Sales Agent'}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
            <span className="w-2 h-2 rounded-full bg-current mr-1"></span>
            {statusConfig.label}
          </span>
        </div>

        {/* Configuration Controls */}
        <div className="space-y-3 mb-4">
          {/* Logic Level */}
          <div className="space-y-1">
            <label className="text-xs text-gray-600 font-medium">Logic Level</label>
            <select 
              value={agent.logic_level || 'medium'}
              onChange={(e) => {
                const updatedAgent = { ...agent, logic_level: e.target.value };
                onConfigSaved(updatedAgent);
              }}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Contact Frequency */}
          <div className="space-y-1">
            <label className="text-xs text-gray-600 font-medium">
              Contact Frequency: Every {agent.contact_frequency || 3} days
            </label>
            <input
              type="range"
              min="1"
              max="7"
              value={agent.contact_frequency || 3}
              onChange={(e) => {
                const updatedAgent = { ...agent, contact_frequency: parseInt(e.target.value) };
                onConfigSaved(updatedAgent);
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#f2070d]"
            />
          </div>

          {/* ⭐ Communication Toggles - UPDATED WITH TOGGLE SWITCHES */}
          <div className="flex items-center justify-between gap-2 pt-2">
            {/* Calls Toggle */}
            <div className="flex items-center gap-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={agent.enable_calls !== false}
                  onChange={(e) => {
                    const updatedAgent = { ...agent, enable_calls: e.target.checked };
                    onConfigSaved(updatedAgent);
                  }}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#f2070d]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#f2070d]"></div>
              </label>
              <span className="text-xs text-gray-700 font-medium ml-1">Calls</span>
            </div>

            {/* Emails Toggle */}
            <div className="flex items-center gap-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={agent.enable_emails !== false}
                  onChange={(e) => {
                    const updatedAgent = { ...agent, enable_emails: e.target.checked };
                    onConfigSaved(updatedAgent);
                  }}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#f2070d]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#f2070d]"></div>
              </label>
              <span className="text-xs text-gray-700 font-medium ml-1">Emails</span>
            </div>

            {/* SMS Toggle */}
            <div className="flex items-center gap-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={agent.enable_sms !== false}
                  onChange={(e) => {
                    const updatedAgent = { ...agent, enable_sms: e.target.checked };
                    onConfigSaved(updatedAgent);
                  }}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#f2070d]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#f2070d]"></div>
              </label>
              <span className="text-xs text-gray-700 font-medium ml-1">SMS</span>
            </div>
          </div>
        </div>

        {/* Stats/Activity Tabs */}
        <div className="border-t pt-3">
          <div className="flex border-b mb-3">
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 pb-2 text-xs font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'text-[#f2070d] border-b-2 border-[#f2070d]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Stats
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex-1 pb-2 text-xs font-medium transition-colors ${
                activeTab === 'activity'
                  ? 'text-[#f2070d] border-b-2 border-[#f2070d]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Activity
            </button>
          </div>

          {activeTab === 'stats' ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Calls Today:</span>
                <span className="font-semibold text-gray-900">
                  {agent.calls_today || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Leads Closed:</span>
                <span className="font-semibold text-[#f2070d]">
                  {agent.leads_closed || 0}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Efficiency:</span>
                  <span className="font-semibold text-gray-900">
                    {agent.efficiency || 85}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#f2070d] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${agent.efficiency || 85}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 max-h-24 overflow-y-auto">
              {agent.recent_activity && agent.recent_activity.length > 0 ? (
                agent.recent_activity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <Activity className="w-3 h-3 text-[#f2070d] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{activity}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-gray-500">
                  No recent activity
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => onConfigure(agent)}
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Settings size={16} />
            Configure
          </button>
          <button
            onClick={() => onChat(agent)}
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <MessageSquare size={16} />
            Chat
          </button>
        </div>

        {/* Delete Button (Top Right) */}
        <button
          onClick={() => onDelete(agent._id)}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete Agent"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </Card>
  );
};

// ✅ Training Section Component - UPDATED WITH DOCUMENT HANDLING
const TrainingSection = ({ agents }) => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentDocuments, setAgentDocuments] = useState({});  // ✅ NEW: Store loaded documents
  const [isLoading, setIsLoading] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState({
    knowledgeScore: 91,
    objectionHandling: 88,
    conversionEfficiency: 83,
    qAggressiveScore: 21999,
    lastTraining: "2h ago"
  });

  // ✅ NEW: Load documents when component mounts or selected agent changes
  useEffect(() => {
    if (selectedAgent) {
      loadAgentDocuments(selectedAgent._id);
    }
  }, [selectedAgent]);

  // ✅ NEW: Function to load documents for agent
  const loadAgentDocuments = async (agentId) => {
    try {
      setIsLoading(true);
      const response = await voiceService.getDocuments(agentId);
      
      if (response.success) {
        setAgentDocuments(prev => ({
          ...prev,
          [agentId]: response.documents
        }));
        console.log(`✅ Loaded ${response.documents.length} documents for agent ${agentId}`);
      }
    } catch (error) {
      console.error('❌ Failed to load documents:', error);
      toast.error('Failed to load training documents');
    } finally {
      setIsLoading(false);
    }
  };

  // Training modules - ONLY 3 document uploads as requested
  const trainingModules = [
    {
      id: "knowledge",
      title: "Upload Knowledge Base",
      description: "AI learns your products, services, and procedures",
      icon: BookOpen,
      type: "file",
      accept: ".pdf,.docx,.txt,.md",
      placeholder: "Upload knowledge base documents"
    },
    {
      id: "training",
      title: "Upload Training Materials",
      description: "AI learns from employee training materials",
      icon: GraduationCap,
      type: "file",
      accept: ".pdf,.pptx,.docx,.txt",
      placeholder: "Upload training materials"
    },
    {
      id: "reports",
      title: "Upload Performance Reports",
      description: "AI learns from historical performance data",
      icon: BarChart3,
      type: "file",
      accept: ".xlsx,.csv,.pdf",
      placeholder: "Upload performance reports"
    }
  ];

  // ✅ FIXED: Handle file upload with proper agent selection
  const handleFileUpload = async (moduleId, files) => {
    if (!selectedAgent) {
      toast.error('Please select an agent first');
      return;
    }

    if (!files || files.length === 0) {
      return;
    }

    try {
      setIsLoading(true);
      let uploadedCount = 0;

      // Upload each file
      for (const file of files) {
        try {
          const result = await voiceService.uploadDocument(selectedAgent._id, file);
          
          if (result.success) {
            toast.success(`Uploaded: ${file.name}`);
            uploadedCount++;
          }
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          toast.error(`Failed to upload ${file.name}: ${error.message}`);
        }
      }

      // Reload documents after upload
      await loadAgentDocuments(selectedAgent._id);

      if (uploadedCount > 0) {
        toast.success(`Successfully uploaded ${uploadedCount} document(s)`);
        
        // Update training progress
        setTrainingProgress(prev => ({
          ...prev,
          knowledgeScore: Math.min(prev.knowledgeScore + 3, 100),
          lastTraining: "Just now"
        }));
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload documents');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ NEW: Handle document deletion
  const handleDeleteDocument = async (docId) => {
    if (!selectedAgent) return;

    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await voiceService.deleteDocument(selectedAgent._id, docId);
      toast.success('Document deleted');
      
      // Reload documents
      await loadAgentDocuments(selectedAgent._id);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    }
  };

  const startTraining = () => {
    toast.loading("Starting AI training process...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("AI training started successfully!");
      
      setTrainingProgress(prev => ({
        ...prev,
        knowledgeScore: Math.min(prev.knowledgeScore + 5, 100),
        objectionHandling: Math.min(prev.objectionHandling + 4, 100),
        conversionEfficiency: Math.min(prev.conversionEfficiency + 3, 100),
        qAggressiveScore: prev.qAggressiveScore + 1000,
        lastTraining: "In progress"
      }));
    }, 2000);
  };

  // Get current agent's documents
  const currentAgentDocs = selectedAgent ? agentDocuments[selectedAgent._id] || [] : [];

  // Graph data similar to the example code
  const improvementData = [
    { month: "Jan", score: 65 },
    { month: "Feb", score: 72 },
    { month: "Mar", score: 78 },
    { month: "Apr", score: 83 },
    { month: "May", score: 88 },
    { month: "Jun", score: 91 },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#f2070d]/10 to-white rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Brain className="w-6 h-6 text-[#f2070d]" />
              AI Training Center
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Upload documents to train your AI agents with your business knowledge, policies, and procedures.
            </p>
          </div>
          <Button 
            onClick={startTraining}
            className="bg-[#f2070d] hover:bg-[#d5060b] flex items-center gap-2"
          >
            <Zap size={18} />
            Train Now
          </Button>
        </div>

        {/* ✅ NEW: Agent Selector */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Agent to Train
          </label>
          <select
            value={selectedAgent?._id || ''}
            onChange={(e) => {
              const agent = agents.find(a => a._id === e.target.value);
              setSelectedAgent(agent);
            }}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-transparent"
          >
            <option value="">Choose an agent...</option>
            {agents.map(agent => (
              <option key={agent._id} value={agent._id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Show training modules only if agent is selected */}
      {selectedAgent ? (
        <>
          {/* Document Upload Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Upload Training Documents</h3>
            <p className="text-gray-600 mb-6">
              Training agent: <strong>{selectedAgent.name}</strong>
            </p>
            
            <div className="grid gap-6 md:grid-cols-3">
              {trainingModules.map((module) => (
                <Card key={module.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#f2070d]/50 bg-white">
                  <div className="p-6">
                    <div className="p-3 rounded-lg bg-[#f2070d]/10 w-fit mb-4">
                      <module.icon className="w-6 h-6 text-[#f2070d]" />
                    </div>
                    
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{module.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Upload Files ({module.accept})
                      </label>
                      
                      <div className="relative">
                        <input
                          id={`file-${module.id}`}
                          type="file"
                          accept={module.accept}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          multiple
                          onChange={(e) => handleFileUpload(module.id, Array.from(e.target.files))}
                          disabled={isLoading}
                        />
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#f2070d] transition-colors cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                          <p className="text-sm text-gray-600 mb-1">
                            {isLoading ? 'Uploading...' : 'No file chosen'}
                          </p>
                          <p className="text-xs text-gray-500 mb-2">
                            Drag & drop or click to upload
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* ✅ NEW: Uploaded Documents List */}
          {currentAgentDocs.length > 0 && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Uploaded Documents ({currentAgentDocs.length})
                </h3>
                <div className="space-y-2">
                  {currentAgentDocs.map((doc) => (
                    <div 
                      key={doc._id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-[#f2070d]" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.filename}</p>
                          <p className="text-xs text-gray-500">
                            {(doc.file_size / 1024).toFixed(1)} KB • {doc.total_chunks} chunks
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteDocument(doc._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <div className="p-12 text-center">
            <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Select an Agent to Start Training
            </h3>
            <p className="text-gray-600">
              Choose an agent above to upload training documents and improve its knowledge base.
            </p>
          </div>
        </Card>
      )}

      {/* Learning Dashboard */}
      <Card className="border-2 border-[#f2070d]/20 bg-white">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-6 h-6 text-[#f2070d]" />
            <h3 className="text-xl font-bold text-gray-900">Learning Dashboard</h3>
          </div>
          <p className="text-gray-600 mb-6">Track your AI team's knowledge growth over time</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Target className="w-4 h-4" />
                Knowledge Score
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900">{trainingProgress.knowledgeScore}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#f2070d] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${trainingProgress.knowledgeScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Zap className="w-4 h-4" />
                Objection Handling
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900">{trainingProgress.objectionHandling}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#f2070d] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${trainingProgress.objectionHandling}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4" />
                Conversion Efficiency
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900">{trainingProgress.conversionEfficiency}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#f2070d] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${trainingProgress.conversionEfficiency}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Q-Aggressive Score</div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900">{trainingProgress.qAggressiveScore.toLocaleString()}</div>
                <Button 
                  onClick={startTraining}
                  size="sm" 
                  className="w-full mt-2 bg-[#f2070d] hover:bg-[#d5060b]"
                >
                  <Zap size={14} className="mr-2" />
                  Train Now
                </Button>
              </div>
            </div>
          </div>

          {/* Graph - Improved Version */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Improvement Over Time</h4>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="relative h-80">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-600">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>
                
                {/* Graph area */}
                <div className="absolute left-16 right-0 top-0 bottom-8">
                  {/* Horizontal grid lines */}
                  <div className="absolute inset-0">
                    {[0, 25, 50, 75, 100].map((value, index) => (
                      <div
                        key={value}
                        className="absolute w-full border-t border-gray-200"
                        style={{ bottom: `${value}%` }}
                      />
                    ))}
                  </div>
                  
                  {/* Line chart */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    {/* Draw line */}
                    <polyline
                      fill="none"
                      stroke="#f2070d"
                      strokeWidth="3"
                      points={improvementData.map((point, index) => {
                        const x = (index / (improvementData.length - 1)) * 100;
                        const y = 100 - point.score;
                        return `${x}%,${y}%`;
                      }).join(' ')}
                    />
                    
                    {/* Draw points */}
                    {improvementData.map((point, index) => {
                      const x = (index / (improvementData.length - 1)) * 100;
                      const y = 100 - point.score;
                      return (
                        <g key={index}>
                          <circle
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r="6"
                            fill="#f2070d"
                            stroke="white"
                            strokeWidth="3"
                          />
                        </g>
                      );
                    })}
                  </svg>
                  
                  {/* Hover tooltips */}
                  {improvementData.map((point, index) => {
                    const x = (index / (improvementData.length - 1)) * 100;
                    const y = 100 - point.score;
                    return (
                      <div
                        key={index}
                        className="absolute transform -translate-x-1/2 -translate-y-full group cursor-pointer"
                        style={{ left: `${x}%`, top: `${y}%` }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded py-1 px-2 -mt-12 whitespace-nowrap">
                          {point.month}<br />
                          score: {point.score}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* X-axis labels */}
                <div className="absolute left-16 right-0 bottom-0 flex justify-between text-xs text-gray-600">
                  {improvementData.map((point, index) => (
                    <div key={index} className="text-center">
                      <div className="font-medium">{point.month}</div>
                      <div className="text-[#f2070d] text-xs mt-1">score: {point.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const VoiceAgents = () => {
  const [activeTab, setActiveTab] = useState('agents'); // 'agents' or 'training'
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Stats summary
  const [stats, setStats] = useState({
    totalAgents: 0,
    avgEfficiency: 0,
    totalCalls: 0,
    leadsClosed: 0
  });

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    setIsLoading(true);
    try {
      const data = await voiceService.getAgents();
      
      if (Array.isArray(data)) {
        setAgents(data);
        calculateStats(data);
      } else if (data && data.agents && Array.isArray(data.agents)) {
        setAgents(data.agents);
        calculateStats(data.agents);
      } else {
        console.error('Unexpected data format:', data);
        setAgents([]);
        toast.error('Received unexpected data format from server');
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
      toast.error('Failed to load voice agents');
      setAgents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (agentsList) => {
    const totalAgents = agentsList.length;
    const activeAgents = agentsList.filter(a => a.is_active).length;
    
    setStats({
      totalAgents: totalAgents,
      avgEfficiency: activeAgents > 0 ? Math.round((activeAgents / totalAgents) * 100) : 0,
      totalCalls: agentsList.reduce((sum, a) => sum + (a.calls_today || 0), 0),
      leadsClosed: agentsList.reduce((sum, a) => sum + (a.leads_closed || 0), 0)
    });
  };

  const handleCreateAgent = () => {
    setSelectedAgent(null);
    setShowAgentModal(true);
  };

  const handleConfigureAgent = (agent) => {
    setSelectedAgent(agent);
    setShowConfigModal(true);
  };

  const handleChatWithAgent = (agent) => {
    setSelectedAgent(agent);
    setShowChatModal(true);
  };

  const handleDeleteAgent = async (agentId) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return;

    try {
      await voiceService.deleteAgent(agentId);
      toast.success('Agent deleted successfully');
      loadAgents();
    } catch (error) {
      console.error('Failed to delete agent:', error);
      toast.error('Failed to delete agent');
    }
  };

  const handleAgentSaved = () => {
    setShowAgentModal(false);
    setSelectedAgent(null);
    loadAgents();
  };

  const handleConfigSaved = async (updatedConfig) => {
    try {
      await voiceService.updateAgent(updatedConfig._id, updatedConfig);
      toast.success('Configuration updated successfully');
      loadAgents();
    } catch (error) {
      console.error('Failed to update configuration:', error);
      toast.error('Failed to update configuration');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
          <p className="text-gray-600 mt-1">
            Manage, discover, and train your AI sales team
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleCreateAgent} 
            className="flex items-center bg-[#f2070d] hover:bg-[#d5060b]"
          >
            <Plus size={20} className="mr-2" />
            Add New Agent
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('agents')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'agents'
                ? 'border-[#f2070d] text-[#f2070d]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Bot size={20} />
            <span>All Agents</span>
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'training'
                ? 'border-[#f2070d] text-[#f2070d]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Brain size={20} />
            <span>AI Training Center</span>
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'agents' ? (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-5 hover:shadow-lg transition-shadow bg-white">
              <div className="text-sm text-gray-600 mb-1">Total Agents</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalAgents}</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-[#f2070d] h-1.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </Card>
            <Card className="p-5 hover:shadow-lg transition-shadow bg-white">
              <div className="text-sm text-gray-600 mb-1">Avg Efficiency</div>
              <div className="text-2xl font-bold text-gray-900">{stats.avgEfficiency}%</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-[#f2070d] h-1.5 rounded-full" style={{ width: `${stats.avgEfficiency}%` }}></div>
              </div>
            </Card>
            <Card className="p-5 hover:shadow-lg transition-shadow bg-white">
              <div className="text-sm text-gray-600 mb-1">Total Calls</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalCalls}</div>
              <div className="text-xs text-gray-600 mt-1">Today</div>
            </Card>
            <Card className="p-5 hover:shadow-lg transition-shadow bg-white">
              <div className="text-sm text-gray-600 mb-1">Leads Closed</div>
              <div className="text-2xl font-bold text-gray-900">{stats.leadsClosed}</div>
              <div className="text-xs text-[#f2070d] mt-1">35% conversion</div>
            </Card>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f2070d]"></div>
            </div>
          ) : agents.length === 0 ? (
            /* Empty State */
            <Card className="p-12 text-center border-2 border-dashed border-gray-300 hover:border-[#f2070d] transition-colors bg-white">
              <Bot size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Voice Agents Yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create your first AI voice agent to start handling calls automatically. Train it to become an expert in your business.
              </p>
              <Button onClick={handleCreateAgent} className="bg-[#f2070d] hover:bg-[#d5060b]">
                <Plus size={20} className="mr-2" />
                Create Your First Agent
              </Button>
            </Card>
          ) : (
            /* Agents Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <AgentCard
                  key={agent._id}
                  agent={agent}
                  onConfigure={handleConfigureAgent}
                  onChat={handleChatWithAgent}
                  onDelete={handleDeleteAgent}
                  onConfigSaved={handleConfigSaved}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <TrainingSection agents={agents} />
      )}

      {/* Agent Form Modal */}
      <Modal
        isOpen={showAgentModal}
        onClose={() => {
          setShowAgentModal(false);
          setSelectedAgent(null);
        }}
        title={selectedAgent ? 'Edit Agent' : 'Create New Agent'}
        size="large"
      >
        <AgentForm
          agent={selectedAgent}
          onSuccess={handleAgentSaved}
          onCancel={() => {
            setShowAgentModal(false);
            setSelectedAgent(null);
          }}
        />
      </Modal>

      {/* Configure Modal */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => {
          setShowConfigModal(false);
          setSelectedAgent(null);
        }}
        title="Agent Configuration"
        size="medium"
      >
        {selectedAgent && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logic Level
              </label>
              <select
                defaultValue={selectedAgent.logic_level || 'medium'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2070d]"
              >
                <option value="low">Low - Simple responses</option>
                <option value="medium">Medium - Balanced approach</option>
                <option value="high">High - Sophisticated handling</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Frequency
              </label>
              <input
                type="range"
                min="1"
                max="30"
                defaultValue={selectedAgent.contact_frequency || 3}
                className="w-full accent-[#f2070d]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Communication Channels
              </label>
              <div className="space-y-3">
                {/* Calls Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Enable Calls</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={selectedAgent.enable_calls !== false}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f2070d]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2070d]"></div>
                  </label>
                </div>

                {/* Emails Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Enable Emails</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={selectedAgent.enable_emails !== false}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f2070d]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2070d]"></div>
                  </label>
                </div>

                {/* SMS Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Enable SMS</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={selectedAgent.enable_sms !== false}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f2070d]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2070d]"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                onClick={() => setShowConfigModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={() => {
                handleConfigSaved(selectedAgent);
                setShowConfigModal(false);
              }} className="bg-[#f2070d] hover:bg-[#d5060b]">
                Save Configuration
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Chat Modal */}
      <Modal
        isOpen={showChatModal}
        onClose={() => {
          setShowChatModal(false);
          setSelectedAgent(null);
        }}
        title={`Chat with ${selectedAgent?.name}`}
        size="medium"
      >
        {selectedAgent && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-[#f2070d]/10 rounded-lg">
                  <Bot className="text-[#f2070d]" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedAgent.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Hello! I'm ready to provide you with updates on my recent activity.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask your AI agent anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2070d]"
              />
              <Button className="bg-[#f2070d] hover:bg-[#d5060b]">Send</Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="w-full">
                <Phone size={16} className="mr-2" />
                Call Agent
              </Button>
              <Button variant="outline" className="w-full">
                <MessageSquareText size={16} className="mr-2" />
                Text Agent
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VoiceAgents;