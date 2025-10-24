import React from 'react';

const RecordingControls = ({
  isRecording,
  isPaused,
  recordingTime,
  lectureTitle,
  subject,
  category,
  tags,
  recognitionLanguage,
  onLectureTitleChange,
  onSubjectChange,
  onCategoryChange,
  onTagsChange,
  onLanguageChange,
  onStartRecording,
  onPauseRecording,
  onResumeRecording,
  onStopRecording,
}) => {
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="text-3xl mr-3"></span>
        Record Lecture
      </h2>

      <div className="space-y-4">
        {/* Lecture Title Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Lecture Title *
          </label>
          <input
            type="text"
            value={lectureTitle}
            onChange={(e) => onLectureTitleChange(e.target.value)}
            placeholder="e.g., Introduction to Machine Learning"
            disabled={isRecording}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Subject Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            placeholder="e.g., Computer Science"
            disabled={isRecording}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={isRecording}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="Other">Select Category</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Engineering">Engineering</option>
            <option value="Business">Business</option>
            <option value="Arts">Arts</option>
            <option value="Languages">Languages</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Tags Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => onTagsChange(e.target.value)}
            placeholder="e.g., AI, Machine Learning, Neural Networks"
            disabled={isRecording}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
        </div>

        {/* Recording Timer Display */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 text-center border-2 border-indigo-100">
          <div className="text-5xl font-mono font-bold text-indigo-600 mb-2">
            {formatTime(recordingTime)}
          </div>
          {isRecording && (
            <div className="mt-3 flex items-center justify-center">
              <span className={`inline-flex items-center ${isPaused ? 'text-yellow-600' : 'text-red-600'}`}>
                <span 
                  className={`h-3 w-3 rounded-full mr-2 ${
                    isPaused ? 'bg-yellow-600' : 'bg-red-600 animate-pulse'
                  }`}
                ></span>
                <span className="font-semibold">
                  {isPaused ? 'PAUSED' : 'RECORDING...'}
                </span>
              </span>
            </div>
          )}
          {!isRecording && recordingTime === 0 && (
            <p className="text-gray-500 text-sm mt-2">Ready to record</p>
          )}
        </div>

        {/* Recording Control Buttons */}
        <div className="space-y-3 pt-2">
          {!isRecording ? (
            <button
              onClick={onStartRecording}
              disabled={!lectureTitle.trim()}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
            >
              <span className="text-2xl">●</span>
              <span className="text-lg">Start Recording</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={isPaused ? onResumeRecording : onPauseRecording}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                <span className="text-xl">{isPaused ? '▶' : '⏸'}</span>
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
              <button
                onClick={onStopRecording}
                className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                <span className="text-xl">⏹</span>
                <span>Stop</span>
              </button>
            </div>
          )}
        </div>

        {/* Tips */}
        {!isRecording && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-semibold mb-2">💡 Tips for best results:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Speak clearly and at a moderate pace</li>
              <li>• Ensure good microphone quality</li>
              <li>• Minimize background noise</li>
              <li>• Use Chrome browser for best support</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingControls;