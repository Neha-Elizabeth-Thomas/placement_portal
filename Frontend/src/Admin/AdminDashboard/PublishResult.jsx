import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Data } from "../AdminDashboard/ExcelComponent/Data";
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const PublishResult = () => {
    const navigate = useNavigate();
    const [excelFile, setExcelFile] = useState(null);
    const [excelFileError, setExcelFileError] = useState(null);
    const [excelData, setExcelData] = useState(null);
    const [fileName, setFileName] = useState(""); // State to store the selected file name

    const FileType = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const handleFile = (e) => {
        let selectedFile = e.target.files[0]; // Get the first file
        if (selectedFile) {
            setFileName(selectedFile.name); // Set file name
            if (FileType.includes(selectedFile.type)) {
                let reader = new FileReader();
                reader.readAsArrayBuffer(selectedFile);
                reader.onload = (event) => {
                    setExcelFileError(null);
                    setExcelFile(event.target.result); // Update state with the file data
                };
                reader.onerror = () => {
                    setExcelFileError("Error reading the file");
                    setExcelFile(null);
                };
            } else {
                setExcelFileError("Please select a valid Excel file");
                setExcelFile(null);
                setFileName(""); // Reset file name if the file is invalid
            }
        } else {
            setExcelFileError("No file selected");
            setFileName(""); // Reset file name if no file is selected
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const selectedFile = e.dataTransfer.files[0];
        if (selectedFile) {
            handleFile({ 
                target: 
                { 
                    files: 
                    [selectedFile] 
                } 
            });
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (excelFile !== null) {
            const workbook = XLSX.read(excelFile, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            let data = XLSX.utils.sheet_to_json(worksheet, { raw: false });

            // Format dates
            data = data.map((row) => {
                if (row.Date) {
                    row.Date = new Date((row.Date - 25569) * 86400 * 1000)
                        .toISOString()
                        .split("T")[0];
                }
                return row;
            });
            console.log(data);
            setExcelData(data);

            
            
            
            for (const row of excelData) {
        try {
            console.log(`Processing KTU ID: ${row.ktu_id} for ${row.company_name}`);

            const { data: driveResponse } = await axios.get(
                `http://localhost:3000/portal/drive-id/${row.company_name}/${row.job_role}/${row.year}`
            );

            if (!driveResponse.driveId) {
                console.error(`Drive ID not found for:`, row);
                continue;
            }

            const driveId = driveResponse.driveId;

            const roundResultPayload = {
                driveId,
                roundNumber: row.round_number,
                ktuId: row.ktu_id,
                status: row.round_status,
            };

            await axios.post("http://localhost:3000/portal/round-result", roundResultPayload);

            console.log(`✅ Successfully posted round result for KTU ID: ${row.ktu_id}`);

        } catch (error) {
            console.error(`❌ Error processing row:`, row, error.response ? error.response.data : error.message);
        }
    }

     Swal.fire({
            icon: 'success',
            title: 'Result Enterd Into Database Successfully!',
            showConfirmButton: false,
            timer: 2000,  // Auto close after 2 sec
          });
    
          setTimeout(() => {
            navigate('/Admin-dashboard'); // Redirect after alert
          }, 2000);
    

            
            
        } else {
            setExcelData(null);
            Swal.fire({
                    icon: 'error',
                    title: 'Login Failed!',
                    text: err.response?.data?.message || 'Something went wrong',
                  });
        }
    };

    return (
        <div className="container mx-auto p-6">
            {/* Drag and Drop File Section */}
            <div
                className="border-2 border-dashed border-Navy p-6 text-center rounded-lg mt-6"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <label className="block text-xl font-semibold text-gray-700 mb-4">
                    Drag and Drop Result File
                </label>
                <p className="text-gray-500 mb-4">Or click to select a file</p>
                <input
                    type="file"
                    onChange={handleFile}
                    className="hidden"
                    id="fileInput"
                />
                <button
                    type="button"
                    onClick={() => document.getElementById("fileInput").click()}
                    className="mt-4 px-6 py-2 bg-[#005f69] text-white rounded-md hover:bg-Navy"
                >
                    Choose File
                </button>

                {/* Display Selected File Name */}
                {fileName && (
                    <p className="text-green-500 mt-4">Selected File: {fileName}</p>
                )}
                {excelFileError && (
                    <p className="text-red-500 text-sm mt-2">{excelFileError}</p>
                )}
            </div>

            {/* Submit Button */}
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

            {/* Display Excel Data */}
            <h3 className="text-2xl font-semibold text-gray-800">View Excel Data</h3>
            {excelData === null ? (
                <p className="text-gray-500">No File Selected!</p>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg border-Navy">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-[#005f69] text-left text-white border-Navy">
                                <th className="px-4 py-2">Company Name</th>
                                <th className="px-4 py-2">Job Role</th>
                                <th className="px-4 py-2">Year</th>
                                <th className="px-4 py-2">Ktu id</th>
                                <th className="px-4 py-2">Round Number</th>
                                <th className="px-4 py-2">Round status</th>
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

export default PublishResult;
