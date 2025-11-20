// // frontend/src/Pages/dashboard/calls/CallLogs.jsx - Enhanced UI Version
// import React, { useState, useEffect } from "react";
// import { 
//   Search, FileText, Filter, Clock, User, Phone, 
//   Download, Eye, ChevronDown, AlertCircle, Loader
// } from "lucide-react";
// import Card from "../../../Components/ui/Card";
// import Input from "../../../Components/ui/Input";
// import Button from "../../../Components/ui/Button";
// import { callService } from "../../../services/call";
// import toast from "react-hot-toast";

// const CallLogs = () => {
//   const [logs, setLogs] = useState([]);
//   const [filteredLogs, setFilteredLogs] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
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
//     applyFilters();
//   }, [logs, filters, searchTerm]);

//   const loadCallLogs = async () => {
//     try {
//       setIsLoading(true);
      
//       const response = await callService.getCallLogs({
//         limit: 100,
//         ...filters,
//         search: searchTerm
//       });
      
//       console.log('📋 Loaded call logs:', response);
      
//       if (!response || response.length === 0) {
//         setLogs([]);
//         setFilteredLogs([]);
//         console.log('ℹ️ No call logs found in database');
//       } else {
//         setLogs(response);
//         setFilteredLogs(response);
//       }
      
//     } catch (error) {
//       console.error('❌ Failed to load call logs:', error);
//       toast.error('Failed to load call logs');
//       setLogs([]);
//       setFilteredLogs([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...logs];

//     if (searchTerm) {
//       filtered = filtered.filter(log =>
//         log.transcript?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         log.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         log.keywords?.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//     }

//     if (filters.outcome) {
//       filtered = filtered.filter(log => log.outcome === filters.outcome);
//     }

//     if (filters.sentiment) {
//       filtered = filtered.filter(log => log.sentiment === filters.sentiment);
//     }

//     if (filters.dateFrom) {
//       const fromDate = new Date(filters.dateFrom);
//       filtered = filtered.filter(log => new Date(log.created_at) >= fromDate);
//     }

//     if (filters.dateTo) {
//       const toDate = new Date(filters.dateTo);
//       toDate.setHours(23, 59, 59, 999);
//       filtered = filtered.filter(log => new Date(log.created_at) <= toDate);
//     }

//     setFilteredLogs(filtered);
//   };

//   const formatDate = (date) => {
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
//   };

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
//                 <p className="text-gray-600 font-semibold">Detailed analysis and transcripts of your calls</p>
//               </div>
//             </div>
//             <button 
//               onClick={loadCallLogs} 
//               className="px-6 py-3 bg-[#f2070d] text-white font-bold rounded-full hover:shadow-lg transition-all flex items-center space-x-2"
//             >
//               <Download className="h-4 w-4" />
//               <span>REFRESH</span>
//             </button>
//           </div>
//         </Card>

//         {/* Search and Filters */}
//         <Card className="p-6 rounded-3xl shadow-lg bg-white border border-black">
//           <div className="flex items-center space-x-3 mb-6">
//             <Filter className="h-6 w-6 text-[#f2070d]" />
//             <h3 className="text-xl font-bold text-[#2C2C2C]">Search & Filters</h3>
//           </div>

//           {/* Search Bar */}
//           <div className="mb-6">
//             <div className="relative">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#f2070d] z-10" />
//               <input
//                 type="text"
//                 placeholder="Search in transcripts, summaries, or keywords..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 border border-black rounded-full font-bold text-[#2C2C2C] bg-white focus:ring-0 focus:outline-none shadow-md hover:shadow-lg transition-all"
//               />
//             </div>
//           </div>

//           {/* Filter Controls */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Outcome Filter */}
//             <div>
//               <label className="block text-sm font-black mb-2 uppercase tracking-wide">
//                 <span className="text-[#2C2C2C]">OUTCOM</span>
//                 <span className="text-[#f2070d]">E</span>
//               </label>
//               <select
//                 value={filters.outcome}
//                 onChange={(e) => setFilters({ ...filters, outcome: e.target.value })}
//                 className="w-full px-4 py-3 border border-black rounded-full font-bold text-[#2C2C2C] bg-white focus:ring-0 focus:outline-none shadow-md hover:shadow-lg transition-all cursor-pointer"
//               >
//                 <option value="">All Outcomes</option>
//                 <option value="successful">Successful</option>
//                 <option value="needs_followup">Needs Follow-up</option>
//                 <option value="no_answer">No Answer</option>
//                 <option value="unsuccessful">Unsuccessful</option>
//               </select>
//             </div>

