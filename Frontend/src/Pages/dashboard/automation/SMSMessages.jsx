// frontend/src/pages/dashboard/automation/SMSMessages.jsx

import { useState, useEffect } from 'react';
import { sms } from '../../../services/api';
import Button from '../../../Components/ui/Button';
import Modal from '../../../Components/ui/Modal';
import SMSForm from '../../../Components/forms/SMSForm';
import Badge from '../../../Components/ui/Badge';
import EmptyState from '../../../Components/ui/EmptyState';
import LoadingSpinner from '../../../Components/common/LoadingSpinner';
import StatCard from '../../../Components/ui/StatCard';

const SMSMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isBulk, setIsBulk] = useState(false);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await sms.getAll(params);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching SMS messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await sms.stats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSendSingle = () => {
    setIsBulk(false);
    setShowModal(true);
  };

  const handleSendBulk = () => {
    setIsBulk(true);
    setShowModal(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (isBulk) {
        await sms.sendBulk(data);
        alert('Bulk SMS queued for sending!');
      } else {
        await sms.send(data);
        alert('SMS sent successfully!');
      }
      setShowModal(false);
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error sending SMS:', error);
      alert('Error sending SMS');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this SMS?')) {
      try {
        await sms.delete(id);
        fetchMessages();
        fetchStats();
      } catch (error) {
        console.error('Error deleting SMS:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      sent: 'success',
      delivered: 'success',
      failed: 'danger'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SMS Messages</h1>
          <p className="text-gray-600 mt-1">Send and manage SMS messages</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={handleSendBulk}>
            Send Bulk SMS
          </Button>
          <Button onClick={handleSendSingle}>+ Send SMS</Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Sent"
            value={stats.total_sent}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            }
          />
          <StatCard
            title="Today"
            value={stats.today_sent}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="This Week"
            value={stats.this_week_sent}
            color="purple"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatCard
            title="Failed"
            value={stats.total_failed}
            color="red"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={filter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filter === 'sent' ? 'primary' : 'secondary'}
            onClick={() => setFilter('sent')}
          >
            Sent
          </Button>
          <Button
            size="sm"
            variant={filter === 'pending' ? 'primary' : 'secondary'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button
            size="sm"
            variant={filter === 'failed' ? 'primary' : 'secondary'}
            onClick={() => setFilter('failed')}
          >
            Failed
          </Button>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow">
        {messages.length === 0 ? (
          <EmptyState
            title="No SMS messages yet"
            description="Send your first SMS message to get started"
            actionLabel="Send SMS"
            onAction={handleSendSingle}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Direction
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
                {messages.map((message) => (
                  <tr key={message._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {message.to_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">{message.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(message.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Badge variant={message.direction === 'inbound' ? 'info' : 'default'}>
                        {message.direction}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(message.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(message._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Send SMS Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isBulk ? 'Send Bulk SMS' : 'Send SMS'}
      >
        <SMSForm
          isBulk={isBulk}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default SMSMessages;