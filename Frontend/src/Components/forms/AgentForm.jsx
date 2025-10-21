// // frontend/src/Components/forms/AgentForm.jsx
// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Bot, Save } from "lucide-react";
// import Input from "../ui/Input";
// import Button from "../ui/Button";
// import Textarea from "../ui/Textarea";
// import { voiceService } from "../../services/voice";
// import toast from "react-hot-toast";

// const agentSchema = z.object({
//   name: z.string().min(1, 'Name is required').max(100),
//   description: z.string().optional(),
//   voice_id: z.string().min(1, 'Voice is required'),
//   system_prompt: z.string().min(10, 'System prompt must be at least 10 characters'),
//   greeting_message: z.string().min(1, 'Greeting message is required'),
//   stability: z.number().min(0).max(1).default(0.5),
//   similarity_boost: z.number().min(0).max(1).default(0.75)
// });

// const AgentForm = ({ agent = null, onSuccess, onCancel }) => {
//   const [voices, setVoices] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isTesting, setIsTesting] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//     setValue
//   } = useForm({
//     resolver: zodResolver(agentSchema),
//     defaultValues: agent || {
//       name: '',
//       description: '',
//       voice_id: '',
//       system_prompt: 'You are a helpful and professional AI assistant for customer support. Be friendly, clear, and concise in your responses.',
//       greeting_message: 'Hello! How can I help you today?',
//       stability: 0.5,
//       similarity_boost: 0.75
//     }
//   });

//   const selectedVoiceId = watch('voice_id');
//   const greetingMessage = watch('greeting_message');
//   const stability = watch('stability');
//   const similarityBoost = watch('similarity_boost');

//   useEffect(() => {
//     loadVoices();
//   }, []);

//   const loadVoices = async () => {
//     try {
//       const data = await voiceService.getAvailableVoices();
//       // Handle the response structure correctly
//       if (data && data.voices) {
//         setVoices(data.voices);
//       } else if (Array.isArray(data)) {
//         setVoices(data);
//       } else {
//         console.error('Unexpected voices data format:', data);
//         toast.error('Failed to load available voices');
//       }
//     } catch (error) {
//       console.error('Failed to load voices:', error);
//       toast.error('Failed to load available voices');
//     }
//   };

//   const testVoice = async () => {
//     if (!selectedVoiceId || !greetingMessage) {
//       toast.error('Please select a voice and enter a greeting message');
//       return;
//     }

//     setIsTesting(true);
//     try {
//       const result = await voiceService.testVoice({
//         text: greetingMessage,
//         voice_id: selectedVoiceId
//       });
      
//       // Play audio if URL is provided
//       if (result.audio_url) {
//         const audio = new Audio(result.audio_url);
//         audio.play();
//       }
      
//       toast.success('Voice test initiated (mock response)');
//     } catch (error) {
//       console.error('Voice test failed:', error);
//       toast.error('Failed to test voice');
//     } finally {
//       setIsTesting(false);
//     }
//   };

//   const onSubmit = async (data) => {
//     setIsLoading(true);
//     try {
//       const agentData = {
//         name: data.name,
//         description: data.description || null,
//         voice_id: data.voice_id,
//         system_prompt: data.system_prompt,
//         greeting_message: data.greeting_message,
//         voice_settings: {
//           stability: data.stability,
//           similarity_boost: data.similarity_boost
//         },
//         personality_traits: [],
//         knowledge_base: {},
//         is_active: true
//       };

//       let result;
//       if (agent) {
//         result = await voiceService.updateAgent(agent._id, agentData);
//         toast.success('Agent updated successfully');
//       } else {
//         result = await voiceService.createAgent(agentData);
//         toast.success('Agent created successfully');
//       }

//       if (onSuccess) {
//         onSuccess(result);
//       }
//     } catch (error) {
//       console.error('Failed to save agent:', error);
//       toast.error(error.response?.data?.detail || 'Failed to save agent');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       {/* Basic Information */}
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Agent Name *
//           </label>
//           <Input
//             {...register('name')}
//             placeholder="e.g., Customer Support Agent"
//             error={errors.name?.message}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Description (Optional)
//           </label>
//           <Textarea
//             {...register('description')}
//             placeholder="Brief description of this agent's purpose..."
//             rows={2}
//             error={errors.description?.message}
//           />
//         </div>
//       </div>

