import React, { useRef } from "react";
import ritImg from "./assets/rit_campus.jpg"; // Import the image
import ritImg1 from "./assets/rit_trees.jpg"; // Import the image
import ritImg2 from "./assets/rit_img.jpg"; // Import the image
import ritImg3 from "./assets/rit_sky_view.jpg"; // Import the image
import alumni1 from "./assets/unni.png"; // Import the image
import alumni2 from "./assets/kiara.png"; // Import the image
import alumni3 from "./assets/alia.png"; // Import the image
import alumni4 from "./assets/tovino.png"; // Import the image
import p1 from "./assets/cognizant.png"
import p2 from "./assets/Envestnet.png"
import p3 from "./assets/tcs.png"
import p4 from "./assets/ust_global.png"
import { FaCheckCircle, FaRegCheckCircle, FaUser, FaClipboardList, FaHandshake, FaClock, FaBell, FaUserTie, FaGraduationCap } from "react-icons/fa"; // Import icons

const ExplorePage = () => {
    const nextSectionRef = useRef(null); 
    const handleExploreMore = () => {
        nextSectionRef.current.scrollIntoView({ behavior: "smooth" });
    };
  // Sample data for companies and testimonials
  const companies = [
    { id: 1, name: "TCS", logo: p3 },
    { id: 2, name: "UST GLOBAL", logo: p4},
    { id: 3, name: "ENVESTNET", logo: p2 },
    { id: 4, name: "CONGNIZENT", logo: p1},
  ];

  const testimonials = [
    {
      id: 1,
      name: "Ashwin Ganesh",
      role: "Software Engineer at Google",
      quote: "The placement cell helped me secure my dream job!",
      photo: alumni1, // Use imported image
    },
    {
      id: 2,
      name: "Nirmala Pillai",
      role: "Data Scientist at Microsoft",
      quote: "Great support and guidance throughout the process.",
      photo: alumni3, // Use imported image
    },
    {
      id: 3,
      name: "Jimmy Thomas",
      role: "Product Manager at Amazon",
      quote: "The training sessions were incredibly helpful.",
      photo: alumni4, // Use imported image
    },
    {
      id: 4,
      name: "Tarini Moorthy",
      role: "Consultant at Deloitte",
      quote: "I got placed in my dream company thanks to CGPC.",
      photo: alumni2, // Use imported image
    },
  ];

    const guidelines = [
        {
        text: "All final year students must register with CGPC to be eligible for placement drives.",
        icon: <FaCheckCircle className="text-blue-500 text-2xl" />,
        },
        {
        text: "Registration is not compulsory. Students not interested in placement are advised not to register.",
        icon: <FaRegCheckCircle className="text-blue-500 text-2xl" />,
        },
        {
        text: "75% attendance in Placement training is mandatory for eligibility.",
        icon: <FaUser className="text-blue-500 text-2xl" />,
        },
        {
        text: "Students must apply in the CGPC portal to express interest in job offers.",
        icon: <FaClipboardList className="text-blue-500 text-2xl" />,
        },
        {
        text: "Companies are divided into four categories: Open, IT, Core, Dream. Placement rules apply accordingly.",
        icon: <FaHandshake className="text-blue-500 text-2xl" />,
        },
        {
        text: "Students abstaining from placement drives will be de-registered.",
        icon: <FaUser className="text-blue-500 text-2xl" />,
        },
        {
        text: "Volunteering for CGPC is encouraged and may impact future opportunities.",
        icon: <FaHandshake className="text-blue-500 text-2xl" />,
        },
        {
        text: "Students must be courteous and respectful to Team CGPC.",
        icon: <FaUserTie className="text-blue-500 text-2xl" />,
        },
        {
        text: "Clarify salary, job profile, and other details during pre-placement talks.",
        icon: <FaClipboardList className="text-blue-500 text-2xl" />,
        },
        {
        text: "Attend pre-placement talks (PPT) on time and be formally dressed.",
        icon: <FaClock className="text-blue-500 text-2xl" />,
        },
        {
        text: "Check announcements regularly and be punctual for tests/interviews.",
        icon: <FaBell className="text-blue-500 text-2xl" />,
        },
        {
        text: "Maintain discipline and ethical behavior during the placement process.",
        icon: <FaUserTie className="text-blue-500 text-2xl" />,
        },
        {
        text: "Placement offers and acceptances must go through the Placement Office.",
        icon: <FaHandshake className="text-blue-500 text-2xl" />,
        },
        {
        text: "Students are eligible for only one job offer.",
        icon: <FaCheckCircle className="text-blue-500 text-2xl" />,
        },
        {
        text: "Inform the company and Placement Office if opting for higher studies.",
        icon: <FaGraduationCap className="text-blue-500 text-2xl" />,
        },
        {
        text: "CGPC decisions are final and binding.",
        icon: <FaCheckCircle className="text-blue-500 text-2xl" />,
        },
    ];
  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <div
        className="bg-cover bg-center h-96 flex flex-col justify-center items-center text-white"
        style={{
        backgroundImage: `url(${ritImg})`, // Use the imported image
        height: "800px", // Match the height of the image
        width: "100%", // Full width
        margin: "0 auto", // Center the hero section
      }}
      >
        <h1 className="text-4xl font-bold mb-4">
          Welcome to the CGPC RIT
        </h1>
        <p className="text-xl mb-8">Empowering Students for Successful Careers</p>
        <button
          onClick={handleExploreMore} // Add click handler
          className="bg-orange-500 px-6 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
        >
          Explore More
        </button>
      </div>

      {/* About Placement Cell and College */}
      <div ref={nextSectionRef} className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <img
            src={ritImg2}
            alt="College"
            className="w-full md:w-1/2 rounded-lg"
          />
          <div className="text-left">
            <p className="mb-4">
              Rajiv Gandhi Institute of Technology, named after the late Prime Minister Sri Rajiv Gandhi, run by the Government of Kerala, started functioning in 1991. It has established a vast infrastructure and put together a team of dedicated teachers. The institution has become one of the leading technical Institutes in Kerala.
            </p>
            <p className="mb-4">Placement Rate: 90% | Recruiters: 100+</p>
          </div>
        </div>
      </div>

      {/* Placement Procedure */}
      <div className="bg-gray-50 py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Placement Procedure
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">
              1. Invitations to Companies
            </h3>
            <p>
              The Career Guidance and Placement Cell (CGPC) sends invitations to
              companies/organizations along with relevant information.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">2. Allotment of Dates</h3>
            <p>
              CGPC allots dates to companies for campus interviews based on
              various details provided by the companies.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">3. Confirmation</h3>
            <p>
              The company/organization confirms the dates with CGPC. Interested
              students register for the recruitment process.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">4. Student Details</h3>
            <p>
              Details of interested students are sent to the company.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">5. Recruitment Process</h3>
            <p>
              Companies come to the campus on the allotted dates and conduct
              tests and/or interviews.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">6. Final List</h3>
            <p>
              The company/organization furnishes the final list of students
              preferably on the date of the interview.
            </p>
          </div>
        </div>
      </div>

      {/* Placement Guidelines */}
    <div className="py-12 px-4 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-8 font-serif">
        Placement Guidelines
      </h2>
      <div className="max-w-4xl mx-auto space-y-6">
        {guidelines.map((guideline, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex-shrink-0">{guideline.icon}</div>
            <p className="text-gray-700 font-sans leading-relaxed">
              {guideline.text}
            </p>
          </div>
        ))}
      </div>
    </div>

      {/* Companies Coming for Placement */}
  <div className="bg-gray-50 py-12 px-4">
  <h2 className="text-3xl font-bold text-center mb-8">Our Recruiters</h2>
  <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
    {companies.map((company) => (
      <div
        key={company.id}
        className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center"
      >
        <img
          src={company.logo}
          alt={company.name}
          className="w-24 h-24 object-contain mb-4"
        />
        <p className="text-lg font-medium">{company.name}</p>
      </div>
    ))}
  </div>
</div>


      {/* Alumni Testimonials */}
      <div className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          What Our Alumni Say
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <img
                src={testimonial.photo}
                alt={testimonial.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold">{testimonial.name}</h3>
              <p className="text-gray-600">{testimonial.role}</p>
              <p className="mt-4">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex  justify-center">
          {/* Left Section */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-xl font-bold">RIT Career Connect</h2>
            <p className="text-sm">Empowering your career journey since 2025.</p>
            <p className="text-sm">&copy; 2025 RIT Career Connect. All rights reserved.</p>
          </div>

     
          
        </div>
      </div>
    </footer>
    </div>
  );
};

export default ExplorePage; 