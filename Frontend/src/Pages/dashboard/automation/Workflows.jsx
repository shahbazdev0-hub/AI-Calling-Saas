// frontend/src/pages/dashboard/automation/Workflows.jsx

import { useState, useEffect } from 'react';
import { workflow } from '../../../services/api';
import Button from '../../../Components/ui/Button';
import Modal from '../../../Components/ui/Modal';
import WorkflowForm from '../../../Components/forms/WorkflowForm';
import Badge from '../../../Components/ui/Badge';
import EmptyState from '../../../Components/ui/EmptyState';
import LoadingSpinner from '../../../Components/common/LoadingSpinner';

const Workflows = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const response = await workflow.getAll();
      setWorkflows(response.data.workflows || []);
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedWorkflow(null);
    setShowModal(true);
  };

  const handleEdit = (wf) => {
    setSelectedWorkflow(wf);
    setShowModal(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedWorkflow) {
        await workflow.update(selectedWorkflow.id, data);
      } else {
        await workflow.create(data);
      }
      setShowModal(false);
      fetchWorkflows();
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('Error saving workflow');
    }
  };

  const handleExecute = async (id) => {
    if (window.confirm('Are you sure you want to execute this workflow?')) {
      try {
        await workflow.execute(id, {});
        alert('Workflow executed successfully!');
        fetchWorkflows();
      } catch (error) {
        console.error('Error executing workflow:', error);
        alert('Error executing workflow');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        await workflow.delete(id);
        fetchWorkflows();
      } catch (error) {
        console.error('Error deleting workflow:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
          <p className="text-gray-600 mt-1">Create and manage complex workflows</p>
        </div>
        <Button onClick={handleCreate}>+ Create Workflow</Button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800">
              Visual workflow builder is coming soon! For now, you can create basic workflows with configuration.
            </p>
          </div>
        </div>
      </div>

      {/* Workflows List */}
      <div className="bg-white rounded-lg shadow">
        {workflows.length === 0 ? (
          <EmptyState
            title="No workflows yet"
            description="Create your first workflow to automate complex business processes"
            actionLabel="Create Workflow"
            onAction={handleCreate}
          />
        ) : (
          <div className="divide-y divide-gray-200">
            {workflows.map((wf) => (
              <div key={wf.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{wf.name}</h3>
                      <Badge variant={wf.is_active ? 'success' : 'default'}>
                        {wf.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {wf.description && (
                      <p className="text-sm text-gray-600 mt-1">{wf.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Executed: {wf.execution_count} times</span>
                      <span>Success: {wf.success_count}</span>
                      <span>Failed: {wf.failure_count}</span>
                      <span>Version: {wf.version}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" onClick={() => handleExecute(wf.id)}>
                      Execute
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(wf)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(wf.id)}>
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
        title={selectedWorkflow ? 'Edit Workflow' : 'Create Workflow'}
      >
        <WorkflowForm
          workflow={selectedWorkflow}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Workflows;