//             {/* Sentiment Filter */}
//             <div>
//               <label className="block text-sm font-black mb-2 uppercase tracking-wide">
//                 <span className="text-[#2C2C2C]">SENTIMEN</span>
//                 <span className="text-[#f2070d]">T</span>
//               </label>
//               <select
//                 value={filters.sentiment}
//                 onChange={(e) => setFilters({ ...filters, sentiment: e.target.value })}
//                 className="w-full px-4 py-3 border border-black rounded-full font-bold text-[#2C2C2C] bg-white focus:ring-0 focus:outline-none shadow-md hover:shadow-lg transition-all cursor-pointer"
//               >
//                 <option value="">All Sentiments</option>
//                 <option value="positive">Positive</option>
//                 <option value="neutral">Neutral</option>
//                 <option value="negative">Negative</option>
//               </select>
//             </div>

//             {/* From Date */}
//             <div>
//               <label className="block text-sm font-black mb-2 uppercase tracking-wide">
//                 <span className="text-[#2C2C2C]">FRO</span>
//                 <span className="text-[#f2070d]">M</span>
//                 <span className="text-[#2C2C2C]"> DAT</span>
//                 <span className="text-[#f2070d]">E</span>
//               </label>
//               <div className="relative">
//                 <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#f2070d] pointer-events-none z-10" size={20} />
//                 <input
//                   type="date"
//                   value={filters.dateFrom}
//                   onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
//                   className="w-full pl-12 pr-4 py-3 border border-black rounded-full font-bold text-[#2C2C2C] bg-white focus:ring-0 focus:outline-none shadow-md hover:shadow-lg transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
//                 />
//               </div>
//             </div>
            
//             {/* To Date */}
//             <div>
//               <label className="block text-sm font-black mb-2 uppercase tracking-wide">
//                 <span className="text-[#2C2C2C]">T</span>
//                 <span className="text-[#f2070d]">O</span>
//                 <span className="text-[#2C2C2C]"> DAT</span>
//                 <span className="text-[#f2070d]">E</span>
//               </label>
//               <div className="relative">
//                 <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#f2070d] pointer-events-none z-10" size={20} />
//                 <input
//                   type="date"
//                   value={filters.dateTo}
//                   onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
//                   className="w-full pl-12 pr-4 py-3 border border-black rounded-full font-bold text-[#2C2C2C] bg-white focus:ring-0 focus:outline-none shadow-md hover:shadow-lg transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
//                 />
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Results Count */}
//         <div className="text-center py-2">
//           <p className="text-[#2C2C2C] font-bold text-lg">
//             Showing <span className="text-[#f2070d] text-2xl">{filteredLogs.length}</span> of <span className="text-[#f2070d] text-2xl">{logs.length}</span> logs
//           </p>
//         </div>

