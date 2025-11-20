// frontend/src/components/communication/SMSReplyModal.jsx - NEW FILE

import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from "../../Components/ui/Button"
import { smsLogsService } from '../../services/sms_logs';
import { toast } from 'react-hot-toast';
import {
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

const SMSReplyModal = ({ log, onClose, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 160;

  const handleMessageChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setMessage(text);
      setCharCount(text.length);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      setSending(true);
      
      await smsLogsService.replySMS({
        to_number: log.from_number,
        message: message.trim(),
        original_sms_id: log._id
      });

      toast.success('Reply sent successfully');
      onSuccess();
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error(error.response?.data?.detail || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Reply to SMS"
      size="lg"
    >
      <div className="space-y-6">
        {/* Original Message Info */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {log.customer_name || 'Unknown Customer'}
                </div>
                <div className="text-sm text-gray-600">
                  {formatPhoneNumber(log.from_number)}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(log.created_at)}
            </div>
          </div>
          
          <div className="bg-white rounded p-3 border border-gray-200">
            <div className="text-sm text-gray-700">
              {log.message}
            </div>
          </div>
        </div>

        {/* Reply Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Reply
          </label>
          <textarea
            value={message}
            onChange={handleMessageChange}
            placeholder="Type your reply message..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              SMS messages are limited to 160 characters
            </div>
            <div className={`text-sm font-medium ${
              charCount > 140 ? 'text-orange-600' : 'text-gray-600'
            }`}>
              {charCount} / {maxChars}
            </div>
          </div>
        </div>

        {/* Previous Replies (if any) */}
        {log.replies && log.replies.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              Previous Replies ({log.replies.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {log.replies.map((reply, index) => (
                <div
                  key={reply._id || index}
                  className="bg-blue-50 rounded-lg p-3 border border-blue-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-medium text-blue-900">
                      You replied
                    </div>
                    <div className="text-xs text-blue-600">
                      {formatDate(reply.created_at)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    {reply.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={sending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={sending || !message.trim()}
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                Send Reply
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SMSReplyModal;