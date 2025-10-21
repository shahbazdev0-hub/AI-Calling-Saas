import { useState, useCallback, useRef, useEffect } from "react";
import toast from "react-hot-toast";

export const useVoice = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioStreamRef = useRef(null);
  const animationFrameRef = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      // Set up audio context for visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // Handle audio blob (send to server, etc.)
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start audio level monitoring
      monitorAudioLevel();

      toast.success('Recording started');
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(err.message);
      toast.error('Failed to start recording');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }

      // Close audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      setIsRecording(false);
      setAudioLevel(0);
      toast.success('Recording stopped');
    }
  }, [isRecording]);

  const monitorAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateLevel = () => {
      if (!isRecording) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      const normalizedLevel = Math.min(100, (average / 255) * 100);
      
      setAudioLevel(normalizedLevel);
      
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };

    updateLevel();
  }, [isRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return {
    isRecording,
    audioLevel,
    error,
    startRecording,
    stopRecording,
    toggleRecording
  };
};

export default useVoice;