//         {/* Call Logs List */}
//         <div className="space-y-4">
//           {filteredLogs.length === 0 ? (
//             <Card className="p-8 sm:p-16 text-center rounded-3xl bg-white shadow-lg">
//               <FileText size={72} className="mx-auto text-gray-300 mb-4" />
//               <h3 className="text-xl font-bold text-[#2C2C2C] mb-2">No Call Logs Found</h3>
//               <p className="text-gray-600 font-semibold mb-4">
//                 {logs.length === 0 
//                   ? "No call logs have been generated yet. Make some calls to see logs here." 
//                   : "No logs match your current filters. Try adjusting your search criteria."
//                 }
//               </p>
//               {logs.length === 0 && (
//                 <button 
//                   onClick={() => window.location.href = '/dashboard/calls/center'} 
//                   className="mt-4 px-6 py-3 bg-[#f2070d] text-white font-bold rounded-full hover:shadow-lg transition-all"
//                 >
//                   START MAKING CALLS
//                 </button>
//               )}
//             </Card>
//           ) : (
//             filteredLogs.map((log) => (
//               <Card key={log._id} className="p-6 rounded-3xl bg-white hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     {/* Header with date and outcome */}
//                     <div className="flex flex-wrap items-center gap-3 mb-4">
//                       <div className="flex items-center space-x-2 text-gray-600 font-semibold">
//                         <Clock className="h-4 w-4 text-[#f2070d]" />
//                         <span className="text-sm">
//                           {formatDate(log.created_at)}
//                         </span>
//                       </div>
//                       <span className={`px-4 py-1 text-xs font-bold rounded-xl uppercase ${getOutcomeColor(log.outcome)}`}>
//                         {log.outcome || 'Unknown'}
//                       </span>
//                       <span className={`px-4 py-1 text-xs font-bold rounded-xl uppercase ${getSentimentColor(log.sentiment)}`}>
//                         {log.sentiment || 'Neutral'}
//                       </span>
//                       {log.recording_duration > 0 && (
//                         <div className="bg-[#f2070d] px-4 py-2 rounded-xl text-white">
//                           <span className="text-xs font-bold">{formatDuration(log.recording_duration)}</span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Summary */}
//                     <div className="mb-4 bg-gray-50 p-4 rounded-2xl">
//                       <h4 className="font-black text-[#2C2C2C] mb-2 uppercase text-sm tracking-wide">
//                         <span className="text-[#2C2C2C]">SUMMAR</span>
//                         <span className="text-[#f2070d]">Y</span>
//                       </h4>
//                       <p className="text-gray-700 font-semibold text-sm">
//                         {log.summary || 'No summary available'}
//                       </p>
//                     </div>

//                     {/* Keywords */}
//                     {log.keywords && log.keywords.length > 0 && (
//                       <div className="mb-4">
//                         <h5 className="text-xs font-black text-[#2C2C2C] mb-2 uppercase tracking-wide">
//                           KEYWORDS
//                         </h5>
//                         <div className="flex flex-wrap gap-2">
//                           {log.keywords.map((keyword, index) => (
//                             <span key={index} className="px-3 py-1 bg-gray-100 border border-[#2C2C2C] text-[#2C2C2C] text-xs font-bold rounded-full uppercase">
//                               {keyword}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Action Buttons */}
//                     <div className="flex flex-wrap items-center gap-3 mt-4">
//                       <button
//                         onClick={() => {
//                           setSelectedLog(log);
//                           setShowTranscript(true);
//                         }}
//                         className="px-5 py-2 border-2 border-[#2C2C2C] text-[#2C2C2C] font-bold rounded-full hover:bg-[#2C2C2C] hover:text-white transition-all flex items-center space-x-2"
//                       >
//                         <Eye className="h-4 w-4" />
//                         <span>VIEW TRANSCRIPT</span>
//                       </button>
                      
//                       <button
//                         onClick={() => downloadTranscript(log)}
//                         className="px-5 py-2 border-2 border-[#f2070d] text-[#f2070d] font-bold rounded-full hover:bg-[#f2070d] hover:text-white transition-all flex items-center space-x-2"
//                       >
//                         <Download className="h-4 w-4" />
//                         <span>DOWNLOAD</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             ))
//           )}
//         </div>

//         {/* Transcript Modal */}
//         {showTranscript && selectedLog && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-hidden border-4 border-[#f2070d] shadow-2xl">
//               <div className="p-6 border-b-2 border-gray-200 bg-gray-50">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-black text-[#2C2C2C] uppercase tracking-wide">
//                     <span className="text-[#2C2C2C]">CALL TRANSCR</span>
//                     <span className="text-[#f2070d]">I</span>
//                     <span className="text-[#2C2C2C]">PT</span>
//                   </h3>
//                   <button
//                     onClick={() => setShowTranscript(false)}
//                     className="px-5 py-2 border-2 border-[#2C2C2C] text-[#2C2C2C] font-bold rounded-full hover:bg-[#2C2C2C] hover:text-white transition-all"
//                   >
//                     CLOSE
//                   </button>
//                 </div>
//                 <p className="text-sm text-gray-600 font-semibold mt-2">
//                   {formatDate(selectedLog.created_at)}
//                 </p>
//               </div>
              
//               <div className="p-6 overflow-y-auto max-h-[60vh]">
//                 <div className="space-y-6">
//                   <div>
//                     <h4 className="font-black text-[#2C2C2C] mb-3 uppercase text-sm tracking-wide">
//                       <span className="text-[#2C2C2C]">SUMMAR</span>
//                       <span className="text-[#f2070d]">Y</span>
//                     </h4>
//                     <p className="text-gray-700 font-semibold bg-gray-50 p-4 rounded-2xl border border-gray-200">
//                       {selectedLog.summary || 'No summary available'}
//                     </p>
//                   </div>
                  
//                   <div>
//                     <h4 className="font-black text-[#2C2C2C] mb-3 uppercase text-sm tracking-wide">
//                       <span className="text-[#2C2C2C]">FULL TRANSCR</span>
//                       <span className="text-[#f2070d]">I</span>
//                       <span className="text-[#2C2C2C]">PT</span>
//                     </h4>
//                     <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 max-h-96 overflow-y-auto">
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


// frontend/src/Pages/dashboard/calls/CallLogs.jsx - Enhanced UI Version
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  Search, FileText, Filter, Clock, User, Phone, 
  Download, Eye, ChevronDown, AlertCircle, Loader, Calendar
} from "lucide-react";
import Card from "../../../Components/ui/Card";
import Input from "../../../Components/ui/Input";
import Button from "../../../Components/ui/Button";
import { callService } from "../../../services/call";
import toast from "react-hot-toast";

