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

  const makeCall = useCallback(async (phoneNumber, agentId = null) => {
    setIsLoading(true);
    setError(null);

    try {
      const call = await callService.createCall({
        direction: 'outbound',
        from_number: null, // Will use default
        to_number: phoneNumber,
        agent_id: agentId
      });

      setActiveCall(call);
      setCallStatus('ringing');
      
      // Join call room via WebSocket
      websocketService.joinCall(call._id);

      toast.success('Call initiated');
      return call;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to initiate call';
      setError(errorMsg);
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
      setError(errorMsg);
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
      setError(errorMsg);
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
      setError(errorMsg);
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

export default useCall;