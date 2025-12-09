// // frontend/src/Pages/dashboard/calls/CallLogs.jsx - COMPLETE WITH REGENERATE BUTTON
// import React, { useState, useEffect } from "react";
// import { 
//   Search, FileText, Filter, Clock, User, Phone, 
//   Download, Eye, ChevronDown, AlertCircle, Loader, Wrench
// } from "lucide-react";
// import Card from "../../../Components/ui/Card";
// import Input from "../../../Components/ui/Input";
// import Button from "../../../Components/ui/Button";
// import { callService } from "../../../services/call";
// import api from "../../../services/api";
// import toast from "react-hot-toast";

// const CallLogs = () => {
//   const [logs, setLogs] = useState([]);
//   const [filteredLogs, setFilteredLogs] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isRegenerating, setIsRegenerating] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedLog, setSelectedLog] = useState(null);
//   const [showTranscript, setShowTranscript] = useState(false);
  
//   const [filters, setFilters] = useState({
//     outcome: '',
//     sentiment: '',
//     dateFrom: '',
//     dateTo: ''
//   });

//   useEffect(() => {
//     loadCallLogs();
//   }, []);

//   useEffect(() => {
//     console.log('🔄 Applying filters - Current logs count:', logs.length);
//     applyFilters();
//   }, [logs, filters, searchTerm]);

//   const loadCallLogs = async () => {
//     try {
//       setIsLoading(true);
      
//       console.log('📡 Fetching call logs from backend...');
//       const response = await callService.getCallLogs({
//         skip: 0,
//         limit: 100
//       });
      
//       console.log('📦 RAW RESPONSE FROM BACKEND:', response);
//       console.log('📊 Response type:', typeof response);
//       console.log('📊 Is Array?:', Array.isArray(response));
//       console.log('📊 Response length:', response?.length);
      
//       if (response && Array.isArray(response)) {
//         console.log('✅ Setting logs - Count:', response.length);
//         console.log('📋 First 3 logs:', response.slice(0, 3));
        
//         setLogs(response);
//         setFilteredLogs(response);
        
//         toast.success(`Loaded ${response.length} call logs`);
//       } else {
//         console.warn('⚠️ Response is not an array:', response);
//         setLogs([]);
//         setFilteredLogs([]);
//       }
      
//     } catch (error) {
//       console.error('❌ Failed to load call logs:', error);
//       console.error('❌ Error details:', error.response?.data);
//       toast.error('Failed to load call logs');
//       setLogs([]);
//       setFilteredLogs([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRegenerateLogs = async () => {
//     try {
//       setIsRegenerating(true);
//       console.log('🔧 Regenerating missing call logs...');
      
//       const response = await api.post('/calls/logs/regenerate');
      
//       console.log('✅ Regenerate response:', response.data);
      
//       if (response.data.created_logs > 0) {
//         toast.success(`Created ${response.data.created_logs} missing logs!`);
//       } else {
//         toast.info(response.data.message || 'All calls already have logs');
//       }
      
//       // Refresh the logs
//       await loadCallLogs();
      
//     } catch (error) {
//       console.error('❌ Failed to regenerate logs:', error);
//       toast.error('Failed to regenerate logs');
//     } finally {
//       setIsRegenerating(false);
//     }
//   };

//   const applyFilters = () => {
//     console.log('🔍 Starting filter application');
//     console.log('🔍 Logs to filter:', logs.length);
//     console.log('🔍 Current filters:', filters);
//     console.log('🔍 Search term:', searchTerm);
    
//     let filtered = [...logs];
//     console.log('🔍 After copy:', filtered.length);

//     if (searchTerm) {
//       console.log('🔍 Applying search filter:', searchTerm);
//       filtered = filtered.filter(log =>
//         log.transcript?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         log.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         log.keywords?.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//       console.log('🔍 After search filter:', filtered.length);
//     }

//     if (filters.outcome) {
//       console.log('🔍 Applying outcome filter:', filters.outcome);
//       const beforeCount = filtered.length;
//       filtered = filtered.filter(log => log.outcome === filters.outcome);
//       console.log(`🔍 After outcome filter: ${filtered.length} (removed ${beforeCount - filtered.length})`);
//     }

//     if (filters.sentiment) {
//       console.log('🔍 Applying sentiment filter:', filters.sentiment);
//       const beforeCount = filtered.length;
//       filtered = filtered.filter(log => log.sentiment === filters.sentiment);
//       console.log(`🔍 After sentiment filter: ${filtered.length} (removed ${beforeCount - filtered.length})`);
//     }

