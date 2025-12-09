// // frontend/src/pages/dashboard/calls/Recordings.jsx - ✅ WITH PLAY & STOP CONTROLS

// import React, { useState, useEffect } from "react";
// import { Play, Square, Download, Search } from "lucide-react";
// import { format } from "date-fns";
// import Card from "../../../Components/ui/Card";
// import Input from "../../../Components/ui/Input";
// import Button from "../../../Components/ui/Button";
// import { callService } from "../../../services/call";
// import toast from "react-hot-toast";

// const Recordings = () => {
//   const [recordings, setRecordings] = useState([]);
//   const [filteredRecordings, setFilteredRecordings] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentAudio, setCurrentAudio] = useState(null);
//   const [playingRecordingId, setPlayingRecordingId] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     loadRecordings();
//   }, []);

//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = recordings.filter(rec =>
//         rec.call.from_number?.includes(searchTerm) ||
//         rec.call.to_number?.includes(searchTerm) ||
//         rec.call.phone_number?.includes(searchTerm)
//       );
//       setFilteredRecordings(filtered);
//     } else {
//       setFilteredRecordings(recordings);
//     }
//   }, [searchTerm, recordings]);

//   const loadRecordings = async () => {
//     setIsLoading(true);
//     try {
//       console.log('📞 Loading completed calls...');
//       const calls = await callService.getCalls({ status: 'completed' });
//       console.log(`✅ Found ${calls.length} completed calls`);
      
//       const recordingsPromises = calls.map(async (call) => {
//         try {
//           console.log(`🎙️ Fetching recording for call ${call._id}...`);
//           const response = await callService.getCallRecording(call._id);
          
//           if (response.success && response.recordings && response.recordings.length > 0) {
//             console.log(`✅ Found ${response.recordings.length} recording(s) for call ${call._id}`);
//             return response.recordings.map(rec => ({ ...rec, call }));
//           } else {
//             console.log(`ℹ️ No recording available for call ${call._id}`);
//             return [];
//           }
//         } catch (error) {
//           if (error.response?.status === 404) {
//             console.log(`ℹ️ No recording available for call ${call._id} (404)`);
//           } else {
//             console.error(`❌ Error fetching recording for call ${call._id}:`, error.message);
//           }
//           return [];
//         }
//       });

//       const allRecordings = (await Promise.all(recordingsPromises)).flat();
      
//       console.log(`\n${'='.repeat(80)}`);
//       console.log(`📊 RECORDINGS SUMMARY:`);
//       console.log(`${'='.repeat(80)}`);
//       console.log(`   Total Calls: ${calls.length}`);
//       console.log(`   Recordings Found: ${allRecordings.length}`);
//       console.log(`   Calls Without Recordings: ${calls.length - allRecordings.length}`);
//       console.log(`${'='.repeat(80)}\n`);
      
//       setRecordings(allRecordings);
//       setFilteredRecordings(allRecordings);
      
//       if (allRecordings.length === 0) {
//         toast('No recordings available yet. Make a new call to create recordings.', {
//           icon: 'ℹ️',
//           duration: 4000,
//         });
//       } else {
//         toast.success(`Loaded ${allRecordings.length} recording${allRecordings.length !== 1 ? 's' : ''}`);
//       }
//     } catch (error) {
//       console.error('❌ Failed to load recordings:', error);
//       toast.error('Failed to load recordings');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ✅ Play recording
//   const playRecording = async (recording) => {
//     try {
//       // Stop current audio if playing
//       if (currentAudio) {
//         currentAudio.pause();
//         currentAudio.currentTime = 0;
//       }

//       // Download recording to backend first
//       toast.loading('Preparing recording...', { id: 'download' });
//       await callService.downloadRecording(recording.call._id);
//       toast.success('Recording ready', { id: 'download' });

//       // Create and play audio
//       const playUrl = callService.getRecordingPlayUrl(recording.call._id);
//       const audio = new Audio(playUrl);
      
//       audio.play();
//       setCurrentAudio(audio);
//       setPlayingRecordingId(recording.sid);
      
//       // Handle audio end
//       audio.addEventListener('ended', () => {
//         setPlayingRecordingId(null);
//       });
      
//       toast.success('Playing recording');
//     } catch (error) {
//       console.error('Failed to play recording:', error);
//       toast.error('Failed to play recording');
//     }
//   };

//   // ✅ Stop recording
//   const stopRecording = () => {
//     if (currentAudio) {
//       currentAudio.pause();
//       currentAudio.currentTime = 0;
//       setCurrentAudio(null);
//       setPlayingRecordingId(null);
//       toast.success('Recording stopped');
//     }
//   };

