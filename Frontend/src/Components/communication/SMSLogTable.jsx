// frontend/src/components/communication/SMSLogTable.jsx - NEW FILE

import { useState } from 'react';
import Badge from '../ui/Badge';
import Button from "../../Components/ui/Button"
import {
  ChatBubbleLeftRightIcon,
  EyeIcon,
  PhoneIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const SMSLogTable = ({ logs, onReply, onViewDetails }) => {
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

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    // Format phone number (e.g., +1234567890 to +1 (234) 567-890)
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      sent: { variant: 'success', label: 'Sent' },
      delivered: { variant: 'success', label: 'Delivered' },
      failed: { variant: 'danger', label: 'Failed' },
      pending: { variant: 'warning', label: 'Pending' },
      received: { variant: 'info', label: 'Received' }
    };

    const config = statusConfig[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getDirectionIcon = (direction) => {
    if (direction === 'inbound') {
      return <ArrowDownIcon className="h-4 w-4 text-green-600" />;
    }
    return <ArrowUpIcon className="h-4 w-4 text-blue-600" />;
  };

  const truncateMessage = (message, maxLength = 80) => {
    if (!message) return '';
    return message.length > maxLength 
      ? `${message.substring(0, maxLength)}...` 
      : message;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Direction
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Message
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getDirectionIcon(log.direction)}
                  <span className="ml-2 text-sm text-gray-900 capitalize">
                    {log.direction}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
  <div className="flex items-center">
    <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
    <button
      onClick={() => {
        const phoneNumber = log.direction === 'outbound' ? log.to_number : log.from_number;
        window.location.href = `/dashboard/sms-chat/${encodeURIComponent(phoneNumber)}`;
      }}
      className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
    >
      {formatPhoneNumber(
        log.direction === 'outbound' ? log.to_number : log.from_number
      )}
    </button>
  </div>
</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {log.customer_name || 'Unknown'}
                </div>
                {log.customer_email && (
                  <div className="text-xs text-gray-500">{log.customer_email}</div>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-md">
                  {truncateMessage(log.message)}
                </div>
                {log.has_replies && (
                  <div className="flex items-center mt-1">
                    <ChatBubbleLeftRightIcon className="h-3 w-3 text-blue-500 mr-1" />
                    <span className="text-xs text-blue-600">
                      {log.reply_count} {log.reply_count === 1 ? 'reply' : 'replies'}
                    </span>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(log.status)}
                {log.error_message && (<div className="mt-1">
                    <span className="text-xs text-red-600" title={log.error_message}>
                      Error
                    </span>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatDate(log.created_at)}
                </div>
                {log.delivered_at && (
                  <div className="text-xs text-gray-500">
                    Delivered: {formatDate(log.delivered_at)}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onViewDetails(log)}
                    title="View details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  {log.direction === 'inbound' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onReply(log)}
                      title="Reply to this SMS"
                    >
                      <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SMSLogTable;