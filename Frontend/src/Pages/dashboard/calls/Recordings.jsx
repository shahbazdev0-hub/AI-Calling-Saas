// calls/Recordings.jsx
import React, { useState, useEffect } from "react";
import { Play, Download, Trash2, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import Card from "../../../Components/ui/Card";
import Input from "../../../Components/ui/Input";
import Button from "../../../Components/ui/Button";
import { callService } from "../../../services/call";
import toast from "react-hot-toast";

const Recordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [filteredRecordings, setFilteredRecordings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecordings();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = recordings.filter(rec =>
        rec.call.from_number.includes(searchTerm) ||
        rec.call.to_number.includes(searchTerm)
      );
      setFilteredRecordings(filtered);
    } else {
      setFilteredRecordings(recordings);
    }
  }, [searchTerm, recordings]);

  const loadRecordings = async () => {
    setIsLoading(true);
    try {
      const calls = await callService.getCalls({ status: 'completed' });
      
      const recordingsPromises = calls.map(async (call) => {
        try {
          const recs = await callService.getCallRecording(call._id);
          return recs.recordings?.map(rec => ({ ...rec, call })) || [];
        } catch (error) {
          return [];
        }
      });

      const allRecordings = (await Promise.all(recordingsPromises)).flat();
      setRecordings(allRecordings);
      setFilteredRecordings(allRecordings);
    } catch (error) {
      console.error('Failed to load recordings:', error);
      toast.error('Failed to load recordings');
    } finally {
      setIsLoading(false);
    }
  };

  const playRecording = (recording) => {
    if (currentAudio) {
      currentAudio.pause();
    }

    const audio = new Audio(recording.url);
    audio.play();
    setCurrentAudio(audio);
    toast.success('Playing recording');
  };

  const downloadRecording = async (recording) => {
    try {
      const response = await fetch(recording.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${recording.sid}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Recording downloaded');
    } catch (error) {
      console.error('Failed to download recording:', error);
      toast.error('Failed to download recording');
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Call Recordings</h1>
          <p className="text-gray-600 mt-1">
            Listen to and manage your call recordings
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search by phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {filteredRecordings.length} recording{filteredRecordings.length !== 1 ? 's' : ''}
      </div>

      {/* Recordings List */}
      <div className="space-y-3">
        {filteredRecordings.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            <Play size={48} className="mx-auto text-gray-400 mb-4" />
            <p>No recordings found</p>
          </Card>
        ) : (
          filteredRecordings.map((recording) => (
            <Card key={recording.sid} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <button
                    onClick={() => playRecording(recording)}
                    className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    <Play size={20} />
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="font-semibold">
                        {recording.call.direction === 'inbound' 
                          ? recording.call.from_number 
                          : recording.call.to_number}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(recording.call.created_at), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Duration: {formatDuration(recording.duration)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => downloadRecording(recording)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Download"
                  >
                    <Download size={20} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Recordings;