//     if (filters.dateFrom) {
//       console.log('🔍 Applying dateFrom filter:', filters.dateFrom);
//       const fromDate = new Date(filters.dateFrom);
//       const beforeCount = filtered.length;
//       filtered = filtered.filter(log => {
//         const logDate = new Date(log.created_at);
//         return logDate >= fromDate;
//       });
//       console.log(`🔍 After dateFrom filter: ${filtered.length} (removed ${beforeCount - filtered.length})`);
//     }

//     if (filters.dateTo) {
//       console.log('🔍 Applying dateTo filter:', filters.dateTo);
//       const toDate = new Date(filters.dateTo);
//       toDate.setHours(23, 59, 59, 999);
//       const beforeCount = filtered.length;
//       filtered = filtered.filter(log => {
//         const logDate = new Date(log.created_at);
//         return logDate <= toDate;
//       });
//       console.log(`🔍 After dateTo filter: ${filtered.length} (removed ${beforeCount - filtered.length})`);
//     }

//     console.log('✅ FINAL FILTERED COUNT:', filtered.length);
//     setFilteredLogs(filtered);
//   };

//   const formatDate = (date) => {
//     if (!date) return 'N/A';
//     const d = new Date(date);
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
//   };

//   const getSentimentColor = (sentiment) => {
//     switch (sentiment) {
//       case 'positive': return 'bg-green-100 text-green-800 border border-green-500';
//       case 'negative': return 'bg-red-100 text-[#f2070d] border border-[#f2070d]';
//       case 'neutral': return 'bg-gray-100 text-[#2C2C2C] border border-[#2C2C2C]';
//       default: return 'bg-gray-100 text-gray-800 border border-gray-500';
//     }
//   };

//   const getOutcomeColor = (outcome) => {
//     switch (outcome) {
//       case 'successful': return 'bg-green-100 text-green-800 border border-green-500';
//       case 'unsuccessful': return 'bg-red-100 text-[#f2070d] border border-[#f2070d]';
//       case 'needs_followup': return 'bg-yellow-100 text-yellow-800 border border-yellow-500';
//       case 'no_answer': return 'bg-gray-100 text-[#2C2C2C] border border-[#2C2C2C]';
//       case 'information_provided': return 'bg-blue-100 text-blue-800 border border-blue-500';
//       case 'callback_requested': return 'bg-purple-100 text-purple-800 border border-purple-500';
//       default: return 'bg-gray-100 text-gray-800 border border-gray-500';
//     }
//   };

