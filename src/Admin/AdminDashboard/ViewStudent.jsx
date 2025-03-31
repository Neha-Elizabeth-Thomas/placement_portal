import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ViewStudent = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    department: "",
    minCgpa: "",
    no_of_backlogs: "",
    placed: "",
    graduationYear: "",
    noSupplyHistory: ""
  });



  useEffect(() => {
  const fetchStudents = async () => {
    let url = `${import.meta.env.VITE_API_UR}/portal/get-all-registered-students`;

    if (activeTab === "filter") {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      url = `${import.meta.env.VITE_API_UR}/portal/filter-students?${queryParams.toString()}`;
    }

    console.log("Fetching from:", url);

    try {
      setStudents([]); 
      const res = await axios.get(url);
      console.log("Response Data:", res.data);

      
      const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString("en-GB"); 
      };

      let formattedData = [];

      if (activeTab === "all") {
        formattedData = res.data.map((student) => ({
          ...student,
          date_of_birth: formatDate(student.date_of_birth),
        }));
        setStudents(formattedData);
      } else if (activeTab === "filter" && res.data.success && Array.isArray(res.data.data)) {
        formattedData = res.data.data.map((student) => ({
          ...student,
          date_of_birth: formatDate(student.date_of_birth),
        }));
        setStudents(formattedData);
      } else {
        console.error("Unexpected response format", res.data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  fetchStudents();
}, [activeTab, filters]);





  const exportToExcel = () => {
    if (students.length === 0) {
      alert("No data available to download!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const fileName = `students_${activeTab}.xlsx`;

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, fileName);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex space-x-4 mb-4">
        {["all", "filter"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg flex-1 ${
              activeTab === tab
                ? "bg-[#005f69] text-white font-bold"
                : "bg-gray-200 border-[#005f69] border-2 hover:bg-gray-300 font-bold"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "filter" && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
         <div className="bg-blue-100 p-4 rounded-lg mb-4">
  <h3 className="text-xl font-bold text-blue-800">Available Filters</h3>
  <p className="text-lg text-blue-700">
    You can filter students using <b>any combination</b> of the following:
  </p>
  <ul className="list-disc pl-5 text-lg text-blue-700">
    <li><b>Department:</b> CSE, ECE, ME, etc.</li>
    <li><b>Minimum CGPA:</b> Example: 5.0, 6.5</li>
    <li><b>No. of Backlogs:</b> Example: 0, 1, 2, etc.</li>
    <li><b>Placed:</b> true / false</li>
    <li><b>Graduation Year:</b> Example: 2026, 2025</li>
    <li><b>No Supply History:</b> true / false</li>
  </ul>
  <p className="text-lg text-blue-700 mt-2">
    ✅ You can apply <b>one filter</b> or <b>multiple filters together</b>.  
    <br /> Example: Filter by <b>Department = CSE</b> & <b>CGPA ≥ 6.5</b> at the same time.
  </p>
</div>

          <input type="text" placeholder="Department" className="p-2 border rounded w-full mb-2" onChange={(e) => setFilters({ ...filters, department: e.target.value })} />
          <input type="number" placeholder="Minimum CGPA" className="p-2 border rounded w-full mb-2" onChange={(e) => setFilters({ ...filters, minCgpa: e.target.value })} />
          <input type="number" placeholder="No. of Backlogs" className="p-2 border rounded w-full mb-2" onChange={(e) => setFilters({ ...filters, no_of_backlogs: e.target.value })} />
          <select className="p-2 border rounded w-full mb-2" onChange={(e) => setFilters({ ...filters, placed: e.target.value })}>
            <option value="">Placed?</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <input type="number" placeholder="Graduation Year" className="p-2 border rounded w-full mb-2" onChange={(e) => setFilters({ ...filters, graduationYear: e.target.value })} />
          <select className="p-2 border rounded w-full mb-2" onChange={(e) => setFilters({ ...filters, noSupplyHistory: e.target.value })}>
            <option value="">Supply History?</option>
            <option value="true">No Supply History</option>
            <option value="false">Have Supply</option>
          </select>
        </div>
      )}

      <button onClick={exportToExcel} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 mb-4">
        Download {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Data
      </button>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white shadow-md rounded-lg border-[#005f69]">
          <thead>
            <tr className="bg-[#005f69] text-white">
              <th className="p-3 text-left">KTU ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">RIT Mail</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Program</th>
              <th className="p-3 text-left">Semester</th>
              <th className="p-3 text-left">DOB</th>
              <th className="p-3 text-left">Year of Graduation</th>
              <th className="p-3 text-left">Gender</th>
              <th className="p-3 text-left">CGPA</th>
              <th className="p-3 text-left">Number of Backlogs</th>
              <th className="p-3 text-left">Supply History</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.ktu_id} className="border-b">
                  <td className="p-3">{student.ktu_id}</td>
                  <td className="p-3">{student.student_name}</td>
                  <td className="p-3">{student.department}</td>
                  <td className="p-3">{student.rit_email}</td>
                  <td className="p-3">{student.phone_number}</td>
                  <td className="p-3">{student.program}</td>
                  <td className="p-3">{student.semester}</td>
                  <td className="p-3">{student.date_of_birth}</td>
                  <td className="p-3">{student.year_of_graduation}</td>
                  <td className="p-3">{student.gender}</td>
                  <td className="p-3">{student.cgpa}</td>
                  <td className="p-3">{student.no_of_backlogs}</td>
                  <td className="p-3">{student.supply_history ? "Yes" : "No"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="p-3 text-center">No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewStudent;
