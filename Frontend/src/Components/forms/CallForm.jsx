// // frontend/src/Components/forms/CallForm.jsx
// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Phone } from "lucide-react";
// import Input from "../ui/Input";
// import Button from "../ui/Button";
// import { voiceService } from "../../services/voice";
// import { callService } from "../../services/call";
// import toast from "react-hot-toast";

// // Fixed validation schema - allows Pakistani numbers starting with 0
// const callSchema = z.object({
//   phoneNumber: z.string()
//     .min(10, 'Phone number must be at least 10 digits')
//     .regex(/^(\+?[1-9]\d{1,14}|0\d{9,})$/, 'Invalid phone number format'),
//   agentId: z.string().optional()
// });

// const CallForm = ({ onSuccess }) => {
//   const [agents, setAgents] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset
//   } = useForm({
//     resolver: zodResolver(callSchema)
//   });

//   useEffect(() => {
//     loadAgents();
//   }, []);

//   const loadAgents = async () => {
//   try {
//     const data = await voiceService.getAgents({ is_active: true });
//     setAgents(data.agents || []); // Extract the agents array
//   } catch (error) {
//     console.error('Failed to load agents:', error);
//     setAgents([]); // Set empty array on error
//   }
// };

//   const onSubmit = async (data) => {
//     setIsLoading(true);
//     try {
//       // Call the service with the form data
//       const result = await callService.createCall({
//         phoneNumber: data.phoneNumber,
//         agentId: data.agentId || null
//       });
      
//       if (onSuccess) {
//         await onSuccess(result);
//       }
      
//       reset();
//       toast.success('Call initiated successfully');
//     } catch (error) {
//       console.error('Failed to initiate call:', error);
      
//       // Better error handling for different error types
//       let errorMessage = 'Failed to initiate call';
      
//       if (error.response?.status === 422) {
//         const detail = error.response.data?.detail;
//         if (Array.isArray(detail)) {
//           errorMessage = detail.map(err => err.msg).join(', ');
//         } else if (typeof detail === 'string') {
//           errorMessage = detail;
//         } else {
//           errorMessage = 'Invalid phone number format. Please use +92XXX or 03XX format.';
//         }
//       } else if (error.response?.data?.detail) {
//         errorMessage = error.response.data.detail;
//       }
      
//       toast.error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Phone Number
//         </label>
//         <Input
//           {...register('phoneNumber')}
//           type="tel"
//           placeholder="+923208518724 or 03208518724"
//           error={errors.phoneNumber?.message}
//         />
//         <p className="text-xs text-gray-500 mt-1">
//           Enter Pakistani number (03XX) or international format (+92XXX)
//         </p>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           AI Agent (Optional)
//         </label>
//         <select
//           {...register('agentId')}
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         >
//           <option value="">No Agent</option>
//           {agents.map(agent => (
//             <option key={agent._id} value={agent._id}>
//               {agent.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <Button
//         type="submit"
//         isLoading={isLoading}
//         className="w-full"
//       >
//         <Phone size={20} className="mr-2" />
//         Start Call
//       </Button>
//     </form>
//   );
// };

// export default CallForm;




// frontend/src/Components/forms/CallForm.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { voiceService } from "../../services/voice";
import { callService } from "../../services/call";
import toast from "react-hot-toast";

// Fixed validation schema - allows Pakistani numbers starting with 0
const callSchema = z.object({
  phoneNumber: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^(\+?[1-9]\d{1,14}|0\d{9,})$/, 'Invalid phone number format'),
  agentId: z.string().optional()
});

const CallForm = ({ onSuccess }) => {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAgents, setLoadingAgents] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(callSchema)
  });

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    setLoadingAgents(true);
    try {
      const data = await voiceService.getAgents({ is_active: true });
      
      // ✅ FIX: Backend returns array directly, not wrapped in {agents: [...]}
      if (Array.isArray(data)) {
        setAgents(data);
      } else if (data && data.agents && Array.isArray(data.agents)) {
        // Fallback in case structure changes
        setAgents(data.agents);
      } else {
        console.error('Unexpected agents data format:', data);
        setAgents([]);
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
      setAgents([]); // Set empty array on error to prevent undefined
      toast.error('Failed to load agents');
    } finally {
      setLoadingAgents(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Format phone number properly
      let phoneNumber = data.phoneNumber.trim();
      
      // If starts with 0, convert to +92 format
      if (phoneNumber.startsWith('0')) {
        phoneNumber = '+92' + phoneNumber.slice(1);
      }
      // If doesn't start with +, add +
      else if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+' + phoneNumber;
      }
      
      // Call the service with the form data
      const result = await callService.createCall({
        phoneNumber: phoneNumber,
        agentId: data.agentId || null
      });
      
      if (onSuccess) {
        await onSuccess(result);
      }
      
      reset();
      toast.success('Call initiated successfully');
    } catch (error) {
      console.error('Failed to initiate call:', error);
      
      // Better error handling for different error types
      let errorMessage = 'Failed to initiate call';
      
      if (error.response?.status === 422) {
        const detail = error.response.data?.detail;
        if (Array.isArray(detail)) {
          errorMessage = detail.map(err => err.msg).join(', ');
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        } else {
          errorMessage = 'Invalid phone number format. Please use +92XXX or 03XX format.';
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Phone Number Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <Input
          {...register('phoneNumber')}
          type="tel"
          placeholder="+923208518724 or 03208518724"
          error={errors.phoneNumber?.message}
          icon={<Phone size={18} className="text-gray-400" />}
        />
        <p className="mt-1 text-xs text-gray-500">
          Enter Pakistani number (03XX) or international format (+92XXX)
        </p>
      </div>

      {/* Agent Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI Agent (Optional)
        </label>
        <select
          {...register('agentId')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loadingAgents}
        >
          <option value="">No Agent</option>
          {loadingAgents ? (
            <option disabled>Loading agents...</option>
          ) : agents.length === 0 ? (
            <option disabled>No active agents available</option>
          ) : (
            agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name}
              </option>
            ))
          )}
        </select>
        {errors.agentId && (
          <p className="mt-1 text-sm text-red-600">{errors.agentId.message}</p>
        )}
        {!loadingAgents && agents.length === 0 && (
          <p className="mt-1 text-xs text-amber-600">
            No agents available. Create one in Voice Agents section.
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Starting Call...
            </>
          ) : (
            <>
              <Phone size={18} className="mr-2" />
              Start Call
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CallForm;