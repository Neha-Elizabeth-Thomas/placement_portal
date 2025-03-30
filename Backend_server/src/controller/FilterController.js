import { filterStudents,filterDrives } from "../services/FilterServices.js";

export const getFilteredStudents = async (req, res) => {
  try {
    const { department, minCgpa, no_of_backlogs, noSupplyHistory,placed, graduationYear } = req.query;

    const students = await filterStudents({ department, minCgpa,no_of_backlogs, noSupplyHistory,placed, graduationYear });

    res.json({ success: true, data: students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getFilteredDrives = async (req, res) => {
  try {
    const { year, jobRole, company } = req.query;
    
    const filteredDrives = await filterDrives({
      year,
      jobRole,
      company
    });

    res.status(200).json({
      success: true,
      data: filteredDrives
    });
  } catch (error) {
    console.error("Error filtering drives:", error);
    res.status(500).json({
      success: false,
      message: "Failed to filter drives",
      error: error.message
    });
  }
};