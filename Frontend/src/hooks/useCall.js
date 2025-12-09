// hooks/useCall.js - FIXED VERSION
import { useState, useCallback, useEffect } from "react";
import { callService } from "../services/call";
import { websocketService } from "../services/websocket";
import toast from "react-hot-toast";

export const useCall = () => {
  const [activeCall, setActiveCall] = useState(null);
  const [callStatus, setCallStatus] = useState('idle'); // idle, ringing, in-progress, ended
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen for call updates via WebSocket
    const handleCallUpdate = (data) => {
      if (activeCall && data.callId === activeCall._id) {
        setCallStatus(data.status);
        if (data.status === 'completed') {
          setActiveCall(null);
          setDuration(0);
        }
      }
    };

    websocketService.onCallUpdate(handleCallUpdate);

    return () => {
      websocketService.off('call-update', handleCallUpdate);
    };
  }, [activeCall]);

  useEffect(() => {
    // Update duration timer
    let interval;
    if (callStatus === 'in-progress') {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  // ✅ FIXED: makeCall function with correct payload matching backend schema
  const makeCall = useCallback(async (phoneNumber, agentId = null) => {
    setIsLoading(true);
    setError(null);

    try {
      // ✅ FIX: Match the backend CallCreate schema exactly
      // Backend expects: phone_number, agent_id (optional), direction (optional)
      const callData = {
        phone_number: phoneNumber,  // ✅ Changed from to_number to phone_number
        direction: 'outbound'
      };

      // Only add agent_id if it's provided and valid
      if (agentId && agentId !== null && agentId !== '') {
        callData.agent_id = agentId;
      }

      console.log('📞 Creating call with payload:', callData);

      const call = await callService.createCall(callData);

      console.log('✅ Call created:', call);

      setActiveCall(call);
      setCallStatus('ringing');
      
      // Join call room via WebSocket
      websocketService.joinCall(call._id);

      toast.success('Call initiated');
      return call;
    } catch (err) {
      console.error('❌ Call creation failed:', err);
      
      // ✅ FIXED: Better error handling for validation errors
      let errorMsg = 'Failed to initiate call';
      
      if (err.response?.status === 422) {
        // Handle validation errors
        const detail = err.response.data?.detail;
        if (Array.isArray(detail)) {
          errorMsg = detail.map(e => e.msg || JSON.stringify(e)).join(', ');
        } else if (typeof detail === 'string') {
          errorMsg = detail;
        } else {
          errorMsg = 'Validation error: ' + JSON.stringify(detail);
        }
      } else if (err.response?.data?.detail) {
        errorMsg = err.response.data.detail;
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(err); // ✅ Store the full error object for CallInterface to display
      toast.error(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const endCall = useCallback(async () => {
    if (!activeCall) return;

    setIsLoading(true);

    try {
      await callService.hangupCall(activeCall._id);
      
      // Leave call room via WebSocket
      websocketService.leaveCall(activeCall._id);

      setCallStatus('ended');
      setActiveCall(null);
      setDuration(0);

      toast.success('Call ended');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to end call';
      setError(err); // ✅ Store the full error object
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [activeCall]);

  const getCallHistory = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const calls = await callService.getCalls(filters);
      return calls;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to fetch call history';
      setError(err); // ✅ Store the full error object
      toast.error(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCallDetails = useCallback(async (callId) => {
    setIsLoading(true);
    setError(null);

    try {
      const call = await callService.getCall(callId);
      return call;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to fetch call details';
      setError(err); // ✅ Store the full error object
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    activeCall,
    callStatus,
    duration: formatDuration(duration),
    durationSeconds: duration,
    isLoading,
    error,
    makeCall,
    endCall,
    getCallHistory,
    getCallDetails
  };
};

// ✅ CRITICAL: Export both named and default export for compatibility

export default useCall;