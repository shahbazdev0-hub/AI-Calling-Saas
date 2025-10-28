//  frontend/src/Components/forms/AgentForm.jsx - implemented campaign builder 

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, Save, Play } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import { voiceService } from "../../services/voice";
import { flowService } from "../../services/flow";
import toast from "react-hot-toast";

// ✅ SIMPLIFIED SCHEMA - Only essential fields
const agentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
  voice_id: z.string().min(1, 'Voice is required'),
  workflow_id: z.string().optional(),
  stability: z.number().min(0).max(1).default(0.5),
  similarity_boost: z.number().min(0).max(1).default(0.75)
});

const AgentForm = ({ agent = null, onSuccess, onCancel }) => {
  const [voices, setVoices] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [isLoadingWorkflows, setIsLoadingWorkflows] = useState(true);
  const [isTesting, setIsTesting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(agentSchema),
    defaultValues: agent ? {
      name: agent.name || '',
      description: agent.description || '',
      voice_id: agent.voice_id || '',
      workflow_id: agent.workflow_id || '',
      stability: agent.voice_settings?.stability || 0.5,
      similarity_boost: agent.voice_settings?.similarity_boost || 0.75
    } : {
      name: '',
      description: '',
      voice_id: '',
      workflow_id: '',
      stability: 0.5,
      similarity_boost: 0.75
    }
  });

  const selectedVoiceId = watch('voice_id');
  const selectedWorkflowId = watch('workflow_id');
  const stability = watch('stability');
  const similarityBoost = watch('similarity_boost');

  // Load ElevenLabs voices
  useEffect(() => {
    loadVoices();
  }, []);

  // Load workflows
  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadVoices = async () => {
    try {
      setIsLoadingVoices(true);
      const result = await voiceService.getAvailableVoices();
      
      if (result.voices && Array.isArray(result.voices)) {
        setVoices(result.voices);
        console.log('✅ Loaded voices:', result.voices.length);
      } else {
        console.error('❌ Invalid voices response:', result);
        toast.error('Failed to load voices');
      }
    } catch (error) {
      console.error('❌ Error loading voices:', error);
      toast.error('Failed to load voices');
    } finally {
      setIsLoadingVoices(false);
    }
  };

  const loadWorkflows = async () => {
    try {
      setIsLoadingWorkflows(true);
      const result = await flowService.getFlows();
      
      if (result.flows && Array.isArray(result.flows)) {
        // Filter only active workflows
        const activeWorkflows = result.flows.filter(w => w.active !== false);
        setWorkflows(activeWorkflows);
        console.log('✅ Loaded workflows:', activeWorkflows.length);
      } else {
        console.error('❌ Invalid workflows response:', result);
        setWorkflows([]);
      }
    } catch (error) {
      console.error('❌ Error loading workflows:', error);
      toast.error('Failed to load workflows');
      setWorkflows([]);
    } finally {
      setIsLoadingWorkflows(false);
    }
  };

  const testVoice = async () => {
    if (!selectedVoiceId) {
      toast.error('Please select a voice first');
      return;
    }

    try {
      setIsTesting(true);
      
      const result = await voiceService.testVoice({
        text: 'Hello! This is a test of my voice. How does it sound?',
        voice_id: selectedVoiceId
      });
      
      if (result.success && result.audio_url) {
        // Play the audio
        const audio = new Audio(`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}${result.audio_url}`);
        audio.play();
        toast.success('Playing voice sample');
      } else {
        toast.error('Failed to test voice');
      }
    } catch (error) {
      console.error('Voice test failed:', error);
      toast.error('Failed to test voice');
    } finally {
      setIsTesting(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // ✅ Prepare agent data matching backend schema
      const agentData = {
        name: data.name,
        description: data.description || null,
        voice_id: data.voice_id,
        workflow_id: data.workflow_id || null,
        system_prompt: "You are a helpful and professional AI assistant for customer support. Be friendly, clear, and concise in your responses.",
        greeting_message: "Hello! How can I help you today?",
        stability: data.stability,
        similarity_boost: data.similarity_boost,
        is_active: true
      };

      console.log('📤 Sending agent data:', agentData);

      let result;
      if (agent) {
        // Update existing agent
        result = await voiceService.updateAgent(agent._id, agentData);
        toast.success('Agent updated successfully!');
      } else {
        // Create new agent
        result = await voiceService.createAgent(agentData);
        toast.success('Agent created successfully!');
      }

      console.log('✅ Agent saved:', result);

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('❌ Failed to save agent:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to save agent';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Bot size={20} className="mr-2 text-[#f2070d]" />
          Agent Information
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agent Name *
          </label>
          <Input
            {...register('name')}
            placeholder="e.g., Customer Support Agent"
            error={errors.name?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <Textarea
            {...register('description')}
            placeholder="Brief description of this agent's purpose..."
            rows={2}
            error={errors.description?.message}
          />
        </div>
      </div>

      {/* AI Campaign Workflow Selection */}
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-900">
          AI Campaign Flow (Optional)
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conversation Workflow
          </label>
          
          {isLoadingWorkflows ? (
            <div className="text-sm text-gray-500">Loading workflows...</div>
          ) : (
            <>
              <select
                {...register('workflow_id')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-transparent"
              >
                <option value="">No Workflow (OpenAI Only)</option>
                {workflows.map(workflow => (
                  <option key={workflow._id} value={workflow._id}>
                    {workflow.name}
                    {workflow.description ? ` - ${workflow.description}` : ''}
                  </option>
                ))}
              </select>
              
              <p className="text-xs text-gray-500 mt-2">
                {selectedWorkflowId 
                  ? '✅ Agent will follow this workflow first, then use OpenAI for undefined queries'
                  : 'Agent will use OpenAI responses only'
                }
              </p>
            </>
          )}
        </div>
      </div>

      {/* Voice Settings */}
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-900">
          Voice Settings
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Voice *
          </label>
          
          {isLoadingVoices ? (
            <div className="text-sm text-gray-500">Loading voices...</div>
          ) : (
            <>
              <select
                {...register('voice_id')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-transparent ${
                  errors.voice_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a voice</option>
                {voices.map(voice => (
                  <option key={voice.voice_id} value={voice.voice_id}>
                    {voice.name}
                    {voice.labels?.accent ? ` (${voice.labels.accent})` : ''}
                    {voice.labels?.gender ? ` - ${voice.labels.gender}` : ''}
                  </option>
                ))}
              </select>
              
              {errors.voice_id && (
                <p className="text-sm text-red-500 mt-1">{errors.voice_id.message}</p>
              )}
              
              {selectedVoiceId && (
                <Button
                  type="button"
                  onClick={testVoice}
                  disabled={isTesting}
                  variant="outline"
                  className="mt-2"
                >
                  <Play size={16} className="mr-2" />
                  {isTesting ? 'Testing...' : 'Test Voice'}
                </Button>
              )}
            </>
          )}
        </div>

        {/* Voice Quality Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stability: {stability.toFixed(2)}
            </label>
            <input
              type="range"
              {...register('stability', { valueAsNumber: true })}
              min="0"
              max="1"
              step="0.01"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Higher = more consistent, Lower = more expressive
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Similarity Boost: {similarityBoost.toFixed(2)}
            </label>
            <input
              type="range"
              {...register('similarity_boost', { valueAsNumber: true })}
              min="0"
              max="1"
              step="0.01"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Higher = closer to original voice
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t">
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="outline">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading || isLoadingVoices}>
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} className="mr-2" />
              {agent ? 'Update Agent' : 'Create Agent'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default AgentForm;