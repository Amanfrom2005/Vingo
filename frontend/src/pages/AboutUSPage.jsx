import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const AboutUSPage = () => {
  return (
    <>
    <Nav/>
    <main className="min-h-screen bg-gray-50 py-12 px-6 md:px-12 lg:px-24 mt-16">
      <section className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4">
            <Link to="/" > <FaArrowLeft size={20} className='text-[#ff4d2d] p-2 w-9 h-9'/> </Link>
            About Vingo
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Vingo is committed to delivering the best food from your favorite
            restaurants right to your doorstep quickly and reliably.
          </p>
        </header>

        {/* Mission Section */}
        <section className="md:flex md:items-center md:space-x-12 gap-8">
          <div className="relative md:flex-1">
            <img
              src="/api/placeholder/600/400"
              alt="Mission"
              className="rounded-lg shadow-lg w-full object-cover max-h-80 md:max-h-full"
            />
          </div>
          <div className="md:flex-1 space-y-6 mt-6 md:mt-0">
            <h2 className="text-3xl font-semibold text-orange-600">
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              To connect communities through fresh and delicious food delivery
              experiences by supporting local restaurants and providing
              unmatched speed and convenience.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <h2 className="text-3xl font-semibold text-center mb-10 text-orange-600">
            Meet Our Team
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                name: "Alice Johnson",
                role: "Founder & CEO",
                img: "/api/placeholder/200/200",
              },
              {
                name: "Bob Smith",
                role: "CTO",
                img: "/api/placeholder/200/201",
              },
              {
                name: "Carol Lee",
                role: "Marketing Lead",
                img: "/api/placeholder/200/202",
              },
              {
                name: "David Kim",
                role: "Operations Manager",
                img: "/api/placeholder/200/203",
              },
            ].map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-orange-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto space-y-4 text-center">
          <h2 className="text-3xl font-semibold text-orange-600">
            Core Values
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Speed, Quality, Reliability, Customer Satisfaction, and Supporting
            Local Restaurants.
          </p>
        </section>
      </section>
    </main>
    <Footer/>
    </>
  );
};

export default AboutUSPage;
