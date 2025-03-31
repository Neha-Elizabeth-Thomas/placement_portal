import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CheckCircle, XCircle, Hourglass } from "lucide-react";
import Confetti from "react-confetti";
import { useParams } from "react-router-dom";
import axios from "axios";

const Result = () => {
  const { driveId } = useParams(); // Get driveId from the URL
  const [companyData, setCompanyData] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Fetch results on component mount
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, please log in.");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_UR}/portal/drive/${driveId}/round-results`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.roundResults.length > 0) {
          setCompanyData({
            company: response.data.companyName, // Replace with actual company name or fetch it from the backend
            rounds: response.data.roundResults.map((round) => ({
              name: round.round_name,
              result: round.status, // Assuming backend returns "Cleared", "Pending", etc.
            })),
          });
        }
      } catch (error) {
        console.error("Error fetching round results:", error.response?.data?.message || error.message);
      }
    };

    fetchResults();
  }, [driveId]);

  // Calculate derived data
  const totalRounds = companyData ? companyData.rounds.length : 0;
  const passedRounds = companyData ? companyData.rounds.filter((round) => round.result === "Cleared").length : 0;
  const remainingRounds = totalRounds - passedRounds;
  const passPercentage = totalRounds > 0 ? ((passedRounds / totalRounds) * 100).toFixed(2) : 0;

  const data = [
    { name: "Completed", value: passedRounds },
    { name: "Remaining", value: remainingRounds },
  ];

  const COLORS = ["#22C55E", "#FACC15"];

  // Show confetti if all rounds are passed
  useEffect(() => {
    if (passedRounds === totalRounds && totalRounds > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [passedRounds, totalRounds]);

  // Early return if data is not yet loaded
  if (!companyData) {
    return <p className="text-white">Loading results...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      {showConfetti && <Confetti />}

      <h1 className="text-2xl font-bold mb-6 text-Navy">{companyData.company} - Placement Result</h1>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Round-wise Results */}
        <div className="bg-white text-blue-950 shadow-lg p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Round-wise Results</h2>
          <div className="space-y-4">
            {companyData.rounds.map((round, i) => (
              <div
                key={i}
                className={`p-4 flex items-center gap-4 rounded-lg text-lg font-semibold transition-all ${
                  round.result === "Cleared"
                    ? "bg-green-500 text-white"
                    : round.result === "Pending"
                    ? "bg-yellow-500 text-black"
                    : "bg-red-500 text-white"
                }`}
              >
                {round.result === "Cleared" && <CheckCircle size={24} />}
                {round.result === "Pending" && <Hourglass size={24} />}
                {round.result === "Failed" && <XCircle size={24} />}
                {round.name}: {round.result}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Summary & Chart */}
        <div className="space-y-8">
          {/* Summary Box */}
          <div className="bg-white p-8 rounded-lg shadow-lg text-blue-950">
            <h2 className="text-2xl font-bold mb-4">Summary</h2>
            <div className="relative w-full bg-gray-200 h-4 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${passPercentage}%` }}
              ></div>
            </div>
            <p className="text-lg font-semibold mt-2">Total Rounds: {totalRounds}</p>
            <p className="text-lg font-semibold text-green-600">Completed: {passedRounds}</p>
            <p className="text-lg font-semibold text-yellow-600">Remaining: {remainingRounds}</p>
            <p className="text-lg font-bold mt-2">Overall Pass Percentage: {passPercentage}%</p>
          </div>

          {/* Performance Chart */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-blue-950 mb-4">Performance Chart</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;