// frontend/src/components/forms/SMSForm.jsx

import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const SMSForm = ({ onSubmit, onCancel, isBulk = false }) => {
  const [formData, setFormData] = useState({
    to_number: '',
    to_numbers: '',
    message: '',
    from_number: '',
    batch_size: 25
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (isBulk) {
      if (!formData.to_numbers) {
        newErrors.to_numbers = 'At least one phone number is required';
      }
    } else {
      if (!formData.to_number) {
        newErrors.to_number = 'Phone number is required';
      }
    }

    if (!formData.message) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length > 160) {
      newErrors.message = 'Message must be 160 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isBulk) {
        // Convert phone numbers string to array
        const numbersArray = formData.to_numbers
          .split(',')
          .map(num => num.trim())
          .filter(num => num);

        onSubmit({
          to_numbers: numbersArray,
          message: formData.message,
          from_number: formData.from_number || undefined,
          batch_size: parseInt(formData.batch_size)
        });
      } else {
        onSubmit({
          to_number: formData.to_number,
          message: formData.message,
          from_number: formData.from_number || undefined
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isBulk ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Numbers (comma-separated) *
          </label>
          <textarea
            name="to_numbers"
            value={formData.to_numbers}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+1234567890, +0987654321, +1122334455"
            required
          />
          {errors.to_numbers && (
            <p className="text-red-500 text-sm mt-1">{errors.to_numbers}</p>
          )}
        </div>
      ) : (
        <Input
          label="Phone Number"
          name="to_number"
          value={formData.to_number}
          onChange={handleChange}
          placeholder="+1234567890"
          error={errors.to_number}
          required
        />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message * ({formData.message.length}/160 characters)
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          maxLength={160}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your SMS message..."
          required
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message}</p>
        )}
      </div>

      <Input
        label="From Number (optional)"
        name="from_number"
        value={formData.from_number}
        onChange={handleChange}
        placeholder="+1234567890"
        helperText="Leave empty to use default"
      />

      {isBulk && (
        <Input
          label="Batch Size"
          name="batch_size"
          type="number"
          value={formData.batch_size}
          onChange={handleChange}
          min="1"
          max="100"
          helperText="Number of SMS to send per batch"
        />
      )}

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isBulk ? 'Send Bulk SMS' : 'Send SMS'}
        </Button>
      </div>
    </form>
  );
};

export default SMSForm;