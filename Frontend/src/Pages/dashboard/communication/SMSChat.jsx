// frontend/src/pages/dashboard/communication/SMSChat.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  PaperAirplaneIcon, 
  ArrowLeftIcon,
  PhoneIcon,
  UserCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import Button from '../../../components/ui/Button';

const SMSChat = () => {
  const { phoneNumber } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [customerInfo, setCustomerInfo] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch chat history and customer info
  useEffect(() => {
    fetchChatHistory();
  }, [phoneNumber]);

  const fetchChatHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await api.get(`/sms-logs/chat/${phoneNumber}`);
      
      if (response.data.success) {
        setMessages(response.data.messages || []);
        setCustomerInfo(response.data.customer_info);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      toast.error('Failed to load chat history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const userMessage = newMessage.trim();
    setNewMessage('');
    setLoading(true);

    // Add user message to chat immediately
    const tempUserMsg = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
      status: 'sending'
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      // Send message to backend
      const response = await api.post('/sms-logs/chat/send', {
        phone_number: phoneNumber,
        message: userMessage
      });

      if (response.data.success) {
        // Update user message status
        setMessages(prev => prev.map(msg => 
          msg.id === tempUserMsg.id 
            ? { ...msg, status: 'sent', id: response.data.user_message.id }
            : msg
        ));

        // Add AI response
        if (response.data.ai_response) {
          const aiMessage = {
            id: response.data.ai_response.id || Date.now() + 1,
            role: 'assistant',
            content: response.data.ai_response.content,
            timestamp: response.data.ai_response.timestamp || new Date().toISOString(),
            status: 'delivered'
          };
          setMessages(prev => [...prev, aiMessage]);
        }

        toast.success('Message sent');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.detail || 'Failed to send message');
      
      // Remove failed message
      setMessages(prev => prev.filter(msg => msg.id !== tempUserMsg.id));
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (phone) => {
    const cleaned = ('' + phone).replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/dashboard/sms-logs')}
              className="flex items-center"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <UserCircleIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {customerInfo?.name || 'Customer'}
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                  <PhoneIcon className="h-4 w-4 mr-1" />
                  {formatPhoneNumber(phoneNumber)}
                </div>
              </div>
            </div>
          </div>

          {customerInfo?.email && (
            <div className="text-sm text-gray-600">
              {customerInfo.email}
            </div>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {loadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <PhoneIcon className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start a conversation by sending a message below</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-white text-gray-900 border border-gray-200'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  <div
                    className={`flex items-center justify-end mt-1 text-xs ${
                      message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
                    }`}
                  >
                    <ClockIcon className="h-3 w-3 mr-1" />
                    {formatTimestamp(message.timestamp)}
                    {message.status === 'sending' && (
                      <span className="ml-2">Sending...</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows="3"
              disabled={loading}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !newMessage.trim()}
            className="px-6 py-3 h-fit"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                Send
              </>
            )}
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          AI-powered responses are generated automatically based on your query
        </p>
      </div>
    </div>
  );
};

export default SMSChat;