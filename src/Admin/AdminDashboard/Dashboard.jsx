import React, { useState,useEffect } from 'react';

import axios from "axios";
import { Table, Modal, Button, Form } from "react-bootstrap";
import {
  FaUserFriends,
  FaBuilding,
  FaSpinner,
  FaClipboardCheck,
  FaGraduationCap,
  FaChartLine,
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend } from 'recharts';


const dataPie = [
  { name: 'CSE', value: 120 },
  { name: 'ECE', value: 100 },
  { name: 'EEE', value: 80 },
  { name: 'ME', value: 60 },
  { name: 'CE', value: 40 },
];




const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00c49f'];

const Dashboard = () => {


const roundOptions = [
    "Aptitude",
    "Interview",
    "Technical",
    "HR",
    "Group Discussion",
    "Coding Test",
    "System Design",
    "Case Study",
    "Puzzle Round",
    "Managerial Round",
    "Domain-Specific Round",
  ];
  const[lastYear,setLastYear] = useState(null);
  const [selectedTab, setSelectedTab] = useState('Existing-Company');

  const [choose, setChoose] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState("");
  const [companies, setCompanies] = useState([]);
  const [drivechoose, setDrivechoose] = useState(false);
  const [editedRounds, setEditedRounds] = useState({});
const [selectedDriveRounds, setSelectedDriveRounds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [RoundDrive, setRoundDrive] = useState([]);
  const [companyCount, setCompanyCount] = useState(0);
const[placementCount,setPlacementCount] = useState(0);
const[ongoingRounds,setongoingRounds] = useState(0);
const[upcomingDeadlines,setupcomingDeadlines] = useState(0);
const[registeredStudents,setregisteredStudents] = useState(0);
const[placementSuccessRate,setPlacementSucessRate] = useState(0);
  const [dataBar, setDataBar] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

  


useEffect(()=>{
    setLastYear(new Date().getFullYear()-1);
},[]);




  
 useEffect(() => {
    const fetchStatisticsByYear = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_UR}/portal/placed-students/count-by-year`);
        console.log("Fetched Data:", response.data); 
        const placementData = response.data.placement_data;

        
        const formattedData = Object.entries(placementData).map(([year, count]) => ({
          name: year, // X-Axis (Year)
          placements: count // Y-Axis (Placement count)
        }));

        setDataBar(formattedData);
      } catch (error) {
        console.error("Error occurred while getting data by year:", error);
      }
    };

    fetchStatisticsByYear();
 }, []);
  
  





  
 

  //Comapny Form Data
   const [formData, setFormData] = useState({
    company_id: "",
    company_name: "",
    contact_person_name: "",
    phone_number: "",
    official_mail: "",
    address:"",
    website_link: "",
   });


   

  
const handleSearch = async (e) => {
  const name = e.target.value.toLowerCase(); // Convert input to lowercase
  setSearchTerm(e.target.value);

  if (name.trim() === "") {
    fetchAllCompanies();
  } else {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_UR}/portal/get-company`);
      const companiesData = response.data.companies;

      if (Array.isArray(companiesData)) {
        // Filter companies case-insensitively
        const filteredCompanies = companiesData.filter(company =>
          company.company_name.toLowerCase().includes(name)
        );
        setCompanies(filteredCompanies);
      } else {
        setCompanies([]);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      setCompanies([]);
    }
  }
};

  useEffect(() => {
    fetchAllCompanies();
  }, []);

  const fetchAllCompanies = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_UR}/portal/get-company`);
      console.log("Fetched companies:", response.data);

      const companiesData = response.data.companies; // Extract 'companies' array

      if (Array.isArray(companiesData)) {
        setCompanies(companiesData);
      } else {
        console.error("Companies data is not an array:", companiesData);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };
  






   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_UR}/portal/placement-stats/${lastYear}`);
        setPlacementCount(response.data.placed_count);
        setongoingRounds(response.data.ongoing_rounds);
        setupcomingDeadlines(response.data.upcoming_deadlines);
        setregisteredStudents(response.data.registered_students);
        setPlacementSucessRate(response.data.placement_success_rate);
      } catch (error) {
        console.error("Error fetching company count:", error);
      }
    };

    fetchData();
  }, [lastYear]);

  { /*Retrive each count for the admin dashboard */}

   useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_UR}/portal/registered-companies/count`);
        
        setCompanyCount(res.data.company_count);
      } catch (error) {
        console.error("Error fetching company count:", error);
      }
    };

    fetchData();
  }, []);








  const handleUpdatedClick = (company) => {
    

   
    setFormData({
      company_id: company.company_id,
      company_name: company.company_name,
      contact_person_name: company.contact_person_name || "",
      official_mail: company.official_mail,
      address: company.address,
      phone_number: company.phone_number || "",
      website_link: company.website_link,
    });
     setTimeout(() => setChoose(true), 10);
  }

  const handleDrive = (e) => {
    setFormDrive({ ...formDrive, [e.target.name]: e.target.value });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  //Updation of company from front
  const handleCompanySubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await axios.put(`${import.meta.env.VITE_API_UR}/portal/update-company`, formData);
      if (response.status === 200) {
        alert("Company updated successfully!");
        setChoose(false);
      }
    } catch (error) {
      console.error("Error updating company:", error);
      alert("Failed to update company.");
    }
  };


  return (
    <div>
      {/* Placement Stats */}
      <div className="flex flex-wrap justify-around">
        {/* Stats Section */}
        <div className="flex flex-col items-center flex-1 bg-[#005f69] text-white p-4 rounded-lg mx-2 shadow-md">
          <FaUserFriends size={40} className="mb-2" />
          <h2 className="text-lg font-bold">Total Students Registered</h2>
          <p className="text-4xl font-bold">{registeredStudents}</p>
        </div>

        <div className="flex flex-col items-center flex-1 bg-blue-800 text-white p-4 rounded-lg mx-2 shadow-md">
          <FaBuilding size={40} className="mb-2" />
          <h2 className="text-lg font-bold">Total Companies Registered</h2>
          <p className="text-4xl font-bold">{ companyCount}</p>
        </div>

        <div className="flex flex-col items-center flex-1 bg-blue-900 text-white p-4 rounded-lg mx-2 shadow-md">
          <FaSpinner size={40} className="mb-2 animate-spin" />
          <h2 className="text-lg font-bold">Ongoing Drives</h2>
          <p className="text-4xl font-bold">{ongoingRounds}</p>
        </div>

        <div className="flex flex-col items-center flex-1 bg-red-600 text-white p-4 rounded-lg mx-2 shadow-md">
          <FaClipboardCheck size={40} className="mb-2" />
          <h2 className="text-lg font-bold">Upcoming Deadlines</h2>
          <p className="text-4xl font-bold">{upcomingDeadlines}</p>
        </div>

        <div className="flex flex-col items-center flex-1 bg-teal-700 text-white p-4 rounded-lg mx-2 shadow-md">
          <FaGraduationCap size={40} className="mb-2" />
          <h2 className="text-lg font-bold">Students Placed</h2>
          <p className="text-4xl font-bold">{placementCount}</p>
        </div>

        <div className="flex flex-col items-center flex-1 bg-emerald-600 text-white p-4 rounded-lg mx-2 shadow-md">
          <FaChartLine size={40} className="mb-2" />
          <h2 className="text-lg font-bold">Placement Success Rate</h2>
          <p className="text-4xl font-bold">{placementSuccessRate}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex flex-row justify-center items-center mt-6 space-x-8">
        {/* Bar Chart */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Yearly Placements Overview</h2>
          <ResponsiveContainer width={600} height={300}>
            <BarChart data={dataBar}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="placements" fill="#005f69" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Doughnut Chart */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Department-wise Placement</h2>
          <ResponsiveContainer width={600} height={300}>
            <PieChart>
              <Pie
                data={dataPie}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {dataPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <PieTooltip />
              <PieLegend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/*Button to choose different sections */}
     <div className="flex justify-center mt-10 gap-4">
        <button
          className={`px-6 py-2 font-bold flex-1 ${
            selectedTab === 'Existing-Company' ? 'bg-[#005f69] text-white' : 'bg-gray-300'
          }`}
          onClick={() => setSelectedTab('Existing-Company')}
        >
          Existing Company
        </button>
      
         
      </div>   

      {/*The Table Data */}
      {selectedTab === "Existing-Company" && (
        <div className="overflow-x-auto shadow-md rounded-lg border-Navy mt-8">
          <input
          type="text"
            placeholder="Enter company Name for search "
          value={searchTerm}
        onChange={handleSearch}
          className='w-1/2 rounded-md border-[#005f69] mb-10'/>

          <Table striped bordered hover responsive>
            <thead style={{ backgroundColor: "#005f69", color: "white" }}>
              <tr>
                <th> ID</th>
                <th>Company Name</th>
                <th>Contact Person</th>
                <th>Email</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Website</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.company_id}>
                  <td>{company.company_id}</td>
                  <td>{company.company_name}</td>
                  <td>{company.contact_person_name || "N/A"}</td>
                  <td>{company.official_mail}</td>
                   <td>{company.address}</td>
                  <td>{company.phone_number || "N/A"}</td>
                  <td>
                    <a
                      href={company.website_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {company.website_link}
                    </a>
                  </td>
                  <td>
                    <button className="px-6 py-2 bg-[#005f69] text-white rounded hover:bg-[blue] transition"
                onClick={() => {
    console.log("Button clicked! Company:", company); // Add this log
    handleUpdatedClick(company);
    console.log("choose after click:", choose); // Check if `choose` changes
  }}>Update</button>
                  </td>
                  <td>
                    <button className='px-6 py-2 bg-red-700 text-white rounded hover:bg-[#004b52] transition'
                      onClick={() => {
                        handleDeleteClick(company);
                    }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

     



{choose && (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-2xl shadow-xl w-1/2">
      <h2 className="text-3xl text-[#005f69] font-bold mb-6 text-center my-7">Update Company</h2>

      <form onSubmit={handleCompanySubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-lg font-bold text-[#005f69] mb-4">ID</label>
            <input
              type="text"
              name="company_id"
              value={formData.company_id}
              readOnly
              className="bg-gray-200 border-[#005f69] text-[#005f69] text-lg rounded-lg w-full p-2.5"
            />
          </div>
          <div>
            <label className="block text-lg font-bold text-[#005f69] mb-4">Company Name</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="bg-gray-200 border-[#005f69] text-[#005f69] text-lg rounded-lg w-full p-2.5"
            />
          </div>
          <div>
            <label className="block text-lg font-bold text-[#005f69] mb-4">Contact Person</label>
            <input
              type="text"
              name="contact_person_name"
              value={formData.contact_person_name}
              onChange={handleChange}
              className="bg-gray-200 border-[#005f69] text-[#005f69] text-lg rounded-lg w-full p-2.5"
            />
          </div>
          <div>
            <label className="block text-lg font-bold text-[#005f69] mb-4">Email</label>
            <input
              type="email"
              name="official_mail"
              value={formData.official_mail}
              onChange={handleChange}
              className="bg-gray-200 border-[#005f69] text-[#005f69] text-lg rounded-lg w-full p-2.5"
            />
                </div>
                 <div>
            <label className="block text-lg font-bold text-[#005f69] mb-4">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="bg-gray-200 border-[#005f69] text-[#005f69] text-lg rounded-lg w-full p-2.5"
            />
          </div>
          <div>
            <label className="block text-lg font-bold text-[#005f69] mb-4">Phone</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="bg-gray-200 border-[#005f69] text-[#005f69] text-lg rounded-lg w-full p-2.5"
            />
          </div>
          <div>
            <label className="block text-lg font-bold text-[#005f69] mb-4">Website</label>
            <input
              type="url"
              name="website_link"
              value={formData.website_link}
              onChange={handleChange}
              className="bg-gray-200 border-[#005f69] text-[#005f69] text-lg rounded-lg w-full p-2.5"
            />
          </div>
        </div>

        <div className="flex justify-center items-center gap-5 ">
          <button
            type="button"
            onClick={() => setChoose(false)}
            className="text-white hover:bg-red-700 font-bold bg-slate-500 rounded-lg text-sm px-5 py-2.5 transition flex-1 my-7"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-white bg-[#005f69] hover:bg-[#004b52] font-medium rounded-lg text-sm px-5 py-2.5 transition flex-1 my-7"
          >
            Update Drive
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      
 
    </div>
  );
};

export default Dashboard;
