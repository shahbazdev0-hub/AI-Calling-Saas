// // frontend/src/pages/dashboard/communication/SMSLogs.jsx - FULLY CORRECTED

// import { useState, useEffect } from 'react';
// import { smsLogsService } from '../../../services/sms_logs';
// import SMSLogTable from '../../../Components/communication/SMSLogTable';
// import SMSReplyModal from '../../../Components/communication/SMSReplyModal';
// import Input from "../../../Components/ui/Input";
// import Button from "../../../Components/ui/Button";
// import { toast } from 'react-hot-toast';
// import {
//   PhoneIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   ClockIcon,
//   FunnelIcon,
//   MagnifyingGlassIcon,
//   ArrowPathIcon
// } from '@heroicons/react/24/outline';

// // Simple StatCard Component (inline)
// const StatCard = ({ title, value, icon, trend, color }) => {
//   const colorClasses = {
//     blue: 'bg-blue-500',
//     green: 'bg-green-500',
//     red: 'bg-red-500',
//     purple: 'bg-purple-500',
//     indigo: 'bg-indigo-500'
//   };

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="mt-2 text-3xl font-semibold text-gray-900">{value || 0}</p>
//           {trend && (
//             <p className="mt-2 text-sm text-gray-500">
//               <span className="font-medium">{trend.value || 0}</span> {trend.label}
//             </p>
//           )}
//         </div>
//         <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.blue} text-white`}>
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// };

// const SMSLogs = () => {
//   const [logs, setLogs] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedLog, setSelectedLog] = useState(null);
//   const [showReplyModal, setShowReplyModal] = useState(false);
  
//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalLogs, setTotalLogs] = useState(0);
//   const pageSize = 20;
  
//   // Filters
//   const [filters, setFilters] = useState({
//     status: '',
//     direction: '',
//     search: '',
//     from_date: '',
//     to_date: ''
//   });
  
//   const [showFilters, setShowFilters] = useState(false);

//   useEffect(() => {
//     fetchSMSLogs();
//     fetchStats();
//   }, [currentPage, filters]);

//   const fetchSMSLogs = async () => {
//     try {
//       setLoading(true);
//       const skip = (currentPage - 1) * pageSize;
      
//       const response = await smsLogsService.getSMSLogs({
//         skip,
//         limit: pageSize,
//         ...filters
//       });
      
//       setLogs(response.sms_logs || []);
//       setTotalLogs(response.total || 0);
//       setTotalPages(Math.ceil((response.total || 0) / pageSize));
//     } catch (error) {
//       console.error('Error fetching SMS logs:', error);
//       toast.error('Failed to load SMS logs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const response = await smsLogsService.getStats();
//       setStats(response);
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await Promise.all([fetchSMSLogs(), fetchStats()]);
//     setRefreshing(false);
//     toast.success('SMS logs refreshed');
//   };

//   const handleReply = (log) => {
//     setSelectedLog(log);
//     setShowReplyModal(true);
//   };

//   const handleReplySuccess = async () => {
//     setShowReplyModal(false);
//     setSelectedLog(null);
//     await fetchSMSLogs();
//     toast.success('Reply sent successfully');
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//     setCurrentPage(1);
//   };

//   const handleClearFilters = () => {
//     setFilters({
//       status: '',
//       direction: '',
//       search: '',
//       from_date: '',
//       to_date: ''
//     });
//     setCurrentPage(1);
//   };

