const AuthService = require('../services/authService');
const { validationResult } = require('express-validator');

class AuthController {
  // Register user
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          errors: errors.array()
        });
      }

      const result = await AuthService.register(req.body);
      
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        ...result
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      res.json({
        status: 'success',
        message: 'Login successful',
        ...result
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        status: 'error',
        message: error.message
      });
    }
  }

  // Get user profile
  async getProfile(req, res) {
    try {
      const user = await AuthService.getProfile(req.user._id);
      res.json({
        status: 'success',
        user
      });
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const user = await AuthService.updateProfile(req.user._id, req.body);
      res.json({
        status: 'success',
        message: 'Profile updated successfully',
        user
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }

  // Get all users
  async getUsers(req, res) {
    try {
      const users = await AuthService.getAllUsers();
      res.json({
        status: 'success',
        users
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
}
module.exports = new AuthController();