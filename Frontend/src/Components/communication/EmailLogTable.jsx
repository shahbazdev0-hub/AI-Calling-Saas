// // frontend/src/components/communication/EmailLogTable.jsx - CORRECTED

// import Button from "../../Components/ui/Button";
// import {
//   EyeIcon,
//   EnvelopeIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   CursorArrowRaysIcon
// } from '@heroicons/react/24/outline';

// // Simple Badge Component (inline since it's not imported)
// const Badge = ({ variant, children }) => {
//   const variantClasses = {
//     info: 'bg-blue-100 text-blue-800',
//     success: 'bg-green-100 text-green-800',
//     danger: 'bg-red-100 text-red-800',
//     warning: 'bg-yellow-100 text-yellow-800',
//     secondary: 'bg-gray-100 text-gray-800'
//   };

//   return (
//     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant] || variantClasses.secondary}`}>
//       {children}
//     </span>
//   );
// };

// const EmailLogTable = ({ logs, onViewDetail }) => {
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     }).format(date);
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       sent: { variant: 'info', label: 'Sent' },
//       delivered: { variant: 'success', label: 'Delivered' },
//       opened: { variant: 'success', label: 'Opened' },
//       clicked: { variant: 'success', label: 'Clicked' },
//       failed: { variant: 'danger', label: 'Failed' },
//       pending: { variant: 'warning', label: 'Pending' }
//     };

//     const config = statusConfig[status] || { variant: 'secondary', label: status };
//     return <Badge variant={config.variant}>{config.label}</Badge>;
//   };

//   const truncateText = (text, maxLength = 60) => {
//     if (!text) return '';
//     return text.length > maxLength 
//       ? `${text.substring(0, maxLength)}...` 
//       : text;
//   };

//   const getEngagementIcons = (log) => {
//     const icons = [];
    
//     if (log.opened_count > 0) {
//       icons.push(
//         <div key="opened" className="flex items-center text-blue-600" title="Email opened">
//           <EyeIcon className="h-4 w-4 mr-1" />
//           <span className="text-xs">{log.opened_count}</span>
//         </div>
//       );
//     }
    
//     if (log.clicked_count > 0) {
//       icons.push(
//         <div key="clicked" className="flex items-center text-green-600" title="Links clicked">
//           <CursorArrowRaysIcon className="h-4 w-4 mr-1" />
//           <span className="text-xs">{log.clicked_count}</span>
//         </div>
//       );
//     }
    
//     return icons;
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Recipient
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Subject
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Status
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Engagement
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Sent Date
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {logs.map((log) => (
//             <tr key={log._id} className="hover:bg-gray-50 transition-colors">
//               <td className="px-6 py-4">
//                 <div className="flex items-start">
//                   <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
//                   <div>
//                     <div className="text-sm font-medium text-gray-900">
//                       {log.recipient_name || 'Unknown'}
//                     </div>
//                     <div className="text-sm text-gray-500">{log.to_email}</div>
//                     {log.recipient_phone && (
//                       <div className="text-xs text-gray-400 mt-1">
//                         {log.recipient_phone}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </td>
//               <td className="px-6 py-4">
//                 <div className="text-sm text-gray-900 max-w-xs">
//                   {truncateText(log.subject)}
//                 </div>
//                 {log.campaign_id && (
//                   <div className="text-xs text-gray-500 mt-1">
//                     Campaign
//                   </div>
//                 )}
//                 {log.appointment_id && (
//                   <div className="text-xs text-blue-600 mt-1">
//                     Appointment Confirmation
//                   </div>
//                 )}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 {getStatusBadge(log.status)}
//                 {log.error_message && (
//                   <div className="mt-1">
//                     <span className="text-xs text-red-600" title={log.error_message}>
//                       Error
//                     </span>
//                   </div>
//                 )}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="flex items-center space-x-3">
//                   {getEngagementIcons(log)}
//                   {log.opened_count === 0 && log.clicked_count === 0 && (
//                     <span className="text-xs text-gray-400">No activity</span>
//                   )}
//                 </div>
//                 {log.opened_at && (
//                   <div className="text-xs text-gray-500 mt-1">
//                     Last opened: {formatDate(log.opened_at)}
//                   </div>
//                 )}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="text-sm text-gray-900">
//                   {formatDate(log.created_at)}
//                 </div>
//                 {log.sent_at && log.sent_at !== log.created_at && (
//                   <div className="text-xs text-gray-500">
//                     Sent: {formatDate(log.sent_at)}
//                   </div>
//                 )}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <Button
//                   variant="secondary"
//                   size="sm"
//                   onClick={() => onViewDetail(log)}
//                   title="View full email"
//                 >
//                   <EyeIcon className="h-4 w-4 mr-1" />
//                   View
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default EmailLogTable;

// frontend/src/Components/communication/EmailLogTable.jsx - âœ… ADD QUICK REPLY BUTTON

import { EyeIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import Badge from '../ui/Badge';

const EmailLogTable = ({ logs, onViewDetail, onReply }) => {  // âœ… Add onReply prop
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      sent: { variant: 'info', label: 'Sent' },
      delivered: { variant: 'success', label: 'Delivered' },
      opened: { variant: 'success', label: 'Opened' },
      clicked: { variant: 'success', label: 'Clicked' },
      failed: { variant: 'danger', label: 'Failed' },
      pending: { variant: 'warning', label: 'Pending' }
    };

    const config = statusConfig[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recipient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subject
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Engagement
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sent Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {log.recipient_name || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500">{log.to_email}</div>
                    {log.recipient_phone && (
                      <div className="text-xs text-gray-400">{log.recipient_phone}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs truncate">
                  {log.subject}
                </div>
                {log.content_preview && (
                  <div className="text-xs text-gray-500 max-w-xs truncate">
                    {log.content_preview}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(log.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-3 text-xs">
                  {log.opened_count > 0 && (
                    <span className="text-purple-600 font-medium">
                      👁️ {log.opened_count}
                    </span>
                  )}
                  {log.clicked_count > 0 && (
                    <span className="text-indigo-600 font-medium">
                      🖱️ {log.clicked_count}
                    </span>
                  )}
                  {log.reply_count > 0 && (
                    <span className="text-green-600 font-medium">
                      ↩️ {log.reply_count}
                    </span>
                  )}
                  {log.opened_count === 0 && log.clicked_count === 0 && log.reply_count === 0 && (
                    <span className="text-gray-400">No activity</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(log.sent_at || log.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  {/* âœ… NEW - Quick Reply Button */}
                  {onReply && (
                    <button
                      onClick={() => onReply(log)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                      title="Reply"
                    >
                      <ArrowUturnLeftIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => onViewDetail(log)}
                    className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                    title="View Details"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmailLogTable;