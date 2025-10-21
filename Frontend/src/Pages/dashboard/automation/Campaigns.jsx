// frontend/src/pages/dashboard/automation/Campaigns.jsx

import { useState, useEffect } from 'react';
import { email } from '../../../services/api';
import Button from '../../../Components/ui/Button';
import Modal from '../../../Components/ui/Modal';
import CampaignForm from '../../../Components/forms/CampaignForm';
import Badge from '../../../Components/ui/Badge';
import EmptyState from '../../../Components/ui/EmptyState';
import LoadingSpinner from '../../../Components/common/LoadingSpinner';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await email.getCampaigns();
      setCampaigns(response.data.campaigns || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCampaign(null);
    setShowModal(true);
  };

  const handleEdit = (campaign) => {
    setSelectedCampaign(campaign);
    setShowModal(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedCampaign) {
        await email.updateCampaign(selectedCampaign.id, data);
      } else {
        await email.createCampaign(data);
      }
      setShowModal(false);
      fetchCampaigns();
    } catch (error) {
      console.error('Error saving campaign:', error);
      alert('Error saving campaign');
    }
  };

  const handleSend = async (id) => {
    if (window.confirm('Are you sure you want to send this campaign?')) {
      try {
        await email.sendCampaign(id);
        fetchCampaigns();
        alert('Campaign queued for sending!');
      } catch (error) {
        console.error('Error sending campaign:', error);
        alert('Error sending campaign');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await email.deleteCampaign(id);
        fetchCampaigns();
      } catch (error) {
        console.error('Error deleting campaign:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      draft: 'default',
      scheduled: 'info',
      sending: 'warning',
      sent: 'success',
      cancelled: 'danger'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
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
          <h1 className="text-2xl font-bold text-gray-900">Email Campaigns</h1>
          <p className="text-gray-600 mt-1">Create and manage email campaigns</p>
        </div>
        <Button onClick={handleCreate}>+ Create Campaign</Button>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-lg shadow">
        {campaigns.length === 0 ? (
          <EmptyState
            title="No campaigns yet"
            description="Create your first email campaign to reach your customers"
            actionLabel="Create Campaign"
            onAction={handleCreate}
          />
        ) : (
          <div className="divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{campaign.subject}</p>
                    <div className="grid grid-cols-5 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-gray-500">Recipients</p>
                        <p className="font-semibold">{campaign.recipient_count}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Sent</p>
                        <p className="font-semibold text-green-600">{campaign.sent_count}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Delivered</p>
                        <p className="font-semibold text-blue-600">{campaign.delivered_count}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Opened</p>
                        <p className="font-semibold text-purple-600">{campaign.opened_count}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Failed</p>
                        <p className="font-semibold text-red-600">{campaign.failed_count}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {campaign.status === 'draft' && (
                      <>
                        <Button size="sm" onClick={() => handleSend(campaign.id)}>
                          Send
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(campaign)}>
                          Edit
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="danger" onClick={() => handleDelete(campaign.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedCampaign ? 'Edit Campaign' : 'Create Campaign'}
        size="lg"
      >
        <CampaignForm
          campaign={selectedCampaign}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Campaigns;