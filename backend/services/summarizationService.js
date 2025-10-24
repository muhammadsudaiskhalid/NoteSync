const axios = require('axios');

const summarizationService = {
  /**
   * Summarize lecture transcript using Google Gemini API
   * @param {string} transcript - The lecture transcript
   * @param {string} subject - The subject/topic of the lecture
   * @returns {object} - Summarized content with key points, definitions, etc.
   */
  async summarizeLecture(transcript, subject = 'General') {
    try {
      console.log('\nStarting summarization with Gemini 2.0 Flash...');
      
      if (!transcript || transcript.trim().length === 0) {
        throw new Error('Transcript is empty');
      }

      const apiKey = process.env.GEMINI_API_KEY;
      console.log('API Key exists:', !!apiKey);
      
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('Gemini API key not properly configured');
      }

      console.log('Transcript length:', transcript.length, 'characters');

      // Create the prompt
      const prompt = `You are an expert educational assistant helping students create study notes from lecture transcripts.

Analyze the following lecture transcript and provide a comprehensive study guide.

**Subject:** ${subject}

**Transcript:**
${transcript}

**Instructions:**
1. Create a concise summary (2-3 paragraphs) focusing on the main concepts
2. Extract 5-10 key points that are most important for understanding the topic
3. List important definitions and terminology
4. Identify topics that are likely to appear in exams
5. Remove any casual conversation, jokes, or off-topic discussions
6. Focus only on educational content

**Return your response in valid JSON format with this structure:**
{
  "summary": "A 2-3 paragraph summary of the lecture",
  "keyPoints": ["point 1", "point 2", ...],
  "definitions": ["definition 1", "definition 2", ...],
  "examTopics": ["topic 1", "topic 2", ...]
}

**IMPORTANT:** Return ONLY the JSON object, no additional text or markdown formatting.`;

      console.log('Sending request to Gemini API...');

      // Call Gemini API using REST endpoint
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 60000 // 60 second timeout
        }
      );

      console.log('Gemini API Response received');

      // Extract text from Gemini response format
      const text = response.data.candidates[0].content.parts[0].text;
      console.log('Response text:', text.substring(0, 100) + '...');

      // Parse the JSON response
      let parsedResponse;
      try {
        // Try to extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          // If no JSON found, create a structured response from the text
          parsedResponse = {
            summary: text,
            keyPoints: [],
            definitions: [],
            examTopics: []
          };
        }
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        // If parsing fails, return the raw text as summary
        parsedResponse = {
          summary: text.replace(/```json\n?|\n?```/g, '').trim(),
          keyPoints: [],
          definitions: [],
          examTopics: []
        };
      }

      // Ensure all fields exist
      const finalResponse = {
        summary: parsedResponse.summary || 'Summary not available',
        keyPoints: Array.isArray(parsedResponse.keyPoints) ? parsedResponse.keyPoints : [],
        definitions: Array.isArray(parsedResponse.definitions) ? parsedResponse.definitions : [],
        examTopics: Array.isArray(parsedResponse.examTopics) ? parsedResponse.examTopics : []
      };

      console.log('Summarization completed successfully');
      return finalResponse;

    } catch (error) {
      console.error('Summarization Error:', error.message);
      
      // Better error handling
      if (error.response) {
        console.error('API Response Error:');
        console.error('   Status:', error.response.status);
        console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        
        const errorMsg = error.response.data?.error?.message || 
                        error.response.statusText || 
                        'API request failed';
        throw new Error(`Gemini API Error (${error.response.status}): ${errorMsg}`);
      } else if (error.request) {
        console.error('No Response from API');
        throw new Error('No response from Gemini API. Check your internet connection.');
      } else {
        throw new Error(`Failed to summarize: ${error.message}`);
      }
    }
  },

  /**
   * Validate API key
   * @returns {boolean} - True if API key is configured
   */
  isConfigured() {
    const apiKey = process.env.GEMINI_API_KEY;
    const isValid = !!apiKey && 
                    apiKey !== 'your_gemini_api_key_here' && 
                    apiKey.length > 0 &&
                    apiKey.startsWith('AIza');
    
    console.log('Gemini API Key Check:');
    console.log('  - Exists:', !!apiKey);
    console.log('  - Length:', apiKey ? apiKey.length : 0);
    console.log('  - Starts with AIza:', apiKey ? apiKey.startsWith('AIza') : false);
    console.log('  - Valid:', isValid);
    
    return isValid;
  }
};

module.exports = summarizationService;