// frontend/src/pages/dashboard/automation/Automations.jsx

import { useState, useEffect } from 'react';
import { automation } from '../../../services/api';
import Button from '../../../Components/ui/Button';
import Modal from '../../../Components/ui/Modal';
import AutomationForm from '../../../Components/forms/AutomationForm';
import Badge from '../../../Components/ui/Badge';
import EmptyState from '../../../Components/ui/EmptyState';
import LoadingSpinner from '../../../Components/common/LoadingSpinner';

const Automations = () => {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAutomations();
    fetchStats();
  }, []);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const response = await automation.getAll();
      setAutomations(response.data.automations || []);
    } catch (error) {
      console.error('Error fetching automations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await automation.stats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreate = () => {
    setSelectedAutomation(null);
    setShowModal(true);
  };

  const handleEdit = (auto) => {
    setSelectedAutomation(auto);
    setShowModal(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedAutomation) {
        await automation.update(selectedAutomation.id, data);
      } else {
        await automation.create(data);
      }
      setShowModal(false);
      fetchAutomations();
      fetchStats();
    } catch (error) {
      console.error('Error saving automation:', error);
      alert('Error saving automation');
    }
  };

  const handleToggle = async (id, isActive) => {
    try {
      await automation.toggle(id, !isActive);
      fetchAutomations();
    } catch (error) {
      console.error('Error toggling automation:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this automation?')) {
      try {
        await automation.delete(id);
        fetchAutomations();
        fetchStats();
      } catch (error) {
        console.error('Error deleting automation:', error);
      }
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Automations</h1>
          <p className="text-gray-600 mt-1">Create and manage automated workflows</p>
        </div>
        <Button onClick={handleCreate}>+ Create Automation</Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Automations</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_automations}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.active_automations}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Executions</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total_executions}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Success Rate</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats.total_executions > 0
                ? Math.round((stats.successful_executions / stats.total_executions) * 100)
                : 0}%
            </p>
          </div>
        </div>
      )}

      {/* Automations List */}
      <div className="bg-white rounded-lg shadow">
        {automations.length === 0 ? (
          <EmptyState
            title="No automations yet"
            description="Create your first automation to start automating your workflows"
            actionLabel="Create Automation"
            onAction={handleCreate}
          />
        ) : (
          <div className="divide-y divide-gray-200">
            {automations.map((auto) => (
              <div key={auto.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{auto.name}</h3>
                      <Badge variant={auto.is_active ? 'success' : 'default'}>
                        {auto.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="info">{auto.trigger_type}</Badge>
                    </div>
                    {auto.description && (
                      <p className="text-sm text-gray-600 mt-1">{auto.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Executed: {auto.execution_count} times</span>
                      <span>Success: {auto.success_count}</span>
                      <span>Failed: {auto.failure_count}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant={auto.is_active ? 'secondary' : 'primary'}
                      onClick={() => handleToggle(auto.id, auto.is_active)}
                    >
                      {auto.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(auto)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(auto.id)}>
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
        title={selectedAutomation ? 'Edit Automation' : 'Create Automation'}
        size="lg"
      >
        <AutomationForm
          automation={selectedAutomation}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Automations;