// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, 
  Facebook, Twitter, Github, Chrome, Smartphone 
} from 'lucide-react';
import { loginStudent } from '../services/api';

const LoginPage = ({ setAuth }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    otp: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      const response = await loginStudent({
        email: formData.email,
        password: formData.password
      });
      
      // Save token and user data to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.student));
      
      // Update auth state
      if (setAuth) {
        setAuth(true);
      }
      
      setSuccess('Login successful! Redirecting...');
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLogin = (e) => {
    e.preventDefault();
    setError('Phone/OTP login is not implemented yet. Please use email/password.');
  };

  const handleSocialLogin = (provider) => {
    setError(`${provider} login is not implemented yet. Please use email/password.`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFF6FF] to-[#ECFEFF] flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#14BDEE] to-[#5BD1D7] rounded-lg flex items-center justify-center">
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-[#384158]">Paarsh E-Learning</div>
              <div className="text-sm text-[#76777A]">Learn. Grow. Succeed.</div>
            </div>
          </div>
          <div className="text-sm text-[#76777A]">
            New to Paarsh?{' '}
            <Link to="/register" className="text-[#14BDEE] hover:text-[#0DA8D4] font-medium transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Welcome Back Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#14BDEE] to-[#5BD1D7] rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-[#384158] mb-2">Welcome Back</h1>
                <p className="text-[#76777A]">Sign in to continue your learning journey</p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-600">{success}</p>
                  </div>
                </div>
              )}

              {/* Login Method Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => {
                    setLoginMethod('email');
                    setError('');
                  }}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    loginMethod === 'email'
                      ? 'text-[#14BDEE] border-b-2 border-[#14BDEE]'
                      : 'text-[#76777A] hover:text-[#384158]'
                  }`}
                >
                  Email & Password
                </button>
                <button
                  onClick={() => {
                    setLoginMethod('phone');
                    setError('Phone/OTP login coming soon!');
                  }}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    loginMethod === 'phone'
                      ? 'text-[#14BDEE] border-b-2 border-[#14BDEE]'
                      : 'text-[#76777A] hover:text-[#384158]'
                  }`}
                >
                  Phone & OTP
                </button>
              </div>

              {/* Email/Password Form */}
              {loginMethod === 'email' && (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#384158] mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#76777A]" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="student@paarsh.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14BDEE] focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-[#384158]">
                        Password
                      </label>
                      <Link to="/forgot-password" className="text-sm text-[#14BDEE] hover:text-[#0DA8D4] transition-colors">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#76777A]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14BDEE] focus:border-transparent transition-colors"
                        required
                        minLength="6"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#76777A] hover:text-[#384158] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-[#14BDEE] rounded focus:ring-[#14BDEE]"
                      />
                      <label htmlFor="remember" className="ml-2 text-sm text-[#384158]">
                        Remember me
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-[#14BDEE] to-[#5BD1D7] text-white font-medium rounded-lg hover:from-[#0DA8D4] hover:to-[#4ABCC2] focus:outline-none focus:ring-2 focus:ring-[#14BDEE] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing in...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  <div className="text-center">
                    <div className="text-sm text-[#76777A]">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-[#14BDEE] hover:text-[#0DA8D4] font-medium transition-colors">
                        Sign up now
                      </Link>
                    </div>
                  </div>
                </form>
              )}

              {/* Phone/OTP Form */}
              {loginMethod === 'phone' && (
                <form onSubmit={handleOtpLogin} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#384158] mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#76777A]" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14BDEE] focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#384158] mb-2">
                      OTP
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#76777A]" />
                      <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleInputChange}
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14BDEE] focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className="mt-2 text-sm text-[#14BDEE] hover:text-[#0DA8D4] transition-colors"
                    >
                      Send OTP
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={true}
                    className="w-full py-3 bg-gray-300 text-gray-500 font-medium rounded-lg cursor-not-allowed transition-all duration-300"
                  >
                    Coming Soon
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-200"></div>
                <div className="px-4 text-sm text-[#76777A]">Or continue with</div>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => handleSocialLogin('google')}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-[#EFF6FF] hover:border-[#14BDEE] transition-colors flex items-center justify-center"
                >
                  <Chrome className="w-5 h-5 text-[#14BDEE]" />
                </button>
                <button
                  onClick={() => handleSocialLogin('facebook')}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-[#EFF6FF] hover:border-[#14BDEE] transition-colors flex items-center justify-center"
                >
                  <Facebook className="w-5 h-5 text-[#14BDEE]" />
                </button>
                <button
                  onClick={() => handleSocialLogin('github')}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-[#EFF6FF] hover:border-[#14BDEE] transition-colors flex items-center justify-center"
                >
                  <Github className="w-5 h-5 text-[#384158]" />
                </button>
                <button
                  onClick={() => handleSocialLogin('twitter')}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-[#EFF6FF] hover:border-[#14BDEE] transition-colors flex items-center justify-center"
                >
                  <Twitter className="w-5 h-5 text-[#60A5FA]" />
                </button>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-3 bg-[#ECFEFF] border border-[#14BDEE] rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-[#14BDEE] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#384158]">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-xl font-bold text-[#14BDEE]">50K+</div>
              <div className="text-xs text-[#76777A]">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-[#5BD1D7]">200+</div>
              <div className="text-xs text-[#76777A]">Expert Mentors</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-[#60A5FA]">95%</div>
              <div className="text-xs text-[#76777A]">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-sm text-[#76777A]">
        <p>© {new Date().getFullYear()} Paarsh E-Learning Platform. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link to="/terms" className="hover:text-[#384158] transition-colors">Terms</Link>
          <Link to="/privacy" className="hover:text-[#384158] transition-colors">Privacy</Link>
          <Link to="/contact" className="hover:text-[#384158] transition-colors">Contact</Link>
          <Link to="/help" className="hover:text-[#384158] transition-colors">Help Center</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;