//   const handleViewDetails = async (log) => {
//     try {
//       const details = await smsLogsService.getSMSLogDetail(log._id);
//       setSelectedLog(details);
//     } catch (error) {
//       console.error('Error fetching SMS details:', error);
//       toast.error('Failed to load SMS details');
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">SMS Logs</h1>
//           <p className="mt-1 text-sm text-gray-500">
//             View and manage all SMS messages sent and received
//           </p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <Button
//             variant="secondary"
//             size="sm"
//             onClick={handleRefresh}
//             disabled={refreshing}
//           >
//             <ArrowPathIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
//             Refresh
//           </Button>
//           <Button
//             variant="secondary"
//             size="sm"
//             onClick={() => setShowFilters(!showFilters)}
//           >
//             <FunnelIcon className="h-4 w-4 mr-2" />
//             Filters
//           </Button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       {stats && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard
//             title="Total Sent"
//             value={stats.total_sent}
//             icon={<PhoneIcon className="h-6 w-6" />}
//             trend={{ value: stats.today_sent, label: 'Today' }}
//             color="blue"
//           />
//           <StatCard
//             title="Delivered"
//             value={stats.total_delivered}
//             icon={<CheckCircleIcon className="h-6 w-6" />}
//             trend={{ 
//               value: stats.total_delivered > 0 
//                 ? `${((stats.total_delivered / stats.total_sent) * 100).toFixed(1)}%` 
//                 : '0%', 
//               label: 'Success rate' 
//             }}
//             color="green"
//           />
//           <StatCard
//             title="Failed"
//             value={stats.total_failed}
//             icon={<XCircleIcon className="h-6 w-6" />}
//             trend={{ value: stats.total_pending, label: 'Pending' }}
//             color="red"
//           />
//           <StatCard
//             title="This Month"
//             value={stats.this_month_sent}
//             icon={<ClockIcon className="h-6 w-6" />}
//             trend={{ value: stats.this_week_sent, label: 'This week' }}
//             color="purple"
//           />
//         </div>
//       )}

//       {/* Filters Section */}
//       {showFilters && (
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Search
//               </label>
//               <div className="relative">
//                 <Input
//                   type="text"
//                   placeholder="Phone number, message, name..."
//                   value={filters.search}
//                   onChange={(e) => handleFilterChange('search', e.target.value)}
//                   className="pl-10"
//                 />
//                 <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//               </div>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Status
//               </label>
//               <select
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 value={filters.status}
//                 onChange={(e) => handleFilterChange('status', e.target.value)}
//               >
//                 <option value="">All Statuses</option>
//                 <option value="sent">Sent</option>
//                 <option value="delivered">Delivered</option>
//                 <option value="failed">Failed</option>
//                 <option value="pending">Pending</option>
//                 <option value="received">Received</option>
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Direction
//               </label>
//               <select
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 value={filters.direction}
//                 onChange={(e) => handleFilterChange('direction', e.target.value)}
//               >
//                 <option value="">All Directions</option>
//                 <option value="outbound">Outbound</option>
//                 <option value="inbound">Inbound</option>
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 From Date
//               </label>
//               <Input
//                 type="datetime-local"
//                 value={filters.from_date}
//                 onChange={(e) => handleFilterChange('from_date', e.target.value)}
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 To Date
//               </label>
//               <Input
//                 type="datetime-local"
//                 value={filters.to_date}
//                 onChange={(e) => handleFilterChange('to_date', e.target.value)}
//               />
//             </div>
            
//             <div className="flex items-end">
//               <Button
//                 variant="secondary"
//                 onClick={handleClearFilters}
//                 className="w-full"
//               >
//                 Clear Filters
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* SMS Logs Table */}
//       <div className="bg-white rounded-lg shadow">
//         {loading ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//           </div>
//         ) : logs.length === 0 ? (
//           <div className="text-center py-12">
//             <PhoneIcon className="mx-auto h-12 w-12 text-gray-400" />
//             <h3 className="mt-2 text-sm font-medium text-gray-900">No SMS messages found</h3>
//             <p className="mt-1 text-sm text-gray-500">
//               No SMS messages match your current filters
//             </p>
//             {(filters.status || filters.search) && (
//               <div className="mt-6">
//                 <Button variant="secondary" onClick={handleClearFilters}>
//                   Clear Filters
//                 </Button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <>
//             <SMSLogTable
//               logs={logs}
//               onReply={handleReply}
//               onViewDetails={handleViewDetails}
//             />
            
//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="px-6 py-4 border-t border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div className="text-sm text-gray-700">
//                     Showing {((currentPage - 1) * pageSize) + 1} to{' '}
//                     {Math.min(currentPage * pageSize, totalLogs)} of {totalLogs} results
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Button
//                       variant="secondary"
//                       size="sm"
//                       onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                       disabled={currentPage === 1}
//                     >
//                       Previous
//                     </Button>
//                     <span className="text-sm text-gray-700">
//                       Page {currentPage} of {totalPages}
//                     </span>
//                     <Button
//                       variant="secondary"
//                       size="sm"
//                       onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                       disabled={currentPage === totalPages}
//                     >
//                       Next
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Reply Modal */}
//       {showReplyModal && selectedLog && (
//         <SMSReplyModal
//           log={selectedLog}
//           onClose={() => {
//             setShowReplyModal(false);
//             setSelectedLog(null);
//           }}
//           onSuccess={handleReplySuccess}
//         />
//       )}
//     </div>
//   );
// };

// export default SMSLogs;

// // frontend/src/pages/dashboard/communication/SMSLogs.jsx - WITH AUTO-REFRESH POLLING

// import { useState, useEffect } from 'react';
// import { smsLogsService } from '../../../services/sms_logs';
// import SMSLogTable from '../../../Components/communication/SMSLogTable';
// import SMSReplyModal from '../../../Components/communication/SMSReplyModal';
// import Input from "../../../Components/ui/Input";
// import Button from "../../../Components/ui/Button";
// import { toast } from 'react-hot-toast';
// import {
//   PhoneIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   ClockIcon,
//   FunnelIcon,
//   MagnifyingGlassIcon,
//   ArrowPathIcon
// } from '@heroicons/react/24/outline';

// // Simple StatCard Component (inline)
// const StatCard = ({ title, value, icon, trend, color }) => {
//   const colorClasses = {
//     blue: 'bg-blue-500',
//     green: 'bg-green-500',
//     red: 'bg-red-500',
//     purple: 'bg-purple-500',
//     indigo: 'bg-indigo-500'
//   };

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="mt-2 text-3xl font-semibold text-gray-900">{value || 0}</p>
//           {trend && (
//             <p className="mt-2 text-sm text-gray-500">
//               <span className="font-medium">{trend.value || 0}</span> {trend.label}
//             </p>
//           )}
//         </div>
//         <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.blue} text-white`}>
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// };

// const SMSLogs = () => {
//   const [logs, setLogs] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedLog, setSelectedLog] = useState(null);
//   const [showReplyModal, setShowReplyModal] = useState(false);
  
//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalLogs, setTotalLogs] = useState(0);
//   const pageSize = 20;
  
//   // Filters
//   const [filters, setFilters] = useState({
//     status: '',
//     direction: '',
//     search: '',
//     from_date: '',
//     to_date: ''
//   });
  
//   const [showFilters, setShowFilters] = useState(false);

//   // Initial fetch on mount and when filters/page change
//   useEffect(() => {
//     fetchSMSLogs();
//     fetchStats();
//   }, [currentPage, filters]);

//   // ✅ NEW: Auto-refresh polling for real-time SMS updates
//   useEffect(() => {
//     // Set up polling interval to check for new messages every 5 seconds
//     const pollInterval = setInterval(() => {
//       // Silently fetch without showing loading state
//       fetchSMSLogs(true);
//       fetchStats(true);
//     }, 5000); // Poll every 5 seconds

//     // Cleanup interval on unmount
//     return () => clearInterval(pollInterval);
//   }, [currentPage, filters]); // Re-setup polling when page or filters change

//   const fetchSMSLogs = async (silent = false) => {
//     try {
//       if (!silent) setLoading(true);
//       const skip = (currentPage - 1) * pageSize;
      
//       const response = await smsLogsService.getSMSLogs({
//         skip,
//         limit: pageSize,
//         ...filters
//       });
      
//       setLogs(response.sms_logs || []);
//       setTotalLogs(response.total || 0);
//       setTotalPages(Math.ceil((response.total || 0) / pageSize));
//     } catch (error) {
//       console.error('Error fetching SMS logs:', error);
//       if (!silent) toast.error('Failed to load SMS logs');
//     } finally {
//       if (!silent) setLoading(false);
//     }
//   };

//   const fetchStats = async (silent = false) => {
//     try {
//       const response = await smsLogsService.getStats();
//       setStats(response);
//     } catch (error) {
//       if (!silent) console.error('Error fetching stats:', error);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await Promise.all([fetchSMSLogs(), fetchStats()]);
//     setRefreshing(false);
//     toast.success('SMS logs refreshed');
//   };

//   const handleReply = (log) => {
//     setSelectedLog(log);
//     setShowReplyModal(true);
//   };

//   const handleReplySuccess = async () => {
//     setShowReplyModal(false);
//     setSelectedLog(null);
//     await fetchSMSLogs();
//     toast.success('Reply sent successfully');
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//     setCurrentPage(1);
//   };

//   const handleClearFilters = () => {
//     setFilters({
//       status: '',
//       direction: '',
//       search: '',
//       from_date: '',
//       to_date: ''
//     });
//     setCurrentPage(1);
//   };

//   const handleViewDetails = async (log) => {
//     try {
//       const details = await smsLogsService.getSMSLogDetail(log._id);
//       setSelectedLog(details);
//     } catch (error) {
//       console.error('Error fetching SMS details:', error);
//       toast.error('Failed to load SMS details');
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">SMS Logs</h1>
//           <p className="mt-1 text-sm text-gray-500">
//             View and manage all SMS messages sent and received
//           </p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <Button
//             variant="secondary"
//             size="sm"
//             onClick={handleRefresh}
//             disabled={refreshing}
//           >
//             <ArrowPathIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
//             Refresh
//           </Button>
//           <Button
//             variant="secondary"
//             size="sm"
//             onClick={() => setShowFilters(!showFilters)}
//           >
//             <FunnelIcon className="h-4 w-4 mr-2" />
//             Filters
//           </Button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       {stats && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard
//             title="Total Sent"
//             value={stats.total_sent}
//             icon={<PhoneIcon className="h-6 w-6" />}
//             trend={{ value: stats.today_sent, label: 'Today' }}
//             color="blue"
//           />
//           <StatCard
//             title="Delivered"
//             value={stats.total_delivered}
//             icon={<CheckCircleIcon className="h-6 w-6" />}
//             trend={{ 
//               value: stats.total_delivered > 0 
//                 ? `${((stats.total_delivered / stats.total_sent) * 100).toFixed(1)}%` 
//                 : '0%', 
//               label: 'Success rate' 
//             }}
//             color="green"
//           />
//           <StatCard
//             title="Failed"
//             value={stats.total_failed}
//             icon={<XCircleIcon className="h-6 w-6" />}
//             trend={{ value: stats.total_pending, label: 'Pending' }}
//             color="red"
//           />
//           <StatCard
//             title="This Month"
//             value={stats.this_month_sent}
//             icon={<ClockIcon className="h-6 w-6" />}
//             trend={{ value: stats.this_week_sent, label: 'This week' }}
//             color="purple"
//           />
//         </div>
//       )}

//       {/* Filters Section */}
//       {showFilters && (
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Search
//               </label>
//               <div className="relative">
//                 <Input
//                   type="text"
//                   placeholder="Phone number, message, name..."
//                   value={filters.search}
//                   onChange={(e) => handleFilterChange('search', e.target.value)}
//                   className="pl-10"
//                 />
//                 <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//               </div>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Status
//               </label>
//               <select
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 value={filters.status}
//                 onChange={(e) => handleFilterChange('status', e.target.value)}
//               >
//                 <option value="">All Statuses</option>
//                 <option value="sent">Sent</option>
//                 <option value="delivered">Delivered</option>
//                 <option value="failed">Failed</option>
//                 <option value="pending">Pending</option>
//                 <option value="received">Received</option>
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Direction
//               </label>
//               <select
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 value={filters.direction}
//                 onChange={(e) => handleFilterChange('direction', e.target.value)}
//               >
//                 <option value="">All Directions</option>
//                 <option value="inbound">Inbound</option>
//                 <option value="outbound">Outbound</option>
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 From Date
//               </label>
//               <Input
//                 type="date"
//                 value={filters.from_date}
//                 onChange={(e) => handleFilterChange('from_date', e.target.value)}
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 To Date
//               </label>
//               <Input
//                 type="date"
//                 value={filters.to_date}
//                 onChange={(e) => handleFilterChange('to_date', e.target.value)}
//               />
//             </div>
            
