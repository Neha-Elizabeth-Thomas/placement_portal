import React, { useState, useEffect } from "react";
import { FaUserCircle, FaIdBadge, FaEnvelope, FaPhone, FaGraduationCap, FaCalendarAlt, FaBook, FaBriefcase, FaFileAlt } from "react-icons/fa";

const StudentUpdate = () => {
  const [student, setStudent] = useState(null); // Initially null to handle loading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_UR}/portal/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }

        const data = await response.json();
        setStudent(data);
        console.log(student);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) return <p className="text-center text-lg">Loading your awesome profile... ⏳</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!student) return null; // Prevents rendering errors if student is still null

  const handleChange = (e) => {
    setStudent({ ...student, skills: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditing(false);
    alert("Skills updated successfully!");
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      {/* Greeting */}
      <div className="w-full text-center mb-6">
        <FaUserCircle className="text-7xl mx-auto text-gray-600" />
        <h1 className="text-4xl font-bold mt-2 text-blue-900">
          Hey <span className="text-red-700">{student.student_name}</span>! Keep Debugging Your Success! 🚀
        </h1>
        <p className="text-lg text-gray-700">
          "Placement is just an optimized algorithm away! Keep coding, keep winning! 💻🔥"
        </p>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-4 gap-8 max-w-6xl mx-auto p-8 text-red-600 text-xl">
        {[
          { label: "KTU ID", value: student.ktu_id, icon: <FaIdBadge /> },
          { label: "Name", value: student.student_name, icon: <FaUserCircle /> },
          { label: "Email", value: student.rit_email, icon: <FaEnvelope /> },
          { label: "Phone", value: student.phone_number, icon: <FaPhone /> },
          { label: "Department", value: student.department, icon: <FaGraduationCap /> },
          { label: "Program", value: student.program, icon: <FaGraduationCap /> },
          { label: "Semester", value: student.semester, icon: <FaBook /> },
          { label: "Date of Birth", value: student.date_of_birth, icon: <FaCalendarAlt /> },
          { label: "Year of Graduation", value: student.year_of_graduation, icon: <FaGraduationCap /> },
          { label: "Gender", value: student.gender, icon: <FaUserCircle /> },
          { label: "CGPA", value: student.cgpa, icon: <FaBook /> },
          { label: "Number of Backlogs", value: student.no_of_backlogs, icon: <FaBook /> },
          { 
            label: "Supply History", 
            value: student.supply_history ? "Yes" : "No", 
            icon: <FaBriefcase /> 
          },
          { 
            label: "Resume", 
            value: student.resume_url ? (
              <a 
                href={student.resume_url.startsWith("http") ? student.resume_url : `https://${student.resume_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Resume
              </a>
            ) : "Not Uploaded",
            icon: <FaFileAlt />
          }
        ].map((item, index) => (
          <div key={index} className="flex items-center p-4">
            <div className="text-blue-600 text-2xl mr-4">{item.icon}</div>
            <div>
              <p className="font-semibold">{item.label}:</p>
              <p>{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Skills Section */}
      <div className="w-full max-w-6xl bg-white p-6">
        <label className="block text-2xl font-semibold text-Navy">Skills</label>
        {editing ? (
          <textarea
            className="w-full p-3 border-Navy border-2"
            value={student.skills}
            onChange={handleChange}
          />
        ) : (
          <p className="p-3 bg-gray-200 rounded-lg text-lg">{student.skills}</p>
        )}
      </div>
      
      {/* Edit Button */}
      <div className="mt-4 flex justify-center">
        {editing ? (
          <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg w-full">Save</button>
        ) : (
          <button onClick={() => setEditing(true)} className="bg-Navy text-white px-6 py-3 rounded-lg text-lg w-52">Edit Skills</button>
        )}
      </div>
    </div>
  );
};

export default StudentUpdate;