//   // ✅ Download recording
//   const downloadRecording = async (recording) => {
//     try {
//       toast.loading('Downloading recording...', { id: 'download' });
      
//       // Ensure recording is on backend
//       await callService.downloadRecording(recording.call._id);
      
//       // Get play URL and download
//       const playUrl = callService.getRecordingPlayUrl(recording.call._id);
//       const response = await fetch(playUrl);
//       const blob = await response.blob();
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `recording-${recording.sid}.mp3`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
      
//       toast.success('Recording downloaded', { id: 'download' });
//     } catch (error) {
//       console.error('Failed to download recording:', error);
//       toast.error('Failed to download recording', { id: 'download' });
//     }
//   };

//   const formatDuration = (seconds) => {
//     if (!seconds) return '0:00';
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Call Recordings</h1>
//           <p className="text-gray-600 mt-1">
//             Listen to and manage your call recordings
//           </p>
//         </div>
//         <Button onClick={loadRecordings} variant="outline">
//           Refresh
//         </Button>
//       </div>

//       {/* Search */}
//       <Card className="p-4">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//           <Input
//             type="text"
//             placeholder="Search by phone number..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//       </Card>

//       {/* Results Count */}
//       <div className="text-sm text-gray-600">
//         {filteredRecordings.length} recording{filteredRecordings.length !== 1 ? 's' : ''}
//       </div>

//       {/* Recordings List */}
//       <div className="space-y-3">
//         {filteredRecordings.length === 0 ? (
//           <Card className="p-8 text-center text-gray-500">
//             <Play size={48} className="mx-auto text-gray-400 mb-4" />
//             <p className="font-medium mb-2">No recordings found</p>
//             <p className="text-sm">
//               {recordings.length === 0 
//                 ? "Recordings will appear here after calls are completed. Make a new call to create recordings."
//                 : "Try adjusting your search to find recordings."}
//             </p>
//           </Card>
//         ) : (
//           filteredRecordings.map((recording) => (
//             <Card key={recording.sid} className="p-4 hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4 flex-1">
//                   {/* ✅ Play/Stop Button */}
//                   {playingRecordingId === recording.sid ? (
//                     <button
//                       onClick={stopRecording}
//                       className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
//                       title="Stop"
//                     >
//                       <Square size={20} />
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => playRecording(recording)}
//                       className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
//                       title="Play"
//                     >
//                       <Play size={20} />
//                     </button>
//                   )}

//                   <div className="flex-1">
//                     <div className="flex items-center space-x-3 mb-1">
//                       <span className="font-semibold">
//                         {recording.call.direction === 'inbound' 
//                           ? recording.call.from_number 
//                           : recording.call.to_number}
//                       </span>
//                       <span className="text-sm text-gray-500">
//                         {format(new Date(recording.call.created_at), 'MMM dd, yyyy HH:mm')}
//                       </span>
//                     </div>
//                     <div className="text-sm text-gray-600">
//                       Duration: {formatDuration(recording.duration)}
//                     </div>
//                   </div>
//                 </div>

//                 {/* ✅ Download Button */}
//                 <div className="flex items-center space-x-2">
//                   <button
//                     onClick={() => downloadRecording(recording)}
//                     className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                     title="Download"
//                   >
//                     <Download size={20} />
//                   </button>
//                 </div>
//               </div>
//             </Card>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Recordings;




// frontend/src/pages/dashboard/calls/Recordings.jsx - ✅ WITH PLAY & STOP CONTROLS

