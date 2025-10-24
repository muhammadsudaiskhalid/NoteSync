const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lectureController');
const { protect } = require('../middleware/auth');

// Summarize transcript (Protected)
router.post('/summarize', protect, lectureController.summarize);

// Get categories and tags (Protected - must be before /:id route)
router.get('/lectures/stats/categories-tags', protect, lectureController.getCategoriesAndTags);

// CRUD operations for lectures (All Protected)
router.post('/lectures', protect, lectureController.createLecture);
router.get('/lectures', protect, lectureController.getAllLectures);
router.get('/lectures/:id', protect, lectureController.getLecture);
router.put('/lectures/:id', protect, lectureController.updateLecture);
router.delete('/lectures/:id', protect, lectureController.deleteLecture);

module.exports = router;