//   const formatDuration = (seconds) => {
//     if (!seconds) return '0:00';
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const downloadTranscript = (log) => {
//     const content = `Call Log - ${formatDate(log.created_at)}\n\nSummary:\n${log.summary}\n\nTranscript:\n${log.transcript}\n\nKeywords: ${log.keywords?.join(', ')}\nOutcome: ${log.outcome}\nSentiment: ${log.sentiment}`;
    
//     const blob = new Blob([content], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `call-log-${log._id}.txt`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
    
//     toast.success('Transcript downloaded');
//   };

//   console.log('🎨 RENDER - Filtered logs to display:', filteredLogs.length);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="relative">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#f2070d]"></div>
//           <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-[#f2070d]" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-50">
//       <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
//         {/* Header */}
//         <Card className="p-6 rounded-3xl shadow-lg bg-white border border-black">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//             <div className="flex items-center space-x-4">
//               <div className="p-4 bg-[#f2070d] rounded-2xl">
//                 <FileText className="h-8 w-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-black text-[#2C2C2C] uppercase tracking-wide">
//                   <span className="text-[#2C2C2C]">CAL</span>
//                   <span className="text-[#f2070d]">L</span>
//                   <span className="text-[#2C2C2C]"> LOG</span>
//                   <span className="text-[#f2070d]">S</span>
//                 </h1>
//                 <p className="text-sm font-semibold text-gray-600">
//                   Detailed analysis and transcripts of your calls
//                 </p>
//                 <p className="text-xs font-bold text-[#f2070d] mt-1">
//                   DEBUG: Total Logs: {logs.length} | Filtered: {filteredLogs.length}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <Button
//                 onClick={handleRegenerateLogs}
//                 disabled={isRegenerating}
//                 className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
//               >
//                 {isRegenerating ? (
//                   <>
//                     <Loader className="h-5 w-5 animate-spin" />
//                     <span>FIXING...</span>
//                   </>
//                 ) : (
//                   <>
//                     <Wrench className="h-5 w-5" />
//                     <span>FIX MISSING LOGS</span>
//                   </>
//                 )}
//               </Button>
//               <Button
//                 onClick={loadCallLogs}
//                 className="px-6 py-3 bg-[#f2070d] hover:bg-[#d10609] text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
//               >
//                 <Clock className="h-5 w-5" />
//                 <span>REFRESH</span>
//               </Button>
//             </div>
//           </div>
//         </Card>

//         {/* Search & Filters */}
//         <Card className="p-6 rounded-3xl shadow-lg bg-white border border-black">
//           <div className="space-y-4">
//             {/* Search Bar */}
//             <div className="relative">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <Input
//                 type="text"
//                 placeholder="Search in transcripts, summaries, or keywords..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-12 py-3 border border-black rounded-full font-semibold"
//               />
//             </div>

//             {/* Filter Row */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {/* Outcome Filter */}
//               <div>
//                 <label className="block text-sm font-black mb-2 uppercase">OUTCOME</label>
//                 <select
//                   value={filters.outcome}
//                   onChange={(e) => setFilters({ ...filters, outcome: e.target.value })}
//                   className="w-full px-4 py-3 border border-black rounded-full font-bold bg-white"
//                 >
//                   <option value="">All Outcomes</option>
//                   <option value="successful">Successful</option>
//                   <option value="unsuccessful">Unsuccessful</option>
//                   <option value="no_answer">No Answer</option>
//                   <option value="information_provided">Info Provided</option>
//                   <option value="callback_requested">Callback Requested</option>
//                   <option value="unknown">Unknown</option>
//                 </select>
//               </div>

//               {/* Sentiment Filter */}
//               <div>
//                 <label className="block text-sm font-black mb-2 uppercase">SENTIMENT</label>
//                 <select
//                   value={filters.sentiment}
//                   onChange={(e) => setFilters({ ...filters, sentiment: e.target.value })}
//                   className="w-full px-4 py-3 border border-black rounded-full font-bold bg-white"
//                 >
//                   <option value="">All Sentiments</option>
//                   <option value="positive">Positive</option>
//                   <option value="neutral">Neutral</option>
//                   <option value="negative">Negative</option>
//                 </select>
//               </div>

//               {/* Date From */}
//               <div>
//                 <label className="block text-sm font-black mb-2 uppercase">FROM DATE</label>
//                 <Input
//                   type="date"
//                   value={filters.dateFrom}
//                   onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
//                   className="border border-black rounded-full font-semibold"
//                 />
//               </div>

//               {/* Date To */}
//               <div>
//                 <label className="block text-sm font-black mb-2 uppercase">TO DATE</label>
//                 <Input
//                   type="date"
//                   value={filters.dateTo}
//                   onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
//                   className="border border-black rounded-full font-semibold"
//                 />
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Results Count */}
//         <div className="text-center">
//           <p className="text-lg font-bold text-[#2C2C2C]">
//             Showing <span className="text-[#f2070d]">{filteredLogs.length}</span> of <span className="text-[#f2070d]">{logs.length}</span> logs
//           </p>
//         </div>

