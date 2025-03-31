import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Data = ({ excelData }) => {
  return excelData.map((individualExcelData, index) => (
    <tr key={index}>
      <IndividualData individualExcelData={individualExcelData} />
    </tr>
  ));
};

const IndividualData = ({ individualExcelData }) => {
  return (
    <>
      <td className="p-6">{individualExcelData.ktu_id}</td>
      <td className="p-6">{individualExcelData.student_name}</td>
      <td className="p-6">{individualExcelData.department}</td>
      <td className="p-6"> {individualExcelData.rit_email}</td>
      <td className="p-6">{individualExcelData.phone_number}</td>
      <td className="p-6">{individualExcelData.program}</td>
      <td className="p-6">{individualExcelData.semester}</td>
      <td className="p-6">{individualExcelData.date_of_birth}</td>
      <td className="p-6">{individualExcelData.year_of_graduation}</td>
      <td className="p-6">{individualExcelData.gender}</td>
      <td className="p-6">{individualExcelData.cgpa}</td>
      <td className="p-6">{individualExcelData.no_of_backlogs}</td>
      <td className="p-6">{individualExcelData.supply_history ? "Yes" : "No"}</td>
    </>
  );
};

const AddStudent = () => {
  const navigate = useNavigate();
  const [excelFile, setExcelFile] = useState(null);
  const [excelFileError, setExcelFileError] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState("");

  const FileType = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const handleFile = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      if (FileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (event) => {
          setExcelFileError(null);
          setExcelFile(event.target.result);
        };
        reader.onerror = () => {
          setExcelFileError("Error reading the file");
          setExcelFile(null);
        };
      } else {
        setExcelFileError("Please select a valid Excel file");
        setExcelFile(null);
        setFileName("");
      }
    } else {
      setExcelFileError("No file selected");
      setFileName("");
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (excelFile !== null) {
    const workbook = XLSX.read(excelFile, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let data = XLSX.utils.sheet_to_json(worksheet, { raw: false });

    // Convert date format for each entry
    data = data.map((student) => {
      if (student.date_of_birth) {
        const excelDate = new Date(student.date_of_birth);
        const formattedDate = excelDate.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
        return { ...student, date_of_birth: formattedDate };
      }
      return student;
    });

    setExcelData(data);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_UR}/portal/add-student`, data);

      if (!res || !res.status || (res.status !== 200 && res.status !== 201)) {
        throw new Error("Unexpected response status: " + res.status);
      }

      Swal.fire({
        icon: 'success',
        title: 'Students Entered Into Database Successfully!',
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        navigate('/Admin-dashboard');
      });

    } catch (error) {
      console.error("Error adding student:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error While Adding Students!!!!!',
        showConfirmButton: false,
        timer: 2000,
      });
    }

    console.log(data);
  } else {
    setExcelData([]);
  }
};

  return (
    <div className="container mx-auto p-6">
      <div className="border-2 border-dashed border-Navy p-6 text-center rounded-lg mt-6">
        <label className="block text-xl font-semibold text-gray-700 mb-4">
          Drag and Drop Result File
        </label>
        <input type="file" onChange={handleFile} className="hidden" id="fileInput" />
        <button
          type="button"
          onClick={() => document.getElementById("fileInput").click()}
          className="mt-4 px-6 py-2 bg-[#005f69] text-white rounded-md hover:bg-Navy"
        >
          Choose File
        </button>
        {fileName && <p className="text-green-500 mt-4">Selected File: {fileName}</p>}
        {excelFileError && <p className="text-red-500 text-sm mt-2">{excelFileError}</p>}
      </div>
      <div className="mt-6 flex justify-center">
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-6 py-2 bg-[#005f69] text-white rounded-md hover:bg-blue-600 w-1/2 font-extrabold"
        >
          Submit
        </button>
      </div>
      <hr className="my-6" />
      <h3 className="text-2xl font-semibold text-gray-800">View Student Data</h3>
      {excelData.length === 0 ? (
        <p className="text-gray-500">No File Selected!</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg border-Navy">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-[#005f69] text-left text-white border-Navy">
                <th className="px-4 py-2">KTU ID</th>
                <th className="px-4 py-2">Student Name</th>
                <th className="px-4 py-2">Department</th>
                <th className="px-4 py-2">RIT Email</th>
                <th className="px-4 py-2">Phone Number</th>
                <th className="px-4 py-2">Program</th>
                <th className="px-4 py-2">Semester</th>
                <th className="px-4 py-2">Date of Birth</th>
                <th className="px-4 py-2">Year of Graduation</th>
                <th className="px-4 py-2">Gender</th>
                <th className="px-4 py-2">CGPA</th>
                <th className="px-4 py-2">No. of Backlogs</th>
                <th className="px-4 py-2">Supply History</th>
              </tr>
            </thead>
            <tbody>
              <Data excelData={excelData} />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AddStudent;
