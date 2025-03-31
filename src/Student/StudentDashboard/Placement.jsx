import React, { useState,useEffect } from 'react';
import { Carousel } from 'flowbite-react';
import Rit from '../../assets/placed_1.png';
import homeimage1 from '../../assets/placed_2.png';
import homeimage2 from '../../assets/placed_3.png';
import axios from "axios"
import Swal from "sweetalert2";

import {
  FaUserGraduate, // For Placements Attended
  FaRegHandshake, // For Number of Offers
  FaUsers,        // For Ongoing Drives
} from 'react-icons/fa';



const Placement = () => {
  const [selectedTab, setSelectedTab] = useState('on-campus');
  const [selectedDrive, setSelectedDrive] = useState(null);
 
  const [onCampusDrives, setOnCampusDrives] = useState([]);
  const [offCampusDrives, setOffCampusDrives] = useState([]);
   const [stats, setStats] = useState({
    totalRegistered: 0,
    ongoingDrives: 0,
    placedDrives: 0,
  });

  // Fetch stats data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found! User not authenticated.");
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_API_UR}/portal/student/drives/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === 200) {
          setStats({
            totalRegistered: res.data.totalRegistered,
            ongoingDrives: res.data.ongoingDrives,
            placedDrives: res.data.placedDrives,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);


const handleConfirm = async (driveId) => {
  try {
    const tok = localStorage.getItem("token");
    if (!tok) {
      console.log("No token found! User not authenticated.");
      return;
    }

    const res = await axios.post(
      `${import.meta.env.VITE_API_UR}/portal/student-drive-register/${driveId}`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${tok}`, 
        },
      }
    );

    // Show success message
    Swal.fire({
      icon: "success",
      title: "Registered Successfully!",
      text: "You have successfully registered for this drive.",
    });

  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data.message;

      // Show error message in SweetAlert
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage, // Shows the exact error message from the backend
      });
    } else {
      console.log("Error while registering for drive", error);
    }
  }
};
  
  
useEffect(() => {
  const fetchEligibleDrives = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage

      if (!token) {
        console.log("No token found! User not authenticated.");
        return;
      }

      const res = await axios.get(`${import.meta.env.VITE_API_UR}/portal/eligible-drives`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in the header
        },
      });
      console.log(res.data.on_campus);
      setOnCampusDrives(res.data.on_campus || []);
      setOffCampusDrives(res.data.off_campus || []);

    } catch (error) {
      console.error("Error fetching eligible drives:", error);
    }
  };

  fetchEligibleDrives();
}, []);

  return (
    <div>
      {/* Carousel Section */}
      <div className="px-4 lg:px-14 max-w-screen-2xl mx-auto h-80">
        <Carousel className="w-full mx-auto">
          <div className="h-80">
            <img src={Rit} alt="Image 1" className="h-full w-full object-cover" />
          </div>
          <div className="h-80">
            <img src={homeimage1} alt="Image 2" className="h-full w-full object-cover" />
          </div>
          <div className="h-80">
            <img src={homeimage2} alt="Image 3" className="h-full w-full object-cover" />
          </div>
        </Carousel>
      </div>

      {/* Placement Stats Section */}
      <div className="flex justify-around mt-8">
        <div className="flex flex-col items-center flex-1 bg-Navy text-white p-4 rounded-lg mx-2 shadow-md">
          <FaUserGraduate className="text-5xl mb-2" />
          <h2 className="text-lg font-bold">Placements Attended</h2>
          <p className="text-4xl font-bold">{stats.totalRegistered}</p>
        </div>
        <div className="flex flex-col items-center flex-1 bg-blue-950 text-white p-4 rounded-lg mx-2 shadow-md">
          <FaRegHandshake className="text-5xl mb-2" />
          <h2 className="text-lg font-bold">Number of Offers</h2>
          <p className="text-4xl font-bold">{stats.placedDrives}</p>
        </div>
        <div className="flex flex-col items-center flex-1 bg-blue-900 text-white p-4 rounded-lg mx-2 shadow-md">
          <FaUsers className="text-5xl mb-2" />
          <h2 className="text-lg font-bold">Ongoing Drives</h2>
          <p className="text-4xl font-bold">{stats.ongoingDrives}</p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex justify-center mt-16 gap-4">
        <button
          className={`px-6 py-2 rounded-lg font-bold flex-1 ${
            selectedTab === 'on-campus' ? 'bg-Navy text-white' : 'bg-gray-300'
          }`}
          onClick={() => setSelectedTab('on-campus')}
        >
          On-Campus
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-bold flex-1 ${
            selectedTab === 'off-campus' ? 'bg-Navy text-white' : 'bg-gray-300'
          }`}
          onClick={() => setSelectedTab('off-campus')}
        >
          Off-Campus
        </button>
      </div>

        {/* Drives Section */}
      <div className="mt-9 px-4">
        {selectedTab === 'on-campus' && (
          <div>
            <h3 className="text-lg font-bold mb-2">On-Campus Drives</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {onCampusDrives.map((drive) => (
              <div
  key={drive.drive_id}
  className="flex flex-col items-center p-6  border-Navy border-2 rounded-2xl shadow-lg  text-white transform transition-all hover:-translate-y-2 hover:shadow-xl"
>
  <span className="font-bold text-2xl text-Navy">
    {drive.company_name} - {drive.job_role}
  </span>
  <hr className="border-blue-500 w-full my-2" />
  <p className="text-Navy text-center">{drive.description}</p>
 <button
    onClick={() => setSelectedDrive(drive)}
    className="px-4 py-2 bg-gradient-to-r from-Navy to-blue-500 text-white rounded-lg hover:scale-105 transition-transform mt-4"
  >
    More Details
  </button>
</div>

              ))}
            </div>
          </div>
        )}
 </div>

     
      {/* Drive Details Modal */}
      {selectedDrive && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-Navy text-white p-8 rounded shadow-lg w-1/2 ">
            <h2 className="text-2xl font-bold mb-4">{selectedDrive.company_name} - {selectedDrive.job_role}</h2>
            <p className="mb-2 text-xl"><strong>Description:</strong> {selectedDrive.description}</p>
            <p className="mb-2 text-xl"><strong>Number of Rounds:</strong> {selectedDrive.num_of_rounds}</p>
            <p className="mb-2 text-xl"><strong>Eligibility:</strong> {selectedDrive.focused_branches.join(', ')}</p>
            <p className="mb-2 text-xl"><strong>Minimum CGPA Required:</strong> {selectedDrive.min_cgpa_required}</p>
            <p className="mb-2 text-xl"><strong>Backlogs Permitted:</strong> {selectedDrive.no_of_backlogs_permitted}</p>
            <p className="mb-2 text-xl"><strong>Supply History Allowed:</strong> {selectedDrive.supply_history_allowed ? 'Yes' : 'No'}</p>
            <p className="mb-2 text-xl"><strong>Drive Mode:</strong> {selectedDrive.drive_mode}</p>
            <p className="mb-2 text-xl"><strong>Drive Type:</strong> {selectedDrive.drive_type}</p>
            <p className="mb-2 text-xl"><strong>Location:</strong> {selectedDrive.work_location}</p>
            <p className="mb-2 text-xl"><strong>Remuneration:</strong> Training - ₹{selectedDrive.training_package}, Permanent - ₹{selectedDrive.permanent_package}</p>
            <p className="mb-2 text-xl">
              <strong>Key Dates:</strong> Resume Submission -{" "}
              {new Date(selectedDrive.last_date_to_submit).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }).replace(/\//g, "-")}
              , Interview Date -{" "}
              {new Date(selectedDrive.start_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }).replace(/\//g, "-")}
            </p>
            <a href={selectedDrive.registration_link} target="_blank" rel="noopener noreferrer" className="block mt-4 bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600">
              Apply using Their Site
            </a>
          <a
            onClick={() => {
                Swal.fire({
        title: "Registed SuccessFully,Prepare Well 🎉",
        text: "Redirecting to dashboard...",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
                setSelectedDrive(null); // Close the popup after confirmation
              handleConfirm(selectedDrive.drive_id)
            }}
            className="block mt-4 bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600"
          >
            Confirm Registration
          </a>

            <button
              onClick={() => setSelectedDrive(null)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}




{selectedTab === 'off-campus' && (
          <div>
            <h3 className="text-lg font-bold mb-2">Off-Campus Drives</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {offCampusDrives.map((drive) => (
                <div
                  key={drive.drive_id}
                  className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow"
                >
                  <span className="font-medium">{drive.company_name} - {drive.job_role}</span>
                   <hr className="border-blue-500 w-full my-2" />
                  <p className="text-gray-700 text-center">{drive.description}</p>
                  <button
                     onClick={() => window.open(drive.registration_link, "_blank")}
                    className="px-4 py-2 bg-Navy text-white rounded hover:bg-green-600 mt-4"
                  >
                    Register via Link
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
     

    </div>
  );
};

export default Placement;