//       {/* Voice Settings */}
//       <div className="space-y-4 pt-4 border-t">
//         <h3 className="text-lg font-semibold text-gray-900">Voice Settings</h3>
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Voice *
//           </label>
//           <select
//             {...register('voice_id')}
//             className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//               errors.voice_id ? 'border-red-500' : 'border-gray-300'
//             }`}
//           >
//             <option value="">Select a voice</option>
//             {voices.map(voice => (
//               <option key={voice.voice_id} value={voice.voice_id}>
//                 {voice.name} - {voice.description}
//               </option>
//             ))}
//           </select>
//           {errors.voice_id && (
//             <p className="text-red-500 text-sm mt-1">{errors.voice_id.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Stability: {stability}
//           </label>
//           <input
//             type="range"
//             {...register('stability', { valueAsNumber: true })}
//             min="0"
//             max="1"
//             step="0.01"
//             className="w-full"
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             Higher values = more consistent, Lower values = more expressive
//           </p>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Similarity Boost: {similarityBoost}
//           </label>
//           <input
//             type="range"
//             {...register('similarity_boost', { valueAsNumber: true })}
//             min="0"
//             max="1"
//             step="0.01"
//             className="w-full"
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             Higher values = closer to original voice
//           </p>
//         </div>
//       </div>

//       {/* Greeting & Prompt */}
//       <div className="space-y-4 pt-4 border-t">
//         <h3 className="text-lg font-semibold text-gray-900">Agent Behavior</h3>
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Greeting Message *
//           </label>
//           <Textarea
//             {...register('greeting_message')}
//             placeholder="Hello! How can I help you today?"
//             rows={2}
//             error={errors.greeting_message?.message}
//           />
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             onClick={testVoice}
//             isLoading={isTesting}
//             className="mt-2"
//             disabled={!selectedVoiceId || !greetingMessage}
//           >
//             Test Voice
//           </Button>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             System Prompt *
//           </label>
//           <Textarea
//             {...register('system_prompt')}
//             placeholder="Instructions for how the AI agent should behave..."
//             rows={6}
//             error={errors.system_prompt?.message}
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             Define the agent's personality, expertise, and conversation guidelines
//           </p>
//         </div>
//       </div>

//       {/* Form Actions */}
//       <div className="flex justify-end space-x-3 pt-4 border-t">
//         {onCancel && (
//           <Button type="button" variant="outline" onClick={onCancel}>
//             Cancel
//           </Button>
//         )}
//         <Button type="submit" isLoading={isLoading}>
//           <Save size={20} className="mr-2" />
//           {agent ? 'Update Agent' : 'Create Agent'}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default AgentForm;





// frontend/src/Components/forms/AgentForm.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, Save } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import { voiceService } from "../../services/voice";
import toast from "react-hot-toast";

const agentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
  voice_id: z.string().min(1, 'Voice is required'),
  system_prompt: z.string().min(10, 'System prompt must be at least 10 characters'),
  greeting_message: z.string().min(1, 'Greeting message is required'),
  stability: z.number().min(0).max(1).default(0.5),
  similarity_boost: z.number().min(0).max(1).default(0.75)
});

