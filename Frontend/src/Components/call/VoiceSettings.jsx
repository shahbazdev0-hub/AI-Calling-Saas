import React, { useState, useEffect } from "react";
import { Settings, Volume2, Mic } from "lucide-react";
import Card from "../../Components/ui/Card"
import Button from "../ui/Button";
import toast from "react-hot-toast";

const VoiceSettings = () => {
  const [audioDevices, setAudioDevices] = useState({
    microphones: [],
    speakers: []
  });
  const [selectedDevices, setSelectedDevices] = useState({
    microphone: '',
    speaker: ''
  });
  const [volume, setVolume] = useState(80);
  const [sensitivity, setSensitivity] = useState(50);

  useEffect(() => {
    loadAudioDevices();
  }, []);

  const loadAudioDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      const microphones = devices.filter(device => device.kind === 'audioinput');
      const speakers = devices.filter(device => device.kind === 'audiooutput');

      setAudioDevices({ microphones, speakers });

      // Set default devices
      if (microphones.length > 0 && !selectedDevices.microphone) {
        setSelectedDevices(prev => ({
          ...prev,
          microphone: microphones[0].deviceId
        }));
      }
      if (speakers.length > 0 && !selectedDevices.speaker) {
        setSelectedDevices(prev => ({
          ...prev,
          speaker: speakers[0].deviceId
        }));
      }
    } catch (error) {
      console.error('Failed to load audio devices:', error);
      toast.error('Failed to load audio devices');
    }
  };

  const testMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedDevices.microphone }
      });

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);

      toast.success('Microphone test successful');

      // Stop the stream after 2 seconds
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();
      }, 2000);
    } catch (error) {
      console.error('Microphone test failed:', error);
      toast.error('Microphone test failed');
    }
  };

  const testSpeaker = () => {
    const audio = new Audio('/notification.mp3');
    audio.volume = volume / 100;
    
    if (selectedDevices.speaker && audio.setSinkId) {
      audio.setSinkId(selectedDevices.speaker)
        .then(() => audio.play())
        .catch(err => {
          console.error('Speaker test failed:', err);
          toast.error('Speaker test failed');
        });
    } else {
      audio.play();
    }
    
    toast.success('Playing test sound');
  };

  const saveSettings = () => {
    localStorage.setItem('voiceSettings', JSON.stringify({
      selectedDevices,
      volume,
      sensitivity
    }));
    toast.success('Settings saved');
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Settings size={24} />
        <h2 className="text-2xl font-bold">Voice Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Microphone Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mic className="inline mr-2" size={16} />
            Microphone
          </label>
          <div className="flex space-x-2">
            <select
              value={selectedDevices.microphone}
              onChange={(e) => setSelectedDevices({ ...selectedDevices, microphone: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {audioDevices.microphones.map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
                </option>
              ))}
            </select>
            <Button onClick={testMicrophone} variant="outline">
              Test
            </Button>
          </div>
        </div>

        {/* Microphone Sensitivity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Microphone Sensitivity: {sensitivity}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={sensitivity}
            onChange={(e) => setSensitivity(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Speaker Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Volume2 className="inline mr-2" size={16} />
            Speaker
          </label>
          <div className="flex space-x-2">
            <select
              value={selectedDevices.speaker}
              onChange={(e) => setSelectedDevices({ ...selectedDevices, speaker: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {audioDevices.speakers.map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Speaker ${device.deviceId.slice(0, 5)}`}
                </option>
              ))}
            </select>
            <Button onClick={testSpeaker} variant="outline">
              Test
            </Button>
          </div>
        </div>

        {/* Volume Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Volume: {volume}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={saveSettings}>
            Save Settings
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default VoiceSettings;
