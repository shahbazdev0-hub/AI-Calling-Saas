import { useEffect, useState, useCallback } from "react";
import { websocketService } from "../services/websocket";
import { useAuth } from "./useAuth";

export const useWebSocket = () => {
  const { token } = useAuth();
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      websocketService.connect(token);

      const handleConnection = (data) => {
        setConnected(data.status === 'connected');
      };

      const handleError = (err) => {
        setError(err);
        setConnected(false);
      };

      websocketService.on('connection', handleConnection);
      websocketService.on('error', handleError);

      return () => {
        websocketService.off('connection', handleConnection);
        websocketService.off('error', handleError);
        websocketService.disconnect();
      };
    }
  }, [token]);

  const emit = useCallback((event, data) => {
    websocketService.emit(event, data);
  }, []);

  const on = useCallback((event, callback) => {
    websocketService.on(event, callback);
  }, []);

  const off = useCallback((event, callback) => {
    websocketService.off(event, callback);
  }, []);

  return {
    connected,
    error,
    emit,
    on,
    off
  };
};

export default useWebSocket;