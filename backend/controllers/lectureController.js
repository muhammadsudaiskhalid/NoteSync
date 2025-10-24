const Lecture = require('../models/Lecture');
const summarizationService = require('../services/summarizationService');

const lectureController = {
  /**
   * @desc    Summarize lecture transcript
   * @route   POST /api/summarize
   * @access  Public
   */
  summarize: async (req, res) => {
    try {
      const { transcript, subject } = req.body;

      // Validation
      if (!transcript || transcript.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Transcript is required'
        });
      }

      // Check if Gemini API is configured
      if (!summarizationService.isConfigured()) {
        return res.status(500).json({
          success: false,
          error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to .env file.'
        });
      }

      console.log(`Summarizing transcript (${transcript.length} characters)...`);

      // Summarize using Gemini AI
      const summary = await summarizationService.summarizeLecture(transcript, subject);

      console.log('Summarization successful');

      res.status(200).json({
        success: true,
        ...summary
      });

    } catch (error) {
      console.error('Summarization error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to summarize transcript'
      });
    }
  },

  /**
   * @desc    Create new lecture
   * @route   POST /api/lectures
   * @access  Private
   */
  createLecture: async (req, res) => {
    try {
      const { title, subject, transcript, summary, keyPoints, definitions, examTopics, duration, category, tags } = req.body;

      // Validation
      if (!title || !transcript || !summary) {
        return res.status(400).json({
          success: false,
          error: 'Title, transcript, and summary are required'
        });
      }

      // Create lecture with user reference
      const lecture = await Lecture.create({
        user: req.user.id,
        title: title.trim(),
        subject: subject?.trim() || '',
        transcript,
        summary,
        keyPoints: keyPoints || [],
        definitions: definitions || [],
        examTopics: examTopics || [],
        duration: duration || 0,
        category: category || 'Other',
        tags: tags || []
      });

      console.log(`Lecture created: ${lecture.title} (User: ${req.user.email})`);

      res.status(201).json({
        success: true,
        lecture
      });

    } catch (error) {
      console.error('Create lecture error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create lecture'
      });
    }
  },

  /**
   * @desc    Get all lectures
   * @route   GET /api/lectures
   * @access  Public
   */
  getAllLectures: async (req, res) => {
    try {
      const { category, tag } = req.query;
      
      // Build filter
      let filter = {};
      if (category) {
        filter.category = category;
      }
      if (tag) {
        filter.tags = tag;
      }

      const lectures = await Lecture.find(filter)
        .sort({ date: -1 })
        .select('-__v');

      console.log(`Retrieved ${lectures.length} lectures${category ? ` (category: ${category})` : ''}${tag ? ` (tag: ${tag})` : ''}`);

      res.status(200).json({
        success: true,
        count: lectures.length,
        lectures
      });

    } catch (error) {
      console.error('Get lectures error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get lectures'
      });
    }
  },

  /**
   * @desc    Get single lecture
   * @route   GET /api/lectures/:id
   * @access  Public
   */
  getLecture: async (req, res) => {
    try {
      const lecture = await Lecture.findById(req.params.id);

      if (!lecture) {
        return res.status(404).json({
          success: false,
          error: 'Lecture not found'
        });
      }

      console.log(`Retrieved lecture: ${lecture.title}`);

      res.status(200).json({
        success: true,
        lecture
      });

    } catch (error) {
      console.error('Get lecture error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get lecture'
      });
    }
  },

  /**
   * @desc    Update lecture
   * @route   PUT /api/lectures/:id
   * @access  Public
   */
  updateLecture: async (req, res) => {
    try {
      let lecture = await Lecture.findById(req.params.id);

      if (!lecture) {
        return res.status(404).json({
          success: false,
          error: 'Lecture not found'
        });
      }

      lecture = await Lecture.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

      console.log(`Updated lecture: ${lecture.title}`);

      res.status(200).json({
        success: true,
        lecture
      });

    } catch (error) {
      console.error('Update lecture error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update lecture'
      });
    }
  },

  /**
   * @desc    Delete lecture
   * @route   DELETE /api/lectures/:id
   * @access  Public
   */
  deleteLecture: async (req, res) => {
    try {
      const lecture = await Lecture.findById(req.params.id);

      if (!lecture) {
        return res.status(404).json({
          success: false,
          error: 'Lecture not found'
        });
      }

      await lecture.deleteOne();

      console.log(`Deleted lecture: ${lecture.title}`);

      res.status(200).json({
        success: true,
        message: 'Lecture deleted successfully',
        data: {}
      });

    } catch (error) {
      console.error('Delete lecture error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete lecture'
      });
    }
  },

  /**
   * @desc    Get all categories and tags
   * @route   GET /api/lectures/stats/categories-tags
   * @access  Public
   */
  getCategoriesAndTags: async (req, res) => {
    try {
      // Get unique categories
      const categories = await Lecture.distinct('category');
      
      // Get all tags
      const allTags = await Lecture.distinct('tags');
      
      // Count lectures per category
      const categoryStats = await Promise.all(
        categories.map(async (cat) => ({
          name: cat,
          count: await Lecture.countDocuments({ category: cat })
        }))
      );

      // Count lectures per tag
      const tagStats = await Promise.all(
        allTags.map(async (tag) => ({
          name: tag,
          count: await Lecture.countDocuments({ tags: tag })
        }))
      );

      res.status(200).json({
        success: true,
        categories: categoryStats,
        tags: tagStats
      });

    } catch (error) {
      console.error('Get categories/tags error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get categories and tags'
      });
    }
  }
};

module.exports = lectureController;