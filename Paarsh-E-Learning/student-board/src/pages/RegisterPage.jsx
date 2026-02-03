// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserPlus, User, Mail, Lock, Eye, EyeOff, Phone, 
  Calendar, MapPin, Book, ChevronDown, CheckCircle,
  AlertCircle, GraduationCap, Briefcase, Users
} from 'lucide-react';
import { registerStudent } from '../services/api';

const RegisterPage = ({ setAuth }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    city: '',
    educationLevel: '',
    course: 'Computer Science'
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const courses = [
    'Computer Science',
    'Information Technology',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Data Science',
    'Artificial Intelligence',
    'Web Development',
    'Mobile App Development',
    'Cyber Security',
    'Cloud Computing'
  ];

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' }
  ];

  const educationLevels = [
    'High School',
    'Undergraduate',
    'Graduate',
    'Postgraduate',
    'Working Professional',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateStep1 = () => {
    const errors = [];
    
    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.gender) errors.push('Gender is required');
    if (!formData.phone.trim()) errors.push('Phone number is required');
    if (formData.password.length < 6) errors.push('Password must be at least 6 characters');
    if (formData.password !== formData.confirmPassword) errors.push('Passwords do not match');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[0-9]{10}$/;
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      errors.push('Phone number must be 10 digits');
    }
    
    return errors;
  };

  const handleNextStep = () => {
    const errors = validateStep1();
    if (errors.length === 0) {
      setCurrentStep(2);
      setError('');
    } else {
      setError(errors.join('. '));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const errors = validateStep1();
    if (errors.length > 0) {
      setError(errors.join('. '));
      return;
    }
    
    if (!acceptedTerms) {
      setError('You must accept the Terms of Service and Privacy Policy');
      return;
    }
    
    if (!formData.course) {
      setError('Please select a course');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Clean phone number (remove non-digits)
      const cleanPhone = formData.phone.replace(/\D/g, '');
      
      const response = await registerStudent({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        phone: cleanPhone,
        course: formData.course,
        dateOfBirth: formData.dateOfBirth || null,
        city: formData.city || '',
        educationLevel: formData.educationLevel || ''
      });
      
      // Save token and user data to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.student));
      
      // Update auth state
      if (setAuth) {
        setAuth(true);
      }
      
      setSuccess('Registration successful! Welcome to Paarsh E-Learning. Redirecting...');
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFF6FF] to-[#ECFEFF] flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#14BDEE] to-[#5BD1D7] rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-[#384158]">Paarsh E-Learning</div>
              <div className="text-sm text-[#76777A]">Start Your Learning Journey</div>
            </div>
          </div>
          <div className="text-sm text-[#76777A]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#14BDEE] hover:text-[#0DA8D4] font-medium transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Registration Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
            {/* Progress Steps */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <div 
                  className={`flex-1 py-4 text-center font-medium transition-colors ${
                    currentStep === 1 ? 'text-[#14BDEE] bg-[#ECFEFF]' : 'text-[#76777A]'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      currentStep === 1 ? 'bg-[#14BDEE] text-white' : 'bg-[#EFF6FF] text-[#76777A]'
                    }`}>
                      1
                    </div>
                    Personal Details
                  </div>
                </div>
                <div 
                  className={`flex-1 py-4 text-center font-medium transition-colors ${
                    currentStep === 2 ? 'text-[#14BDEE] bg-[#ECFEFF]' : 'text-[#76777A]'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      currentStep === 2 ? 'bg-[#14BDEE] text-white' : 'bg-[#EFF6FF] text-[#76777A]'
                    }`}>
                      2
                    </div>
                    Course & Education
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
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
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-600">{success}</p>
                  </div>
                </div>
              )}

              {currentStep === 1 ? (
                // Step 1: Personal Details
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-[#384158] mb-2">Personal Information</h1>
                    <p className="text-[#76777A]">Tell us about yourself</p>
                  </div>

                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#384158] mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#76777A]" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Harshad More"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14BDEE] focus:border-transparent transition-colors"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#384158] mb-2">
                          Gender *
                        </label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#76777A] z-10" />
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14BDEE] focus:border-transparent transition-colors appearance-none"
                            required
                          >
                            <option value="">Select Gender</option>
                            {genderOptions.map(option => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#76777A]" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#384158] mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#76777A]" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="harshad@example.com"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14BDEE] focus:border-transparent transition-colors"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#384158] mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#76777A]" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="9876543210"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14BDEE] focus:border-transparent transition-colors"
                            required
                            maxLength="10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#384158] mb-2">
                          Password *
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#76777A]" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Create a strong password"
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

                      <div>
                        <label className="block text-sm font-medium text-[#384158] mb-2">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#76777A]" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your password"
                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14BDEE] focus:border-transparent transition-colors"
                            required
                            minLength="6"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#76777A] hover:text-[#384158] transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#384158] mb-2">
                          Date of Birth
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#76777A]" />
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14BDEE] focus:border-transparent transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#384158] mb-2">
                          City
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#76777A]" />
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Your city"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14BDEE] focus:border-transparent transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password Requirements */}
                    <div className="p-3 bg-[#EFF6FF] rounded-lg border border-gray-200">
                      <div className="text-sm font-medium text-[#384158] mb-2">Password must contain:</div>
                      <div className="grid grid-cols-2 gap-1 text-xs text-[#76777A]">
                        <div className="flex items-center gap-1">
                          <CheckCircle className={`w-3 h-3 ${formData.password.length >= 6 ? 'text-green-500' : 'text-gray-300'}`} />
                          At least 6 characters
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className={`w-3 h-3 ${formData.password === formData.confirmPassword && formData.password ? 'text-green-500' : 'text-gray-300'}`} />
                          Passwords match
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-[#14BDEE] to-[#5BD1D7] text-white font-medium rounded-lg hover:from-[#0DA8D4] hover:to-[#4ABCC2] focus:outline-none focus:ring-2 focus:ring-[#14BDEE] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      Continue to Course Selection
                    </button>
                  </form>
                </div>
              ) : (
                // Step 2: Course & Education
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-[#384158] mb-2">Education & Course Selection</h1>
                    <p className="text-[#76777A]">Tell us about your education and choose your course</p>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#384158] mb-2">
                        Current Education Level
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#76777A] z-10" />
                        <select
                          name="educationLevel"
                          value={formData.educationLevel}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14BDEE] focus:border-transparent transition-colors appearance-none"
                        >
                          <option value="">Select education level (Optional)</option>
                          {educationLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#76777A]" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#384158] mb-2">
                        Choose Your Course *
                      </label>
                      <div className="relative">
                        <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#76777A] z-10" />
                        <select
                          name="course"
                          value={formData.course}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14BDEE] focus:border-transparent transition-colors appearance-none"
                          required
                        >
                          {courses.map(course => (
                            <option key={course} value={course}>{course}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#76777A]" />
                      </div>
                    </div>

                    {/* Student Information Preview */}
                    <div className="p-4 bg-[#EFF6FF] rounded-lg border border-gray-200">
                      <h4 className="font-medium text-[#384158] mb-3">Registration Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#76777A]">Name:</span>
                          <span className="font-medium text-[#384158]">{formData.name || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#76777A]">Email:</span>
                          <span className="font-medium text-[#384158]">{formData.email || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#76777A]">Gender:</span>
                          <span className="font-medium text-[#384158]">{formData.gender || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#76777A]">Phone:</span>
                          <span className="font-medium text-[#384158]">{formData.phone || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#76777A]">Selected Course:</span>
                          <span className="font-medium text-[#14BDEE]">{formData.course || 'Not selected'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="p-4 bg-[#ECFEFF] rounded-lg border border-[#14BDEE]">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            id="terms"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="w-4 h-4 text-[#14BDEE] rounded focus:ring-[#14BDEE]"
                            required
                          />
                        </div>
                        <div className="text-sm">
                          <label htmlFor="terms" className="font-medium text-[#384158]">
                            I agree to the Terms of Service and Privacy Policy *
                          </label>
                          <p className="text-[#76777A] mt-1">
                            By creating an account, you agree to our terms and acknowledge our privacy policy.
                            You'll receive occasional account-related emails.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="py-3 border border-gray-300 text-[#384158] font-medium rounded-lg hover:bg-[#EFF6FF] transition-colors"
                        disabled={isLoading}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="py-3 bg-gradient-to-r from-[#14BDEE] to-[#5BD1D7] text-white font-medium rounded-lg hover:from-[#0DA8D4] hover:to-[#4ABCC2] focus:outline-none focus:ring-2 focus:ring-[#14BDEE] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating Account...
                          </div>
                        ) : (
                          'Create Account'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Benefits Section */}
              <div className="mt-8 p-4 bg-gradient-to-r from-[#ECFEFF] to-[#EFF6FF] rounded-lg border border-[#5BD1D7]">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#5BD1D7] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-[#384158] mb-2">Why join Paarsh E-Learning?</h4>
                    <ul className="space-y-1 text-sm text-[#76777A]">
                      <li>• Access to 1000+ industry-relevant courses</li>
                      <li>• 1:1 mentorship with industry experts</li>
                      <li>• Certificate recognized by 500+ companies</li>
                      <li>• Placement assistance with 95% success rate</li>
                      <li>• Flexible learning schedule</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <div className="text-sm text-[#76777A]">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#14BDEE] hover:text-[#0DA8D4] font-medium transition-colors">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-lg font-bold text-[#14BDEE]">₹0</div>
              <div className="text-xs text-[#76777A]">No Registration Fee</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#5BD1D7]">7-Day</div>
              <div className="text-xs text-[#76777A]">Free Trial</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#60A5FA]">100%</div>
              <div className="text-xs text-[#76777A]">Placement Support</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#FFA726]">24/7</div>
              <div className="text-xs text-[#76777A]">Learning Support</div>
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

export default RegisterPage;