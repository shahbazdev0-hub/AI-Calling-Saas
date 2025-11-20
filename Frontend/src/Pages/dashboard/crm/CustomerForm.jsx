// frontend/src/pages/dashboard/crm/CustomerForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Phone, Building, MapPin, Tag } from 'lucide-react';
import Card from '../../../Components/ui/Card';
import Button from '../../../Components/ui/Button';
import Input from '../../../Components/ui/Input';
import customerService from '../../../services/customer';
import { validateEmail, validatePhone } from '../../../utils/validation';
import toast from 'react-hot-toast';

const CustomerForm = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(customerId);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    tags: [],
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchCustomer();
    }
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const data = await customerService.getById(customerId);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        company: data.company || '',
        address: data.address || '',
        tags: data.tags || [],
        notes: data.notes || ''
      });
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      toast.error('Failed to load customer data');
      navigate('/dashboard/crm/customers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setSaving(true);

      if (isEditMode) {
        await customerService.update(customerId, formData);
        toast.success('Customer updated successfully');
      } else {
        await customerService.create(formData);
        toast.success('Customer created successfully');
      }

      navigate('/dashboard/crm/customers');
    } catch (error) {
      console.error('Failed to save customer:', error);
      toast.error(
        error.response?.data?.detail || 'Failed to save customer'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f2070d]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/crm/customers')}
          className="border-[#E0E0E0]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#2C2C2C]">
            {isEditMode ? 'Edit Customer' : 'Add New Customer'}
          </h1>
          <p className="text-sm text-[#666666] mt-1">
            {isEditMode ? 'Update customer information' : 'Create a new customer record'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="p-6 border-2 border-[#F0F0F0]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-[#f2070d]" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                    Full Name <span className="text-[#f2070d]">*</span>
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    className={`border-[#E0E0E0] focus:border-[#f2070d] ${
                      errors.name ? 'border-[#f2070d]' : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-[#f2070d] mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                    Company
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#666666]" />
                    <Input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Enter company name"
                      className="pl-10 border-[#E0E0E0] focus:border-[#f2070d]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-[#f2070d]" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                    Email <span className="text-[#f2070d]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#666666]" />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="customer@example.com"
                      className={`pl-10 border-[#E0E0E0] focus:border-[#f2070d] ${
                        errors.email ? 'border-[#f2070d]' : ''
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-[#f2070d] mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                    Phone <span className="text-[#f2070d]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#666666]" />
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className={`pl-10 border-[#E0E0E0] focus:border-[#f2070d] ${
                        errors.phone ? 'border-[#f2070d]' : ''
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-[#f2070d] mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#f2070d]" />
                Address
              </h3>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
                className="border-[#E0E0E0] focus:border-[#f2070d]"
              />
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5 text-[#f2070d]" />
                Tags
              </h3>
              <div className="flex gap-2 mb-3">
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  className="border-[#E0E0E0] focus:border-[#f2070d]"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag(e);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  variant="outline"
                  className="border-[#2C2C2C] text-[#2C2C2C]"
                >
                  Add Tag
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#F0F0F0] text-[#2C2C2C] rounded-full text-sm border border-[#E0E0E0]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-[#f2070d] hover:text-[#d10609] font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional notes about this customer..."
                rows={4}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#f2070d] resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/crm/customers')}
            className="border-[#E0E0E0]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-[#f2070d] to-[#FF6B6B] hover:from-[#d10609] hover:to-[#FF5555] text-white"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditMode ? 'Update Customer' : 'Create Customer'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;