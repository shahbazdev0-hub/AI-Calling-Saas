import React, { useState, useEffect, useRef } from "react";
import { FileText, Download, Copy, Search } from "lucide-react";
import { format } from "date-fns";
import Card from "../../Components/ui/Card"
import Button from "../ui/Button";
import Input from "../ui/Input";
import toast from "react-hot-toast";

const TranscriptViewer = ({ callId, transcript, messages = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMessages, setFilteredMessages] = useState(messages);
  const transcriptRef = useRef(null);

  useEffect(() => {
    if (searchTerm) {
      const filtered = messages.filter(msg =>
        msg.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages);
    }
  }, [searchTerm, messages]);

  const copyTranscript = () => {
    const text = messages
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    navigator.clipboard.writeText(text);
    toast.success('Transcript copied to clipboard');
  };

  const downloadTranscript = () => {
    const text = messages
      .map(msg => {
        const time = format(new Date(msg.timestamp), 'HH:mm:ss');
        return `[${time}] ${msg.role.toUpperCase()}: ${msg.content}`;
      })
      .join('\n\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${callId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Transcript downloaded');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'user':
        return 'bg-blue-100 text-blue-800';
      case 'assistant':
        return 'bg-green-100 text-green-800';
      case 'system':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FileText size={24} />
          <h2 className="text-2xl font-bold">Call Transcript</h2>
        </div>
        <div className="flex space-x-2">
          <Button onClick={copyTranscript} variant="outline" size="sm">
            <Copy size={16} className="mr-2" />
            Copy
          </Button>
          <Button onClick={downloadTranscript} variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search transcript..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Transcript */}
      <div
        ref={transcriptRef}
        className="space-y-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4"
      >
        {filteredMessages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {searchTerm ? 'No matching messages found' : 'No transcript available'}
          </div>
        ) : (
          filteredMessages.map((message, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(message.role)}`}>
                  {message.role.toUpperCase()}
                </span>
                {message.timestamp && (
                  <span className="text-xs text-gray-500">
                    {format(new Date(message.timestamp), 'HH:mm:ss')}
                  </span>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {transcript && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Full Transcript</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-800 whitespace-pre-wrap">{transcript}</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TranscriptViewer;