//         {/* Call Logs Grid */}
//         <div className="space-y-4">
//           {filteredLogs.length === 0 ? (
//             <Card className="p-16 text-center rounded-3xl bg-white shadow-lg">
//               <FileText size={72} className="mx-auto text-gray-300 mb-4" />
//               <h3 className="text-xl font-bold text-[#2C2C2C] mb-2">No Call Logs Found</h3>
//               <p className="text-gray-600 font-semibold mb-4">
//                 {logs.length === 0 
//                   ? "No call logs have been generated yet." 
//                   : "No logs match your current filters."}
//               </p>
//               {logs.length === 0 && (
//                 <Button
//                   onClick={handleRegenerateLogs}
//                   disabled={isRegenerating}
//                   className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full inline-flex items-center space-x-2"
//                 >
//                   {isRegenerating ? (
//                     <>
//                       <Loader className="h-5 w-5 animate-spin" />
//                       <span>GENERATING LOGS...</span>
//                     </>
//                   ) : (
//                     <>
//                       <Wrench className="h-5 w-5" />
//                       <span>GENERATE MISSING LOGS</span>
//                     </>
//                   )}
//                 </Button>
//               )}
//             </Card>
//           ) : (
//             filteredLogs.map((log, index) => (
//               <Card key={log._id} className="p-6 rounded-3xl bg-white hover:shadow-2xl transition-all">
//                 <div className="space-y-4">
//                   {/* Header */}
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex flex-wrap items-center gap-3 mb-2">
//                         <div className="flex items-center space-x-2 text-gray-600 font-semibold">
//                           <Clock className="h-4 w-4 text-[#f2070d]" />
//                           <span className="text-sm">{formatDate(log.created_at)}</span>
//                         </div>
//                         <span className={`px-4 py-1 text-xs font-bold rounded-xl uppercase ${getOutcomeColor(log.outcome)}`}>
//                           {log.outcome || 'Unknown'}
//                         </span>
//                         <span className={`px-4 py-1 text-xs font-bold rounded-xl uppercase ${getSentimentColor(log.sentiment)}`}>
//                           {log.sentiment || 'Neutral'}
//                         </span>
//                         {log.recording_duration > 0 && (
//                           <div className="bg-[#f2070d] px-4 py-2 rounded-xl text-white">
//                             <span className="text-xs font-bold">{formatDuration(log.recording_duration)}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Summary */}
//                   <div className="bg-gray-50 p-4 rounded-2xl">
//                     <h4 className="font-black text-[#2C2C2C] mb-2 uppercase text-sm">SUMMARY</h4>
//                     <p className="text-gray-700 font-semibold text-sm">
//                       {log.summary || 'No summary available'}
//                     </p>
//                   </div>

//                   {/* Keywords */}
//                   {log.keywords && log.keywords.length > 0 && (
//                     <div>
//                       <h5 className="text-xs font-black text-[#2C2C2C] mb-2 uppercase">KEYWORDS</h5>
//                       <div className="flex flex-wrap gap-2">
//                         {log.keywords.map((keyword, idx) => (
//                           <span key={idx} className="px-3 py-1 bg-gray-100 border border-[#2C2C2C] text-[#2C2C2C] text-xs font-bold rounded-full uppercase">
//                             {keyword}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Actions */}
//                   <div className="flex items-center gap-3">
//                     <button
//                       onClick={() => {
//                         setSelectedLog(log);
//                         setShowTranscript(true);
//                       }}
//                       className="px-5 py-2 border-2 border-[#2C2C2C] text-[#2C2C2C] font-bold rounded-full hover:bg-[#2C2C2C] hover:text-white transition-all flex items-center space-x-2"
//                     >
//                       <Eye className="h-4 w-4" />
//                       <span>VIEW TRANSCRIPT</span>
//                     </button>
//                     <button
//                       onClick={() => downloadTranscript(log)}
//                       className="px-5 py-2 bg-[#f2070d] text-white font-bold rounded-full hover:bg-[#d10609] transition-all flex items-center space-x-2"
//                     >
//                       <Download className="h-4 w-4" />
//                       <span>DOWNLOAD</span>
//                     </button>
//                   </div>
//                 </div>
//               </Card>
//             ))
//           )}
//         </div>

//         {/* Transcript Modal */}
//         {showTranscript && selectedLog && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
//               <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//                 <h3 className="text-2xl font-black text-[#2C2C2C] uppercase">
//                   <span className="text-[#2C2C2C]">TRANSCRI</span>
//                   <span className="text-[#f2070d]">PT</span>
//                 </h3>
//                 <button
//                   onClick={() => {
//                     setShowTranscript(false);
//                     setSelectedLog(null);
//                   }}
//                   className="p-2 hover:bg-gray-100 rounded-full transition-all"
//                 >
//                   <span className="text-2xl font-bold text-[#2C2C2C]">×</span>
//                 </button>
//               </div>
              
//               <div className="p-6 overflow-y-auto max-h-[60vh]">
//                 <div className="space-y-6">
//                   {/* Summary */}
//                   <div>
//                     <h4 className="font-black text-[#2C2C2C] mb-3 uppercase text-sm">SUMMARY</h4>
//                     <p className="text-gray-700 font-semibold bg-gray-50 p-4 rounded-2xl">
//                       {selectedLog.summary || 'No summary available'}
//                     </p>
//                   </div>
                  
