import React, { useRef, useEffect } from 'react';

const TranscriptDisplay = ({ 
  transcript, 
  interimTranscript, 
  isRecording,
  onSummarize,
  isProcessing 
}) => {
  const transcriptEndRef = useRef(null);

  // Auto-scroll to bottom when new text is added
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, interimTranscript]);

  const hasContent = transcript || interimTranscript;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="text-3xl mr-3"></span>
          Live Transcript
        </h2>
        
        {transcript && !isRecording && (
          <button
            onClick={onSummarize}
            disabled={isProcessing}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin"></span>
                <span>Summarizing...</span>
              </>
            ) : (
              <>
                <span>Summarize</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {!hasContent ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center p-8">
              <p className="text-lg mb-2">Start recording to see transcript</p>
              <p className="text-sm">Your lecture will be transcribed in real-time</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-y-auto border-2 border-gray-200">
            <div className="space-y-2">
              {/* Final transcript */}
              {transcript && (
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {transcript}
                </p>
              )}
              
              {/* Interim transcript (appears in lighter color) */}
              {interimTranscript && isRecording && (
                <p className="text-gray-500 italic leading-relaxed">
                  {interimTranscript}
                </p>
              )}
              
              {/* Auto-scroll anchor */}
              <div ref={transcriptEndRef} />
            </div>
          </div>
        )}

        {/* Recording status indicator */}
        {isRecording && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
            <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
            <span>Listening and transcribing...</span>
          </div>
        )}

        {/* Word count */}
        {transcript && (
          <div className="mt-3 text-sm text-gray-500 text-right">
            Words: {transcript.split(/\s+/).filter(word => word.length > 0).length}
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptDisplay;