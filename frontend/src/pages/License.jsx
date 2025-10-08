import React from 'react';
import { AiOutlineCode, AiOutlineCopyright, AiOutlineGlobal } from 'react-icons/ai';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const License = () => {
  const openSourceLibraries = [
    { name: "React", license: "MIT", purpose: "UI Library" },
    { name: "React Router", license: "MIT", purpose: "Navigation" },
    { name: "Redux Toolkit", license: "MIT", purpose: "State Management" },
    { name: "Axios", license: "MIT", purpose: "HTTP Requests" },
    { name: "Tailwind CSS", license: "MIT", purpose: "Styling" },
    { name: "React Icons", license: "MIT", purpose: "Icons" },
    { name: "Recharts", license: "MIT", purpose: "Charts" },
    { name: "React Spinners", license: "MIT", purpose: "Loading Indicators" }
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
            License & Legal Information
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Information about our licensing, terms of use, and the open-source 
            libraries that power Vingo.
          </p>
        </div>

        {/* App License */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b47] rounded-xl flex items-center justify-center">
              <AiOutlineCopyright className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Vingo App License</h2>
          </div>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              © 2025 Vingo. All rights reserved.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              This mobile application and its original content, features, and functionality 
              are owned by Vingo and are protected by international copyright, trademark, 
              patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You may not reproduce, distribute, modify, create derivative works of, 
              publicly display, publicly perform, republish, download, store, or transmit 
              any of the material on our application without prior written consent.
            </p>
          </div>
        </div>

        {/* Terms of Service */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <AiOutlineGlobal className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Terms of Service</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">User Responsibilities</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Provide accurate information when placing orders</li>
                <li>• Use the service in accordance with applicable laws</li>
                <li>• Respect intellectual property rights</li>
                <li>• Not engage in fraudulent activities</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Service Availability</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Service availability may vary by location</li>
                <li>• We strive for 99.9% uptime but cannot guarantee it</li>
                <li>• Maintenance windows may cause temporary interruptions</li>
                <li>• Features may be updated or modified without notice</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Open Source Libraries */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <AiOutlineCode className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Open Source Libraries</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            Vingo is built using various open-source libraries. We are grateful to the 
            open-source community for their contributions.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Library</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">License</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {openSourceLibraries.map((lib, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{lib.name}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {lib.license}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{lib.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">
              <strong>MIT License:</strong> A permissive license that allows commercial use, 
              modification, distribution, and private use, while requiring preservation of 
              copyright and license notices.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-[#ff4d2d] to-[#ff6b47] rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Legal Questions?</h2>
            <p className="text-lg mb-6 opacity-90">
              For any legal or licensing questions, please contact our legal team.
            </p>
            <a 
              href="mailto:legal@vingo.com" 
              className="inline-block bg-white text-[#ff4d2d] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Contact Legal Team
            </a>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default License;
