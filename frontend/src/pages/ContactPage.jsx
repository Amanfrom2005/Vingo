import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Nav from "../components/Nav";

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
    <Nav/>
    <main className="min-h-screen bg-gray-50 py-12 px-6 md:px-12 lg:px-24 mt-12">
      <section className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4">
            <Link to="/" > <FaArrowLeft size={20} className='text-[#ff4d2d] p-2 w-9 h-9'/> </Link>
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Have questions or feedback? Reach out to us. We're here to listen.
          </p>
        </header>

        {/* Form and Map Container */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              fetch("https://formspree.io/f/yourformid", {
                // replace yourformid with actual Formspree id
                method: "POST",
                headers: { Accept: "application/json" },
                body: formData,
              }).then((res) => {
                if (res.ok) {
                  setSubmitted(true);
                }
              });
            }}
            className="flex-1 bg-white rounded-lg shadow-md p-8 space-y-6"
          >
            {submitted ? (
              <div className="text-green-600 text-center font-semibold text-lg">
                Thank you for contacting us! We will get back to you soon.
              </div>
            ) : (
              <>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Your email address"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows="5"
                    required
                    className="w-full min-h-20 max-h-96 border border-gray-300 rounded-md px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Write your message here"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-md py-3 shadow transition duration-300 hover:shadow-lg"
                >
                  Send Message
                </button>
              </>
            )}
          </form>

          {/* Google Map */}
          <div className="flex-1 rounded-lg shadow-lg overflow-hidden">
            <iframe
              title="Vingo Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.1720953153267!2d-122.42168968468182!3d37.77492917975925!2m3!1f0!2f0!3f0!3m2!
              1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808d2cba5ddf%3A0x5ddb7ed3d7c96dc3!2sSan+Francisco!5e0!3m2!1sen!2sin!4v1614651651245!5m2!1sen!2sin"
              className="w-full h-96 sm:h-full"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
      <Footer/>
    </>
  );
};

export default ContactPage;
