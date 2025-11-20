// // frontend/src/pages/dashboard/communication/EmailLogs.jsx - FULLY CORRECTED

// import { useState, useEffect } from 'react';
// import { emailLogsService } from '../../../services/email_logs';
// import EmailLogTable from '../../../Components/communication/EmailLogTable';
// import EmailLogDetailModal from '../../../Components/communication/EmailLogDetailModal';
// import Button from '../../../Components/ui/Button';
// import Input from '../../../Components/ui/Input';
// import { toast } from 'react-hot-toast';
// import {
//   EnvelopeIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   EyeIcon,
//   CursorArrowRaysIcon,
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

// const EmailLogs = () => {
//   const [logs, setLogs] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedLog, setSelectedLog] = useState(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
  
//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalLogs, setTotalLogs] = useState(0);
//   const pageSize = 20;
  
//   // Filters
//   const [filters, setFilters] = useState({
//     status: '',
//     search: '',
//     from_date: '',
//     to_date: '',
//     has_opened: null,
//     has_clicked: null
//   });
  
//   const [showFilters, setShowFilters] = useState(false);

//   useEffect(() => {
//     fetchEmailLogs();
//     fetchStats();
//   }, [currentPage, filters]);

//   const fetchEmailLogs = async () => {
//     try {
//       setLoading(true);
//       const skip = (currentPage - 1) * pageSize;
      
//       const response = await emailLogsService.getEmailLogs({
//         skip,
//         limit: pageSize,
//         ...filters
//       });
      
//       setLogs(response.email_logs || []);
//       setTotalLogs(response.total || 0);
//       setTotalPages(Math.ceil((response.total || 0) / pageSize));
//     } catch (error) {
//       console.error('Error fetching email logs:', error);
//       toast.error('Failed to load email logs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const response = await emailLogsService.getStats();
//       setStats(response);
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await Promise.all([fetchEmailLogs(), fetchStats()]);
//     setRefreshing(false);
//     toast.success('Email logs refreshed');
//   };

//   const handleViewDetail = async (log) => {
//     try {
//       const details = await emailLogsService.getEmailLogDetail(log._id);
//       setSelectedLog(details);
//       setShowDetailModal(true);
//     } catch (error) {
//       console.error('Error fetching email details:', error);
//       toast.error('Failed to load email details');
//     }
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//     setCurrentPage(1);
//   };

//   const handleClearFilters = () => {
//     setFilters({
//       status: '',
//       search: '',
//       from_date: '',
//       to_date: '',
//       has_opened: null,
//       has_clicked: null
//     });
//     setCurrentPage(1);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Email Logs</h1>
//           <p className="mt-1 text-sm text-gray-500">
//             View and track all emails sent to customers
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
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
//           <StatCard
//             title="Total Sent"
//             value={stats.total_sent}
//             icon={<EnvelopeIcon className="h-6 w-6" />}
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
//             title="Opened"
//             value={stats.total_opened}
//             icon={<EyeIcon className="h-6 w-6" />}
//             trend={{ value: `${stats.open_rate || 0}%`, label: 'Open rate' }}
//             color="purple"
//           />
//           <StatCard
//             title="Clicked"
//             value={stats.total_clicked}
//             icon={<CursorArrowRaysIcon className="h-6 w-6" />}
//             trend={{ value: `${stats.click_rate || 0}%`, label: 'Click rate' }}
//             color="indigo"
//           />
//           <StatCard
//             title="Failed"
//             value={stats.total_failed}
//             icon={<XCircleIcon className="h-6 w-6" />}
//             trend={{ value: stats.total_pending, label: 'Pending' }}
//             color="red"
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
//                   placeholder="Email, subject, name..."
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
//                 <option value="opened">Opened</option>
//                 <option value="clicked">Clicked</option>
//                 <option value="failed">Failed</option>
//                 <option value="pending">Pending</option>
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Engagement
//               </label>
//               <select
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 value={filters.has_opened === null ? '' : filters.has_opened.toString()}
//                 onChange={(e) => {
//                   const value = e.target.value === '' ? null : e.target.value === 'true';
//                   handleFilterChange('has_opened', value);
//                 }}
//               >
//                 <option value="">All</option>
//                 <option value="true">Opened</option>
//                 <option value="false">Not Opened</option>
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

//       {/* Email Logs Table */}
//       <div className="bg-white rounded-lg shadow">
//         {loading ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//           </div>
//         ) : logs.length === 0 ? (
//           <div className="text-center py-12">
//             <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
//             <h3 className="mt-2 text-sm font-medium text-gray-900">No emails found</h3>
//             <p className="mt-1 text-sm text-gray-500">
//               No emails match your current filters
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
//             <EmailLogTable
//               logs={logs}
//               onViewDetail={handleViewDetail}
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

