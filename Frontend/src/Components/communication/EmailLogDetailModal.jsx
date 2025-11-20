// // frontend/src/components/communication/EmailLogDetailModal.jsx - NEW FILE

// import Modal from '../ui/Modal';
//  import Badge from '../ui/Badge';
// import {
//   EnvelopeIcon,
//   ClockIcon,
//   EyeIcon,
//   CursorArrowRaysIcon,
//   CheckCircleIcon,
//   XCircleIcon
// } from '@heroicons/react/24/outline';

// const EmailLogDetailModal = ({ log, onClose }) => {
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat('en-US', {
//       month: 'long',
//       day: 'numeric',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
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

//   return (
//     <Modal
//       isOpen={true}
//       onClose={onClose}
//       title="Email Details"
//       size="xl"
//     >
//       <div className="space-y-6">
//         {/* Header Information */}
//         <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="text-xs font-medium text-gray-500 uppercase">
//                 Recipient
//               </label>
//               <div className="mt-1">
//                 <div className="text-sm font-medium text-gray-900">
//                   {log.recipient_name || 'Unknown'}
//                 </div>
//                 <div className="text-sm text-gray-600">{log.to_email}</div>
//                 {log.recipient_phone && (
//                   <div className="text-xs text-gray-500 mt-1">
//                     {log.recipient_phone}
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             <div>
//               <label className="text-xs font-medium text-gray-500 uppercase">
//                 From
//               </label>
//               <div className="mt-1">
//                 <div className="text-sm text-gray-600">{log.from_email}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Subject */}
//         <div>
//           <label className="text-xs font-medium text-gray-500 uppercase">
//             Subject
//           </label>
//           <div className="mt-1 text-sm text-gray-900 font-medium">
//             {log.subject}
//           </div>
//         </div>

//         {/* Status and Timeline */}
//         <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
//           <div className="flex items-center justify-between mb-4">
//             <h4 className="text-sm font-medium text-gray-900">Status & Timeline</h4>
//             {getStatusBadge(log.status)}
//           </div>
          
//           <div className="space-y-3">
//             <div className="flex items-start">
//               <ClockIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
//               <div>
//                 <div className="text-sm font-medium text-gray-900">Created</div>
//                 <div className="text-sm text-gray-600">{formatDate(log.created_at)}</div>
//               </div>
//             </div>
            
//             {log.sent_at && (
//               <div className="flex items-start">
//                 <EnvelopeIcon className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-900">Sent</div>
//                   <div className="text-sm text-gray-600">{formatDate(log.sent_at)}</div>
//                 </div>
//               </div>
//             )}
            
//             {log.delivered_at && (
//               <div className="flex items-start">
//                 <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-900">Delivered</div>
//                   <div className="text-sm text-gray-600">{formatDate(log.delivered_at)}</div>
//                 </div>
//               </div>
//             )}
            
//             {log.opened_at && (
//               <div className="flex items-start">
//                 <EyeIcon className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-900">
//                     Opened ({log.opened_count} {log.opened_count === 1 ? 'time' : 'times'})
//                   </div>
//                   <div className="text-sm text-gray-600">Last: {formatDate(log.opened_at)}</div>
//                 </div>
//               </div>
//             )}
            
//             {log.clicked_at && log.clicked_count > 0 && (
//               <div className="flex items-start">
//                 <CursorArrowRaysIcon className="h-5 w-5 text-indigo-600 mr-3 mt-0.5" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-900">
//                     Clicked ({log.clicked_count} {log.clicked_count === 1 ? 'time' : 'times'})
//                   </div>
//                   <div className="text-sm text-gray-600">Last: {formatDate(log.clicked_at)}</div>
//                 </div>
//               </div>
//             )}

//             {log.error_message && (
//               <div className="flex items-start">
//                 <XCircleIcon className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
//                 <div>
//                   <div className="text-sm font-medium text-red-900">Error</div>
//                   <div className="text-sm text-red-600">{log.error_message}</div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Clicked Links */}
//         {log.clicked_links && log.clicked_links.length > 0 && (
//           <div>
//             <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">
//               Clicked Links
//             </label>
//             <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//               <ul className="space-y-2">
//                 {log.clicked_links.map((link, index) => (
//                   <li key={index} className="text-sm text-blue-600 break-all">
//                     {link}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}

//         {/* Context Information */}
//         {(log.campaign_id || log.automation_id || log.call_id || log.appointment_id) && (
//           <div>
//             <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">
//               Context
//             </label>
//             <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 space-y-2">
//               {log.campaign_id && (
//                 <div className="text-sm">
//                   <span className="font-medium">Campaign ID:</span>{' '}
//                   <span className="text-gray-600">{log.campaign_id}</span>
//                 </div>
//               )}
//               {log.automation_id && (
//                 <div className="text-sm">
//                   <span className="font-medium">Automation ID:</span>{' '}
//                   <span className="text-gray-600">{log.automation_id}</span>
//                 </div>
//               )}
//               {log.call_id && (
//                 <div className="text-sm">
//                   <span className="font-medium">Call ID:</span>{' '}
//                   <span className="text-gray-600">{log.call_id}</span>
//                 </div>
//               )}
//               {log.appointment_id && (
//                 <div className="text-sm">
//                   <span className="font-medium">Appointment ID:</span>{' '}
//                   <span className="text-gray-600">{log.appointment_id}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Email Content Preview */}
//         <div>
//           <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">
//             Email Content
//           </label>
//           <div className="bg-white rounded-lg border border-gray-300 p-4 max-h-96 overflow-y-auto">
//             {log.content ? (
//               <div
//                 className="prose prose-sm max-w-none"
//                 dangerouslySetInnerHTML={{ __html: log.content }}
//               />
//             ) : log.text_content ? (
//               <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
//                 {log.text_content}
//               </pre>
//             ) : (
//               <div className="text-sm text-gray-500 italic">
//                 No content available
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Technical Details */}
//         {log.smtp_message_id && (
//           <div>
//             <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">
//               Technical Details
//             </label>
//             <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//               <div className="text-xs text-gray-600 break-all">
//                 <span className="font-medium">Message ID:</span> {log.smtp_message_id}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </Modal>
//   );
// };

// export default EmailLogDetailModal;
// frontend/src/Components/communication/EmailLogDetailModal.jsx - âœ… UPDATED WITH REPLY BUTTON

import { useState } from 'react';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import {
  EnvelopeIcon,
  ClockIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUturnLeftIcon  // NEW
} from '@heroicons/react/24/outline';

const EmailLogDetailModal = ({ log, onClose, onReply }) => {  // âœ… NEW: onReply prop
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
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
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Email Details"
      size="xl"
    >
      <div className="space-y-6">
        {/* Header Information */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">
                Recipient
              </label>
              <div className="mt-1">
                <div className="text-sm font-medium text-gray-900">
                  {log.recipient_name || 'Unknown'}
                </div>
                <div className="text-sm text-gray-600">{log.to_email}</div>
                {log.recipient_phone && (
                  <div className="text-xs text-gray-500 mt-1">
                    {log.recipient_phone}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">
                From
              </label>
              <div className="mt-1">
                <div className="text-sm text-gray-600">{log.from_email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">
            Subject
          </label>
          <div className="mt-1 text-sm text-gray-900 font-medium">
            {log.subject}
          </div>
        </div>

        {/* âœ… NEW - Reply Button */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onReply(log)}
          >
            <ArrowUturnLeftIcon className="h-4 w-4 mr-2" />
            Reply to this Email
          </Button>
        </div>

        {/* Status and Timeline */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">Status & Timeline</h4>
            {getStatusBadge(log.status)}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <ClockIcon className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">Created</div>
                <div className="text-sm text-gray-600">{formatDate(log.created_at)}</div>
              </div>
            </div>
            
            {log.sent_at && (
              <div className="flex items-start">
                <EnvelopeIcon className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Sent</div>
                  <div className="text-sm text-gray-600">{formatDate(log.sent_at)}</div>
                </div>
              </div>
            )}
            
            {log.delivered_at && (
              <div className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Delivered</div>
                  <div className="text-sm text-gray-600">{formatDate(log.delivered_at)}</div>
                </div>
              </div>
            )}
            
            {log.opened_at && log.opened_count > 0 && (
              <div className="flex items-start">
                <EyeIcon className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Opened ({log.opened_count} {log.opened_count === 1 ? 'time' : 'times'})
                  </div>
                  <div className="text-sm text-gray-600">Last: {formatDate(log.opened_at)}</div>
                </div>
              </div>
            )}
            
            {log.clicked_at && log.clicked_count > 0 && (
              <div className="flex items-start">
                <CursorArrowRaysIcon className="h-5 w-5 text-indigo-600 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Clicked ({log.clicked_count} {log.clicked_count === 1 ? 'time' : 'times'})
                  </div>
                  <div className="text-sm text-gray-600">Last: {formatDate(log.clicked_at)}</div>
                </div>
              </div>
            )}

            {log.error_message && (
              <div className="flex items-start">
                <XCircleIcon className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-red-900">Error</div>
                  <div className="text-sm text-red-600">{log.error_message}</div>
                </div>
              </div>
            )}

            {/* âœ… NEW - Reply Info */}
            {log.has_reply && log.reply_count > 0 && (
              <div className="flex items-start">
                <ArrowUturnLeftIcon className="h-5 w-5 text-indigo-600 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Replied ({log.reply_count} {log.reply_count === 1 ? 'time' : 'times'})
                  </div>
                  {log.last_replied_at && (
                    <div className="text-sm text-gray-600">Last: {formatDate(log.last_replied_at)}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Clicked Links */}
        {log.clicked_links && log.clicked_links.length > 0 && (
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">
              Clicked Links
            </label>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <ul className="space-y-2">
                {log.clicked_links.map((link, index) => (
                  <li key={index} className="text-sm text-blue-600 break-all">
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Context Information */}
        {(log.campaign_id || log.automation_id || log.call_id || log.appointment_id) && (
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">
              Context
            </label>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 space-y-2">
              {log.campaign_id && (
                <div className="text-sm">
                  <span className="font-medium">Campaign ID:</span>{' '}
                  <span className="text-gray-600">{log.campaign_id}</span>
                </div>
              )}
              {log.automation_id && (
                <div className="text-sm">
                  <span className="font-medium">Automation ID:</span>{' '}
                  <span className="text-gray-600">{log.automation_id}</span>
                </div>
              )}
              {log.call_id && (
                <div className="text-sm">
                  <span className="font-medium">Call ID:</span>{' '}
                  <span className="text-gray-600">{log.call_id}</span>
                </div>
              )}
              {log.appointment_id && (
                <div className="text-sm">
                  <span className="font-medium">Appointment ID:</span>{' '}
                  <span className="text-gray-600">{log.appointment_id}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Email Content Preview */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">
            Email Content
          </label>
          <div className="bg-white rounded-lg border border-gray-300 p-4 max-h-96 overflow-y-auto">
            {log.content ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: log.content }}
              />
            ) : log.text_content ? (
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                {log.text_content}
              </pre>
            ) : (
              <div className="text-sm text-gray-500 italic">
                No content available
              </div>
            )}
          </div>
        </div>

        {/* Technical Details */}
        {log.smtp_message_id && (
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">
              Technical Details
            </label>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-600 break-all">
                <span className="font-medium">Message ID:</span> {log.smtp_message_id}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EmailLogDetailModal;