// services/Websocket.js
import { io } from "socket.io-client";

class WebSocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
  }

  connect(token) {
    const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8001';
    
    this.socket = io(wsUrl, {
      auth: {
        token: token
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.connected = true;
      this.emit('connection', { status: 'connected' });
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.connected = false;
      this.emit('connection', { status: 'disconnected' });
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    });

    return this;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }

    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }

    if (this.socket && this.connected) {
      this.socket.emit(event, data);
    }
  }

  // Call-specific methods
  joinCall(callId) {
    this.emit('join-call', { callId });
  }

  leaveCall(callId) {
    this.emit('leave-call', { callId });
  }

  sendAudio(audioData) {
    this.emit('audio-data', audioData);
  }

  onCallUpdate(callback) {
    this.on('call-update', callback);
  }

  onAudioReceived(callback) {
    this.on('audio-received', callback);
  }

  onTranscript(callback) {
    this.on('transcript', callback);
  }
}

export const websocketService = new WebSocketService();
export default websocketService;