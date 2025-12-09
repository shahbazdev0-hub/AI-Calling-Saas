// call/callinterface.jsx - FIXED VERSION
import React, { useState, useEffect } from "react";
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, AlertCircle } from "lucide-react";
import { useCall } from "../../hooks/useCall";
import { useVoice } from "../../hooks/useVoice";
import Button from "../ui/Button";
import Card from "../../Components/ui/Card"

const CallInterface = ({ phoneNumber, agentId, onCallEnd }) => {
  const { 
    activeCall, 
    callStatus, 
    duration, 
    makeCall, 
    endCall,
    error // Added error from useCall hook
  } = useCall();
  
  const { 
    isRecording, 
    audioLevel, 
    toggleRecording 
  } = useVoice();

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  useEffect(() => {
    if (phoneNumber && !activeCall) {
      handleStartCall();
    }
  }, [phoneNumber]);

  const handleStartCall = async () => {
    try {
      await makeCall(phoneNumber, agentId);
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  };

  const handleEndCall = async () => {
    try {
      await endCall();
      if (onCallEnd) onCallEnd();
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  const getStatusColor = () => {
    switch (callStatus) {
      case 'ringing':
        return 'text-yellow-500';
      case 'in-progress':
        return 'text-green-500';
      case 'ended':
        return 'text-gray-500';
      default:
        return 'text-blue-500';
    }
  };

  const getStatusText = () => {
    switch (callStatus) {
      case 'ringing':
        return 'Ringing...';
      case 'in-progress':
        return 'In Progress';
      case 'ended':
        return 'Call Ended';
      default:
        return 'Initiating...';
    }
  };

  // ✅ FIX: Helper function to safely render error messages
  const renderErrorMessage = (error) => {
    // If error is a string, return it directly
    if (typeof error === 'string') {
      return error;
    }

    // If error has a message property
    if (error?.message) {
      return error.message;
    }

    // If error has response data (Axios error)
    if (error?.response?.data) {
      const { detail } = error.response.data;
      
      // If detail is a string, return it
      if (typeof detail === 'string') {
        return detail;
      }
      
      // If detail is an array of validation errors
      if (Array.isArray(detail)) {
        return detail.map(err => err.msg || JSON.stringify(err)).join(', ');
      }
      
      // If detail is an object, stringify it
      if (typeof detail === 'object') {
        return JSON.stringify(detail);
      }
    }

    // Default fallback
    return 'An error occurred';
  };

  // ✅ FIX: Helper function to safely render validation error details
  const renderValidationErrors = (error) => {
    if (!error?.response?.data?.detail) {
      return null;
    }

    const { detail } = error.response.data;

    // Only render if detail is an array of error objects
    if (Array.isArray(detail) && detail.length > 0) {
      return (
        <ul className="mt-2 space-y-1 text-sm text-red-600">
          {detail.map((err, idx) => {
            // Safely extract error message
            const message = err.msg || err.message || JSON.stringify(err);
            return <li key={idx}>• {message}</li>;
          })}
        </ul>
      );
    }

    return null;
  };

  return (
    <Card className="max-w-md mx-auto p-6">
      <div className="flex flex-col items-center space-y-6">
        {/* ✅ FIXED: Error Display Section - Prevents React rendering errors */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900">Error</h4>
                <p className="text-sm text-red-700">
                  {renderErrorMessage(error)}
                </p>
                {/* ✅ FIX: Safely render validation errors */}
                {renderValidationErrors(error)}
              </div>
            </div>
          </div>
        )}

        {/* Call Status */}
        <div className="text-center">
          <div className={`text-2xl font-bold ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          {phoneNumber && (
            <div className="text-gray-600 mt-2">{phoneNumber}</div>
          )}
          {callStatus === 'in-progress' && (
            <div className="text-3xl font-mono mt-2">{duration}</div>
          )}
        </div>

        {/* Audio Level Indicator */}
        {callStatus === 'in-progress' && (
          <div className="w-full">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-100"
                style={{ width: `${audioLevel}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 text-center mt-1">
              Audio Level
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="flex items-center justify-center space-x-4">
          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            disabled={callStatus !== 'in-progress'}
            className={`p-4 rounded-full transition-colors ${
              isMuted
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            disabled={!activeCall}
            className="p-6 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PhoneOff size={32} />
          </button>

          {/* Speaker Button */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            disabled={callStatus !== 'in-progress'}
            className={`p-4 rounded-full transition-colors ${
              isSpeakerOn
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>

        {/* Additional Info */}
        {activeCall && (
          <div className="text-sm text-gray-500 text-center">
            Call ID: {activeCall._id.slice(-8)}
          </div>
        )}
      </div>
    </Card>
  );
};

export default CallInterface;