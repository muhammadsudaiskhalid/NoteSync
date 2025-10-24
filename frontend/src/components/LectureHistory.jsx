import React, { useState } from 'react';

const LectureHistory = ({ lectures, onDelete, onRefresh }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDelete(id);
    }
  };

  // Filter lectures based on search query, category, and tag
  const filteredLectures = lectures.filter(lecture => {
    const matchesSearch = lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lecture.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || lecture.category === selectedCategory;
    
    const matchesTag = selectedTag === 'all' || 
                      (lecture.tags && lecture.tags.includes(selectedTag));
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  // Get unique categories and tags from lectures
  const categories = ['all', ...new Set(lectures.map(l => l.category).filter(Boolean))];
  const allTags = ['all', ...new Set(lectures.flatMap(l => l.tags || []))];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="text-3xl mr-3"></span>
          Saved Lectures ({lectures.length})
        </h2>
        
        <button
          onClick={onRefresh}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-2"
        >
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search lectures by title or subject..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Tag Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Filter by Tag
          </label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
          >
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag === 'all' ? 'All Tags' : tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory !== 'all' || selectedTag !== 'all' || searchQuery) && (
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <span className="text-sm font-semibold text-gray-600">Active Filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-red-600">×</button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full text-sm">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:text-red-600">×</button>
            </span>
          )}
          {selectedTag !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">
              Tag: {selectedTag}
              <button onClick={() => setSelectedTag('all')} className="ml-1 hover:text-red-600">×</button>
            </span>
          )}
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedTag('all');
            }}
            className="text-sm text-red-600 hover:text-red-800 font-semibold"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Lectures List */}
      {filteredLectures.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-gray-400">
            <p className="text-xl mb-2">{searchQuery || selectedCategory !== 'all' || selectedTag !== 'all' ? 'No matching lectures found' : 'No saved lectures yet'}</p>
            <p className="text-sm">{searchQuery || selectedCategory !== 'all' || selectedTag !== 'all' ? 'Try adjusting your filters' : 'Start recording your first lecture!'}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLectures.map((lecture) => (
            <div
              key={lecture._id}
              className="border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
            >
              {/* Lecture Header */}
              <div className="p-4 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {lecture.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                      {formatDate(lecture.date)}
                      </span>
                      {lecture.subject && (
                        <span className="flex items-center gap-1">
                          • {lecture.subject}
                        </span>
                      )}
                      {lecture.duration && (
                        <span className="flex items-center gap-1">
                          • {formatTime(lecture.duration)}
                        </span>
                      )}
                    </div>

                    {/* Category Badge */}
                    {lecture.category && lecture.category !== 'Other' && (
                      <div className="mb-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                          📁 {lecture.category}
                        </span>
                      </div>
                    )}

                    {/* Tags */}
                    {lecture.tags && lecture.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {lecture.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            🏷️ {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleExpand(lecture._id)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold transition px-3 py-1 rounded hover:bg-indigo-50"
                    >
                      {expandedId === lecture._id ? '▲ Less' : '▼ More'}
                    </button>
                    <button
                      onClick={() => handleDelete(lecture._id, lecture.title)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 transition px-3 py-1 rounded font-semibold flex items-center gap-1"
                      title="Delete lecture"
                    >
                    Delete
                    </button>
                  </div>
                </div>

                {/* Summary Preview */}
                {lecture.summary && (
                  <div className="mt-3">
                    <p className={`text-sm text-gray-700 ${expandedId === lecture._id ? '' : 'line-clamp-2'}`}>
                      {lecture.summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Expanded Content */}
              {expandedId === lecture._id && (
                <div className="p-4 bg-gray-50 border-t-2 border-gray-200 space-y-4">
                  {/* Key Points */}
                  {lecture.keyPoints && lecture.keyPoints.length > 0 && (
                    <div>
                      <h4 className="text-md font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <span>Key Points</span>
                      </h4>
                      <ul className="space-y-1 ml-2">
                        {lecture.keyPoints.map((point, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-green-600 font-bold mt-0.5">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Full Transcript */}
                  {lecture.transcript && (
                    <div>
                      <h4 className="text-md font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <span>Full Transcript</span>
                      </h4>
                      <div className="bg-white rounded-lg p-3 max-h-64 overflow-y-auto border border-gray-300">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {lecture.transcript}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Export Options */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        const text = `${lecture.title}\n\nCategory: ${lecture.category || 'N/A'}\nTags: ${lecture.tags?.join(', ') || 'N/A'}\n\n${lecture.summary}\n\nKey Points:\n${lecture.keyPoints?.join('\n') || ''}`;
                        navigator.clipboard.writeText(text);
                        alert('Copied to clipboard!');
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-3 rounded transition"
                    >
                    Copy
                    </button>
                    <button
                      onClick={() => {
                        const text = `${lecture.title}\n\nCategory: ${lecture.category || 'N/A'}\nTags: ${lecture.tags?.join(', ') || 'N/A'}\nSubject: ${lecture.subject || 'N/A'}\nDate: ${new Date(lecture.date).toLocaleDateString()}\n\n${lecture.summary}\n\nKey Points:\n${lecture.keyPoints?.join('\n') || ''}\n\nTranscript:\n${lecture.transcript || ''}`;
                        const blob = new Blob([text], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${lecture.title}.txt`;
                        a.click();
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 px-3 rounded transition"
                    >
                    Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LectureHistory;