//       {/* Detail Modal */}
//       {showDetailModal && selectedLog && (
//         <EmailLogDetailModal
//           log={selectedLog}
//           onClose={() => {
//             setShowDetailModal(false);
//             setSelectedLog(null);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default EmailLogs;

// frontend/src/pages/dashboard/communication/EmailLogs.jsx - ✅ CORRECTED VERSION

import { useState, useEffect } from 'react';
import { emailLogsService } from '../../../services/email_logs';
import EmailLogTable from '../../../Components/communication/EmailLogTable';
import EmailLogDetailModal from '../../../Components/communication/EmailLogDetailModal';
import EmailReplyModal from '../../../Components/communication/EmailReplyModal';
import Button from '../../../Components/ui/Button';
import Input from '../../../Components/ui/Input';
import { toast } from 'react-hot-toast';
import {
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CursorArrowRaysIcon,
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

const EmailLogs = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const pageSize = 20;
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    from_date: '',
    to_date: '',
    has_opened: null,
    has_clicked: null
  });
  
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchEmailLogs();
    fetchStats();
  }, [currentPage, filters]);

  const fetchEmailLogs = async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * pageSize;
      
      const response = await emailLogsService.getEmailLogs({
        skip,
        limit: pageSize,
        ...filters
      });
      
      setLogs(response.email_logs || []);
      setTotalLogs(response.total || 0);
      setTotalPages(Math.ceil((response.total || 0) / pageSize));
    } catch (error) {
      console.error('Error fetching email logs:', error);
      toast.error('Failed to load email logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await emailLogsService.getStats();
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchEmailLogs(), fetchStats()]);
    setRefreshing(false);
    toast.success('Email logs refreshed');
  };

  const handleViewDetail = async (log) => {
    try {
      const details = await emailLogsService.getEmailLogDetail(log._id);
      setSelectedLog(details);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching email details:', error);
      toast.error('Failed to load email details');
    }
  };

  const handleReply = (log) => {
    setSelectedLog(log);
    setShowDetailModal(false);
    setShowReplyModal(true);
  };

  const handleSendReply = async (replyData) => {
    try {
      await emailLogsService.replyToEmail(replyData);
      await fetchEmailLogs();
      return true;
    } catch (error) {
      console.error('Error sending reply:', error);
      throw error;
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      search: '',
      from_date: '',
      to_date: '',
      has_opened: null,
      has_clicked: null
    });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Logs</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and track all emails sent to customers
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            title="Total Sent"
            value={stats.total_sent}
            icon={<EnvelopeIcon className="h-6 w-6" />}
            trend={{ value: stats.today_sent, label: 'Today' }}
            color="blue"
          />
          <StatCard
            title="Delivered"
            value={stats.total_delivered}
            icon={<CheckCircleIcon className="h-6 w-6" />}
            trend={{ 
              value: stats.total_delivered > 0 
                ? `${stats.success_rate}%` 
                : '0%', 
              label: 'Success rate' 
            }}
            color="green"
          />
          <StatCard
            title="Opened"
            value={stats.total_opened}
            icon={<EyeIcon className="h-6 w-6" />}
            trend={{ 
              value: stats.total_opened > 0 
                ? `${stats.open_rate}%` 
                : '0%', 
              label: 'Open rate' 
            }}
            color="purple"
          />
          <StatCard
            title="Clicked"
            value={stats.total_clicked}
            icon={<CursorArrowRaysIcon className="h-6 w-6" />}
            trend={{ 
              value: stats.total_clicked > 0 
                ? `${stats.click_rate}%` 
                : '0%', 
              label: 'Click rate' 
            }}
            color="indigo"
          />
          <StatCard
            title="Failed"
            value={stats.total_failed}
            icon={<XCircleIcon className="h-6 w-6" />}
            trend={{ value: stats.total_pending || 0, label: 'Pending' }}
            color="red"
          />
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="sent">Sent</option>
                <option value="delivered">Delivered</option>
                <option value="opened">Opened</option>
                <option value="clicked">Clicked</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search emails..."
                  className="pl-10"
                />
              </div>
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
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="secondary" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Email Logs Table */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No emails found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No emails match your current filters
            </p>
            {(filters.status || filters.search) && (
              <div className="mt-6">
                <Button variant="secondary" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            <EmailLogTable
              logs={logs}
              onViewDetail={handleViewDetail}
              onReply={handleReply}
            />
            
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

      {showDetailModal && selectedLog && (
        <EmailLogDetailModal
          log={selectedLog}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedLog(null);
          }}
          onReply={handleReply}
        />
      )}

      {showReplyModal && selectedLog && (
        <EmailReplyModal
          originalEmail={selectedLog}
          onClose={() => {
            setShowReplyModal(false);
            setSelectedLog(null);
          }}
          onReplySent={handleSendReply}
        />
      )}
    </div>
  );
};

export default EmailLogs;