const CallLogs = () => {
  const location = useLocation();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    applyFilters();
  }, [logs, filters, searchTerm]);

  // Check for selectedCallId from navigation state
  useEffect(() => {
    if (location.state?.selectedCallId && logs.length > 0) {
      const callId = location.state.selectedCallId;
      const foundLog = logs.find(log => log._id === callId || log.id === callId);
      if (foundLog) {
        setSelectedLog(foundLog);
        setShowTranscript(true);
      }
      // Clear the state to prevent re-opening on subsequent renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state, logs]);

  const loadCallLogs = async () => {
    try {
      setIsLoading(true);
      
      const response = await callService.getCallLogs({
        limit: 100,
        ...filters,
        search: searchTerm
      });
      
      console.log('📋 Loaded call logs:', response);
      
      if (!response || response.length === 0) {
        setLogs([]);
        setFilteredLogs([]);
        console.log('ℹ️ No call logs found in database');
      } else {
        setLogs(response);
        setFilteredLogs(response);
      }
      
    } catch (error) {
      console.error('❌ Failed to load call logs:', error);
      toast.error('Failed to load call logs');
      setLogs([]);
      setFilteredLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...logs];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.summary?.toLowerCase().includes(term) ||
        log.transcript?.toLowerCase().includes(term) ||
        log.phone_number?.includes(term) ||
        log.keywords?.some(k => k.toLowerCase().includes(term))
      );
    }

    if (filters.outcome) {
      filtered = filtered.filter(log => log.outcome === filters.outcome);
    }

    if (filters.sentiment) {
      filtered = filtered.filter(log => log.sentiment === filters.sentiment);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(log => 
        new Date(log.created_at) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(log => 
        new Date(log.created_at) <= new Date(filters.dateTo)
      );
    }

    setFilteredLogs(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getOutcomeBadge = (outcome) => {
    switch (outcome) {
      case 'successful':
        return 'bg-green-100 text-green-800 border border-green-500';
      case 'needs_followup':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-500';
      case 'no_answer':
        return 'bg-red-100 text-red-800 border border-red-500';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-500';
    }
  };

  const getSentimentBadge = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border border-green-500';
      case 'negative':
        return 'bg-red-100 text-red-800 border border-red-500';
      case 'neutral':
        return 'bg-blue-100 text-blue-800 border border-blue-500';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-500';
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadTranscript = (log) => {
    const content = `Call Log - ${formatDate(log.created_at)}\n\nSummary:\n${log.summary || 'No summary available'}\n\nTranscript:\n${log.transcript || 'No transcript available'}\n\nKeywords: ${log.keywords?.join(', ') || 'None'}\nOutcome: ${log.outcome || 'N/A'}\nSentiment: ${log.sentiment || 'N/A'}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `call-log-${log._id || log.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportLogs = () => {
    if (filteredLogs.length === 0) {
      toast.error('No logs to export');
      return;
    }

    const csvContent = [
      ['Date', 'Phone', 'Duration', 'Outcome', 'Sentiment', 'Summary'].join(','),
      ...filteredLogs.map(log => [
        formatDate(log.created_at),
        log.phone_number || 'N/A',
        formatDuration(log.recording_duration || log.duration),
        log.outcome || 'N/A',
        log.sentiment || 'N/A',
        `"${(log.summary || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `call-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Logs exported successfully');
  };

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
                <p className="text-gray-600 mt-1 font-semibold">
                  Detailed logs and transcripts from your calls
                </p>
              </div>
            </div>
            <button
              onClick={exportLogs}
              disabled={filteredLogs.length === 0}
              className="px-6 py-3 bg-[#f2070d] text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>EXPORT</span>
            </button>
          </div>
        </Card>

        {/* Filters */}
        <Card className="p-6 rounded-3xl shadow-lg bg-white border border-black">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-black mb-2 uppercase tracking-wide">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search logs..."
                  className="w-full pl-12 pr-4 py-3 border border-black rounded-full font-bold focus:outline-none focus:ring-2 focus:ring-[#f2070d]"
                />
              </div>
            </div>

            {/* Outcome Filter */}
            <div>
              <label className="block text-sm font-black mb-2 uppercase tracking-wide">
                Outcome
              </label>
              <select
                value={filters.outcome}
                onChange={(e) => setFilters({...filters, outcome: e.target.value})}
                className="w-full px-4 py-3 border border-black rounded-full font-bold focus:outline-none focus:ring-2 focus:ring-[#f2070d]"
              >
                <option value="">All</option>
                <option value="successful">Successful</option>
                <option value="needs_followup">Needs Follow-up</option>
                <option value="no_answer">No Answer</option>
              </select>
            </div>

            {/* Sentiment Filter */}
            <div>
              <label className="block text-sm font-black mb-2 uppercase tracking-wide">
                Sentiment
              </label>
              <select
                value={filters.sentiment}
                onChange={(e) => setFilters({...filters, sentiment: e.target.value})}
                className="w-full px-4 py-3 border border-black rounded-full font-bold focus:outline-none focus:ring-2 focus:ring-[#f2070d]"
              >
                <option value="">All</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-black mb-2 uppercase tracking-wide">
                Date From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                className="w-full px-4 py-3 border border-black rounded-full font-bold focus:outline-none focus:ring-2 focus:ring-[#f2070d]"
              />
            </div>
          </div>
        </Card>

        {/* Logs List */}
        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <Card className="p-12 text-center rounded-3xl bg-white border border-gray-200">
              <FileText size={72} className="mx-auto text-gray-300 mb-4" />
              <p className="text-[#2C2C2C] text-xl font-bold">No logs found</p>
              <p className="text-gray-500 text-sm mt-2">
                {logs.length === 0 ? 'No call logs in database yet' : 'Try adjusting your filters'}
              </p>
            </Card>
          ) : (
            filteredLogs.map(log => (
              <Card
                key={log._id || log.id}
                className="p-6 rounded-3xl transition-all hover:shadow-xl bg-white border border-gray-200"
              >
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                  <div className="flex-1 w-full">
                    {/* Header Info */}
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="flex items-center text-sm text-gray-600 font-semibold">
                        <Calendar size={14} className="mr-2 text-[#f2070d]" />
                        {formatDate(log.created_at)}
                      </span>
                      {log.phone_number && (
                        <span className="flex items-center text-sm text-gray-600 font-semibold">
                          <Phone size={14} className="mr-2 text-[#f2070d]" />
                          {log.phone_number}
                        </span>
                      )}
                      <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${getOutcomeBadge(log.outcome)}`}>
                        {log.outcome || 'N/A'}
                      </span>
                      {log.sentiment && (
                        <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${getSentimentBadge(log.sentiment)}`}>
                          {log.sentiment}
                        </span>
                      )}
                    </div>

                    {/* Summary */}
                    {log.summary && (
                      <p className="text-gray-800 mb-3 font-semibold">{log.summary}</p>
                    )}

                    {/* Keywords */}
                    {log.keywords && log.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {log.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold border border-gray-300"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-4">
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
                        className="px-5 py-2 border-2 border-[#f2070d] text-[#f2070d] font-bold rounded-full hover:bg-[#f2070d] hover:text-white transition-all flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>DOWNLOAD</span>
                      </button>
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="bg-[#f2070d] px-6 py-4 rounded-2xl text-white text-center min-w-[120px]">
                    <p className="text-xs font-bold uppercase mb-1">Duration</p>
                    <p className="text-2xl font-black">
                      {formatDuration(log.recording_duration || log.duration)}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Results Counter */}
        {filteredLogs.length > 0 && (
          <div className="text-center py-6">
            <p className="text-[#2C2C2C] font-bold text-lg">
              Showing{" "}
              <span className="text-[#f2070d] text-2xl">{filteredLogs.length}</span>{" "}
              of{" "}
              <span className="text-[#f2070d] text-2xl">{logs.length}</span>{" "}
              log{filteredLogs.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Transcript Modal */}
        {showTranscript && selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-hidden border-4 border-[#f2070d] shadow-2xl">
              <div className="p-6 border-b-2 border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-[#2C2C2C] uppercase tracking-wide">
                    <span className="text-[#2C2C2C]">CALL TRANSCR</span>
                    <span className="text-[#f2070d]">I</span>
                    <span className="text-[#2C2C2C]">PT</span>
                  </h3>
                  <button
                    onClick={() => setShowTranscript(false)}
                    className="px-5 py-2 border-2 border-[#2C2C2C] text-[#2C2C2C] font-bold rounded-full hover:bg-[#2C2C2C] hover:text-white transition-all"
                  >
                    CLOSE
                  </button>
                </div>
                <p className="text-sm text-gray-600 font-semibold mt-2">
                  {formatDate(selectedLog.created_at)}
                  {selectedLog.phone_number && ` • ${selectedLog.phone_number}`}
                </p>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">
                  {/* Call Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <p className="text-xs text-gray-500 font-bold uppercase">Duration</p>
                      <p className="text-lg font-black text-[#2C2C2C]">
                        {formatDuration(selectedLog.recording_duration || selectedLog.duration)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <p className="text-xs text-gray-500 font-bold uppercase">Outcome</p>
                      <p className="text-lg font-black text-[#2C2C2C] capitalize">
                        {selectedLog.outcome || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <p className="text-xs text-gray-500 font-bold uppercase">Sentiment</p>
                      <p className="text-lg font-black text-[#2C2C2C] capitalize">
                        {selectedLog.sentiment || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <p className="text-xs text-gray-500 font-bold uppercase">Direction</p>
                      <p className="text-lg font-black text-[#2C2C2C] capitalize">
                        {selectedLog.direction || 'Outbound'}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 className="font-black text-[#2C2C2C] mb-3 uppercase text-sm tracking-wide">
                      <span className="text-[#2C2C2C]">SUMMAR</span>
                      <span className="text-[#f2070d]">Y</span>
                    </h4>
                    <p className="text-gray-700 font-semibold bg-gray-50 p-4 rounded-2xl border border-gray-200">
                      {selectedLog.summary || 'No summary available'}
                    </p>
                  </div>

                  {/* Keywords */}
                  {selectedLog.keywords && selectedLog.keywords.length > 0 && (
                    <div>
                      <h4 className="font-black text-[#2C2C2C] mb-3 uppercase text-sm tracking-wide">
                        <span className="text-[#2C2C2C]">KEYWORD</span>
                        <span className="text-[#f2070d]">S</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLog.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#f2070d] text-white rounded-full text-sm font-bold"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Transcript */}
                  <div>
                    <h4 className="font-black text-[#2C2C2C] mb-3 uppercase text-sm tracking-wide">
                      <span className="text-[#2C2C2C]">FULL TRANSCR</span>
                      <span className="text-[#f2070d]">I</span>
                      <span className="text-[#2C2C2C]">PT</span>
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-semibold">
                        {selectedLog.transcript || 'No transcript available'}
                      </pre>
                    </div>
                  </div>

                  {/* Download Button */}
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => downloadTranscript(selectedLog)}
                      className="px-6 py-3 bg-[#f2070d] text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
                    >
                      <Download className="h-5 w-5" />
                      <span>DOWNLOAD TRANSCRIPT</span>
                    </button>
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