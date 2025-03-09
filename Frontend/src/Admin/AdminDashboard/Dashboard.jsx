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
  const [drives, setDrives] = useState([]);
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
  


useEffect(()=>{
    setLastYear(new Date().getFullYear()-1);
},[]);


useEffect(() => {
  const fetchRounds = async () => {
    try {
      const response = await axios.get("http://localhost:3000/portal/get-all-rounds");
      setRoundDrive(response.data); 
    } catch (error) {
      console.error("Error fetching rounds:", error);
    }
  };

  fetchRounds();
}, []);
  
  {/*Fetch statistics by Year */}
  
 useEffect(() => {
    const fetchStatisticsByYear = async () => {
      try {
        const response = await axios.get("http://localhost:3000/portal/placed-students/count-by-year");
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
  
  
{/*Duration */}
const handleShowRounds = (driveId) => {
  const rounds = RoundDrive.filter((round) => round.drive_id === driveId);

  setSelectedDriveRounds(rounds);
  
  setEditedRounds(
    rounds.reduce((acc, round) => {
      let durationHours = "00";
      let durationMinutes = "00";

      if (round.duration) {
        if (typeof round.duration === "string") {
          // If duration is a string, try splitting
          const durationParts = round.duration.split(":");
          durationHours = durationParts[0] || "00";
          durationMinutes = durationParts[1] || "00";
        } else if (typeof round.duration === "object") {
          // If duration is an object (e.g., returned as { hours: x, minutes: y })
          durationHours = round.duration.hours || "00";
          durationMinutes = round.duration.minutes || "00";
        }
      }

      acc[`${round.drive_id}-${round.round_number}`] = {
        ...round,
        duration: {
          hours: durationHours,
          minutes: durationMinutes,
        },
      };
      return acc;
    }, {})
  );

  setShowForm(true);
};



const handleRoundChange = (e, roundKey, field) => {
  if (field === "duration.hours" || field === "duration.minutes") {
    const [key, subfield] = field.split("."); // Split field into "duration" and "hours/minutes"
    setEditedRounds((prev) => ({
      ...prev,
      [roundKey]: {
        ...prev[roundKey],
        duration: {
          ...prev[roundKey].duration,
          [subfield]: e.target.value,
        },
      },
    }));
  } else {
    setEditedRounds((prev) => ({
      ...prev,
      [roundKey]: {
        ...prev[roundKey],
        [field]: e.target.value,
      },
    }));
  }
};


const handleUpdate = async () => {
  console.log("Updated Rounds: ", editedRounds);
  try {
    await Promise.all(
      Object.entries(editedRounds).map(([key, roundData]) => {
        const [drive_id, round_number] = key.split("-");

        // Convert hours/minutes into PostgreSQL INTERVAL format
        const formattedDuration = `${roundData.duration.hours || "00"}:${
          roundData.duration.minutes || "00"
        }:00`;

        return axios.put(
          `http://localhost:3000/portal/update-round/${drive_id}/${round_number}`,
          {
            ...roundData,
            duration: formattedDuration, // Send as HH:MI:SS
          }
        );
      })
    );
    alert("All rounds updated");
    console.log("✅ All rounds updated successfully!");
  } catch (error) {
    alert(`Error updating rounds: ${JSON.stringify(error.response?.data) || error.message}`);
    console.error(
      "❌ Error updating rounds:",
      error.response?.data || error.message
    );
  }

  setShowForm(false);
};
  
 

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


   useEffect(() => {
    let url = "http://localhost:3000/portal/getdrives"; // Default URL

    if (selectedDrive === "On-Going-drive") {
      url = "http://localhost:3000/portal/drives/ongoing";
    } else if (selectedDrive === "Up-coming-Drives") {
      url = "http://localhost:3000/portal/drives/upcoming";
    } else if (selectedDrive === "Completed-drives") {
      url = "http://localhost:3000/portal/drives/past";
    }

    axios.get(url)
      .then((response) => {
        console.log("Fetched drives:", response.data);
        if (Array.isArray(response.data.drives)) {
          setDrives(response.data.drives);
        } else {
          console.error("Drives data is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching drives:", error);
      });

  }, [selectedDrive]); 

  


  
useEffect(() => {
  axios.get("http://localhost:3000/portal/get-company")
    .then((response) => {
      console.log("Fetched companies:", response.data);
      // Extract the 'companies' array from the response
      const companiesData = response.data.companies;
      
      if (Array.isArray(companiesData)) {
        setCompanies(companiesData);
      } else {
        console.error("Companies data is not an array:", companiesData);
      }
    })
    .catch((error) => {
      console.error("Error fetching companies:", error);
    });
}, []);
  






   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/portal/placement-stats/${lastYear}`);
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
        const res = await axios.get("http://localhost:3000/portal/registered-companies/count");
        
        setCompanyCount(res.data.company_count);
      } catch (error) {
        console.error("Error fetching company count:", error);
      }
    };

    fetchData();
  }, []);



const [formDrive, setFormDrive] = useState({
    drive_id: "", // Primary key for updating drive
    company_id: "", // Changed from company_name → company_id to match DB
    job_role: "",
    num_of_rounds: "",
    training_package: "",
    permanent_package: "",
    drive_mode: "",
    drive_type: "",
    start_date: "",
    last_date_to_submit: "",
    no_of_backlogs_permitted: "",
    supply_history_allowed: false, // Boolean field
    min_cgpa_required: "",
    focused_branches: [], // Array field
    description: "", // Added to match DB
    registration_link: "", // Added to match DB
    work_location: "",
   
});

  

  const handleDriveChange = (drive) => {
   setFormDrive({
        drive_id: drive.drive_id || "", // Ensuring primary key exists
        company_id: drive.company_id || "", // Changed from company_name → company_id to match DB
        job_role: drive.job_role || "",
        num_of_rounds: drive.num_of_rounds || "",
        training_package: drive.training_package || "",
        permanent_package: drive.permanent_package || "",
        drive_mode: drive.drive_mode || "",
        drive_type: drive.drive_type || "",
        start_date: drive.start_date || "",
        last_date_to_submit: drive.last_date_to_submit || "",
        no_of_backlogs_permitted: drive.no_of_backlogs_permitted || "",
        supply_history_allowed: drive.supply_history_allowed ?? false, // Boolean handling
        min_cgpa_required: drive.min_cgpa_required || "",
        focused_branches: drive.focused_branches || [], // Ensuring array consistency
        description: drive.description || "", // Added to match DB
        registration_link: drive.registration_link || "", // Added to match DB
        work_location: drive.work_location || "",
        
    });
setTimeout(() => setDrivechoose(true), 10);
  }

//delete Drive Data
  const handleDriveDelete = async (drive) => {
     alert("Hey Are You Sure ?? You Want to Delete ? There is no undo !!!!!");
    try {
      const result = await axios.delete(`http://localhost:3000/portal/deleteDrive/${drive.drive_id}`);
      if (result.status === 200) {
        alert("Its get deleted successfully");
      }
    } catch (error) {
       console.error("Error deleting drive:", error);
    alert("Failed to delete drive.");
    }
  }
  //Delete The Company From DB
  const handleDeleteClick = async (company) => {
    alert("Hey Are You Sure ?? You Want to Delete ? There is no undo !!!!!");
  try {
    const res = await axios.delete(`http://localhost:3000/portal/delete-company/${company.company_id}`);
    
    if (res.status === 200) {
      alert("Deleted successfully!!!");
    } 
  } catch (error) {
    console.error("Error deleting company:", error);
    alert("Failed to delete company.");
  }
};



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


//Update the Drive
 const handleDriveSubmit = async (e) => {
    e.preventDefault(); 

    if (!formDrive.drive_id || isNaN(Number(formDrive.drive_id))) {
        alert("Invalid drive ID. Please select a valid drive.");
        return;
    }

    try {
        const response = await axios.put('http://localhost:3000/portal/updateDrive', {
            ...formDrive,
            drive_id: Number(formDrive.drive_id),  // Convert `drive_id` to integer
        });

        if (response.status === 200) {  // Fix: response should check `status`
            alert("Drive updated successfully!");
            setDrivechoose(false);
        }
    } catch (error) {
        console.error("Error updating Drive:", error);
        alert("Failed to update Drive.");
    }
};

  //Updation of company from front
  const handleCompanySubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await axios.put('http://localhost:3000/portal/update-company', formData);
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
        <button
          className={`px-6 py-2  font-bold flex-1 ${
            selectedTab === 'DriveData' ? 'bg-[#005f69] text-white' : 'bg-gray-300'
          }`}
          onClick={() => setSelectedTab('DriveData')}
        >
          Check Drive Details
        </button>
         
      </div>   

      {/*The Table Data */}
      {selectedTab === "Existing-Company" && (
        <div className="overflow-x-auto shadow-md rounded-lg border-Navy mt-8">
          <input
          type="text"
            placeholder="Enter company Name for search "
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

      {selectedTab === "DriveData" && (
  <div className="overflow-x-auto shadow-md rounded-lg border-Navy mt-8 p-4">
    <div>
      <select
        name="course"
        className="w-50 border-[#005f69] text-black border-b rounded-lg focus:outline-none focus:ring focus:ring-blue-500 p-2"
        onChange={(e) => setSelectedDrive(e.target.value)}
        required
      >
        <option value="">All Drives</option>
        <option value="On-Going-drive">On-Going Drive</option>
        <option value="Up-coming-Drives">Upcoming Drives</option>
        <option value="Completed-drives">Completed Drives</option>
      </select>
    </div>

    <Table striped bordered hover responsive>
      <thead style={{ backgroundColor: "#005f69", color: "white" }}>
        <tr>
          <th className="px-4 py-2">Drive ID</th>
          <th className="px-4 py-2">Company ID</th>
          <th className="px-4 py-2">Company Name</th>
          <th className="px-4 py-2">Job Role</th>
          <th className="px-4 py-2">Rounds</th>
          <th className="px-4 py-2">Training Package</th>
          <th className="px-4 py-2">Permanent Package</th>
          <th className="px-4 py-2">Drive Mode</th>
          <th className="px-4 py-2">Drive Type</th>
          <th className="px-4 py-2">Start Date</th>
          <th className="px-4 py-2">Last Date to Submit</th>
          <th className="px-4 py-2">Backlogs Permitted</th>
          <th className="px-4 py-2">Supply Allowed</th>
          <th className="px-4 py-2">Min CGPA</th>
          <th className="px-4 py-2">Focused Branches</th>
          <th className="px-4 py-2">Work Location</th>
          <th className="px-4 py-2">Description</th>
          <th className="px-4 py-2">Registration Link</th>
          <th className="px-4 py-2">Round Details</th>
          <th className="px-4 py-2">Update</th>
          <th className="px-4 py-2">Delete</th>
        </tr>
      </thead>
      <tbody>
        {drives.map((drive) => (
          <tr key={drive.drive_id}>
            <td className="px-4 py-3">{drive.drive_id}</td>
            <td className="px-4 py-3">{drive.company_id || "Unknown"}</td>
            <td className="px-4 py-3">{drive.company_name || "Unknown"}</td>
            <td className="px-4 py-3">{drive.job_role}</td>
            <td className="px-4 py-3">{drive.num_of_rounds}</td>
            <td className="px-4 py-3">{drive.training_package} LPA</td>
            <td className="px-4 py-3">{drive.permanent_package} LPA</td>
            <td className="px-4 py-3">{drive.drive_mode}</td>
            <td className="px-4 py-3">{drive.drive_type}</td>
            <td className="px-4 py-3">{new Date(drive.start_date).toLocaleDateString()}</td>
            <td className="px-4 py-3">{new Date(drive.last_date_to_submit).toLocaleDateString()}</td>
            <td className="px-4 py-3">{drive.no_of_backlogs_permitted}</td>
            <td className="px-4 py-3">{drive.supply_history_allowed ? "Yes" : "No"}</td>
            <td className="px-4 py-3">{drive.min_cgpa_required}</td>
            <td className="px-4 py-3">{drive.focused_branches.join(", ")}</td>
            <td className="px-4 py-3">{drive.work_location}</td>
            <td className="px-4 py-3">{drive.description}</td>
            <td className="px-4 py-3">
              <a
                href={drive.registration_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Apply Here
              </a>
            </td>
            <td>
              <button className="px-6 py-2 bg-gray-500 text-white font-bold rounded hover:bg-[#004b52] transition"
                onClick={() => handleShowRounds(drive.drive_id)}
              >
                Round
              </button>
            </td>
            <td>
              <button
                className="px-6 py-2 bg-[#005f69] text-white font-bold rounded hover:bg-blue-700 transition"
                onClick={() => handleDriveChange(drive)}
              >
                Update
              </button>
            </td>
            <td>
              <button
                className="px-6 py-2 bg-red-700 text-white font-bold rounded hover:bg-[#004b52] transition"
                onClick={() => handleDriveDelete(drive)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
)}


{drivechoose && (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-2xl shadow-xl w-1/2">
      <h2 className="text-3xl text-[#005f69] font-bold mb-6 text-center my-7">Update Drive</h2>

      <form onSubmit={handleDriveSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {Object.keys(formDrive).map((key) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-700">
                {key.replace(/_/g, " ").toUpperCase()}
              </label>
              <input
                type={key === "supply_history_allowed" ? "checkbox" : "text"}
                name={key}
                value={formDrive[key]}
                onChange={handleDrive}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-400"
                readOnly={key === "drive_id"} 
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-5 ">
          <button
            type="button"
            onClick={() => setDrivechoose(false)}
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

      {/*This is the form for rounds */}
       {showForm && (
        <div className="fixed inset-0 flex  items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 border-[#005f69] border-5 overflow-x-auto ">
            <h2 className="text-2xl font-bold mb-4 text-center text-[#2d939e]">Edit Round Details</h2>
        <div className=" flex gap-8  p-9">
          
          {selectedDriveRounds.map((round) => {
            const roundKey = `${round.drive_id}-${round.round_number}`;
            return (
              <div key={roundKey} className="mb-4 border-[#005f69] border-5 p-6  rounded-lg ">
                <label className="block font-bold  text-[#005f69]">Round Number</label>
                <input
        type="text"
        className="w-full border-[#005f69] p-2 rounded-md bg-gray-200 cursor-not-allowed"
        value={round.round_number}
        readOnly
      />
                <label className="block font-bold  text-[#005f69]">Round Name</label>

                 <select
                value={editedRounds[roundKey].round_name}
                onChange={(e) => handleRoundChange(e, roundKey, "round_name")}
                className="w-full  border-[#005f69] p-2 rounded-md focus:ring focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select Round</option>
                {roundOptions.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>

               

                <label className="block mt-2 font-bold  text-[#005f69]">Round Date</label>
                <input
                  type="date"
                  className="w-full border-[#005f69] p-2 rounded-md focus:ring focus:ring-blue-500"
                  value={editedRounds[roundKey].round_date}
                  onChange={(e) => handleRoundChange(e, roundKey, "round_date")}
                />

                <label className="block mt-2 font-bold text-[#005f69]">Duration (Hours)</label>
                <input
                  type="number"
                  className="w-full border-[#005f69] rounded-md focus:ring focus:ring-blue-500"
                  value={editedRounds[roundKey].duration?.hours || ""}
                  onChange={(e) => handleRoundChange(e, roundKey, "duration.hours")}
                />

                <label className="block mt-2 font-bold text-[#005f69]">Duration (Minutes)</label>
                <input
                  type="number"
                  className="w-full border-[#005f69] rounded-md focus:ring focus:ring-blue-500"
                  value={editedRounds[roundKey].duration?.minutes || ""}
                  onChange={(e) => handleRoundChange(e, roundKey, "duration.minutes")}
                />


                <label className="block mt-2 font-bold  text-[#005f69]">Location</label>
                <input
                  type="text"
                  className="w-full border-[#005f69] p-2 rounded-md focus:ring focus:ring-blue-500"
                  value={editedRounds[roundKey].location || ""}
                  onChange={(e) => handleRoundChange(e, roundKey, "location")}
                />

                <label className="block mt-2 font-bold  text-[#005f69]">Mode</label>
                <input
                  type="text"
                  className="w-full border-[#005f69] p-2 rounded-md focus:ring focus:ring-blue-500"
                  value={editedRounds[roundKey].mode}
                  onChange={(e) => handleRoundChange(e, roundKey, "mode")}
                />
              </div>
            );
          })}

         
            </div>
             <div className="flex justify-center mt-4">
            <button className="bg-red-600 text-white px-4 py-2 rounded-md mr-2" onClick={() => setShowForm(false)}>
              Cancel Changes
            </button>
            <button className="bg-[#005f69] text-white px-4 py-2 rounded-md" onClick={handleUpdate}>
              Save Changes
            </button>
          </div>
            </div>
      </div>
    )}
  
 
    </div>
  );
};

export default Dashboard;
