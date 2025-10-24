const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key-change-this', {
    expiresIn: '30d'
  });
};

const authController = {
  /**
   * @desc    Register new user
   * @route   POST /api/auth/register
   * @access  Public
   */
  register: async (req, res) => {
    try {
      const { fullName, email, password, university, fieldOfStudy, educationLevel } = req.body;

      // Validation
      if (!fullName || !email || !password || !university || !fieldOfStudy || !educationLevel) {
        return res.status(400).json({
          success: false,
          error: 'Please provide all required fields'
        });
      }

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        });
      }

      // Password strength validation
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 8 characters long'
        });
      }

      // Create user
      const user = await User.create({
        fullName,
        email,
        password,
        university,
        fieldOfStudy,
        educationLevel
      });

      console.log(`New user registered: ${user.email}`);

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          university: user.university,
          fieldOfStudy: user.fieldOfStudy,
          educationLevel: user.educationLevel,
          profilePicture: user.profilePicture
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Registration failed'
      });
    }
  },

  /**
   * @desc    Login user
   * @route   POST /api/auth/login
   * @access  Public
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Please provide email and password'
        });
      }

      // Check for user and include password field
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Account has been deactivated'
        });
      }

      console.log(`User logged in: ${user.email}`);

      // Generate token
      const token = generateToken(user._id);

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          university: user.university,
          fieldOfStudy: user.fieldOfStudy,
          educationLevel: user.educationLevel,
          profilePicture: user.profilePicture
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Login failed'
      });
    }
  },

  /**
   * @desc    Get current user profile
   * @route   GET /api/auth/me
   * @access  Private
   */
  getMe: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          university: user.university,
          fieldOfStudy: user.fieldOfStudy,
          educationLevel: user.educationLevel,
          profilePicture: user.profilePicture,
          createdAt: user.createdAt
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get profile'
      });
    }
  },

  /**
   * @desc    Update user profile
   * @route   PUT /api/auth/profile
   * @access  Private
   */
  updateProfile: async (req, res) => {
    try {
      const { fullName, university, fieldOfStudy, educationLevel } = req.body;

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Update fields
      if (fullName) user.fullName = fullName;
      if (university) user.university = university;
      if (fieldOfStudy) user.fieldOfStudy = fieldOfStudy;
      if (educationLevel) user.educationLevel = educationLevel;

      await user.save();

      console.log(`Profile updated: ${user.email}`);

      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          university: user.university,
          fieldOfStudy: user.fieldOfStudy,
          educationLevel: user.educationLevel,
          profilePicture: user.profilePicture
        }
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update profile'
      });
    }
  },

  /**
   * @desc    Change password
   * @route   PUT /api/auth/change-password
   * @access  Private
   */
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Please provide current and new password'
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          error: 'New password must be at least 8 characters long'
        });
      }

      const user = await User.findById(req.user.id).select('+password');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Check current password
      const isMatch = await user.matchPassword(currentPassword);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      console.log(`Password changed: ${user.email}`);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to change password'
      });
    }
  }
};

module.exports = authController;