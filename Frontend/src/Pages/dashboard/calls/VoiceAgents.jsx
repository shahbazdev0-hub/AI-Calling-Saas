// // calls/VoiceAgents.jsx
// import React, { useState, useEffect } from "react";
// import { Bot, Plus, Edit, Trash2, Copy, TrendingUp } from "lucide-react";
// import Card from "../../../Components/ui/Card";
// import Button from "../../../Components/ui/Button";
// import Modal from "../../../Components/ui/Modal";
// import AgentForm from "../../../Components/forms/AgentForm";
// import { voiceService } from "../../../services/voice";
// import toast from "react-hot-toast";

// const VoiceAgents = () => {
//   const [agents, setAgents] = useState([]);
//   const [selectedAgent, setSelectedAgent] = useState(null);
//   const [showAgentModal, setShowAgentModal] = useState(false);
//   const [showPerformanceModal, setShowPerformanceModal] = useState(false);
//   const [agentPerformance, setAgentPerformance] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     loadAgents();
//   }, []);

//   const loadAgents = async () => {
//   setIsLoading(true);
//   try {
//     const data = await voiceService.getAgents();
//     setAgents(data.agents);  // ✅ Extract the agents array
//   } catch (error) {
//     console.error('Failed to load agents:', error);
//     toast.error('Failed to load voice agents');
//   } finally {
//     setIsLoading(false);
//   }
// };

//   const handleCreateAgent = () => {
//     setSelectedAgent(null);
//     setShowAgentModal(true);
//   };

//   const handleEditAgent = (agent) => {
//     setSelectedAgent(agent);
//     setShowAgentModal(true);
//   };

//   const handleDeleteAgent = async (agentId) => {
//     if (!confirm('Are you sure you want to delete this agent?')) return;

//     try {
//       await voiceService.deleteAgent(agentId);
//       toast.success('Agent deleted successfully');
//       loadAgents();
//     } catch (error) {
//       console.error('Failed to delete agent:', error);
//       toast.error('Failed to delete agent');
//     }
//   };

//   const handleCloneAgent = async (agent) => {
//     const newName = prompt('Enter name for cloned agent:', `${agent.name} (Copy)`);
//     if (!newName) return;

//     try {
//       await voiceService.cloneAgent(agent._id, newName);
//       toast.success('Agent cloned successfully');
//       loadAgents();
//     } catch (error) {
//       console.error('Failed to clone agent:', error);
//       toast.error('Failed to clone agent');
//     }
//   };

//   const handleViewPerformance = async (agent) => {
//     setSelectedAgent(agent);
//     setShowPerformanceModal(true);

//     try {
//       const performance = await voiceService.getAgentPerformance(agent._id);
//       setAgentPerformance(performance);
//     } catch (error) {
//       console.error('Failed to load performance:', error);
//       toast.error('Failed to load agent performance');
//     }
//   };

//   const handleAgentSaved = () => {
//     setShowAgentModal(false);
//     setSelectedAgent(null);
//     loadAgents();
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Voice Agents</h1>
//           <p className="text-gray-600 mt-1">
//             Manage your AI-powered voice agents
//           </p>
//         </div>
//         <Button onClick={handleCreateAgent}>
//           <Plus size={20} className="mr-2" />
//           New Agent
//         </Button>
//       </div>

//       {/* Agents Grid */}
//       {agents.length === 0 ? (
//         <Card className="p-12 text-center">
//           <Bot size={48} className="mx-auto text-gray-400 mb-4" />
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">
//             No Voice Agents Yet
//           </h3>
//           <p className="text-gray-600 mb-6">
//             Create your first AI voice agent to start making automated calls
//           </p>
//           <Button onClick={handleCreateAgent}>
//             <Plus size={20} className="mr-2" />
//             Create First Agent
//           </Button>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {agents.map(agent => (
//             <Card key={agent._id} className="p-6 hover:shadow-lg transition-shadow">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center space-x-3">
//                   <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
//                     <Bot size={24} />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-lg">{agent.name}</h3>
//                     <span className={`text-xs px-2 py-1 rounded-full ${
//                       agent.is_active
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-gray-100 text-gray-800'
//                     }`}>
//                       {agent.is_active ? 'Active' : 'Inactive'}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {agent.description && (
//                 <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                   {agent.description}
//                 </p>
//               )}

//               <div className="space-y-2 mb-4">
//                 <div className="text-sm">
//                   <span className="text-gray-600">Greeting:</span>
//                   <p className="text-gray-900 line-clamp-2 mt-1">
//                     "{agent.greeting_message}"
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between pt-4 border-t">
//                 <button
//                   onClick={() => handleViewPerformance(agent)}
//                   className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
//                 >
//                   <TrendingUp size={16} className="mr-1" />
//                   Performance
//                 </button>

//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => handleCloneAgent(agent)}
//                     className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                     title="Clone"
//                   >
//                     <Copy size={18} />
//                   </button>
//                   <button
//                     onClick={() => handleEditAgent(agent)}
//                     className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                     title="Edit"
//                   >
//                     <Edit size={18} />
//                   </button>
//                   <button
//                     onClick={() => handleDeleteAgent(agent._id)}
//                     className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
//                     title="Delete"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Agent Form Modal */}
//       <Modal
//         isOpen={showAgentModal}
//         onClose={() => {
//           setShowAgentModal(false);
//           setSelectedAgent(null);
//         }}
//         title={selectedAgent ? 'Edit Voice Agent' : 'Create Voice Agent'}
//         size="large"
//       >
//         <AgentForm
//           agent={selectedAgent}
//           onSuccess={handleAgentSaved}
//           onCancel={() => {
//             setShowAgentModal(false);
//             setSelectedAgent(null);
//           }}
//         />
//       </Modal>

//       {/* Performance Modal */}
//       <Modal
//         isOpen={showPerformanceModal}
//         onClose={() => {
//           setShowPerformanceModal(false);
//           setSelectedAgent(null);
//           setAgentPerformance(null);
//         }}
//         title="Agent Performance"
//       >
//         {agentPerformance ? (
//           <div className="space-y-6">
//             <div className="grid grid-cols-2 gap-4">
//               <Card className="p-4">
//                 <p className="text-sm text-gray-600 mb-1">Total Conversations</p>
//                 <p className="text-3xl font-bold text-blue-600">
//                   {agentPerformance.total_conversations}
//                 </p>
//               </Card>

//               <Card className="p-4">
//                 <p className="text-sm text-gray-600 mb-1">Success Rate</p>
//                 <p className="text-3xl font-bold text-green-600">
//                   {agentPerformance.success_rate}%
//                 </p>
//               </Card>

//               <Card className="p-4">
//                 <p className="text-sm text-gray-600 mb-1">Avg Duration</p>
//                 <p className="text-3xl font-bold text-purple-600">
//                   {agentPerformance.average_duration}s
//                 </p>
//               </Card>

//               <Card className="p-4">
//                 <p className="text-sm text-gray-600 mb-1">Sentiment</p>
//                 <div className="flex flex-wrap gap-1 mt-2">
//                   {Object.entries(agentPerformance.sentiment_breakdown || {}).map(([sentiment, count]) => (
//                     <span
//                       key={sentiment}
//                       className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
//                     >
//                       {sentiment}: {count}
//                     </span>
//                   ))}
//                 </div>
//               </Card>
//             </div>
//           </div>
//         ) : (
//           <div className="flex justify-center items-center h-32">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default VoiceAgents;





// frontend/src/Pages/dashboard/calls/VoiceAgents.jsx
import React, { useState, useEffect } from "react";
import { Bot, Plus, Edit, Trash2, Copy, TrendingUp } from "lucide-react";
import Card from "../../../Components/ui/Card";
import Button from "../../../Components/ui/Button";
import Modal from "../../../Components/ui/Modal";
import AgentForm from "../../../Components/forms/AgentForm";
import { voiceService } from "../../../services/voice";
import toast from "react-hot-toast";

const VoiceAgents = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [agentPerformance, setAgentPerformance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    setIsLoading(true);
    try {
      const data = await voiceService.getAgents();
      
      // ✅ FIX: Backend returns array directly, not wrapped in {agents: [...]}
      if (Array.isArray(data)) {
        setAgents(data);
      } else if (data && data.agents && Array.isArray(data.agents)) {
        // Fallback in case structure changes
        setAgents(data.agents);
      } else {
        console.error('Unexpected data format:', data);
        setAgents([]);
        toast.error('Received unexpected data format from server');
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
      toast.error('Failed to load voice agents');
      setAgents([]); // ✅ Set empty array on error to prevent undefined
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAgent = () => {
    setSelectedAgent(null);
    setShowAgentModal(true);
  };

  const handleEditAgent = (agent) => {
    setSelectedAgent(agent);
    setShowAgentModal(true);
  };

  const handleDeleteAgent = async (agentId) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return;

    try {
      await voiceService.deleteAgent(agentId);
      toast.success('Agent deleted successfully');
      loadAgents();
    } catch (error) {
      console.error('Failed to delete agent:', error);
      toast.error('Failed to delete agent');
    }
  };

  const handleCloneAgent = async (agent) => {
    try {
      const newName = `${agent.name} (Copy)`;
      await voiceService.cloneAgent(agent._id, newName);
      toast.success('Agent cloned successfully');
      loadAgents();
    } catch (error) {
      console.error('Failed to clone agent:', error);
      toast.error('Failed to clone agent');
    }
  };

  const handleViewPerformance = async (agent) => {
    try {
      setShowPerformanceModal(true);
      setAgentPerformance(null);
      const performance = await voiceService.getAgentPerformance(agent._id);
      setAgentPerformance(performance);
    } catch (error) {
      console.error('Failed to load agent performance:', error);
      toast.error('Failed to load agent performance');
      setShowPerformanceModal(false);
    }
  };

  const handleAgentSaved = () => {
    setShowAgentModal(false);
    setSelectedAgent(null);
    loadAgents();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Voice Agents</h1>
          <p className="text-gray-600 mt-1">
            Manage your AI voice agents and their configurations
          </p>
        </div>
        <Button onClick={handleCreateAgent} className="flex items-center">
          <Plus size={20} className="mr-2" />
          Create Agent
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : agents.length === 0 ? (
        /* Empty State */
        <Card className="p-12 text-center">
          <Bot size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Voice Agents Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first AI voice agent to start handling calls automatically
          </p>
          <Button onClick={handleCreateAgent}>
            <Plus size={20} className="mr-2" />
            Create Your First Agent
          </Button>
        </Card>
      ) : (
        /* Agents Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card key={agent._id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg mr-3">
                      <Bot className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {agent.name}
                      </h3>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                        agent.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {agent.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {agent.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {agent.description}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="text-sm">
                    <span className="text-gray-600">Greeting:</span>
                    <p className="text-gray-900 line-clamp-2 mt-1">
                      "{agent.greeting_message}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <button
                    onClick={() => handleViewPerformance(agent)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                  >
                    <TrendingUp size={16} className="mr-1" />
                    Performance
                  </button>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCloneAgent(agent)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Clone"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={() => handleEditAgent(agent)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteAgent(agent._id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Agent Form Modal */}
      <Modal
        isOpen={showAgentModal}
        onClose={() => {
          setShowAgentModal(false);
          setSelectedAgent(null);
        }}
        title={selectedAgent ? 'Edit Agent' : 'Create New Agent'}
        size="large"
      >
        <AgentForm
          agent={selectedAgent}
          onSuccess={handleAgentSaved}
          onCancel={() => {
            setShowAgentModal(false);
            setSelectedAgent(null);
          }}
        />
      </Modal>

      {/* Performance Modal */}
      <Modal
        isOpen={showPerformanceModal}
        onClose={() => {
          setShowPerformanceModal(false);
          setAgentPerformance(null);
        }}
        title="Agent Performance"
        size="large"
      >
        {agentPerformance ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Calls</div>
                <div className="text-2xl font-bold text-gray-900">
                  {agentPerformance.total_calls || 0}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Success Rate</div>
                <div className="text-2xl font-bold text-green-600">
                  {agentPerformance.success_rate || 0}%
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Avg Duration</div>
                <div className="text-2xl font-bold text-blue-600">
                  {agentPerformance.avg_duration || 0}s
                </div>
              </Card>
            </div>

            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Sentiment Breakdown
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(agentPerformance.sentiment_breakdown || {}).map(([sentiment, count]) => (
                  <span
                    key={sentiment}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {sentiment}: {count}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VoiceAgents;