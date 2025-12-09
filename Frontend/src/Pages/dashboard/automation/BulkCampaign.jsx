// frontend/src/pages/dashboard/automation/BulkCampaign.jsx
import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Upload, 
  X, 
  Plus, 
  Send, 
  FileText,
  Users,
  Loader,
  CheckCircle,
  AlertCircle,
  Bot
} from 'lucide-react';
import smsCampaignService from '../../../services/smsCampaign';

const BulkCampaign = () => {
  // ============================================
  // STATE
  // ============================================
  
  const [campaignId, setCampaignId] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [message, setMessage] = useState('');
  const [customAiScript, setCustomAiScript] = useState(''); // 🆕 ADD CUSTOM AI SCRIPT
  const [messageSource, setMessageSource] = useState('text'); // 'text' or 'document'
  
  // Manual recipients
  const [manualRecipients, setManualRecipients] = useState([
    { phone_number: '', name: '' },
    { phone_number: '', name: '' },
    { phone_number: '', name: '' }
  ]);
  
  // CSV upload
  const [csvFile, setCsvFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState(null);
  
  // Document upload for message
  const [messageFile, setMessageFile] = useState(null);
  
  // Campaign status
  const [isCreating, setIsCreating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [createdCampaign, setCreatedCampaign] = useState(null);
  const [campaignStatus, setCampaignStatus] = useState(null);
  
  // Refs
  const csvInputRef = useRef(null);
  const messageFileRef = useRef(null);

  // ============================================
  // HANDLERS - MANUAL RECIPIENTS
  // ============================================
  
  const addRecipientRow = () => {
    setManualRecipients([...manualRecipients, { phone_number: '', name: '' }]);
  };
  
  const removeRecipientRow = (index) => {
    if (manualRecipients.length > 1) {
      setManualRecipients(manualRecipients.filter((_, i) => i !== index));
    }
  };
  
  const updateRecipient = (index, field, value) => {
    const updated = [...manualRecipients];
    updated[index][field] = value;
    setManualRecipients(updated);
  };

  // ============================================
  // HANDLERS - CSV UPLOAD
  // ============================================
  
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }
    
    setCsvFile(file);
    
    // Preview CSV
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const preview = smsCampaignService.parseCSVPreview(content);
      
      if (preview.success) {
        setCsvPreview(preview);
        toast.success(`Loaded ${preview.total} recipients from CSV`);
      } else {
        toast.error(`CSV Error: ${preview.error}`);
        setCsvFile(null);
      }
    };
    reader.readAsText(file);
  };

  // ============================================
  // HANDLERS - MESSAGE DOCUMENT UPLOAD
  // ============================================
  
  const handleMessageFileUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    if (!file.name.endsWith('.txt')) {
      toast.error('Please upload a .txt file');
      return;
    }
    
    setMessageFile(file);
    
    // Read file content
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setMessage(content.substring(0, 1600)); // Limit to max SMS length
      toast.success('Message loaded from file');
    };
    reader.readAsText(file);
  };

  // ============================================
  // VALIDATION
  // ============================================
  
  const validateForm = () => {
    if (!campaignId.trim()) {
      toast.error('Please enter a Campaign ID');
      return false;
    }
    
    if (!message.trim()) {
      toast.error('Please enter a message');
      return false;
    }
    
    // Check if we have recipients (either manual or CSV)
    const hasManualRecipients = manualRecipients.some(r => r.phone_number.trim());
    const hasCSVRecipients = csvFile !== null;
    
    if (!hasManualRecipients && !hasCSVRecipients) {
      toast.error('Please add at least one recipient (manually or via CSV)');
      return false;
    }
    
    return true;
  };

  // ============================================
  // CREATE CAMPAIGN
  // ============================================
  
  const handleCreateCampaign = async () => {
    if (!validateForm()) return;
    
    try {
      setIsCreating(true);
      
      // Filter manual recipients
      const recipients = manualRecipients
        .filter(r => r.phone_number.trim())
        .map(r => ({
          phone_number: r.phone_number.trim(),
          name: r.name.trim() || null
        }));
      
      // Create campaign
      const campaign = await smsCampaignService.createCampaign({
        campaign_id: campaignId.trim(),
        campaign_name: campaignName.trim() || null,
        message: message.trim(),
        custom_ai_script: customAiScript.trim() || null,  // 🆕 ADD THIS
        recipients: recipients,
        batch_size: 25,
        enable_replies: true,
        track_responses: true
      });
      
      setCreatedCampaign(campaign);
      toast.success('Campaign created successfully!');
      
      // If CSV file exists, upload it
      if (csvFile) {
        await handleUploadCSV(campaign._id);
      }
      
    } catch (error) {
      console.error('Create campaign error:', error);
      toast.error(error.response?.data?.detail || 'Failed to create campaign');
    } finally {
      setIsCreating(false);
    }
  };

  // ============================================
  // UPLOAD CSV TO EXISTING CAMPAIGN
  // ============================================
  
  const handleUploadCSV = async (campaignObjId) => {
    if (!csvFile) return;
    
    try {
      const result = await smsCampaignService.uploadCSV(campaignId, csvFile);
      
      toast.success(
        `Added ${result.added_count} recipients from CSV` +
        (result.duplicates > 0 ? ` (${result.duplicates} duplicates skipped)` : '')
      );
      
      // Refresh campaign details
      const updated = await smsCampaignService.getCampaign(campaignId);
      setCreatedCampaign(updated);
      
    } catch (error) {
      console.error('CSV upload error:', error);
      toast.error(error.response?.data?.detail || 'Failed to upload CSV');
    }
  };

  // ============================================
  // START CAMPAIGN
  // ============================================
  
  const handleStartCampaign = async () => {
    if (!createdCampaign) {
      toast.error('Please create a campaign first');
      return;
    }
    
    if (createdCampaign.total_recipients === 0) {
      toast.error('Campaign has no recipients');
      return;
    }
    
    try {
      setIsSending(true);
      
      await smsCampaignService.startCampaign(campaignId);
      
      toast.success('Campaign started! Messages are being sent...');
      
      // Start polling for status
      pollCampaignStatus();
      
    } catch (error) {
      console.error('Start campaign error:', error);
      toast.error(error.response?.data?.detail || 'Failed to start campaign');
      setIsSending(false);
    }
  };

  // ============================================
  // POLL CAMPAIGN STATUS
  // ============================================
  
  const pollCampaignStatus = () => {
    const interval = setInterval(async () => {
      try {
        const status = await smsCampaignService.getCampaignStatus(campaignId);
        setCampaignStatus(status);
        
        // Stop polling when completed
        if (['completed', 'completed_with_errors', 'failed'].includes(status.status)) {
          clearInterval(interval);
          setIsSending(false);
          
          if (status.status === 'completed') {
            toast.success(`Campaign completed! Sent ${status.sent_count} messages`);
          } else if (status.status === 'completed_with_errors') {
            toast.warning(
              `Campaign completed with ${status.failed_count} failures out of ${status.total_recipients}`
            );
          } else {
            toast.error('Campaign failed');
          }
        }
      } catch (error) {
        console.error('Status poll error:', error);
        clearInterval(interval);
        setIsSending(false);
      }
    }, 3000); // Poll every 3 seconds
  };

  // ============================================
  // RESET FORM
  // ============================================
  
  const handleReset = () => {
    setCampaignId('');
    setCampaignName('');
    setMessage('');
    setCustomAiScript('');  // 🆕 ADD THIS
    setManualRecipients([
      { phone_number: '', name: '' },
      { phone_number: '', name: '' },
      { phone_number: '', name: '' }
    ]);
    setCsvFile(null);
    setCsvPreview(null);
    setMessageFile(null);
    setCreatedCampaign(null);
    setCampaignStatus(null);
    setMessageSource('text');
  };

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="text-blue-600" />
          Bulk SMS Campaign
        </h1>
        <p className="text-gray-600 mt-2">
          Send SMS messages to multiple recipients with AI-powered responses
        </p>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        
        {/* Campaign ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign ID *
          </label>
          <input
            type="text"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="bulk-campaign-001"
            disabled={createdCampaign !== null}
          />
          <p className="text-sm text-gray-500 mt-1">
            Unique identifier for this campaign (letters, numbers, hyphens, underscores only)
          </p>
        </div>

        {/* Campaign Name (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Name (Optional)
          </label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Summer Promotion 2024"
            disabled={createdCampaign !== null}
          />
        </div>

        {/* CSV Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Upload className="text-blue-600" size={20} />
                CSV Upload
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Upload a CSV file with phone numbers and names
              </p>
            </div>
            
            <button
              onClick={() => csvInputRef.current?.click()}
              disabled={createdCampaign !== null}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Upload size={18} />
              Choose File
            </button>
          </div>
          
          <input
            ref={csvInputRef}
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
          />
          
          {csvFile && csvPreview && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-green-900">
                    ✅ {csvFile.name}
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    {csvPreview.total} recipients loaded
                    {csvPreview.has_more && ' (showing first 100)'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCsvFile(null);
                    setCsvPreview(null);
                  }}
                  className="text-red-600 hover:text-red-800"
                  disabled={createdCampaign !== null}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Manual Recipients Section */}
        <div className="border-2 border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Or Add Manually
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Enter phone numbers and names manually
              </p>
            </div>
            
            <button
              onClick={addRecipientRow}
              disabled={createdCampaign !== null}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus size={18} />
              Add Row
            </button>
          </div>
          
          <div className="space-y-3">
            {manualRecipients.map((recipient, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={recipient.phone_number}
                  onChange={(e) => updateRecipient(index, 'phone_number', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1234567890"
                  disabled={createdCampaign !== null}
                />
                <input
                  type="text"
                  value={recipient.name}
                  onChange={(e) => updateRecipient(index, 'name', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Name (optional)"
                  disabled={createdCampaign !== null}
                />
                
                {manualRecipients.length > 1 && (
                  <button
                    onClick={() => removeRecipientRow(index)}
                    disabled={createdCampaign !== null}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Message Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Message *
          </label>
          
          {/* Message Source Toggle */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setMessageSource('text')}
              disabled={createdCampaign !== null}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                messageSource === 'text'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } disabled:opacity-50`}
            >
              <FileText size={18} className="inline mr-2" />
              Type Message
            </button>
            
            <button
              onClick={() => setMessageSource('document')}
              disabled={createdCampaign !== null}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                messageSource === 'document'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } disabled:opacity-50`}
            >
              <Upload size={18} className="inline mr-2" />
              Upload Document
            </button>
          </div>
          
          {/* Text Input */}
          {messageSource === 'text' && (
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              maxLength={1600}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder="Enter your SMS message here..."
              disabled={createdCampaign !== null}
            />
          )}
          
          {/* Document Upload */}
          {messageSource === 'document' && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                ref={messageFileRef}
                type="file"
                accept=".txt"
                onChange={handleMessageFileUpload}
                className="hidden"
              />
              
              {!messageFile ? (
                <div className="text-center">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <button
                    onClick={() => messageFileRef.current?.click()}
                    disabled={createdCampaign !== null}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Upload Text File (.txt)
                  </button>
                  <p className="text-sm text-gray-600 mt-2">
                    Upload a .txt file containing your message
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-900">
                        ✅ {messageFile.name}
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Message loaded ({message.length} characters)
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setMessageFile(null);
                        setMessage('');
                      }}
                      className="text-red-600 hover:text-red-800"
                      disabled={createdCampaign !== null}
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="mt-4 p-3 bg-white rounded border border-green-300">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                      {message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-600">
              {message.length} / 1600 characters
              {message.length > 160 && (
                <span className="ml-2 text-orange-600">
                  (Will be sent as {Math.ceil(message.length / 160)} SMS)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* 🆕 Custom AI Script Section */}
        <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Bot size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Customize AI Agent Script (Optional)
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Define how your AI should respond to customer replies. This script guides the AI's behavior and personality.
              </p>
            </div>
          </div>
          
          <textarea
            value={customAiScript}
            onChange={(e) => setCustomAiScript(e.target.value)}
            rows={6}
            maxLength={2000}
            className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
            placeholder="Example: You are a sales representative for Elite Cars. Always mention our summer sale with 20% off, free maintenance for 1 year, and test drives available this weekend. Be friendly and encouraging."
            disabled={createdCampaign !== null}
          />
          
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-600">
              {customAiScript.length} / 2000 characters
            </p>
            <button
              onClick={() => setCustomAiScript('')}
              disabled={!customAiScript || createdCampaign !== null}
              className="text-sm text-purple-600 hover:text-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Script
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
            <p className="text-sm font-medium text-purple-900 mb-2">
              💡 How Custom AI Script Works:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>• This script is NOT sent to customers directly</li>
              <li>• AI uses it as instructions when generating responses</li>
              <li>• Customers asking to book appointments will still enter booking flow</li>
              <li>• Campaign Builder keywords will still be matched first</li>
              <li>• Leave empty to use default AI behavior</li>
            </ul>
          </div>

          {/* Preview Badge */}
          {customAiScript.trim() && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              <CheckCircle size={16} />
              Custom AI Script Active
            </div>
          )}
        </div>

        {/* Campaign Status */}
        {createdCampaign && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Campaign Created</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Campaign ID:</span>
                <span className="ml-2 font-medium">{createdCampaign.campaign_id}</span>
              </div>
              <div>
                <span className="text-gray-600">Total Recipients:</span>
                <span className="ml-2 font-medium">{createdCampaign.total_recipients}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-medium capitalize">{createdCampaign.status}</span>
              </div>
              <div>
                <span className="text-gray-600">Batch Size:</span>
                <span className="ml-2 font-medium">{createdCampaign.batch_size}</span>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {campaignStatus && campaignStatus.status === 'in_progress' && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-yellow-900">Sending in Progress...</span>
              <span className="text-sm text-yellow-700">
                Batch {campaignStatus.current_batch} / {campaignStatus.total_batches}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${campaignStatus.progress_percentage}%` }}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <CheckCircle size={16} className="inline text-green-600 mr-1" />
                Sent: {campaignStatus.sent_count}
              </div>
              <div>
                <AlertCircle size={16} className="inline text-red-600 mr-1" />
                Failed: {campaignStatus.failed_count}
              </div>
              <div className="text-right">
                {campaignStatus.progress_percentage.toFixed(1)}% Complete
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          {!createdCampaign ? (
            <>
              <button
                onClick={handleCreateCampaign}
                disabled={isCreating}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
              >
                {isCreating ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Creating Campaign...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Create Campaign
                  </>
                )}
              </button>
              
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Reset
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleStartCampaign}
                disabled={isSending || createdCampaign.status !== 'pending'}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
              >
                {isSending ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Sending Messages...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Start Bulk Campaign
                  </>
                )}
              </button>
              
              <button
                onClick={handleReset}
                disabled={isSending}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                New Campaign
              </button>
            </>
          )}
        </div>

        {/* Help Text */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">How it works:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Enter a unique Campaign ID</li>
            <li>Upload a CSV file with phone numbers OR enter them manually</li>
            <li>Type your message or upload a text document</li>
            <li>Customize AI behavior with a custom script (optional)</li>
            <li>Click "Create Campaign" to prepare</li>
            <li>Click "Start Bulk Campaign" to send to all recipients</li>
            <li>When customers reply, AI will automatically respond with:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>Appointment booking if they ask to schedule</li>
                <li>Campaign Builder responses if keywords match</li>
                <li>Smart OpenAI responses using your custom script</li>
                <li>Default AI responses for general questions</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default BulkCampaign;
