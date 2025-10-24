// Audio Recorder Utility with Enhanced Speech Recognition

class AudioRecorder {
  constructor() {
    this.recognition = null;
    this.isRecording = false;
    this.isPaused = false;
    this.transcript = '';
    this.interimTranscript = '';
    this.onTranscriptUpdate = null;
    this.onError = null;
    this.onEnd = null;
    this.finalTranscriptParts = [];
    this.restartTimeout = null;
  }

  // Check if browser supports Web Speech API
  static isSupported() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  // Initialize speech recognition with optimized settings
  initialize() {
    if (!AudioRecorder.isSupported()) {
      throw new Error('Speech recognition is not supported in this browser. Please use Google Chrome.');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    // Enhanced Configuration for Better Accuracy
    this.recognition.continuous = true; // Keep listening continuously
    this.recognition.interimResults = true; // Show interim results for real-time feedback
    this.recognition.maxAlternatives = 3; // Get multiple alternatives for better accuracy
    
    // Language settings - English with ability to handle code-mixing
    // Note: For better Urdu support, we can dynamically switch
    this.recognition.lang = 'en-US'; // Primary language
    
    // Optional: You can try these for better multilingual support
    // this.recognition.lang = 'ur-PK'; // For Urdu
    // this.recognition.lang = 'en-IN'; // For English with South Asian accent

    // Event handlers
    this.recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    this.recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      let alternatives = [];

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        
        // Collect alternatives for better accuracy
        if (result.length > 1) {
          for (let j = 0; j < Math.min(result.length, 3); j++) {
            alternatives.push({
              transcript: result[j].transcript,
              confidence: result[j].confidence
            });
          }
        }

        if (result.isFinal) {
          // Use the result with highest confidence
          const bestResult = alternatives.length > 0 
            ? alternatives.reduce((prev, current) => 
                (prev.confidence > current.confidence) ? prev : current
              )
            : { transcript, confidence: result[0].confidence };

          final += bestResult.transcript + ' ';
          
          console.log('Final:', bestResult.transcript, '| Confidence:', 
            (bestResult.confidence * 100).toFixed(2) + '%');
        } else {
          interim += transcript;
        }
      }

      if (final) {
        this.finalTranscriptParts.push(final);
        this.transcript = this.finalTranscriptParts.join('');
      }
      
      this.interimTranscript = interim;

      // Call callback with updated transcript
      if (this.onTranscriptUpdate) {
        this.onTranscriptUpdate({
          final: this.transcript,
          interim: this.interimTranscript,
          full: this.transcript + this.interimTranscript,
          alternatives: alternatives
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      if (this.onError) {
        this.onError(event.error);
      }

      // Handle specific errors
      switch (event.error) {
        case 'no-speech':
          console.log('No speech detected, will retry...');
          // Auto-restart after silence
          if (this.isRecording && !this.isPaused) {
            this.scheduleRestart(1000);
          }
          break;
          
        case 'audio-capture':
          console.error('No microphone detected');
          if (this.onError) {
            this.onError('No microphone found. Please check your device.');
          }
          break;
          
        case 'not-allowed':
          console.error('Microphone access denied');
          if (this.onError) {
            this.onError('Microphone access denied. Please allow microphone permissions.');
          }
          break;
          
        case 'network':
          console.error('Network error');
          if (this.isRecording && !this.isPaused) {
            this.scheduleRestart(2000);
          }
          break;
          
        default:
          if (this.isRecording && !this.isPaused) {
            this.scheduleRestart(1000);
          }
      }
    };

    this.recognition.onend = () => {
      console.log('Speech recognition ended');
      
      // Automatically restart if still recording and not paused
      if (this.isRecording && !this.isPaused) {
        console.log('Auto-restarting recognition...');
        this.scheduleRestart(500);
      }

      if (this.onEnd && !this.isRecording) {
        this.onEnd(this.transcript);
      }
    };

    this.recognition.onsoundstart = () => {
      console.log('Sound detected');
    };

    this.recognition.onspeechstart = () => {
      console.log('Speech detected');
    };

    this.recognition.onspeechend = () => {
      console.log('Speech ended');
    };
  }

  // Schedule a restart after error or end
  scheduleRestart(delay) {
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
    }
    
    this.restartTimeout = setTimeout(() => {
      if (this.isRecording && !this.isPaused) {
        try {
          this.recognition.start();
          console.log('Recognition restarted');
        } catch (e) {
          if (e.name !== 'InvalidStateError') {
            console.error('Failed to restart:', e);
          }
        }
      }
    }, delay);
  }

  // Start recording
  start() {
    if (!this.recognition) {
      this.initialize();
    }

    try {
      this.isRecording = true;
      this.isPaused = false;
      this.transcript = '';
      this.interimTranscript = '';
      this.finalTranscriptParts = [];
      this.recognition.start();
      console.log('Recording started');
      return true;
    } catch (error) {
      console.error('Error starting recognition:', error);
      // If already started, it's fine
      if (error.name === 'InvalidStateError') {
        return true;
      }
      return false;
    }
  }

  // Pause recording
  pause() {
    if (this.recognition && this.isRecording) {
      this.isPaused = true;
      this.recognition.stop();
      if (this.restartTimeout) {
        clearTimeout(this.restartTimeout);
      }
      console.log('Recording paused');
    }
  }

  // Resume recording
  resume() {
    if (this.recognition && this.isRecording && this.isPaused) {
      this.isPaused = false;
      try {
        this.recognition.start();
        console.log('Recording resumed');
      } catch (error) {
        console.error('Error resuming recognition:', error);
      }
    }
  }

  // Stop recording
  stop() {
    if (this.recognition && this.isRecording) {
      this.isRecording = false;
      this.isPaused = false;
      if (this.restartTimeout) {
        clearTimeout(this.restartTimeout);
      }
      this.recognition.stop();
      console.log('Recording stopped');
      return this.transcript;
    }
    return '';
  }

  // Get current transcript
  getTranscript() {
    return {
      final: this.transcript,
      interim: this.interimTranscript,
      full: this.transcript + this.interimTranscript
    };
  }

  // Clear transcript
  clearTranscript() {
    this.transcript = '';
    this.interimTranscript = '';
    this.finalTranscriptParts = [];
  }

  // Set language dynamically
  setLanguage(lang) {
    if (this.recognition) {
      this.recognition.lang = lang;
      console.log('Language set to:', lang);
    }
  }

  // Set callback for transcript updates
  setOnTranscriptUpdate(callback) {
    this.onTranscriptUpdate = callback;
  }

  // Set callback for errors
  setOnError(callback) {
    this.onError = callback;
  }

  // Set callback for end
  setOnEnd(callback) {
    this.onEnd = callback;
  }

  // Get supported languages (common ones)
  static getSupportedLanguages() {
    return [
      { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
      { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
      { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
      { code: 'ur-PK', name: 'Urdu (Pakistan)', flag: '🇵🇰' },
      { code: 'ur-IN', name: 'Urdu (India)', flag: '🇮🇳' },
    ];
  }
}

export default AudioRecorder;