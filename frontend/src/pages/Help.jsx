import React, { useState } from 'react';
import { 
  AiOutlinePhone, 
  AiOutlineMail, 
  AiOutlineQuestionCircle,
  AiOutlineBug,
  AiOutlineHeart,
  AiOutlineSend,
  AiOutlinePaperClip
} from 'react-icons/ai';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const Help = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'general', name: 'General Inquiry', icon: AiOutlineQuestionCircle, color: 'blue' },
    { id: 'bug', name: 'Report a Bug', icon: AiOutlineBug, color: 'red' },
    { id: 'feedback', name: 'Feedback', icon: AiOutlineHeart, color: 'green' }
  ];

  const contactMethods = [
    {
      icon: AiOutlinePhone,
      title: 'Phone Support',
      description: '24/7 customer service',
      contact: '+91 123 456 7890',
      action: 'tel:+911234567890'
    },
    {
      icon: AiOutlineMail,
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'support@vingo.com',
      action: 'mailto:support@vingo.com'
    },
    {
      icon: AiOutlinePaperClip,
      title: 'Location',
      description: 'Reach out us here',
      contact: 'Available 9 AM - 10 PM',
      action: '#'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you! Your message has been sent. We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  return (
    <>
    <Nav/>
    <div className="min-h-screen bg-gray-50 pt-20 pb-8 mt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4">
            <Link to="/" > <FaArrowLeft size={20} className='text-[#ff4d2d] p-2 w-9 h-9'/> </Link>
            Help & Support
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're here to help! Get in touch with our support team or browse 
            our resources to find the answers you need.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <a
                key={index}
                href={method.action}
                className="bg-white rounded-2xl shadow-sm p-8 text-center hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b47] rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <IconComponent className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-2">{method.description}</p>
                <p className="text-[#ff4d2d] font-semibold">{method.contact}</p>
              </a>
            );
          })}
        </div>

        {/* Support Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Send us a message
          </h2>

          {/* Category Selection */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-[#ff4d2d] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="text-lg" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff4d2d] focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff4d2d] focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff4d2d] focus:border-transparent outline-none transition-all duration-200"
                placeholder="Brief description of your inquiry"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff4d2d] focus:border-transparent outline-none transition-all duration-200 resize-none"
                placeholder="Please describe your issue or question in detail..."
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b47] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <ClipLoader size={20} color="white" />
                    Sending...
                  </>
                ) : (
                  <>
                    <AiOutlineSend className="text-lg" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Links</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/faq" className="bg-white px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              FAQ
            </Link>
            <Link to="/privacy-policy" className="bg-white px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              Privacy Policy
            </Link>
            <Link to="/license" className="bg-white px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Help;