//             <div className="flex items-end">
//               <Button
//                 variant="secondary"
//                 onClick={handleClearFilters}
//                 className="w-full"
//               >
//                 Clear Filters
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* SMS Logs Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         {loading ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//           </div>
//         ) : logs.length === 0 ? (
//           <div className="text-center py-12">
//             <PhoneIcon className="mx-auto h-12 w-12 text-gray-400" />
//             <h3 className="mt-2 text-sm font-medium text-gray-900">No SMS found</h3>
//             <p className="mt-1 text-sm text-gray-500">
//               No SMS messages match your current filters
//             </p>
//             {(filters.status || filters.search || filters.direction) && (
//               <div className="mt-6">
//                 <Button variant="secondary" onClick={handleClearFilters}>
//                   Clear Filters
//                 </Button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <>
//             <SMSLogTable
//               logs={logs}
//               onViewDetails={handleViewDetails}
//               onReply={handleReply}
//             />
            
//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="px-6 py-4 border-t border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div className="text-sm text-gray-700">
//                     Showing {((currentPage - 1) * pageSize) + 1} to{' '}
//                     {Math.min(currentPage * pageSize, totalLogs)} of {totalLogs} results
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Button
//                       variant="secondary"
//                       size="sm"
//                       onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                       disabled={currentPage === 1}
//                     >
//                       Previous
//                     </Button>
//                     <span className="text-sm text-gray-700">
//                       Page {currentPage} of {totalPages}
//                     </span>
//                     <Button
//                       variant="secondary"
//                       size="sm"
//                       onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                       disabled={currentPage === totalPages}
//                     >
//                       Next
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Reply Modal */}
//       {showReplyModal && selectedLog && (
//         <SMSReplyModal
//           log={selectedLog}
//           onClose={() => {
//             setShowReplyModal(false);
//             setSelectedLog(null);
//           }}
//           onSuccess={handleReplySuccess}
//         />
//       )}
//     </div>
//   );
// };

// export default SMSLogs;

// frontend/src/pages/dashboard/communication/SMSLogs.jsx - WITH AUTO-REFRESH & DEBUG LOGGING

