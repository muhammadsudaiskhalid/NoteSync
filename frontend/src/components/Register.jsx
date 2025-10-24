import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    fieldOfStudy: '',
    educationLevel: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authAPI.register(registerData);
      onRegister(response.user);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo/Header */}
        <div className="text-center">
          <div className="text-6xl mb-4"></div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
          Join NoteSync!
          </h2>
          <p className="text-gray-600">Create your account and start learning smarter</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-500 text-xl"></span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Register Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-xl"></span>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-12 pr-3 py-3 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-xl"></span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-12 pr-3 py-3 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* University */}
            <div>
              <label htmlFor="university" className="block text-sm font-semibold text-gray-700 mb-2">
              University *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-xl"></span>
                <input
                  id="university"
                  name="university"
                  type="text"
                  required
                  value={formData.university}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-12 pr-3 py-3 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="University of XYZ"
                />
              </div>
            </div>

            {/* Field of Study */}
            <div>
              <label htmlFor="fieldOfStudy" className="block text-sm font-semibold text-gray-700 mb-2">
              Field of Study *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-xl"></span>
                <input
                  id="fieldOfStudy"
                  name="fieldOfStudy"
                  type="text"
                  required
                  value={formData.fieldOfStudy}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-12 pr-3 py-3 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="Computer Science"
                />
              </div>
            </div>

            {/* Education Level */}
            <div className="md:col-span-2">
              <label htmlFor="educationLevel" className="block text-sm font-semibold text-gray-700 mb-2">
              Education Level *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-xl"></span>
                <select
                  id="educationLevel"
                  name="educationLevel"
                  required
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-12 pr-3 py-3 border-2 border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 cursor-pointer"
                >
                  <option value="">Select Education Level</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor's">Bachelor's Degree</option>
                  <option value="Master's">Master's Degree</option>
                  <option value="PhD">PhD / Doctorate</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-xl"></span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-12 pr-12 py-3 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-xl"></span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-12 pr-3 py-3 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="Re-enter password"
                />
              </div>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-700 font-semibold mb-2">Password Requirements:</p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>✓ At least 8 characters long</li>
              <li>✓ Should be unique and secure</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                Creating Account...
                </span>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition duration-200"
              >
              Sign In
              </button>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
          By creating an account, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;