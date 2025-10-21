// FILE 1: frontend/src/Components/automation/WorkflowBuilder.jsx
// =============================================================================
import React, { useState } from "react";
import { Plus, Play, Save, Download, Upload } from "lucide-react";
import { generateNodeId, getNodeIcon, getNodeColor } from "../../utils/workflowUtils";

const WorkflowBuilder = ({ workflow, onSave, onExecute }) => {
  const [nodes, setNodes] = useState(workflow?.nodes || []);
  const [selectedNode, setSelectedNode] = useState(null);

  const nodeTypes = [
    { type: 'trigger', label: 'Trigger', description: 'Start point' },
    { type: 'email', label: 'Send Email', description: 'Send an email' },
    { type: 'sms', label: 'Send SMS', description: 'Send SMS message' },
    { type: 'condition', label: 'Condition', description: 'If/else logic' },
    { type: 'delay', label: 'Delay', description: 'Wait for duration' },
    { type: 'webhook', label: 'Webhook', description: 'Call external API' },
  ];

  const addNode = (nodeType) => {
    const newNode = {
      id: generateNodeId(),
      type: nodeType,
      name: `${nodeType} Node`,
      config: {},
      position: { x: 100, y: nodes.length * 100 + 100 },
      next_nodes: [],
    };
    setNodes([...nodes, newNode]);
  };

  const handleSave = () => {
    onSave({ ...workflow, nodes });
  };

  return (
    <div className="flex h-full">
      {/* Sidebar - Node Palette */}
      <div className="w-64 bg-gray-50 border-r p-4">
        <h3 className="font-semibold mb-4">Add Nodes</h3>
        <div className="space-y-2">
          {nodeTypes.map((nodeType) => (
            <button
              key={nodeType.type}
              onClick={() => addNode(nodeType.type)}
              className="w-full p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-sm transition-all text-left"
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xl">{getNodeIcon(nodeType.type)}</span>
                <span className="font-medium text-sm">{nodeType.label}</span>
              </div>
              <p className="text-xs text-gray-500">{nodeType.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Workflow
          </button>
          <button
            onClick={onExecute}
            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Test Run
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-8 overflow-auto bg-gray-100">
        <div className="min-h-full">
          {nodes.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Plus className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Add nodes from the left panel to start building</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {nodes.map((node, index) => (
                <div key={node.id} className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    {index < nodes.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-300" />
                    )}
                  </div>

                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`flex-1 p-4 bg-white rounded-lg shadow-sm border-2 cursor-pointer transition-all ${
                      selectedNode?.id === node.id
                        ? 'border-indigo-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getNodeIcon(node.type)}</span>
                        <div>
                          <h4 className="font-semibold">{node.name}</h4>
                          <p className={`text-xs px-2 py-1 rounded inline-block ${getNodeColor(node.type)}`}>
                            {node.type}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Properties Panel */}
      {selectedNode && (
        <div className="w-80 bg-white border-l p-4">
          <h3 className="font-semibold mb-4">Node Properties</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Node Name
              </label>
              <input
                type="text"
                value={selectedNode.name}
                onChange={(e) => {
                  const updated = nodes.map(n =>
                    n.id === selectedNode.id ? { ...n, name: e.target.value } : n
                  );
                  setNodes(updated);
                  setSelectedNode({ ...selectedNode, name: e.target.value });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <p className={`px-3 py-2 rounded ${getNodeColor(selectedNode.type)}`}>
                {selectedNode.type}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;