//                   {/* Full Transcript */}
//                   <div>
//                     <h4 className="font-black text-[#2C2C2C] mb-3 uppercase text-sm">FULL TRANSCRIPT</h4>
//                     <div className="bg-gray-50 p-4 rounded-2xl max-h-96 overflow-y-auto">
//                       <pre className="whitespace-pre-wrap text-sm text-gray-700 font-semibold">
//                         {selectedLog.transcript || 'No transcript available'}
//                       </pre>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CallLogs;  






// frontend/src/Pages/dashboard/calls/CallLogs.jsx
import React, { useState, useEffect } from "react";
import { 
  Search, FileText, Filter, Clock, User, Phone, 
  Download, Eye, ChevronDown, AlertCircle, Loader, Wrench
} from "lucide-react";
import Card from "../../../Components/ui/Card";
import Input from "../../../Components/ui/Input";
import Button from "../../../Components/ui/Button";
import { callService } from "../../../services/call";
import api from "../../../services/api";
import toast from "react-hot-toast";

const CallLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  
  const [filters, setFilters] = useState({
    outcome: '',
    sentiment: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    loadCallLogs();
  }, []);

  useEffect(() => {
    console.log('🔄 Applying filters - Current logs count:', logs.length);
    applyFilters();
  }, [logs, filters, searchTerm]);

  const loadCallLogs = async () => {
    try {
      setIsLoading(true);
      
      console.log('📡 Fetching call logs from backend...');
      
      const response = await callService.getCallLogs({
        skip: 0,
        limit: 100
      });
      
      console.log('📦 RAW RESPONSE FROM getCallLogs:', response);
      console.log('📊 Response type:', typeof response);
      console.log('📊 Is Array?:', Array.isArray(response));
      
      // ✅ FIX: callService.getCallLogs() now returns array directly
      if (response && Array.isArray(response)) {
        console.log('✅ Setting logs - Count:', response.length);
        console.log('📋 First 3 logs:', response.slice(0, 3));
        
        setLogs(response);
        setFilteredLogs(response);
        
        if (response.length > 0) {
          toast.success(`Loaded ${response.length} call logs`);
        } else {
          toast.info('No call logs found');
        }
      } else {
        console.warn('⚠️ Response is not an array:', response);
        setLogs([]);
        setFilteredLogs([]);
        toast.info('No call logs available');
      }
      
    } catch (error) {
      console.error('❌ Failed to load call logs:', error);
      console.error('❌ Error details:', error.response?.data);
      console.error('❌ Error message:', error.message);
      toast.error(`Failed to load call logs: ${error.message}`);
      setLogs([]);
      setFilteredLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateLogs = async () => {
    try {
      setIsRegenerating(true);
      console.log('🔧 Regenerating missing call logs...');
      
      const response = await api.post('/calls/logs/regenerate');
      
      console.log('✅ Regenerate response:', response.data);
      
      if (response.data.created_logs > 0) {
        toast.success(`Created ${response.data.created_logs} missing logs!`);
      } else {
        toast.info(response.data.message || 'All calls already have logs');
      }
      
      // Refresh the logs
      await loadCallLogs();
      
    } catch (error) {
      console.error('❌ Failed to regenerate logs:', error);
      toast.error('Failed to regenerate logs');
    } finally {
      setIsRegenerating(false);
    }
  };

  const applyFilters = () => {
    console.log('🔍 Starting filter application');
    console.log('🔍 Logs to filter:', logs.length);
    console.log('🔍 Current filters:', filters);
    console.log('🔍 Search term:', searchTerm);
    
    let filtered = [...logs];
    console.log('🔍 After copy:', filtered.length);

    if (searchTerm) {
      console.log('🔍 Applying search filter:', searchTerm);
      filtered = filtered.filter(log =>
        log.transcript?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.keywords?.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      console.log('🔍 After search filter:', filtered.length);
    }

    if (filters.outcome) {
      console.log('🔍 Applying outcome filter:', filters.outcome);
      const beforeCount = filtered.length;
      filtered = filtered.filter(log => log.outcome === filters.outcome);
      console.log(`🔍 After outcome filter: ${filtered.length} (removed ${beforeCount - filtered.length})`);
    }

    if (filters.sentiment) {
      console.log('🔍 Applying sentiment filter:', filters.sentiment);
      const beforeCount = filtered.length;
      filtered = filtered.filter(log => log.sentiment === filters.sentiment);
      console.log(`🔍 After sentiment filter: ${filtered.length} (removed ${beforeCount - filtered.length})`);
    }

    if (filters.dateFrom) {
      console.log('🔍 Applying dateFrom filter:', filters.dateFrom);
      const fromDate = new Date(filters.dateFrom);
      const beforeCount = filtered.length;
      filtered = filtered.filter(log => {
        const logDate = new Date(log.created_at);
        return logDate >= fromDate;
      });
      console.log(`🔍 After dateFrom filter: ${filtered.length} (removed ${beforeCount - filtered.length})`);
    }

    if (filters.dateTo) {
      console.log('🔍 Applying dateTo filter:', filters.dateTo);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      const beforeCount = filtered.length;
      filtered = filtered.filter(log => {
        const logDate = new Date(log.created_at);
        return logDate <= toDate;
      });
      console.log(`🔍 After dateTo filter: ${filtered.length} (removed ${beforeCount - filtered.length})`);
    }

    console.log('✅ FINAL FILTERED COUNT:', filtered.length);
    setFilteredLogs(filtered);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border border-green-500';
      case 'negative': return 'bg-red-100 text-[#f2070d] border border-[#f2070d]';
      case 'neutral': return 'bg-gray-100 text-[#2C2C2C] border border-[#2C2C2C]';
      default: return 'bg-gray-100 text-gray-800 border border-gray-500';
    }
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'successful': return 'bg-green-100 text-green-800 border border-green-500';
      case 'unsuccessful': return 'bg-red-100 text-[#f2070d] border border-[#f2070d]';
      case 'needs_followup': return 'bg-yellow-100 text-yellow-800 border border-yellow-500';
      case 'no_answer': return 'bg-gray-100 text-[#2C2C2C] border border-[#2C2C2C]';
      case 'information_provided': return 'bg-blue-100 text-blue-800 border border-blue-500';
      case 'callback_requested': return 'bg-purple-100 text-purple-800 border border-purple-500';
      default: return 'bg-gray-100 text-gray-800 border border-gray-500';
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadTranscript = (log) => {
    const content = `Call Log - ${formatDate(log.created_at)}\n\nSummary:\n${log.summary}\n\nTranscript:\n${log.transcript}\n\nKeywords: ${log.keywords?.join(', ')}\nOutcome: ${log.outcome}\nSentiment: ${log.sentiment}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `call-log-${log._id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Transcript downloaded');
  };

  console.log('🎨 RENDER - Filtered logs to display:', filteredLogs.length);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#f2070d]"></div>
          <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-[#f2070d]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <Card className="p-6 rounded-3xl shadow-lg bg-white border border-black">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-[#f2070d] rounded-2xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#2C2C2C] uppercase tracking-wide">
                  <span className="text-[#2C2C2C]">CAL</span>
                  <span className="text-[#f2070d]">L</span>
                  <span className="text-[#2C2C2C]"> LOG</span>
                  <span className="text-[#f2070d]">S</span>
                </h1>
                <p className="text-sm font-semibold text-gray-600">
                  Detailed analysis and transcripts of your calls
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={loadCallLogs}
                className="px-6 py-3 bg-[#f2070d] hover:bg-[#d10609] text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <Clock className="h-5 w-5" />
                <span>REFRESH</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Search & Filters */}
        <Card className="p-6 rounded-3xl shadow-lg bg-white border border-black">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search in transcripts, summaries, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 border border-black rounded-full font-semibold"
              />
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Outcome Filter */}
              <div>
                <label className="block text-sm font-black mb-2 uppercase">OUTCOME</label>
                <select
                  value={filters.outcome}
                  onChange={(e) => setFilters({ ...filters, outcome: e.target.value })}
                  className="w-full px-4 py-3 border border-black rounded-full font-bold bg-white"
                >
                  <option value="">All Outcomes</option>
                  <option value="successful">Successful</option>
                  <option value="unsuccessful">Unsuccessful</option>
                  <option value="no_answer">No Answer</option>
                  <option value="information_provided">Info Provided</option>
                  <option value="callback_requested">Callback Requested</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              {/* Sentiment Filter */}
              <div>
                <label className="block text-sm font-black mb-2 uppercase">SENTIMENT</label>
                <select
                  value={filters.sentiment}
                  onChange={(e) => setFilters({ ...filters, sentiment: e.target.value })}
                  className="w-full px-4 py-3 border border-black rounded-full font-bold bg-white"
                >
                  <option value="">All Sentiments</option>
                  <option value="positive">Positive</option>
                  <option value="neutral">Neutral</option>
                  <option value="negative">Negative</option>
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-black mb-2 uppercase">FROM DATE</label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="border border-black rounded-full font-semibold"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-black mb-2 uppercase">TO DATE</label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="border border-black rounded-full font-semibold"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="text-center">
          <p className="text-lg font-bold text-[#2C2C2C]">
            Showing <span className="text-[#f2070d]">{filteredLogs.length}</span> of <span className="text-[#f2070d]">{logs.length}</span> logs
          </p>
        </div>

        {/* Call Logs Grid */}
        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <Card className="p-16 text-center rounded-3xl bg-white shadow-lg">
              <FileText size={72} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-[#2C2C2C] mb-2">No Call Logs Found</h3>
              <p className="text-gray-600 font-semibold mb-4">
                {logs.length === 0 
                  ? "No call logs have been generated yet." 
                  : "No logs match your current filters."}
              </p>
            </Card>
          ) : (
            filteredLogs.map((log, index) => (
              <Card key={log._id} className="p-6 rounded-3xl bg-white hover:shadow-2xl transition-all">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <div className="flex items-center space-x-2 text-gray-600 font-semibold">
                          <Clock className="h-4 w-4 text-[#f2070d]" />
                          <span className="text-sm">{formatDate(log.created_at)}</span>
                        </div>
                        <span className={`px-4 py-1 text-xs font-bold rounded-xl uppercase ${getOutcomeColor(log.outcome)}`}>
                          {log.outcome || 'Unknown'}
                        </span>
                        <span className={`px-4 py-1 text-xs font-bold rounded-xl uppercase ${getSentimentColor(log.sentiment)}`}>
                          {log.sentiment || 'Neutral'}
                        </span>
                        {log.recording_duration > 0 && (
                          <div className="bg-[#f2070d] px-4 py-2 rounded-xl text-white">
                            <span className="text-xs font-bold">{formatDuration(log.recording_duration)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <h4 className="font-black text-[#2C2C2C] mb-2 uppercase text-sm">SUMMARY</h4>
                    <p className="text-gray-700 font-semibold text-sm">
                      {log.summary || 'No summary available'}
                    </p>
                  </div>

                  {/* Keywords */}
                  {log.keywords && log.keywords.length > 0 && (
                    <div>
                      <h5 className="text-xs font-black text-[#2C2C2C] mb-2 uppercase">KEYWORDS</h5>
                      <div className="flex flex-wrap gap-2">
                        {log.keywords.map((keyword, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 border border-[#2C2C2C] text-[#2C2C2C] text-xs font-bold rounded-full uppercase">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedLog(log);
                        setShowTranscript(true);
                      }}
                      className="px-5 py-2 border-2 border-[#2C2C2C] text-[#2C2C2C] font-bold rounded-full hover:bg-[#2C2C2C] hover:text-white transition-all flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>VIEW TRANSCRIPT</span>
                    </button>
                    <button
                      onClick={() => downloadTranscript(log)}
                      className="px-5 py-2 bg-[#f2070d] text-white font-bold rounded-full hover:bg-[#d10609] transition-all flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>DOWNLOAD</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Transcript Modal */}
        {showTranscript && selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-2xl font-black text-[#2C2C2C] uppercase">
                  <span className="text-[#2C2C2C]">TRANSCRI</span>
                  <span className="text-[#f2070d]">PT</span>
                </h3>
                <button
                  onClick={() => {
                    setShowTranscript(false);
                    setSelectedLog(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  <span className="text-2xl font-bold text-[#2C2C2C]">×</span>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">
                  {/* Summary */}
                  <div>
                    <h4 className="font-black text-[#2C2C2C] mb-3 uppercase text-sm">SUMMARY</h4>
                    <p className="text-gray-700 font-semibold bg-gray-50 p-4 rounded-2xl">
                      {selectedLog.summary || 'No summary available'}
                    </p>
                  </div>
                  
                  {/* Full Transcript */}
                  <div>
                    <h4 className="font-black text-[#2C2C2C] mb-3 uppercase text-sm">FULL TRANSCRIPT</h4>
                    <div className="bg-gray-50 p-4 rounded-2xl max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-semibold">
                        {selectedLog.transcript || 'No transcript available'}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallLogs;