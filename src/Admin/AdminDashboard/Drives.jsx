import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from 'react';
import axios from 'axios'


const Drives = () => {
    
  const { id } = useParams(); 
  const location = useLocation(); 
  const navigate = useNavigate();
    const { drive } = location.state || {}; 
    const [roundDrive, setRoundDrive] = useState([]);
    const [selectedRound, setSelectedRound] = useState(null);
const [updatedRound, setUpdatedRound] = useState({});

  const formatDuration = (duration) => {
    if (!duration) return "00:00:00";
    
    const hours = duration.hours || 0;
    const minutes = duration.minutes || 0;
    const seconds = duration.seconds || 0;
    
    return `${hours.toString().padStart(2, '0')}:${
            minutes.toString().padStart(2, '0')}:${
            seconds.toString().padStart(2, '0')}`;
  };

  if (!drive) {
    return <p className="text-center text-red-500">No drive data found!</p>;
  }
    const [drivechoose, setDrivechoose] = useState(false);


const handleEditRound = (round) => {
  setSelectedRound(round);  // Open the form with selected round data
  setUpdatedRound(round);   // Set the existing data in the update state
};


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

const handleUpdateRound = async () => {
  if (!updatedRound || !updatedRound.round_number) {
    alert("No round selected for updating!");
    return;
  }

  try {
    const formattedDuration = `${(updatedRound.duration.hours || 0)
      .toString()
      .padStart(2, "0")}:${(updatedRound.duration.minutes || 0)
      .toString()
      .padStart(2, "0")}:00`;

    await axios.put(
      `http://localhost:3000/portal/update-round/${updatedRound.drive_id}/${updatedRound.round_number}`,
      {
        ...updatedRound,
        duration: formattedDuration,
      }
    );

    alert("✅ Round updated successfully!");
    setSelectedRound(null); // Close the edit form
  } catch (error) {
    alert(`❌ Error updating round: ${error.response?.data || error.message}`);
    console.error("Error updating round:", error);
  }
};



      const handleDriveDelete = async (drive) => {
     alert("Hey Are You Sure ?? You Want to Delete ? There is no undo !!!!!");
    try {
      const result = await axios.delete(`http://localhost:3000/portal/deleteDrive/${drive.drive_id}`);
      if (result.status === 200) {
          alert("Its get deleted successfully");
          navigate("/Admin-dashboard/GetStudents");
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
    
    const [formDrive, setFormDrive] = useState({
        drive_id: "",
        company_id: "", 
        job_role: "",
        num_of_rounds: "",
        training_package: "",
        permanent_package: "",
        drive_mode: "",
        drive_type: "",
        start_date: "",
        last_date_to_submit: "",
        no_of_backlogs_permitted: "",
        supply_history_allowed: false,
        min_cgpa_required: "",
        focused_branches: [], 
        description: "", 
        registration_link: "", 
        work_location: "",
       
    });
    
  const handleDrive = (e) => {
    setFormDrive({ ...formDrive, [e.target.name]: e.target.value });
  };


    
    const handleDriveChange = (drive) => {
   setFormDrive({
        drive_id: drive.drive_id || "",
        company_id: drive.company_id || "", 
        job_role: drive.job_role || "",
        num_of_rounds: drive.num_of_rounds || "",
        training_package: drive.training_package || "",
        permanent_package: drive.permanent_package || "",
        drive_mode: drive.drive_mode || "",
        drive_type: drive.drive_type || "",
        start_date: drive.start_date || "",
        last_date_to_submit: drive.last_date_to_submit || "",
        no_of_backlogs_permitted: drive.no_of_backlogs_permitted || "",
        supply_history_allowed: drive.supply_history_allowed ?? false, 
        min_cgpa_required: drive.min_cgpa_required || "",
        focused_branches: drive.focused_branches || [], 
        description: drive.description || "", 
        registration_link: drive.registration_link || "", 
        work_location: drive.work_location || "",
        
    });
setTimeout(() => setDrivechoose(true), 10);
    }
    

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

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 ">
      <h2 className="text-4xl font-bold text-[#005f69] text-center mb-8">
        {drive.company_name} - {drive.job_role}
      </h2>

      <div >
        {/* Left Side */}
        <div className="space-y-4 flex ">
          <div className="p-4 flex-1">
            <h3 className="text-2xl font-semibold text-[#005f69] mb-5">General Info</h3>
            <p><strong>Drive ID:</strong> {drive.drive_id}</p>
            <p><strong>Company ID:</strong> {drive.company_id || "Unknown"}</p>
            <p><strong>Job Role:</strong> {drive.job_role}</p>
            <p><strong>Drive Mode:</strong> {drive.drive_mode}</p>
            <p><strong>Drive Type:</strong> {drive.drive_type}</p>
          </div>

          <div className="p-4 flex-1">
            <h3 className="text-2xl font-semibold text-[#005f69]  mb-5">Salary Details 💰</h3>
            <p><strong>Training Package:</strong> {drive.training_package} LPA</p>
            <p><strong>Permanent Package:</strong> {drive.permanent_package} LPA</p>
          </div>

          <div className="p-4 flex-1">
            <h3 className="text-2xl font-semibold text-[#005f69]  mb-5">Eligibility</h3>
            <p><strong>Min CGPA Required:</strong> {drive.min_cgpa_required}</p>
            <p><strong>No. of Backlogs Allowed:</strong> {drive.no_of_backlogs_permitted}</p>
            <p><strong>Supply History Allowed:</strong> {drive.supply_history_allowed ? "Yes" : "No"}</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-4 flex ">
          <div className="p-4 flex-1">
            <h3 className="text-2xl font-semibold text-[#005f69]  mb-5">Important Dates 📅</h3>
            <p><strong>Start Date:</strong> {new Date(drive.start_date).toLocaleDateString()}</p>
            <p><strong>Last Date to Apply:</strong> {new Date(drive.last_date_to_submit).toLocaleDateString()}</p>
          </div>

          <div className="p-4 flex-1">
            <h3 className="text-2xl font-semibold text-[#005f69]  mb-5">Location & Branches</h3>
            <p><strong>Work Location:</strong> {drive.work_location}</p>
            <p><strong>Focused Branches:</strong> {drive.focused_branches.join(", ")}</p>
          </div>

   <div className="p-4 flex-1">
  <h3 className="text-2xl font-semibold text-[#005f69] mb-5">Additional Details</h3>
  <div className="max-h-32 overflow-y-auto break-words break-all whitespace-normal p-2 ">
    {drive.description || "No additional details provided."}
  </div>
</div>




        </div>
          </div>
          


{/* Rounds Section */}
<div className="space-y-4 mt-6">
  <h3 className="text-2xl font-semibold text-[#005f69] mb-5">Rounds Details 🎯</h3>

  {roundDrive.filter(round => round.drive_id === drive.drive_id).length > 0 ? (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-[#005f69] text-white">
            <th className="p-3 border border-gray-300">Round No.</th>
            <th className="p-3 border border-gray-300">Round Name</th>
            <th className="p-3 border border-gray-300">Date</th>
            <th className="p-3 border border-gray-300">Duration</th>
            <th className="p-3 border border-gray-300">Location</th>
            <th className="p-3 border border-gray-300">Mode</th>
            <th className="p-3 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roundDrive
            .filter(round => round.drive_id === drive.drive_id)
            .map((round, index) => (
              <tr key={index} className="bg-white text-center border border-gray-300">
                <td className="p-3 border border-gray-300">{round.round_number}</td>
                <td className="p-3 border border-gray-300">{round.round_name}</td>
                <td className="p-3 border border-gray-300">{new Date(round.round_date).toLocaleDateString()}</td>
                <td className="p-3 border border-gray-300">
                  {formatDuration(round.duration)}
                </td>
                <td className="p-3 border border-gray-300">{round.location}</td>
                <td className="p-3 border border-gray-300">{round.mode}</td>
                <td className="p-3 border border-gray-300">
                  <button 
                    onClick={() => handleEditRound(round)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md"
                  >
                    Edit ✏️
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="text-gray-500">No rounds available for this drive.</p>
  )}
</div>



      {/* Buttons Section */}
      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-white flex-1 text-[#005f69] border-[#005f69] border-4 text-xl rounded-lg hover:border-red-600"
        >
          Go Back
        </button>
        <button
                  className="px-6 py-3 border-yellow-500 flex-1 text-yellow-500 border-3 font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
                   onClick={() => handleDriveChange(drive)}
        >
          Update Drive
        </button>
              <button
                  onClick={() => handleDriveDelete(drive)}
          className="px-6 py-3 border-red-800 border-4 flex-1 text-red-800  font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
        >
          Delete Drive
        </button>
     
          </div>
          




          {selectedRound && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="p-5 border rounded-lg shadow-md bg-white w-96">
      <h3 className="text-xl font-semibold mb-3">Edit Round</h3>

      <label className="block mb-2">Round Name:</label>
      <input 
        type="text" 
        value={updatedRound.round_name} 
        onChange={(e) => setUpdatedRound({ ...updatedRound, round_name: e.target.value })} 
        className="border p-2 rounded w-full"
      />

      <label className="block mt-3">Round Date:</label>
      <input 
        type="date" 
        value={updatedRound.round_date?.split("T")[0]} 
        onChange={(e) => setUpdatedRound({ ...updatedRound, round_date: e.target.value })} 
        className="border p-2 rounded w-full"
      />

      <div className="grid grid-cols-3 gap-4 mt-3">
        <div>
          <label className="block">Hours:</label>
          <input 
            type="number" 
            value={updatedRound.duration?.hours || 0} 
            onChange={(e) => setUpdatedRound({ 
              ...updatedRound, 
              duration: { 
                ...updatedRound.duration,
                hours: Number(e.target.value) 
              } 
            })} 
            className="border p-2 rounded w-full"
            min="0"
          />
        </div>
        <div>
          <label className="block">Minutes:</label>
          <input 
            type="number" 
            value={updatedRound.duration?.minutes || 0} 
            onChange={(e) => setUpdatedRound({ 
              ...updatedRound, 
              duration: { 
                ...updatedRound.duration,
                minutes: Number(e.target.value) 
              } 
            })} 
            className="border p-2 rounded w-full"
            min="0" max="59"
          />
        </div>
        <div>
          <label className="block">Seconds:</label>
          <input 
            type="number" 
            value={updatedRound.duration?.seconds || 0} 
            onChange={(e) => setUpdatedRound({ 
              ...updatedRound, 
              duration: { 
                ...updatedRound.duration,
                seconds: Number(e.target.value) 
              } 
            })} 
            className="border p-2 rounded w-full"
            min="0" max="59"
          />
        </div>
      </div>

      <label className="block mt-3">Location:</label>
      <input 
        type="text" 
        value={updatedRound.location} 
        onChange={(e) => setUpdatedRound({ ...updatedRound, location: e.target.value })} 
        className="border p-2 rounded w-full"
      />

      <label className="block mt-3">Mode:</label>
      <select 
        value={updatedRound.mode} 
        onChange={(e) => setUpdatedRound({ ...updatedRound, mode: e.target.value })} 
        className="border p-2 rounded w-full"
      >
        <option value="Online">Online</option>
        <option value="Offline">Offline</option>
      </select>

      {/* Save and Cancel Buttons */}
      <div className="flex justify-end mt-4 gap-3">
        <button 
          onClick={() => setSelectedRound(null)}
          className="px-4 py-2 bg-gray-500 text-white rounded-md"
        >
          Cancel
        </button>
        <button 
          onClick={handleUpdateRound}
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Save Changes
        </button>
      </div>
    </div>
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
                checked={key === "supply_history_allowed" ? formDrive[key] : undefined}  // ✅ Use `checked`
                value={key !== "supply_history_allowed" ? formDrive[key] : undefined}  // ✅ Prevent `value` on checkbox
                onChange={(e) => {
                  if (key === "supply_history_allowed") {
                    setFormDrive((prev) => ({ ...prev, [key]: e.target.checked }));  // ✅ Toggle boolean value
                  } else {
                    handleDrive(e); // ✅ For other inputs
                  }
                }}
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
    </div>
  );
};




export default Drives;
