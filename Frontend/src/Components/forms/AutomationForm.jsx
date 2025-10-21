// frontend/src/components/forms/AutomationForm.jsx

import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const AutomationForm = ({ automation, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: automation?.name || '',
    description: automation?.description || '',
    trigger_type: automation?.trigger_type || 'call_completed',
    trigger_config: automation?.trigger_config || {},
    actions: automation?.actions || [
      {
        type: 'send_email',
        config: {
          to_email: '',
          subject: '',
          content: ''
        }
      }
    ],
    is_active: automation?.is_active ?? true
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleActionChange = (index, field, value) => {
    const newActions = [...formData.actions];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newActions[index].config[child] = value;
    } else {
      newActions[index][field] = value;
    }
    setFormData(prev => ({ ...prev, actions: newActions }));
  };

  const addAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [
        ...prev.actions,
        {
          type: 'send_email',
          config: {
            to_email: '',
            subject: '',
            content: ''
          }
        }
      ]
    }));
  };

  const removeAction = (index) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.trigger_type) newErrors.trigger_type = 'Trigger type is required';
    if (formData.actions.length === 0) newErrors.actions = 'At least one action is required';

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
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        <Input
          label="Automation Name"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trigger Type *
          </label>
          <select
            name="trigger_type"
            value={formData.trigger_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="call_completed">Call Completed</option>
            <option value="demo_booked">Demo Booked</option>
            <option value="form_submitted">Form Submitted</option>
            <option value="time_based">Time Based</option>
          </select>
          {errors.trigger_type && (
            <p className="text-red-500 text-sm mt-1">{errors.trigger_type}</p>
          )}
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
            Active (automation will run automatically)
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Actions</h3>
          <Button type="button" onClick={addAction} variant="secondary" size="sm">
            + Add Action
          </Button>
        </div>

        {formData.actions.map((action, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Action {index + 1}</h4>
              {formData.actions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAction(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action Type
              </label>
              <select
                value={action.type}
                onChange={(e) => handleActionChange(index, 'type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="send_email">Send Email</option>
                <option value="send_sms">Send SMS</option>
                <option value="delay">Delay</option>
                <option value="webhook">Webhook</option>
              </select>
            </div>

            {/* Email Action Config */}
            {action.type === 'send_email' && (
              <>
                <Input
                  label="To Email"
                  value={action.config.to_email || ''}
                  onChange={(e) => handleActionChange(index, 'config.to_email', e.target.value)}
                  placeholder="customer@example.com"
                />
                <Input
                  label="Subject"
                  value={action.config.subject || ''}
                  onChange={(e) => handleActionChange(index, 'config.subject', e.target.value)}
                  placeholder="Thank you for your call"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={action.config.content || ''}
                    onChange={(e) => handleActionChange(index, 'config.content', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email content..."
                  />
                </div>
              </>
            )}

            {/* SMS Action Config */}
            {action.type === 'send_sms' && (
              <>
                <Input
                  label="To Phone Number"
                  value={action.config.to_number || ''}
                  onChange={(e) => handleActionChange(index, 'config.to_number', e.target.value)}
                  placeholder="+1234567890"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={action.config.message || ''}
                    onChange={(e) => handleActionChange(index, 'config.message', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SMS message..."
                  />
                </div>
              </>
            )}

            {/* Delay Action Config */}
            {action.type === 'delay' && (
              <Input
                label="Delay (seconds)"
                type="number"
                value={action.config.seconds || 0}
                onChange={(e) => handleActionChange(index, 'config.seconds', parseInt(e.target.value))}
                placeholder="60"
              />
            )}
          </div>
        ))}

        {errors.actions && (
          <p className="text-red-500 text-sm">{errors.actions}</p>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {automation ? 'Update Automation' : 'Create Automation'}
        </Button>
      </div>
    </form>
  );
};

export default AutomationForm;