import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Data } from "../AdminDashboard/ExcelComponent/Data";

const PublishResult = () => {
    const navigate = useNavigate();
    const [excelFile, setExcelFile] = useState(null);
    const [excelFileError, setExcelFileError] = useState(null);
    const [excelData, setExcelData] = useState(null);
    const [fileName, setFileName] = useState("");

    const [company_name, setCompanyName] = useState("");
    const [job_role, setJobRole] = useState("");
    const [year, setYear] = useState("");
    const [round_number, setRoundNumber] = useState("");

    const [viewMode, setViewMode] = useState("publish"); // "publish" or "delete"

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

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const selectedFile = e.dataTransfer.files[0];
        if (selectedFile) {
            handleFile({ target: { files: [selectedFile] } });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (excelFile !== null) {
            const workbook = XLSX.read(excelFile, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            let data = XLSX.utils.sheet_to_json(worksheet, { raw: false });

            data = data.map((row) => {
                if (row.Date) {
                    row.Date = new Date((row.Date - 25569) * 86400 * 1000)
                        .toISOString()
                        .split("T")[0];
                }
                return row;
            });

            setExcelData(data);

            for (const row of data) {
                try {
                    console.log(`Processing KTU ID: ${row.ktu_id} for ${company_name}`);

                    const { data: driveResponse } = await axios.get(
                        `http://localhost:3000/portal/drive-id/${company_name}/${job_role}/${year}`
                    );

                    if (!driveResponse.driveId) {
                        console.error(`Drive ID not found for:`, row);
                        continue;
                    }

                    const driveId = driveResponse.driveId;

                    const roundResultPayload = {
                        driveId,
                        roundNumber: round_number,
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
                icon: "success",
                title: "Result Entered Into Database Successfully!",
                showConfirmButton: false,
                timer: 2000,
            });

            setTimeout(() => {
                navigate("/Admin-dashboard");
            }, 2000);
        } else {
            setExcelData(null);
            Swal.fire({
                icon: "error",
                title: "Operation Failed!",
                text: "Something went wrong",
            });
        }
    };

    const handleDeleteResult = async () => {
        if (!company_name || !job_role || !year) {
            Swal.fire({
                icon: "error",
                title: "Missing Fields!",
                text: "Please enter Company Name, Job Role, and Year to delete results",
            });
            return;
        }

        try {
            const response = await axios.delete("http://localhost:3000/portal/delete-result", {
                data: { company_name, job_role, year },
            });

            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Results Deleted Successfully!",
                    showConfirmButton: false,
                    timer: 2000,
                });

                setCompanyName("");
                setJobRole("");
                setYear("");
            } else {
                throw new Error("Deletion failed");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: error.response?.data?.message || "Failed to delete results",
            });
        }
    };

    return (
        <div className="container mx-auto p-6">
            {/* Buttons to switch between Publish & Delete */}
            <div className="flex justify-center gap-4 mb-6">
                <button
                    onClick={() => setViewMode("publish")}
                    className={`px-6 py-2 rounded-md font-bold ${
                        viewMode === "publish" ? "bg-[#005f69] text-white" : "bg-gray-300"
                    }`}
                >
                    Publish Result
                </button>
                <button
                    onClick={() => setViewMode("delete")}
                    className={`px-6 py-2 rounded-md font-bold ${
                        viewMode === "delete" ? "bg-red-600 text-white" : "bg-gray-300"
                    }`}
                >
                    Delete Result
                </button>
            </div>

            {viewMode === "publish" ? (
                <>
                   <div className="container mx-auto p-6">


            <div className="flex gap-8">
            <input
                type="text"
                className="flex-1 rounded-md border-[#005f69] border-3"
                placeholder="Company Name"
                value={company_name}
                onChange={(e) => setCompanyName(e.target.value)}
            />
            <input
                type="text"
                className="flex-1 rounded-md border-[#005f69] border-3"
                placeholder="Job Role"
                value={job_role}
                onChange={(e) => setJobRole(e.target.value)}
            />
            <input
                type="text"
                className="flex-1 rounded-md border-[#005f69] border-3"
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
            />
            <input
                type="text"
                className="flex-1 rounded-md border-[#005f69] border-3"
                placeholder="Round Number"
                value={round_number}
                onChange={(e) => setRoundNumber(e.target.value)}
            />
            </div>
            


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
                                
                                <th className="px-4 py-2">Ktu id</th>
                                
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
                </>
            ) : (
                <>
                    {/* Delete Result Section */}
                    <div className="text-center p-6  rounded-md">
                        <h2 className="text-2xl font-bold text-red-600">Delete Students Based On Year!!</h2>
                        <p className="text-gray-600">Enter details to delete results</p>

                        <div className="flex gap-8 mt-4">
                            <input
                                type="text"
                                className="flex-1 rounded-md border-[#ff0000] border-3"
                                placeholder="Company Name"
                                value={company_name}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                            <input
                                type="text"
                                className="flex-1 rounded-md border-[#ff0000] border-3"
                                placeholder="Job Role"
                                value={job_role}
                                onChange={(e) => setJobRole(e.target.value)}
                            />
                            <input
                                type="text"
                                className="flex-1 rounded-md border-[#ff0000] border-3"
                                placeholder="Year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleDeleteResult}
                            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-800 font-bold"
                        >
                            Delete Result
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PublishResult;
