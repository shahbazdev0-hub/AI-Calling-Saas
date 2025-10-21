// frontend/src/components/forms/WorkflowForm.jsx

import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const WorkflowForm = ({ workflow, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: workflow?.name || '',
    description: workflow?.description || '',
    is_active: workflow?.is_active ?? true,
    nodes: workflow?.nodes || [],
    edges: workflow?.edges || []
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Workflow name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Workflow Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Active (workflow will run automatically)
        </label>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          ℹ️ Visual workflow builder coming soon. For now, workflows can be created with basic configuration.
        </p>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {workflow ? 'Update Workflow' : 'Create Workflow'}
        </Button>
      </div>
    </form>
  );
};

export default WorkflowForm;