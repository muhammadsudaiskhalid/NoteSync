import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import AudioRecorder from './utils/audioRecorder';
import { lectureAPI, authAPI } from './services/api';
import RecordingControls from './components/RecordingControls';
import TranscriptDisplay from './components/TranscriptDisplay';
import SummaryDisplay from './components/SummaryDisplay';
import LectureHistory from './components/LectureHistory';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // State management
  const [selectedTab, setSelectedTab] = useState('record');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [lectureTitle, setLectureTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Other');
  const [tags, setTags] = useState('');
  const [recognitionLanguage, setRecognitionLanguage] = useState('en-IN'); // Default to English (India) for better code-mixing
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [summary, setSummary] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lectures, setLectures] = useState([]);
  const [error, setError] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Refs
  const audioRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const user = authAPI.getCurrentUser();

      if (token && user) {
        try {
          // Verify token is still valid
          const response = await authAPI.getMe();
          setCurrentUser(response.user);
          setIsAuthenticated(true);
        } catch (error) {
          // Token invalid, clear storage
          console.log('Token validation failed:', error);
          authAPI.logout();
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // No token or user, clear everything
        authAPI.logout();
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      setAuthLoading(false);
    };

    checkAuth();
  }, []);

  // Initialize audio recorder on mount
  useEffect(() => {
    if (!isAuthenticated) return; // Don't initialize if not authenticated

    if (!AudioRecorder.isSupported()) {
      setError('Speech recognition is not supported in this browser. Please use Google Chrome.');
      return;
    }

    audioRecorderRef.current = new AudioRecorder();
    
    // Set initial language
    audioRecorderRef.current.setLanguage(recognitionLanguage);
    
    // Set up callbacks
    audioRecorderRef.current.setOnTranscriptUpdate((transcriptData) => {
      setTranscript(transcriptData.final);
      setInterimTranscript(transcriptData.interim);
    });

    audioRecorderRef.current.setOnError((error) => {
      console.error('Recording error:', error);
      if (error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone permissions.');
      }
    });

    fetchLectures();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioRecorderRef.current && isRecording) {
        audioRecorderRef.current.stop();
      }
    };
  }, [isAuthenticated]);

  // Authentication handlers
  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleRegister = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authAPI.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setSelectedTab('record');
  };

  const handleUpdateProfile = (user) => {
    setCurrentUser(user);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading NoteSync...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show login/register page if not authenticated
  if (!isAuthenticated) {
    return showRegister ? (
      <Register 
        onRegister={handleRegister} 
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login 
        onLogin={handleLogin} 
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  // Fetch all lectures
  const fetchLectures = async () => {
    try {
      const response = await lectureAPI.getAllLectures();
      if (response.success) {
        setLectures(response.lectures);
      }
    } catch (error) {
      console.error('Error fetching lectures:', error);
    }
  };

  // Handle language change
  const handleLanguageChange = (lang) => {
    setRecognitionLanguage(lang);
    if (audioRecorderRef.current && !isRecording) {
      audioRecorderRef.current.setLanguage(lang);
    }
  };

  // Start recording
  const handleStartRecording = () => {
    if (!lectureTitle.trim()) {
      alert('Please enter a lecture title');
      return;
    }

    if (!audioRecorderRef.current) {
      alert('Audio recorder not initialized');
      return;
    }

    const started = audioRecorderRef.current.start();
    
    if (started) {
      setIsRecording(true);
      setIsPaused(false);
      setTranscript('');
      setInterimTranscript('');
      setSummary(null);
      setRecordingTime(0);
      setError(null);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      alert('Could not start recording. Please check microphone permissions.');
    }
  };

  // Pause recording
  const handlePauseRecording = () => {
    if (audioRecorderRef.current && isRecording) {
      audioRecorderRef.current.pause();
      setIsPaused(true);
      clearInterval(timerRef.current);
    }
  };

  // Resume recording
  const handleResumeRecording = () => {
    if (audioRecorderRef.current && isRecording && isPaused) {
      audioRecorderRef.current.resume();
      setIsPaused(false);
      
      // Restart timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    if (audioRecorderRef.current && isRecording) {
      audioRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      clearInterval(timerRef.current);
    }
  };

  // Summarize transcript using Gemini AI
  const handleSummarize = async () => {
    if (!transcript.trim()) {
      alert('No transcript to summarize');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await lectureAPI.summarize(transcript, subject);
      
      if (response.success) {
        setSummary(response);
      } else {
        throw new Error(response.error || 'Summarization failed');
      }
    } catch (error) {
      console.error('Summarization error:', error);
      const errorMsg = error.message || 'Failed to summarize. Please try again.';
      setError(errorMsg);
      alert('Failed to summarize transcript: ' + errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Save lecture to database
  const handleSaveLecture = async () => {
    if (!transcript || !summary) {
      alert('Please transcribe and summarize first');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Parse tags from comma-separated string
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const lectureData = {
        title: lectureTitle.trim() || `Lecture - ${new Date().toLocaleDateString()}`,
        transcript,
        summary: summary.summary || '',
        keyPoints: summary.keyPoints || [],
        subject: subject.trim(),
        category: category || 'Other',
        tags: tagsArray,
        duration: recordingTime,
      };

      const response = await lectureAPI.saveLecture(lectureData);

      if (response.success) {
        alert('Lecture saved successfully!');
        handleReset();
        await fetchLectures();
        setSelectedTab('history');
      } else {
        throw new Error(response.error || 'Save failed');
      }
    } catch (error) {
      console.error('Save error:', error);
      setError('Failed to save lecture. Please try again.');
      alert('Failed to save lecture: ' + (error.message || error));
    } finally {
      setIsSaving(false);
    }
  };

  // Delete lecture
  const handleDeleteLecture = async (id) => {
    try {
      await lectureAPI.deleteLecture(id);
      await fetchLectures();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete lecture');
    }
  };

  // Reset form
  const handleReset = () => {
    setLectureTitle('');
    setSubject('');
    setCategory('Other');
    setTags('');
    setTranscript('');
    setInterimTranscript('');
    setSummary(null);
    setRecordingTime(0);
    setError(null);
    if (audioRecorderRef.current) {
      audioRecorderRef.current.clearTranscript();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                📚 NoteSync
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                AI-Powered Lecture Note-Taking
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 text-right">
                <p className="font-semibold">Welcome, {currentUser?.fullName?.split(' ')[0]}!</p>
                <p className="text-xs">{currentUser?.university}</p>
              </div>
              <div className="text-sm text-gray-500">
              {AudioRecorder.isSupported() ? '' : 'Use Chrome Browser'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p className="font-bold">⚠️ Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex gap-2 border-b-2 border-gray-300">
          <button
            onClick={() => setSelectedTab('record')}
            className={`px-6 py-3 font-semibold transition-all duration-200 ${
              selectedTab === 'record'
                ? 'border-b-4 border-indigo-600 text-indigo-600 -mb-0.5'
                : 'text-gray-600 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-300'
            }`}
          >
          Record Lecture
          </button>
          <button
            onClick={() => setSelectedTab('history')}
            className={`px-6 py-3 font-semibold transition-all duration-200 ${
              selectedTab === 'history'
                ? 'border-b-4 border-indigo-600 text-indigo-600 -mb-0.5'
                : 'text-gray-600 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-300'
            }`}
          >
          Lecture History ({lectures.length})
          </button>
          <button
            onClick={() => setSelectedTab('profile')}
            className={`px-6 py-3 font-semibold transition-all duration-200 ${
              selectedTab === 'profile'
                ? 'border-b-4 border-indigo-600 text-indigo-600 -mb-0.5'
                : 'text-gray-600 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-300'
            }`}
          >
          Profile
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedTab === 'record' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Recording Controls */}
            <div className="space-y-6">
              <RecordingControls
                isRecording={isRecording}
                isPaused={isPaused}
                recordingTime={recordingTime}
                lectureTitle={lectureTitle}
                subject={subject}
                category={category}
                tags={tags}
                recognitionLanguage={recognitionLanguage}
                onLectureTitleChange={setLectureTitle}
                onSubjectChange={setSubject}
                onCategoryChange={setCategory}
                onTagsChange={setTags}
                onLanguageChange={handleLanguageChange}
                onStartRecording={handleStartRecording}
                onPauseRecording={handlePauseRecording}
                onResumeRecording={handleResumeRecording}
                onStopRecording={handleStopRecording}
              />

              {/* Reset Button */}
              {(transcript || summary) && !isRecording && (
                <button
                  onClick={handleReset}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                Start New Recording
                </button>
              )}
            </div>

            {/* Right Column - Transcript and Summary */}
            <div className="space-y-6">
              <div className="h-96">
                <TranscriptDisplay
                  transcript={transcript}
                  interimTranscript={interimTranscript}
                  isRecording={isRecording}
                  onSummarize={handleSummarize}
                  isProcessing={isProcessing}
                />
              </div>

              {summary && (
                <div className="h-96">
                  <SummaryDisplay
                    summary={summary}
                    onSave={handleSaveLecture}
                    isSaving={isSaving}
                  />
                </div>
              )}
            </div>
          </div>
        ) : selectedTab === 'history' ? (
          /* Lecture History Tab */
          <LectureHistory
            lectures={lectures}
            onDelete={handleDeleteLecture}
            onRefresh={fetchLectures}
          />
        ) : (
          /* Profile Tab */
          <UserProfile
            user={currentUser}
            onUpdate={handleUpdateProfile}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-600 text-sm">
            Made with ❤️ for students in Pakistan | Built by Sudais Khalid © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;