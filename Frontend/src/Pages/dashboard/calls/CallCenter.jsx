// calls/callcenter.jsx
import React, { useState } from "react";
import { Phone, Settings } from "lucide-react";
import CallInterface from "../../../Components/call/CallInterface";
import CallForm from "../../../Components/forms/CallForm";
import VoiceSettings from "../../../Components/call/VoiceSettings";
import Card from "../../../Components/ui/Card";
import Modal from "../../../Components/ui/Modal";

const CallCenter = () => {
  const [activeTab, setActiveTab] = useState('call'); // call, settings
  const [showCallModal, setShowCallModal] = useState(false);
  const [activeCallData, setActiveCallData] = useState(null);

  const tabs = [
    { id: 'call', label: 'Make Call', icon: Phone },
    { id: 'settings', label: 'Voice Settings', icon: Settings }
  ];

  const handleStartCall = (data) => {
    setActiveCallData(data);
    setShowCallModal(false);
  };

  const handleCallEnd = () => {
    setActiveCallData(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Call Center</h1>
          <p className="text-gray-600 mt-1">
            Make calls and manage your voice communications
          </p>
        </div>
        <button
          onClick={() => setShowCallModal(true)}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <Phone size={20} />
          <span>New Call</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'call' && (
          <div>
            {activeCallData ? (
              <CallInterface
                phoneNumber={activeCallData.phoneNumber}
                agentId={activeCallData.agentId}
                onCallEnd={handleCallEnd}
              />
            ) : (
              <Card className="p-8 text-center">
                <Phone size={48} className="mx-auto text-secondary-200 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Active Call
                </h3>
                <p className="text-gray-600 mb-6">
                  Click "New Call" to start a conversation
                </p>
                <button
                  onClick={() => setShowCallModal(true)}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Make a Call
                </button>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'settings' && <VoiceSettings />}
      </div>

      {/* New Call Modal */}
      <Modal
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
        title="Start New Call"
      >
        <CallForm onSuccess={handleStartCall} />
      </Modal>
    </div>
  );
};

export default CallCenter;
