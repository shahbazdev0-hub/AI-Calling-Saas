import React from "react";
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Pause, Play } from "lucide-react";

const CallControls = ({
  isActive,
  isMuted,
  isSpeakerOn,
  isPaused,
  onToggleMute,
  onToggleSpeaker,
  onTogglePause,
  onEndCall
}) => {
  const ControlButton = ({ icon: Icon, active, onClick, activeColor = 'blue', disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-4 rounded-full transition-all ${
        active
          ? `bg-${activeColor}-500 text-white shadow-lg`
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Icon size={24} />
    </button>
  );

  return (
    <div className="flex items-center justify-center space-x-4">
      {/* Mute Toggle */}
      <ControlButton
        icon={isMuted ? MicOff : Mic}
        active={isMuted}
        activeColor="red"
        onClick={onToggleMute}
        disabled={!isActive}
      />

      {/* Pause/Resume */}
      <ControlButton
        icon={isPaused ? Play : Pause}
        active={isPaused}
        activeColor="yellow"
        onClick={onTogglePause}
        disabled={!isActive}
      />

      {/* End Call */}
      <button
        onClick={onEndCall}
        disabled={!isActive}
        className="p-6 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PhoneOff size={32} />
      </button>

      {/* Speaker Toggle */}
      <ControlButton
        icon={isSpeakerOn ? Volume2 : VolumeX}
        active={isSpeakerOn}
        activeColor="blue"
        onClick={onToggleSpeaker}
        disabled={!isActive}
      />

      {/* Call Button (for starting new call) */}
      {!isActive && (
        <ControlButton
          icon={Phone}
          active={false}
          onClick={onEndCall}
        />
      )}
    </div>
  );
};

export default CallControls;