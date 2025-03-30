import { query } from "../db.js";

export const filterStudents = async ({ department, minCgpa, no_of_backlogs,noSupplyHistory, placed, graduationYear }) => {
  let stud_query = `SELECT ktu_id, student_name, department, rit_email, phone_number, program, semester, 
                    date_of_birth, year_of_graduation, gender, cgpa, no_of_backlogs, supply_history, 
                    skills, resume_url 
                    FROM student WHERE password IS NOT NULL`;
  const params = [];
  
  if (department) {
    params.push(department);
    stud_query += ` AND department = $${params.length}`;
  }
  
  if (minCgpa) {
    params.push(minCgpa);
    stud_query += ` AND cgpa >= $${params.length}`;
  }
  
  if (no_of_backlogs) {
    params.push(no_of_backlogs);
    stud_query += ` AND no_of_backlogs <= $${params.length}`;
  }

  if (placed !== undefined) {
  if (placed === "true") {
    params.push("Selected");
    stud_query += ` AND EXISTS (
      SELECT 1 FROM drive_result dr 
      WHERE dr.ktu_id = student.ktu_id 
      AND dr.result = $${params.length}
    )`;
  } else {
    // Student is considered "Not Placed" if:
    // - They have only "Not Selected" entries in drive_result
    // - OR they do not appear in drive_result at all
    stud_query += ` AND NOT EXISTS (
      SELECT 1 FROM drive_result dr 
      WHERE dr.ktu_id = student.ktu_id 
      AND dr.result = 'Selected'
    )`;
  }
}


if (noSupplyHistory !== undefined) {
    params.push(noSupplyHistory === "false"); // Convert "true" to boolean
    stud_query += ` AND supply_history = $${params.length}`;
  }

  if (graduationYear) {
    params.push(graduationYear);
    stud_query += ` AND year_of_graduation = $${params.length}`;
  }

  const { rows } = await query(stud_query, params);
  return rows;
};


export const filterDrives = async ({ year, jobRole, company }) => {
  let drive_query = `
    SELECT 
      pd.drive_id,
      pd.company_id,
      c.company_name,
      pd.job_role,
      pd.num_of_rounds,
      pd.drive_mode,
      pd.drive_type,
      pd.start_date,
      pd.last_date_to_submit,
      pd.no_of_backlogs_permitted,
      pd.supply_history_allowed,
      pd.min_cgpa_required,
      pd.focused_branches,
      pd.description,
      pd.training_package,
      pd.permanent_package,
      pd.registration_link,
      pd.work_location
    FROM placement_drive pd
    JOIN company c ON pd.company_id = c.company_id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (year) {
    params.push(year);
    drive_query += ` AND EXTRACT(YEAR FROM pd.start_date) = $${params.length}`;
  }
  
  if (jobRole) {
    params.push(`%${jobRole.toLowerCase()}%`);
    drive_query += ` AND LOWER(pd.job_role) LIKE $${params.length}`;
  }
  
  if (company) {
    params.push(`%${company.toLowerCase()}%`);
    drive_query += ` AND LOWER(c.company_name) LIKE $${params.length}`;
  }

  drive_query += " ORDER BY pd.start_date DESC";

  const { rows } = await query(drive_query, params);
  return rows;
};