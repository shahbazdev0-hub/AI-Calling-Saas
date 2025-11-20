// frontend/src/Components/communication/EmailReplyModal.jsx - âœ… NEW FILE

import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { toast } from 'react-hot-toast';
import {
  PaperAirplaneIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const EmailReplyModal = ({ originalEmail, onClose, onReplySent }) => {
  const [replyData, setReplyData] = useState({
    subject: `Re: ${originalEmail.subject}`,
    content: ''
  });
  const [sending, setSending] = useState(false);

  const handleContentChange = (e) => {
    setReplyData(prev => ({
      ...prev,
      content: e.target.value
    }));
  };

  const handleSubjectChange = (e) => {
    setReplyData(prev => ({
      ...prev,
      subject: e.target.value
    }));
  };

  const handleSendReply = async () => {
    if (!replyData.content.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSending(true);
    try {
      await onReplySent({
        original_email_id: originalEmail._id,
        subject: replyData.subject,
        content: replyData.content
      });
      
      toast.success('Reply sent successfully');
      onClose();
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Reply to Email"
      size="xl"
    >
      <div className="space-y-4">
        {/* Original Email Info */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="text-sm">
            <div className="mb-2">
              <span className="font-medium text-gray-700">To:</span>
              <span className="ml-2 text-gray-900">
                {originalEmail.recipient_name && `${originalEmail.recipient_name} `}
                &lt;{originalEmail.to_email}&gt;
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Original Subject:</span>
              <span className="ml-2 text-gray-900">{originalEmail.subject}</span>
            </div>
          </div>
        </div>

        {/* Reply Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <Input
            type="text"
            value={replyData.subject}
            onChange={handleSubjectChange}
            placeholder="Email subject"
          />
        </div>

        {/* Reply Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            value={replyData.content}
            onChange={handleContentChange}
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            placeholder="Type your reply message here..."
          />
          <p className="mt-2 text-xs text-gray-500">
            You can use HTML tags for formatting
          </p>
        </div>

        {/* Original Email Preview */}
        <div>
          <button
            type="button"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            onClick={() => {
              const preview = document.getElementById('original-email-preview');
              preview.classList.toggle('hidden');
            }}
          >
            {/* Toggle text based on visibility */}
            Show Original Email
          </button>
          <div id="original-email-preview" className="hidden mt-2 bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-64 overflow-y-auto">
            <div className="text-xs text-gray-500 mb-2">--- Original Message ---</div>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: originalEmail.content }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={sending}
          >
            <XMarkIcon className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSendReply}
            disabled={sending || !replyData.content.trim()}
          >
            <PaperAirplaneIcon className="h-4 w-4 mr-2" />
            {sending ? 'Sending...' : 'Send Reply'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EmailReplyModal;