import React, { useState, useEffect } from "react";
import { Play, Square, Download, Search } from "lucide-react";
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
  const [playingRecordingId, setPlayingRecordingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecordings();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = recordings.filter(rec =>
        rec.from_number?.includes(searchTerm) ||
        rec.to_number?.includes(searchTerm)
      );
      setFilteredRecordings(filtered);
    } else {
      setFilteredRecordings(recordings);
    }
  }, [searchTerm, recordings]);

  const fetchRecordings = async () => {
    try {
      setIsLoading(true);
      
      // ✅ FIX: Get calls with recordings
      const response = await callService.getCalls({
        skip: 0,
        limit: 100,
        status: 'completed'  // Only completed calls have recordings
      });
      
      console.log('📞 Calls response:', response);
      
      // ✅ FIX: Filter calls that have recordings
      const callsWithRecordings = (response.calls || []).filter(call => 
        call.recording_url && call.recording_url.length > 0
      );
      
      console.log('🎵 Calls with recordings:', callsWithRecordings.length);
      
      // ✅ FIX: Fetch recording details for each call
      const recordingsWithDetails = await Promise.all(
        callsWithRecordings.map(async (call) => {
          try {
            // ✅ FIX: Use call.id not call._id
            const recordingData = await callService.getRecording(call.id);
            
            return {
              id: call.id,
              call_id: call.id,  // Add this
              call_sid: call.twilio_call_sid,
              from_number: call.from_number,
              to_number: call.to_number,
              duration: call.duration,
              recording_url: recordingData.recording_url || call.recording_url,
              recording_duration: recordingData.recording_duration || 0,
              created_at: call.created_at,
              status: call.status
            };
          } catch (error) {
            console.error(`❌ Error fetching recording for call ${call.id}:`, error.message);
            // Return basic info even if recording fetch fails
            return {
              id: call.id,
              call_id: call.id,
              call_sid: call.twilio_call_sid,
              from_number: call.from_number,
              to_number: call.to_number,
              duration: call.duration,
              recording_url: call.recording_url,
              recording_duration: call.recording_duration || 0,
              created_at: call.created_at,
              status: call.status
            };
          }
        })
      );
      
      setRecordings(recordingsWithDetails);
      setFilteredRecordings(recordingsWithDetails);
      
      console.log(`\n${'='.repeat(80)}`);
      console.log(`📊 RECORDINGS SUMMARY:`);
      console.log(`${'='.repeat(80)}`);
      console.log(`   Total Calls: ${response.calls?.length || 0}`);
      console.log(`   Recordings Found: ${recordingsWithDetails.length}`);
      console.log(`   Calls Without Recordings: ${(response.calls?.length || 0) - recordingsWithDetails.length}`);
      console.log(`${'='.repeat(80)}\n`);
      
      if (recordingsWithDetails.length === 0) {
        toast('No recordings available yet. Make a new call to create recordings.', {
          icon: 'ℹ️',
          duration: 4000,
        });
      } else {
        toast.success(`Loaded ${recordingsWithDetails.length} recording${recordingsWithDetails.length !== 1 ? 's' : ''}`);
      }
      
    } catch (error) {
      console.error('❌ Failed to load recordings:', error);
      toast.error('Failed to load recordings');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Play recording
  const playRecording = async (recording) => {
    try {
      // Stop current audio if playing
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      // Download recording to backend first
      toast.loading('Preparing recording...', { id: 'download' });
      await callService.downloadRecording(recording.call_id);
      toast.success('Recording ready', { id: 'download' });

      // Create and play audio
      const playUrl = callService.getRecordingPlayUrl(recording.call_id);
      const audio = new Audio(playUrl);
      
      audio.play();
      setCurrentAudio(audio);
      setPlayingRecordingId(recording.id);
      
      // Handle audio end
      audio.addEventListener('ended', () => {
        setPlayingRecordingId(null);
      });
      
      toast.success('Playing recording');
    } catch (error) {
      console.error('Failed to play recording:', error);
      toast.error('Failed to play recording');
    }
  };

  // ✅ Stop recording
  const stopRecording = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setPlayingRecordingId(null);
      toast.success('Recording stopped');
    }
  };

  // ✅ Download recording
  const downloadRecording = async (recording) => {
    try {
      toast.loading('Downloading recording...', { id: 'download' });
      
      // Ensure recording is on backend
      await callService.downloadRecording(recording.call_id);
      
      // Get play URL and download
      const playUrl = callService.getRecordingPlayUrl(recording.call_id);
      const response = await fetch(playUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${recording.call_sid || recording.id}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Recording downloaded', { id: 'download' });
    } catch (error) {
      console.error('Failed to download recording:', error);
      toast.error('Failed to download recording', { id: 'download' });
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
        <Button onClick={fetchRecordings} variant="outline">
          Refresh
        </Button>
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
            <p className="font-medium mb-2">No recordings found</p>
            <p className="text-sm">
              {recordings.length === 0 
                ? "Recordings will appear here after calls are completed. Make a new call to create recordings."
                : "Try adjusting your search to find recordings."}
            </p>
          </Card>
        ) : (
          filteredRecordings.map((recording) => (
            <Card key={recording.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* ✅ Play/Stop Button */}
                  {playingRecordingId === recording.id ? (
                    <button
                      onClick={stopRecording}
                      className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                      title="Stop"
                    >
                      <Square size={20} />
                    </button>
                  ) : (
                    <button
                      onClick={() => playRecording(recording)}
                      className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                      title="Play"
                    >
                      <Play size={20} />
                    </button>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="font-semibold">
                        {recording.direction === 'inbound' 
                          ? recording.from_number 
                          : recording.to_number}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(recording.created_at), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Duration: {formatDuration(recording.duration)}
                      {recording.recording_duration > 0 && 
                        ` • Recording: ${formatDuration(recording.recording_duration)}`
                      }
                    </div>
                  </div>
                </div>

                {/* ✅ Download Button */}
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