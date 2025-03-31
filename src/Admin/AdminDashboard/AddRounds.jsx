import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
const MySwal = withReactContent(Swal);

const AddRounds = () => {
  const { round, drive_id } = useParams(); // Get 'round' and 'drive_id' from URL
  const navigate = useNavigate();
  const [rounds, setRounds] = useState([]);

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

  useEffect(() => {
    if (!isNaN(round) && round > 0) {
      setRounds(
        Array(parseInt(round))
          .fill()
          .map((_, index) => ({
            drive_id: drive_id,
            round_number: index + 1, // Ensuring round numbers start from 1
            round_name: "", 
            round_date: "",
            duration: "",
            location:"",
            mode: "",
            
            
          }))
      );
    } else {
      MySwal.fire({
        title: "Error",
        text: "Invalid number of rounds provided!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, [round, drive_id]);

  const handleInputChange = (index, field, value) => {
    const newRounds = [...rounds];
    newRounds[index][field] = value;
    setRounds(newRounds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_UR}/portal/create-round`, rounds);
      console.log("The insertion was successfull ROUNDS",response.data)
    } catch (error) {
      console.log("There is an error while insert round", error);
    }
    

    MySwal.fire({
      title: "Good Job!",
      text: `You have successfully registered ${round} rounds!`,
      icon: "success",
      confirmButtonText: "OK",
      timer: 2000,
    });

    navigate("/Admin-dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-[#005f69] font-bold text-2xl text-center mb-4">
        Add Rounds for {round} Rounds
      </h2>

      <form onSubmit={handleSubmit}>
        {rounds.map((round, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md my-4">
            <h3 className="text-lg font-semibold text-[#005f69] mb-2">
              Round {index + 1}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Round Number"
                className="input-field"
                value={round.round_number}
                readOnly // Prevent accidental changes
              />

              {/* ✅ Corrected Dropdown for Round Name */}
              <select
                value={round.round_name} // Ensure correct state handling
                onChange={(e) => handleInputChange(index, "round_name", e.target.value)}
                className="input-field"
                required
              >
                <option value="" disabled>Select Round</option>
                {roundOptions.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>

               <input
                type="text"
                placeholder="Location"
                className="input-field"
                value={round.location}
                onChange={(e) => handleInputChange(index, "location", e.target.value)}
                required
              />

              {/* ✅ Corrected Dropdown for Mode */}
              <select
                value={round.mode} // Ensure correct state handling
                onChange={(e) => handleInputChange(index, "mode", e.target.value)}
                className="input-field"
                required
              >
                <option value="" disabled>Select Mode</option>
                <option value="Offline">Offline</option>
                <option value="Online">Online</option>
              </select>

              <input
                type="date"
                className="input-field"
                value={round.round_date}
                onChange={(e) => handleInputChange(index, "round_date", e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Duration (e.g., 1 hour / 30 minutes)"
                className="input-field"
                value={round.duration}
                onChange={(e) => handleInputChange(index, "duration", e.target.value)}
                required
              />
            </div>
          </div>
        ))}

        <div className="flex justify-center my-6">
          <button
            type="submit"
            className="bg-[#005f69] text-white font-bold rounded-lg px-6 py-2 hover:bg-[#004f58] transition duration-300 w-1/2"
            
          >
            Save Rounds
          </button>
        </div>
      </form>

      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 10px;
          border: 1px solid #005f69;
          border-radius: 8px;
          outline: none;
          transition: 0.3s;
        }
        .input-field:focus {
          border-color: #004f58;
          box-shadow: 0 0 5px #004f58;
        }
      `}</style>
    </div>
  );
};

export default AddRounds;
