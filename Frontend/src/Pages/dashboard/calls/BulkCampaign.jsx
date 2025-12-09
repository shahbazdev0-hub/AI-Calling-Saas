// frontend/src/pages/dashboard/calls/BulkCampaign.jsx  

import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Upload, 
  X, 
  Plus, 
  Phone,
  Play,
  Pause,
  Trash2,
  FileText,
  Users,
  Loader,
  CheckCircle,
  AlertCircle,
  Bot,
  Download,
  RefreshCw,
  Rocket
} from 'lucide-react';
import Button from '../../../Components/ui/Button';
import Input from '../../../Components/ui/Input';
import Modal from '../../../Components/ui/Modal';
import Card from '../../../Components/ui/Card';
import Badge from '../../../Components/ui/Badge';
import EmptyState from '../../../Components/ui/EmptyState';
import { bulkCampaignService } from '../../../services/bulkCampaign';

const BulkCampaign = () => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Modal & Steps
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [step, setStep] = useState(1); // 1: Campaign Details, 2: Add Recipients
  
  // Campaign Form Data
  const [formData, setFormData] = useState({
    campaign_id: '',
    campaign_name: '',
    custom_ai_script: ''
  });
  
  // Created Campaign
  const [createdCampaignId, setCreatedCampaignId] = useState(null);
  const [createdCampaign, setCreatedCampaign] = useState(null);
  const [totalRecipients, setTotalRecipients] = useState(0);
  
  // Recipients - CSV Upload
  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState(null);
  
  // Recipients - Manual Entry
  const [manualRecipients, setManualRecipients] = useState([
    { phone_number: '', name: '' }
  ]);
  const [addingManual, setAddingManual] = useState(false);
  
  // Starting Campaign
  const [startingCampaign, setStartingCampaign] = useState(false);
  
  // Campaigns List
  const [campaigns, setCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignStatus, setCampaignStatus] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  
  // ✅ ADD THIS LINE - Error state
  const [error, setError] = useState(null);
  
  // Refs
  const fileInputRef = useRef(null);

  // ============================================
  // LOAD CAMPAIGNS ON MOUNT
  // ============================================
  
  useEffect(() => {
    fetchCampaigns();
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoadingCampaigns(true);
      setError(null);
      
      const response = await bulkCampaignService.getCampaigns();
      
      // ✅ Handle both array and object responses
      if (response.data) {
        if (Array.isArray(response.data)) {
          setCampaigns(response.data);
        } else if (response.data.campaigns && Array.isArray(response.data.campaigns)) {
          setCampaigns(response.data.campaigns);
        } else {
          console.warn('Unexpected response format:', response.data);
          setCampaigns([]);
        }
      } else {
        setCampaigns([]);
      }
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      
      // ✅ Better error handling
      if (err.response) {
        // Server responded with error
        console.error('Server error:', err.response.data);
        setError(`Server error: ${err.response.data.detail || err.response.statusText}`);
      } else if (err.request) {
        // No response received
        console.error('No response from server');
        setError('Unable to reach server. Please check your connection.');
      } else {
        // Request setup error
        console.error('Request error:', err.message);
        setError(`Error: ${err.message}`);
      }
      
      setCampaigns([]);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  // ============================================
  // STEP 1: CREATE CAMPAIGN
  // ============================================
  
  const handleCreateCampaign = async () => {
    if (!formData.campaign_id.trim()) {
      toast.error('Please enter a Campaign ID');
      return;
    }

    try {
      const response = await bulkCampaignService.createCampaign({
        campaign_id: formData.campaign_id.trim(),
        campaign_name: formData.campaign_name.trim() || null,
        custom_ai_script: formData.custom_ai_script.trim() || null
      });
      
      setCreatedCampaign(response.campaign);
      setCreatedCampaignId(formData.campaign_id);
      setTotalRecipients(0); // Initialize recipient count
      toast.success('✅ Campaign created! Now add recipients.');
      setStep(2);
    } catch (error) {
      console.error('Create campaign error:', error);
      toast.error(error.response?.data?.detail || 'Failed to create campaign');
    }
  };

  // ============================================
  // STEP 2: CSV UPLOAD
  // ============================================
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Please upload a CSV or Excel file');
      return;
    }

    setCsvFile(file);
    toast.success(`📎 File selected: ${file.name}`);
  };

  // ============================================
  // UPLOAD CSV RECIPIENTS
  // ============================================

  const handleUploadCSV = async () => {
    if (!csvFile) {
      toast.error('Please select a CSV file');
      return;
    }

    if (!createdCampaignId) {
      toast.error('Please create campaign first');
      return;
    }

    setUploading(true);
    try {
      const response = await bulkCampaignService.uploadCSV(
        createdCampaignId,
        csvFile
      );

      // ✅ DEBUG: Log the response
      console.log('📊 CSV Upload Response:', response);

      // ✅ FIX: Update total recipients from response
      if (response.total_recipients !== undefined) {
        setTotalRecipients(response.total_recipients);
        console.log('✅ Updated totalRecipients:', response.total_recipients);
      } else {
        console.error('❌ No total_recipients in response:', response);
      }

      setUploadStats({
        added: response.added_count,
        duplicates: response.duplicate_count || 0,
        total: response.total_recipients
      });

      toast.success(
        `✅ Added ${response.added_count} recipients from CSV` +
        (response.duplicate_count > 0 ? ` (${response.duplicate_count} duplicates skipped)` : '')
      );

      // Reset file after successful upload
      setCsvFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.detail || 'Failed to upload CSV file');
    } finally {
      setUploading(false);
    }
  };

  // ============================================
  // STEP 2: MANUAL RECIPIENTS
  // ============================================
  
  const addManualRecipient = () => {
    if (manualRecipients.length < 10) {
      setManualRecipients([...manualRecipients, { phone_number: '', name: '' }]);
    } else {
      toast.error('Maximum 10 recipients can be added manually at once');
    }
  };

  const removeManualRecipient = (index) => {
    if (manualRecipients.length > 1) {
      setManualRecipients(manualRecipients.filter((_, i) => i !== index));
    } else {
      toast.error('At least one recipient field is required');
    }
  };

  const updateManualRecipient = (index, field, value) => {
    const updated = [...manualRecipients];
    updated[index][field] = value;
    setManualRecipients(updated);
  };

  // ============================================
  // ADD MANUAL RECIPIENTS
  // ============================================

  const handleAddManualRecipients = async () => {
    const validRecipients = manualRecipients.filter(r => r.phone_number.trim());

    if (validRecipients.length === 0) {
      toast.error('Please enter at least one phone number');
      return;
    }

    if (!createdCampaignId) {
      toast.error('Please create campaign first');
      return;
    }

    setAddingManual(true);
    try {
      const response = await bulkCampaignService.addManualRecipients(
        createdCampaignId,
        validRecipients
      );

      // ✅ FIX: Update total recipients count from response
      if (response.total_recipients !== undefined) {
        setTotalRecipients(response.total_recipients);
      }

      toast.success(`✅ Added ${response.added_count} recipients`);

      if (response.duplicate_count > 0) {
        toast.warning(`⚠️ ${response.duplicate_count} duplicates were skipped`);
      }

      // Reset manual form
      setManualRecipients([{ phone_number: '', name: '' }]);
    } catch (error) {
      console.error('Add recipients error:', error);
      toast.error(error.response?.data?.detail || 'Failed to add recipients');
    } finally {
      setAddingManual(false);
    }
  };

  // ============================================
  // 🆕 START CAMPAIGN FROM MODAL (STEP 2)
  // ============================================
  
  const handleStartCampaignFromModal = async () => {
    if (totalRecipients === 0) {
      toast.error('⚠️ Please add at least one recipient before starting the campaign');
      return;
    }

    if (!window.confirm(
      `Are you sure you want to start calling ${totalRecipients} recipient(s)?\n\n` +
      `Campaign: ${formData.campaign_name || formData.campaign_id}\n` +
      `This will initiate automated phone calls.`
    )) {
      return;
    }

    setStartingCampaign(true);
    try {
      await bulkCampaignService.startCampaign(createdCampaignId, 1); // 1 concurrent call
      
      toast.success(
        `🚀 Campaign Started!\n` +
        `📞 Making calls to ${totalRecipients} recipients...\n` +
        `You can monitor progress in the campaign list.`,
        { duration: 5000 }
      );
      
      // Close modal and refresh campaigns list
      resetModal();
      fetchCampaigns();
      
    } catch (error) {
      console.error('Start campaign error:', error);
      toast.error(error.response?.data?.detail || 'Failed to start campaign');
    } finally {
      setStartingCampaign(false);
    }
  };

  // ============================================
  // RESET & CLOSE MODAL
  // ============================================
  
  const resetModal = () => {
    setShowCreateModal(false);
    setStep(1);
    setFormData({
      campaign_id: '',
      campaign_name: '',
      custom_ai_script: ''
    });
    setCreatedCampaignId(null);
    setCreatedCampaign(null);
    setTotalRecipients(0);
    setCsvFile(null);
    setUploadStats(null);
    setManualRecipients([{ phone_number: '', name: '' }]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ============================================
  // START/PAUSE/DELETE CAMPAIGN (FROM LIST)
  // ============================================
  
  const handleStartCampaignFromList = async (campaignId, maxConcurrent = 1) => {
    try {
      await bulkCampaignService.startCampaign(campaignId, maxConcurrent);
      toast.success('📞 Campaign started! Calls are being made...');
      
      // Start polling for status updates
      const interval = setInterval(async () => {
        try {
          const status = await bulkCampaignService.getCampaignStatus(campaignId);
          setCampaignStatus(status);
          
          if (status.status === 'completed' || status.status === 'failed') {
            clearInterval(interval);
            setPollingInterval(null);
          }
        } catch (error) {
          console.error('Status poll error:', error);
        }
      }, 5000);
      
      setPollingInterval(interval);
      fetchCampaigns();
    } catch (error) {
      console.error('Start campaign error:', error);
      toast.error(error.response?.data?.detail || 'Failed to start campaign');
    }
  };

  const handlePauseCampaign = async (campaignId) => {
    try {
      await bulkCampaignService.pauseCampaign(campaignId);
      toast.success('⏸️ Campaign paused');
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
      fetchCampaigns();
    } catch (error) {
      console.error('Pause campaign error:', error);
      toast.error('Failed to pause campaign');
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    try {
      await bulkCampaignService.deleteCampaign(campaignId);
      toast.success('🗑️ Campaign deleted');
      fetchCampaigns();
    } catch (error) {
      console.error('Delete campaign error:', error);
      toast.error('Failed to delete campaign');
    }
  };

  const handleViewCampaignDetails = async (campaign) => {
    try {
      const status = await bulkCampaignService.getCampaignStatus(campaign.campaign_id);
      setSelectedCampaign(campaign);
      setCampaignStatus(status);
    } catch (error) {
      console.error('Get status error:', error);
      toast.error('Failed to load campaign details');
    }
  };

  // ============================================
  // DOWNLOAD CSV TEMPLATE
  // ============================================
  
  const downloadCSVTemplate = () => {
    const csvContent = 'phone_number,name,email\n+1234567890,John Doe,john@example.com\n+9876543210,Jane Smith,jane@example.com';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_call_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('📥 Template downloaded');
  };

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Phone className="text-blue-600" />
            Bulk Call Campaigns
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage automated bulk calling campaigns
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={20} className="mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Campaigns List */}
      {loadingCampaigns ? (
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <Loader className="animate-spin text-blue-600" size={32} />
          </div>
        </Card>
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={<Phone size={64} />}
          title="No campaigns yet"
          description="Create your first bulk call campaign to get started"
          action={
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus size={20} className="mr-2" />
              Create Campaign
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {campaign.campaign_name || campaign.campaign_id}
                    </h3>
                    <Badge
                      variant={
                        campaign.status === 'running' ? 'success' :
                        campaign.status === 'paused' ? 'warning' :
                        campaign.status === 'completed' ? 'info' :
                        campaign.status === 'failed' ? 'danger' :
                        'default'
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Campaign ID: <span className="font-mono">{campaign.campaign_id}</span>
                  </p>
                  
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Recipients</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {campaign.total_recipients || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">
                        {campaign.completed_calls || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Successful</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {campaign.successful_calls || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Appointments</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {campaign.appointments_booked || 0}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  {campaign.total_recipients > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold text-gray-900">
                          {Math.round(((campaign.completed_calls || 0) / campaign.total_recipients) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(((campaign.completed_calls || 0) / campaign.total_recipients) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Custom AI Script Preview */}
                  {campaign.custom_ai_script && (
                    <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-sm font-semibold text-purple-900 mb-1">
                        <Bot className="inline mr-1" size={16} />
                        Custom AI Script:
                      </p>
                      <p className="text-sm text-purple-800 line-clamp-2">
                        {campaign.custom_ai_script}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {campaign.status === 'ready' || campaign.status === 'paused' ? (
                    <Button
                      onClick={() => handleStartCampaignFromList(campaign.campaign_id, 1)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Play size={18} className="mr-1" />
                      Start
                    </Button>
                  ) : campaign.status === 'running' ? (
                    <Button
                      onClick={() => handlePauseCampaign(campaign.campaign_id)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      <Pause size={18} className="mr-1" />
                      Pause
                    </Button>
                  ) : null}
                  
                  <Button
                    variant="outline"
                    onClick={() => handleViewCampaignDetails(campaign)}
                  >
                    View Details
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteCampaign(campaign.campaign_id)}
                    className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={resetModal}
          title={step === 1 ? 'Create Bulk Call Campaign' : 'Add Recipients'}
          size="large"
        >
          <div className="space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-4 pb-6 border-b">
              <div className={`flex items-center gap-2 ${step === 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span className="font-medium">Campaign Details</span>
              </div>
              
              <div className="w-16 h-0.5 bg-gray-300"></div>
              
              <div className={`flex items-center gap-2 ${step === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span className="font-medium">Add Recipients</span>
              </div>
            </div>

            {/* Step 1: Campaign Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Campaign ID * 
                    <span className="text-gray-500 font-normal ml-2">(letters, numbers, hyphens only)</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., summer-promo-2024"
                    value={formData.campaign_id}
                    onChange={(e) => setFormData({...formData, campaign_id: e.target.value})}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Campaign Name <span className="text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Summer Promotion 2024"
                    value={formData.campaign_name}
                    onChange={(e) => setFormData({...formData, campaign_name: e.target.value})}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customize AI Agent Script <span className="text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    rows="8"
                    placeholder="Example: You are a friendly sales representative for Elite Cars. Always mention our summer sale with 20% off, free maintenance for 1 year, and best drives available this weekend. Be enthusiastic and encouraging."
                    value={formData.custom_ai_script}
                    onChange={(e) => setFormData({...formData, custom_ai_script: e.target.value})}
                  />
                  <div className="mt-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-semibold text-purple-900 mb-2">
                      📌 How Custom AI Script Works:
                    </p>
                    <ul className="text-sm text-purple-800 space-y-1 list-disc list-inside">
                      <li>This script is <strong>NOT</strong> sent to customers directly</li>
                      <li>AI uses it as instructions when generating responses</li>
                      <li>Customers asking to book appointments will still enter booking flow</li>
                      <li>Campaign Builder keywords will still be matched first</li>
                      <li>Leave empty to use default AI behavior</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={resetModal}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateCampaign} 
                    disabled={!formData.campaign_id.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Next: Add Recipients
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Add Recipients */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Recipient Count Display */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="text-blue-600" size={20} />
                      <span className="font-semibold text-blue-900">
                        Total Recipients Added:
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {totalRecipients}
                    </span>
                  </div>
                </div>

                {/* CSV Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-500 transition-colors">
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      📁 CSV Upload
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Upload a CSV or Excel file with phone numbers and names
                    </p>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        variant="outline"
                      >
                        <Upload size={18} className="mr-2" />
                        Choose File
                      </Button>
                      
                      <Button
                        onClick={downloadCSVTemplate}
                        variant="outline"
                      >
                        <Download size={18} className="mr-2" />
                        Download Template
                      </Button>
                    </div>
                    
                    {csvFile && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">
                          📎 Selected: {csvFile.name}
                        </p>
                        {!uploadStats && (
                          <Button
                            onClick={handleUploadCSV}
                            disabled={uploading}
                            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {uploading ? (
                              <>
                                <Loader className="animate-spin mr-2" size={18} />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload size={18} className="mr-2" />
                                Upload Recipients
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {uploadStats && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <CheckCircle className="text-green-600" size={20} />
                          <p className="font-semibold text-green-900">Upload Complete!</p>
                        </div>
                        <div className="text-sm text-green-800 space-y-1">
                          <p>✅ Valid numbers: {uploadStats.added}</p>
                          {uploadStats.duplicates > 0 && (
                            <p>⚠️ Duplicates skipped: {uploadStats.duplicates}</p>
                          )}
                          <p className="font-semibold mt-2">
                            Total in campaign: {uploadStats.total || totalRecipients}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Manual Entry Section */}
                <div className="border-2 border-gray-300 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Users className="text-blue-600" size={20} />
                        Or Add Manually
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Enter phone numbers and names manually (max 10 at a time)
                      </p>
                    </div>
                    <Button
                      onClick={addManualRecipient}
                      disabled={manualRecipients.length >= 10}
                      variant="outline"
                    >
                      <Plus size={18} className="mr-2" />
                      Add Row
                    </Button>
                  </div>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {manualRecipients.map((recipient, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1">
                          <Input
                            type="tel"
                            placeholder="+1234567890"
                            value={recipient.phone_number}
                            onChange={(e) => updateManualRecipient(index, 'phone_number', e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            type="text"
                            placeholder="Customer Name (optional)"
                            value={recipient.name}
                            onChange={(e) => updateManualRecipient(index, 'name', e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <Button
                          onClick={() => removeManualRecipient(index)}
                          variant="outline"
                          disabled={manualRecipients.length === 1}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <Button
                      onClick={handleAddManualRecipients}
                      disabled={!manualRecipients.some(r => r.phone_number.trim()) || addingManual}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {addingManual ? (
                        <>
                          <Loader className="animate-spin mr-2" size={18} />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus size={18} className="mr-2" />
                          Add {manualRecipients.filter(r => r.phone_number.trim()).length} Recipient(s)
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* 🆕 START CAMPAIGN BUTTON */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Rocket className="text-green-600" size={24} />
                        Ready to Start?
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Campaign has <strong>{totalRecipients} recipient(s)</strong>. 
                        Click below to start automated calling.
                      </p>
                    </div>
                    
                    <Button
                      onClick={handleStartCampaignFromModal}
                      disabled={totalRecipients === 0 || startingCampaign}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-lg px-8 py-4"
                    >
                      {startingCampaign ? (
                        <>
                          <Loader className="animate-spin mr-2" size={20} />
                          Starting...
                        </>
                      ) : (
                        <>
                          <Rocket size={20} className="mr-2" />
                          Start Campaign
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    ← Back
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetModal}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Campaign Details Modal */}
      {selectedCampaign && campaignStatus && (
        <Modal
          isOpen={!!selectedCampaign}
          onClose={() => {
            setSelectedCampaign(null);
            setCampaignStatus(null);
          }}
          title="Campaign Details"
          size="xl"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedCampaign.campaign_name || selectedCampaign.campaign_id}
              </h3>
              <p className="text-sm text-gray-600">
                Campaign ID: <span className="font-mono">{selectedCampaign.campaign_id}</span>
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Recipients</p>
                <p className="text-2xl font-bold text-gray-900">{campaignStatus.total_recipients}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Completed Calls</p>
                <p className="text-2xl font-bold text-blue-600">{campaignStatus.completed_calls}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Successful Calls</p>
                <p className="text-2xl font-bold text-green-600">{campaignStatus.successful_calls}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Appointments Booked</p>
                <p className="text-2xl font-bold text-purple-600">{campaignStatus.appointments_booked}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Progress: {campaignStatus.progress_percentage.toFixed(1)}%</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${campaignStatus.progress_percentage}%` }}
                />
              </div>
            </div>
            
            {selectedCampaign.custom_ai_script && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm font-semibold text-purple-900 mb-2">
                  <Bot className="inline mr-1" size={16} />
                  Custom AI Script:
                </p>
                <p className="text-sm text-purple-800 whitespace-pre-wrap">
                  {selectedCampaign.custom_ai_script}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BulkCampaign;