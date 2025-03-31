import React, { useState } from "react";
import LoginWelcome from "../assets/LoginWelcome.avif";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_UR}/portal/login`, {
        rit_email: email,
        password: password,
      });

      localStorage.setItem("token", response.data.token); // Store the token
      // Show SweetAlert2 success message
      MySwal.fire({
        title: "Login Successful 🎉",
        text: "Redirecting to dashboard...",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/student-dashboard"); // Redirect after 2 seconds
      }, 2000);
    } catch (error) {
      console.error("Login error:", error.response?.data?.message || error.message);
      Swal.fire({
        title: "Login Failed ❌",
        text: error.response?.data?.message || "Something went wrong. Try again!",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-gray-200 flex rounded-2xl shadow-lg max-w-3xl p-5 relative">
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-80 rounded-2xl">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        <div className="sm:w-1/2 px-16">
          <h1 className="font-bold text-2xl text-Navy">Login</h1>
          <p className="text-sm mt-4 text-Navy">Only Registered Students Can Login</p>

          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            <input
              className="p-2 mt-4 rounded-xl border"
              type="email"
              name="email"
              placeholder="College Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="p-2 mt-4 rounded-xl border"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="bg-Navy text-white py-2 rounded-xl mt-4 mb-2 hover:bg-red-950" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-10 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-500" />
            <p className="text-center">OR</p>
            <hr className="border-gray-500" />
          </div>

          <div className="flex flex-col">
              <button
            className="bg-Navy text-white py-2 rounded-xl mt-4 mb-4 flex-1 hover:bg-green-600"
            onClick={() => navigate("/Register")}
            disabled={loading}
          >
            Register
            </button>
            

            <button
            className="bg-green-800 text-white py-2 rounded-xl mt-4 mb-4 flex-1  hover:bg-green-600"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Home
          </button>
          </div>
          
        </div>
        
        <div className="sm:block hidden w-1/2">
          <img className="rounded-2xl h-full" src={LoginWelcome} alt="Welcome" />
        </div>
      </div>
    </section>
  );
};

export default Login;
