import React from 'react';

const SummaryDisplay = ({ summary, onSave, isSaving }) => {
  if (!summary) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-lg mb-2">Summary will appear here</p>
          <p className="text-sm">Click "Summarize" after recording to generate AI-powered notes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="text-3xl mr-3"></span>
          Summary & Notes
        </h2>
        
        <button
          onClick={onSave}
          disabled={isSaving}
          className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Save Lecture</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Main Summary */}
        {summary.summary && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500">
            <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
              <span>Summary</span>
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {summary.summary}
            </p>
          </div>
        )}

        {/* Key Points */}
        {summary.keyPoints && summary.keyPoints.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500">
            <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
              <span>Key Points</span>
            </h3>
            <ul className="space-y-2">
              {summary.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-600 font-bold mt-1">•</span>
                  <span className="flex-1">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Definitions */}
        {summary.definitions && summary.definitions.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border-l-4 border-yellow-500">
            <h3 className="text-lg font-bold text-yellow-900 mb-3 flex items-center gap-2">
              <span>Important Definitions</span>
            </h3>
            <ul className="space-y-2">
              {summary.definitions.map((def, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-yellow-600 font-bold mt-1">•</span>
                  <span className="flex-1">{def}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Exam Topics */}
        {summary.examTopics && summary.examTopics.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500">
            <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
              <span>Exam-Relevant Topics</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {summary.examTopics.map((topic, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Save Success Message */}
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800 text-center">
            💡 Click "Save Lecture" to store these notes for future reference
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay;