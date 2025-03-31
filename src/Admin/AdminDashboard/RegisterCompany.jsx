import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const MySwal = withReactContent(Swal);

const RegisterCompany = () => {
  const navigate = useNavigate();

  // State to store form data
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    address: "",
    website: "",
    
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Check if all fields are filled
  const isFormValid = () => {
    return Object.values(formData).every((value) => value.trim() !== "");
  };

  // Handle form submission and send data to the API
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isFormValid()) {
    MySwal.fire({
      title: "Oops!",
      text: "Please fill in all fields before submitting.",
      icon: "error",
      confirmButtonText: "OK",
    });
    return;
  }

  try {
    console.log(formData);
    // Sending form data to the server via POST request
    const response = await axios.post(`${import.meta.env.VITE_API_UR}/portal/add-company`, formData);

    console.log("Company registered successfully:", response.data);

    // Check if the response status indicates success (201)
    if (response.status === 201) {
      MySwal.fire({
        title: "Success!",
        text: "Company registered successfully!",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
      });

      navigate("/Admin-dashboard");
    } else {
      throw new Error("Failed to register company.");
    }
  } catch (error) {
    // Handle error properly
    MySwal.fire({
      title: "Error!",
      text: error.response ? error.response.data.error : error.message,
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};


  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#005f69]">Register Company</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Company Name */}
        <div className="mb-6">
          <label className="text-[#005f69] font-medium block mb-2">Company Name:</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="input w-full border-[#005f69] rounded-lg p-2 focus:ring focus:ring-blue-500"
            required
          />
        </div>

        {/* Contact Person & Phone Number */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-[#005f69] font-medium block mb-2">Contact Person:</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              className="input w-full border-[#005f69] rounded-lg p-2 focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="text-[#005f69] font-medium block mb-2">Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="input w-full border-[#005f69] rounded-lg p-2 focus:ring focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Email & Address */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-[#005f69] font-medium block mb-2">Official Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input w-full border-[#005f69] rounded-lg p-2 focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="text-[#005f69] font-medium block mb-2">Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input w-full border-[#005f69] rounded-lg p-2 focus:ring focus:ring-blue-500"
              rows="3"
              required
            ></textarea>
          </div>
        </div>

        {/* Website */}
        <div className="mb-6">
          <label className="text-[#005f69] font-medium block mb-2">Website:</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="input w-full border-[#005f69] rounded-lg p-2 focus:ring focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-[#005f69] text-white rounded hover:bg-[#004b52] transition"
          >
            Register Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterCompany;
