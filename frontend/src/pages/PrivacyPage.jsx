import React from 'react';
import { AiFillSafetyCertificate , AiOutlineEye, AiOutlineLock, AiOutlinePhone } from 'react-icons/ai';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const PrivacyPage = () => {
  const sections = [
    {
      title: "Information We Collect",
      icon: AiOutlineEye,
      content: [
        "Personal information such as name, email address, phone number, and delivery address",
        "Order history and preferences to improve your experience",
        "Payment information (processed securely through encrypted channels)",
        "Device information and app usage data for analytics and improvements"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: AiFillSafetyCertificate ,
      content: [
        "To process and fulfill your food orders",
        "To communicate with you about your orders and account",
        "To improve our services and user experience",
        "To send promotional offers and updates (with your consent)"
      ]
    },
    {
      title: "Information Security",
      icon: AiOutlineLock,
      content: [
        "We use industry-standard encryption to protect your data",
        "Payment information is processed through secure, PCI-compliant systems",
        "Regular security audits and updates to protect against threats",
        "Access to personal data is restricted to authorized personnel only"
      ]
    },
    {
      title: "Third-Party Sharing",
      icon: AiOutlinePhone,
      content: [
        "We share information with restaurant partners only to fulfill orders",
        "Delivery partners receive only necessary information for order delivery",
        "Payment processors handle transaction data securely",
        "We do not sell your personal information to third parties"
      ]
    }
  ];

  return (
    <>
    <Nav/>
    <div className="min-h-screen bg-gray-50 pt-20 pb-8 mt-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4">
            <Link to="/" > <FaArrowLeft size={20} className='text-[#ff4d2d] p-2 w-9 h-9'/> </Link>
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, 
            use, and protect your personal information.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last updated: September 28, 2025
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Privacy</h2>
          <p className="text-gray-600 leading-relaxed">
            At Vingo, we are committed to protecting your privacy and ensuring the security 
            of your personal information. This Privacy Policy outlines our practices concerning 
            the collection, use, and disclosure of information that you may provide via our 
            mobile application and website.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-sm p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b47] rounded-xl flex items-center justify-center">
                    <IconComponent className="text-white text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#ff4d2d] rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-600 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Rights</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Access & Control</h3>
              <p className="text-gray-600 text-sm">
                You have the right to access, update, or delete your personal information 
                at any time through your account settings.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Opt-Out</h3>
              <p className="text-gray-600 text-sm">
                You can opt-out of promotional communications at any time by 
                updating your preferences or contacting us.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-[#ff4d2d] to-[#ff6b47] rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="text-lg mb-6 opacity-90">
              If you have any questions about this Privacy Policy, please contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:privacy@vingo.com" 
                className="bg-white text-[#ff4d2d] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Email: privacy@vingo.com
              </a>
              <a 
                href="tel:+911234567890" 
                className="bg-white/20 text-white border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors duration-200"
              >
                Call: +91 123 456 7890
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default PrivacyPage;