import { useState, useEffect } from 'react';
import { smsLogsService } from '../../../services/sms_logs';
import SMSLogTable from '../../../Components/communication/SMSLogTable';
import SMSReplyModal from '../../../Components/communication/SMSReplyModal';
import Input from "../../../Components/ui/Input";
import Button from "../../../Components/ui/Button";
import { toast } from 'react-hot-toast';
import {
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Simple StatCard Component (inline)
const StatCard = ({ title, value, icon, trend, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value || 0}</p>
          {trend && (
            <p className="mt-2 text-sm text-gray-500">
              <span className="font-medium">{trend.value || 0}</span> {trend.label}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.blue} text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const SMSLogs = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const pageSize = 20;
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    direction: '',
    search: '',
    from_date: '',
    to_date: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);

  // Initial fetch on mount and when filters/page change
  useEffect(() => {
    fetchSMSLogs();
    fetchStats();
  }, [currentPage, filters]);

  // ✅ NEW: Auto-refresh polling for real-time SMS updates
  useEffect(() => {
    // Set up polling interval to check for new messages every 5 seconds
    const pollInterval = setInterval(() => {
      // Silently fetch without showing loading state
      fetchSMSLogs(true);
      fetchStats(true);
    }, 5000); // Poll every 5 seconds

    // Cleanup interval on unmount
    return () => clearInterval(pollInterval);
  }, [currentPage, filters]); // Re-setup polling when page or filters change

  const fetchSMSLogs = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const skip = (currentPage - 1) * pageSize;
      
      // ✅ DEBUG LOG - Check what we're requesting
      console.log('🔍 Fetching SMS logs with params:', {
        skip,
        limit: pageSize,
        ...filters
      });
      
      const response = await smsLogsService.getSMSLogs({
        skip,
        limit: pageSize,
        ...filters
      });
      
      // ✅ DEBUG LOG - Check what we received
      console.log('📨 SMS Logs Response:', {
        total: response.total,
        logs_count: response.sms_logs?.length,
        first_log: response.sms_logs?.[0],
        inbound_count: response.sms_logs?.filter(log => log.direction === 'inbound').length,
        outbound_count: response.sms_logs?.filter(log => log.direction === 'outbound').length
      });
      
      setLogs(response.sms_logs || []);
      setTotalLogs(response.total || 0);
      setTotalPages(Math.ceil((response.total || 0) / pageSize));
    } catch (error) {
      console.error('Error fetching SMS logs:', error);
      if (!silent) toast.error('Failed to load SMS logs');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchStats = async (silent = false) => {
    try {
      const response = await smsLogsService.getStats();
      setStats(response);
    } catch (error) {
      if (!silent) console.error('Error fetching stats:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchSMSLogs(), fetchStats()]);
    setRefreshing(false);
    toast.success('SMS logs refreshed');
  };

  const handleReply = (log) => {
    setSelectedLog(log);
    setShowReplyModal(true);
  };

  const handleReplySuccess = async () => {
    setShowReplyModal(false);
    setSelectedLog(null);
    await fetchSMSLogs();
    toast.success('Reply sent successfully');
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      direction: '',
      search: '',
      from_date: '',
      to_date: ''
    });
    setCurrentPage(1);
  };

  const handleViewDetails = async (log) => {
    try {
      const details = await smsLogsService.getSMSLogDetail(log._id);
      setSelectedLog(details);
    } catch (error) {
      console.error('Error fetching SMS details:', error);
      toast.error('Failed to load SMS details');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SMS Logs</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all SMS messages sent and received
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Sent"
            value={stats.total_sent}
            icon={<PhoneIcon className="h-6 w-6" />}
            trend={{ value: stats.today_sent, label: 'Today' }}
            color="blue"
          />
          <StatCard
            title="Delivered"
            value={stats.total_delivered}
            icon={<CheckCircleIcon className="h-6 w-6" />}
            trend={{ 
              value: stats.total_delivered > 0 
                ? `${((stats.total_delivered / stats.total_sent) * 100).toFixed(1)}%` 
                : '0%', 
              label: 'Success rate' 
            }}
            color="green"
          />
          <StatCard
            title="Failed"
            value={stats.total_failed}
            icon={<XCircleIcon className="h-6 w-6" />}
            trend={{ value: stats.total_pending, label: 'Pending' }}
            color="red"
          />
          <StatCard
            title="This Month"
            value={stats.this_month_sent}
            icon={<ClockIcon className="h-6 w-6" />}
            trend={{ value: stats.this_week_sent, label: 'This week' }}
            color="purple"
          />
        </div>
      )}

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Phone number, message, name..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="sent">Sent</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
                <option value="received">Received</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Direction
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.direction}
                onChange={(e) => handleFilterChange('direction', e.target.value)}
              >
                <option value="">All Directions</option>
                <option value="inbound">Inbound</option>
                <option value="outbound">Outbound</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <Input
                type="date"
                value={filters.from_date}
                onChange={(e) => handleFilterChange('from_date', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <Input
                type="date"
                value={filters.to_date}
                onChange={(e) => handleFilterChange('to_date', e.target.value)}
              />
            </div>
            
            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={handleClearFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SMS Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <PhoneIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No SMS found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No SMS messages match your current filters
            </p>
            {(filters.status || filters.search || filters.direction) && (
              <div className="mt-6">
                <Button variant="secondary" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            <SMSLogTable
              logs={logs}
              onViewDetails={handleViewDetails}
              onReply={handleReply}
            />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * pageSize) + 1} to{' '}
                    {Math.min(currentPage * pageSize, totalLogs)} of {totalLogs} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedLog && (
        <SMSReplyModal
          log={selectedLog}
          onClose={() => {
            setShowReplyModal(false);
            setSelectedLog(null);
          }}
          onSuccess={handleReplySuccess}
        />
      )}
    </div>
  );
};

export default SMSLogs;