const AgentForm = ({ agent = null, onSuccess, onCancel }) => {
  const [voices, setVoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(agentSchema),
    defaultValues: agent || {
      name: '',
      description: '',
      voice_id: '',
      system_prompt: 'You are a helpful and professional AI assistant for customer support. Be friendly, clear, and concise in your responses.',
      greeting_message: 'Hello! How can I help you today?',
      stability: 0.5,
      similarity_boost: 0.75
    }
  });

  const selectedVoiceId = watch('voice_id');
  const greetingMessage = watch('greeting_message');
  const stability = watch('stability');
  const similarityBoost = watch('similarity_boost');

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    try {
      const data = await voiceService.getAvailableVoices();
      // Handle the response structure correctly
      if (data && data.voices) {
        setVoices(data.voices);
      } else if (Array.isArray(data)) {
        setVoices(data);
      } else {
        console.error('Unexpected voices data format:', data);
        toast.error('Failed to load available voices');
      }
    } catch (error) {
      console.error('Failed to load voices:', error);
      toast.error('Failed to load available voices');
    }
  };

  const testVoice = async () => {
    if (!selectedVoiceId || !greetingMessage) {
      toast.error('Please select a voice and enter a greeting message');
      return;
    }

    setIsTesting(true);
    try {
      const result = await voiceService.testVoice({
        text: greetingMessage,
        voice_id: selectedVoiceId
      });
      
      // Play audio if URL is provided
      if (result.audio_url) {
        const audio = new Audio(result.audio_url);
        audio.play();
      }
      
      toast.success('Voice test initiated (mock response)');
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
      const agentData = {
        name: data.name,
        description: data.description || null,
        voice_id: data.voice_id,
        system_prompt: data.system_prompt,
        greeting_message: data.greeting_message,
        voice_settings: {
          stability: data.stability,
          similarity_boost: data.similarity_boost
        },
        personality_traits: [],
        knowledge_base: {},
        is_active: true
      };

      let result;
      if (agent) {
        result = await voiceService.updateAgent(agent._id, agentData);
        toast.success('Agent updated successfully');
      } else {
        result = await voiceService.createAgent(agentData);
        toast.success('Agent created successfully');
      }

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Failed to save agent:', error);
      toast.error(error.response?.data?.detail || 'Failed to save agent');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">
            Agent Name *
          </label>
          <Input
            {...register('name')}
            placeholder="e.g., Customer Support Agent"
            error={errors.name?.message}
            className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">
            Description (Optional)
          </label>
          <Textarea
            {...register('description')}
            placeholder="Brief description of this agent's purpose..."
            rows={2}
            error={errors.description?.message}
            className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Voice Settings */}
      <div className="space-y-4 pt-6 border-t border-[#e5e5e5]">
        <h3 className="text-xl font-bold text-[#2C2C2C] flex items-center">
          <Bot size={20} className="mr-2 text-[#f2070d]" />
          Voice Settings
        </h3>
        
        <div>
          <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">
            Voice *
          </label>
          <select
            {...register('voice_id')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-transparent transition-all ${
              errors.voice_id ? 'border-[#f2070d]' : 'border-[#e5e5e5]'
            }`}
          >
            <option value="">Select a voice</option>
            {voices.map(voice => (
              <option key={voice.voice_id} value={voice.voice_id}>
                {voice.name} - {voice.description}
              </option>
            ))}
          </select>
          {errors.voice_id && (
            <p className="text-[#f2070d] text-sm mt-1 font-medium">{errors.voice_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">
            Stability: <span className="text-[#f2070d] font-bold">{stability.toFixed(2)}</span>
          </label>
          <input
            type="range"
            {...register('stability', { valueAsNumber: true })}
            min="0"
            max="1"
            step="0.01"
            className="w-full h-2 bg-[#e5e5e5] rounded-lg appearance-none cursor-pointer accent-[#f2070d]"
            style={{
              background: `linear-gradient(to right, #f2070d 0%, #f2070d ${stability * 100}%, #e5e5e5 ${stability * 100}%, #e5e5e5 100%)`
            }}
          />
          <p className="text-xs text-gray-600 mt-2">
            Higher values = more consistent, Lower values = more expressive
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">
            Similarity Boost: <span className="text-[#f2070d] font-bold">{similarityBoost.toFixed(2)}</span>
          </label>
          <input
            type="range"
            {...register('similarity_boost', { valueAsNumber: true })}
            min="0"
            max="1"
            step="0.01"
            className="w-full h-2 bg-[#e5e5e5] rounded-lg appearance-none cursor-pointer accent-[#f2070d]"
            style={{
              background: `linear-gradient(to right, #f2070d 0%, #f2070d ${similarityBoost * 100}%, #e5e5e5 ${similarityBoost * 100}%, #e5e5e5 100%)`
            }}
          />
          <p className="text-xs text-gray-600 mt-2">
            Higher values = closer to original voice
          </p>
        </div>
      </div>

      {/* Greeting & Prompt */}
      <div className="space-y-4 pt-6 border-t border-[#e5e5e5]">
        <h3 className="text-xl font-bold text-[#2C2C2C]">Agent Behavior</h3>
        
        <div>
          <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">
            Greeting Message *
          </label>
          <Textarea
            {...register('greeting_message')}
            placeholder="Hello! How can I help you today?"
            rows={2}
            error={errors.greeting_message?.message}
            className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-transparent transition-all"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={testVoice}
            isLoading={isTesting}
            className="mt-3 bg-gradient-to-r from-[#f2070d] to-[#FF6B6B] hover:from-[#d10609] hover:to-[#e05555] text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all border-0"
            disabled={!selectedVoiceId || !greetingMessage}
          >
            Test Voice
          </Button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">
            System Prompt *
          </label>
          <Textarea
            {...register('system_prompt')}
            placeholder="Instructions for how the AI agent should behave..."
            rows={6}
            error={errors.system_prompt?.message}
            className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#f2070d] focus:border-transparent transition-all"
          />
          <p className="text-xs text-gray-600 mt-2">
            Define the agent's personality, expertise, and conversation guidelines
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-[#e5e5e5]">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="bg-white border-2 border-[#e5e5e5] text-[#2C2C2C] px-6 py-3 rounded-lg font-semibold hover:bg-[#f8f8f8] hover:border-[#2C2C2C] transition-all"
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          isLoading={isLoading}
          className="bg-gradient-to-r from-[#f2070d] to-[#FF6B6B] hover:from-[#d10609] hover:to-[#e05555] text-white px-6 py-3 rounded-lg font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center"
        >
          <Save size={20} className="mr-2" />
          {agent ? 'Update Agent' : 'Create Agent'}
        </Button>
      </div>
    </form>
  );
};

export default AgentForm;