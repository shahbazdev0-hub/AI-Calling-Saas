// frontend/src/components/forms/CampaignForm.jsx

import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const CampaignForm = ({ campaign, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    subject: campaign?.subject || '',
    content: campaign?.content || '',
    recipients: campaign?.recipients ? campaign.recipients.join(', ') : '',
    send_immediately: campaign?.send_immediately ?? false,
    scheduled_at: campaign?.scheduled_at || ''
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

    if (!formData.name) newErrors.name = 'Campaign name is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.content) newErrors.content = 'Content is required';
    if (!formData.recipients) newErrors.recipients = 'At least one recipient is required';

    if (!formData.send_immediately && !formData.scheduled_at) {
      newErrors.scheduled_at = 'Schedule time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Convert recipients string to array
      const recipientsArray = formData.recipients
        .split(',')
        .map(email => email.trim())
        .filter(email => email);

      onSubmit({
        ...formData,
        recipients: recipientsArray,
        scheduled_at: formData.scheduled_at || null
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Campaign Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <Input
        label="Email Subject"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        error={errors.subject}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Content (HTML) *
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="<h1>Hello!</h1><p>Your email content here...</p>"
          required
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Recipients (comma-separated emails) *
        </label>
        <textarea
          name="recipients"
          value={formData.recipients}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="user1@example.com, user2@example.com, user3@example.com"
          required
        />
        {errors.recipients && (
          <p className="text-red-500 text-sm mt-1">{errors.recipients}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="send_immediately"
          checked={formData.send_immediately}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Send immediately
        </label>
      </div>

      {!formData.send_immediately && (
        <Input
          label="Schedule Time"
          name="scheduled_at"
          type="datetime-local"
          value={formData.scheduled_at}
          onChange={handleChange}
          error={errors.scheduled_at}
        />
      )}

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {campaign ? 'Update Campaign' : 'Create Campaign'}
        </Button>
      </div>
    </form>
  );
};

export default CampaignForm;