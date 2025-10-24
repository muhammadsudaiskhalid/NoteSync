/**
 * Transcription Service
 * 
 * NOTE: In NoteSync, we're using Web Speech API (browser-based) for transcription
 * which is FREE and happens on the frontend. This file is kept for future extensibility
 * if you want to add server-side transcription options.
 * 
 * Possible future integrations:
 * - OpenAI Whisper API (paid)
 * - Google Cloud Speech-to-Text (has free tier)
 * - Azure Speech Services (has free tier)
 * - Self-hosted Whisper model
 */

const transcriptionService = {
  /**
   * Check if transcription service is configured
   * Currently, we use Web Speech API in frontend, so this always returns true
   */
  isConfigured() {
    return true; // Web Speech API is browser-based, no server config needed
  },

  /**
   * Get transcription method info
   */
  getInfo() {
    return {
      method: 'Web Speech API (Browser-based)',
      location: 'Frontend',
      cost: 'FREE',
      languages: ['English', 'Urdu', 'Multiple languages supported'],
      realtime: true,
      notes: 'Transcription happens in the browser using Web Speech API. No server-side processing required.'
    };
  },

  /**
   * Future: Add server-side transcription if needed
   * Placeholder for potential future implementation
   */
  async transcribeAudio(audioBuffer, options = {}) {
    throw new Error('Server-side transcription not implemented. Use Web Speech API in frontend.');
  }
};

module.exports = transcriptionService;