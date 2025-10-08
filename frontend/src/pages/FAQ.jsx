import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Nav from '../components/Nav';

const FAQ = () => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqData = [
    {
      question: "How do I place an order?",
      answer: "To place an order, simply browse through our restaurants, select your favorite items, add them to cart, and proceed to checkout. You can pay online or choose cash on delivery."
    },
    {
      question: "What are the delivery charges?",
      answer: "Delivery charges vary based on the distance and restaurant. Most deliveries have a charge between ₹20-50. Some restaurants offer free delivery on orders above ₹200."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery time typically ranges from 30-45 minutes depending on your location, restaurant preparation time, and current demand."
    },
    {
      question: "Can I cancel my order?",
      answer: "Yes, you can cancel your order before it's confirmed by the restaurant. Once the restaurant starts preparing, cancellation may not be possible."
    },
    {
      question: "How do I track my order?",
      answer: "You can track your order in real-time from the 'My Orders' section. You'll receive notifications at each stage of your order."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit/debit cards, UPI, net banking, digital wallets, and cash on delivery."
    },
    {
      question: "How do I become a restaurant partner?",
      answer: "To become a restaurant partner, click on 'Partner with us' and fill out the registration form. Our team will contact you within 24-48 hours."
    },
    {
      question: "How do I report an issue with my order?",
      answer: "You can report any issues through the 'Help & Support' section or contact our customer care. We'll resolve your issue promptly."
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
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about Vingo. Can't find what you're looking for? 
            Contact our support team.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="font-semibold text-gray-900 pr-4">
                  {item.question}
                </h3>
                <div className="flex-shrink-0">
                  {openItems.has(index) ? (
                    <AiOutlineMinus className="text-[#ff4d2d] text-xl" />
                  ) : (
                    <AiOutlinePlus className="text-[#ff4d2d] text-xl" />
                  )}
                </div>
              </button>
              
              {openItems.has(index) && (
                <div className="px-6 pb-5 animate-slideDown">
                  <p className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-[#ff4d2d] to-[#ff6b47] rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-lg mb-6 opacity-90">
              Our support team is here to help you 24/7
            </p>
            <Link to={"/contact"} className="bg-white text-[#ff4d2d] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default FAQ;
