// Components/forms/CallForm.jsx - ✅ FIXED WITH BULK CALLING SUPPORT
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, User, AlertCircle, Users } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { voiceService } from "../../services/voice";
import { callService } from "../../services/call";
import toast from "react-hot-toast";

// Schema without phone number - it comes from agent
const callSchema = z.object({
  agentId: z.string().min(1, 'AI Agent is required'),
  contactName: z.string().optional(),
  notes: z.string().optional(),
});

const CallForm = ({ onSuccess, onCancel }) => {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(callSchema),
    defaultValues: {
      agentId: '',
      contactName: '',
      notes: ''
    }
  });

  const selectedAgentId = watch('agentId');

  // Load available agents
  useEffect(() => {
    loadAgents();
  }, []);

  // Update selected agent when agentId changes
  useEffect(() => {
    if (selectedAgentId && agents.length > 0) {
      const agent = agents.find(a => a._id === selectedAgentId);
      setSelectedAgent(agent);
      console.log('✅ Selected agent:', agent);
      console.log('📞 Agent calling mode:', agent?.calling_mode);
      console.log('📞 Agent contacts:', agent?.contacts?.length);
    } else {
      setSelectedAgent(null);
    }
  }, [selectedAgentId, agents]);

  const loadAgents = async () => {
    try {
      setIsLoadingAgents(true);
      const result = await voiceService.getAgents();
      
      if (result.agents && Array.isArray(result.agents)) {
        // Filter only active agents
        const activeAgents = result.agents.filter(agent => agent.is_active);
        setAgents(activeAgents);
        console.log('✅ Loaded agents:', activeAgents.length);
      } else {
        console.error('❌ Invalid agents response:', result);
        toast.error('Failed to load AI agents');
      }
    } catch (error) {
      console.error('❌ Error loading agents:', error);
      toast.error('Failed to load AI agents');
    } finally {
      setIsLoadingAgents(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (!selectedAgent) {
        toast.error('Please select an agent');
        return;
      }

      if (!selectedAgent.contacts || selectedAgent.contacts.length === 0) {
        toast.error('Selected agent has no contacts. Please update the agent configuration.');
        return;
      }

      // ✅ CHECK CALLING MODE
      if (selectedAgent.calling_mode === 'bulk') {
        // ============================================
        // BULK CALLING - Call all contacts
        // ============================================
        console.log(`🚀 Starting BULK campaign for ${selectedAgent.contacts.length} contacts`);
        
        try {
          const result = await voiceService.executeBulkCampaign(selectedAgent._id);
          
          if (result.success) {
            toast.success(`✅ Bulk campaign started! Calling ${selectedAgent.contacts.length} contacts...`);
            
            if (onSuccess) {
              onSuccess({
                type: 'bulk',
                agentId: selectedAgent._id,
                agentName: selectedAgent.name,
                totalContacts: selectedAgent.contacts.length,
                result: result
              });
            }
          } else {
            toast.error(result.error || 'Failed to start bulk campaign');
          }
        } catch (error) {
          console.error('❌ Bulk campaign error:', error);
          toast.error('Failed to start bulk campaign');
        }
        
      } else {
        // ============================================
        // SINGLE CALLING - Call first contact only
        // ============================================
        const phoneNumber = selectedAgent.contacts[0].phone;
        
        if (!phoneNumber) {
          toast.error('Agent contact is missing phone number');
          return;
        }

        const callData = {
          agentId: data.agentId,
          phoneNumber: phoneNumber,
          contactName: data.contactName || selectedAgent.contacts[0].name,
          notes: data.notes
        };

        console.log('📤 Starting SINGLE call with data:', callData);
        console.log('📞 Using phone number from agent:', phoneNumber);

        if (onSuccess) {
          onSuccess(callData);
        }
        
        toast.success('Call initiated!');
      }
      
    } catch (error) {
      console.error('❌ Error initiating call:', error);
      toast.error('Failed to initiate call');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* AI Agent Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <User size={16} />
          AI Agent <span className="text-red-500">*</span>
          <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            Recommended
          </span>
        </label>
        <select
          {...register('agentId')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          disabled={isLoadingAgents}
        >
          <option value="">Select an AI agent to handle the conversation intelligently</option>
          {agents.map((agent) => (
            <option key={agent._id} value={agent._id}>
              {agent.name} - {agent.calling_mode === 'bulk' ? `📞 Bulk (${agent.contacts?.length || 0} contacts)` : '☎️ Single'}
            </option>
          ))}
        </select>
        {errors.agentId && (
          <p className="mt-1 text-sm text-red-600">{errors.agentId.message}</p>
        )}
        
        {/* Show agent contact info when selected */}
        {selectedAgent && selectedAgent.contacts && selectedAgent.contacts.length > 0 && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              {selectedAgent.calling_mode === 'bulk' ? (
                <Users className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <Phone className="w-5 h-5 text-green-600 mt-0.5" />
              )}
              <div className="text-sm text-green-700">
                {selectedAgent.calling_mode === 'bulk' ? (
                  <>
                    <p className="font-medium">📞 Bulk Campaign Mode</p>
                    <p className="mt-1">Will call all {selectedAgent.contacts.length} contacts automatically</p>
                    <p className="text-xs mt-1 text-green-600">
                      First contact: {selectedAgent.contacts[0].name} - {selectedAgent.contacts[0].phone}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">Contact: {selectedAgent.contacts[0].name}</p>
                    <p className="mt-1">Phone: {selectedAgent.contacts[0].phone}</p>
                    {selectedAgent.contacts[0].email && (
                      <p>Email: {selectedAgent.contacts[0].email}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">AI Agent is Required</p>
              <p className="mt-1">
                {selectedAgent?.calling_mode === 'bulk' 
                  ? 'The system will automatically call all contacts in sequence with AI handling each conversation.'
                  : 'The AI agent will handle the conversation intelligently based on your configured scripts and settings.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Name (Optional) - Only for single calls */}
      {selectedAgent?.calling_mode !== 'bulk' && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <User size={16} />
            Contact Name (Optional)
          </label>
          <Input
            {...register('contactName')}
            type="text"
            placeholder="Enter contact name"
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave blank if contact name is not available
          </p>
        </div>
      )}

      {/* Call Notes (Optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Call Notes (Optional)
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          placeholder="Add any notes for this call..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || isLoadingAgents || !selectedAgent}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              {selectedAgent?.calling_mode === 'bulk' ? 'Starting Campaign...' : 'Starting...'}
            </>
          ) : (
            <>
              {selectedAgent?.calling_mode === 'bulk' ? (
                <>
                  <Users size={18} className="mr-2" />
                  Start Bulk Campaign
                </>
              ) : (
                <>
                  <Phone size={18} className="mr-2" />
                  Start Call
                </>
              )}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CallForm;