import React, { useState } from "react";
import { ReactMic } from "react-mic";

interface VoiceRecorderProps {
  onStop: (audioURL: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onStop }) => {
  const [record, setRecord] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const handleStop = (recordedData: any) => {
    setAudioURL(recordedData.blobURL);
    onStop(recordedData.blobURL);
  };

  return (
    <div>
      <ReactMic
        record={record}
        className="w-full"
        onStop={handleStop}
        strokeColor="#7F56D9"
        backgroundColor="#FEFAF5"
        mimeType="audio/webm"
      />
      <button
        className={`px-4 py-2 rounded ${record ? "bg-red-500" : "bg-primary text-primary-foreground"}`}
        onClick={() => setRecord(!record)}
        type="button"
      >
        {record ? "Stop Recording" : "Record Voice Note"}
      </button>
      {audioURL && (
        <div className="mt-2">
          <audio controls src={audioURL}></audio>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;