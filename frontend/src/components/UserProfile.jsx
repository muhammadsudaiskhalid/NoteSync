import React, { useState } from 'react';
import { authAPI } from '../services/api';

const UserProfile = ({ user, onUpdate, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    university: user.university || '',
    fieldOfStudy: user.fieldOfStudy || '',
    educationLevel: user.educationLevel || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      onUpdate(response.user);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess('Password changed successfully!');
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl">
            👤
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.fullName}</h1>
              <p className="text-indigo-100">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition duration-200 shadow-md"
          >
        Logout
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white px-8 py-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-4">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-b-2xl shadow-2xl p-8">
        <div className="space-y-6">
          {/* Profile Details */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-200 transition duration-200"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    University
                    </label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Field of Study
                    </label>
                    <input
                      type="text"
                      name="fieldOfStudy"
                      value={formData.fieldOfStudy}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Education Level
                    </label>
                    <select
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                    >
                      <option value="High School">High School</option>
                      <option value="Bachelor's">Bachelor's Degree</option>
                      <option value="Master's">Master's Degree</option>
                      <option value="PhD">PhD / Doctorate</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-gray-800">{user.fullName}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">University</p>
                  <p className="text-lg font-semibold text-gray-800">{user.university}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Field of Study</p>
                  <p className="text-lg font-semibold text-gray-800">{user.fieldOfStudy}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Education Level</p>
                  <p className="text-lg font-semibold text-gray-800">{user.educationLevel}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Member Since</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Change Password Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Security</h2>
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="bg-purple-100 text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-200 transition duration-200"
              >
                {isChangingPassword ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {isChangingPassword && (
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;