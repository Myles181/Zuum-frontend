import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from 'react-icons/fc';
import { Link, Navigate, useSearchParams } from "react-router-dom"; // Import useSearchParams
import { useNavigate } from "react-router-dom"; // Import useNavigate
import a from "../../assets/public/Group 14.png";
import b from "../../assets/public/logo.png";
import c from "../../assets/public/google.png";
import { useSignup } from "../../../Hooks/auth/useSignup"; // Import useGoogleAuth useGoogleAuth
import useGoogleAuth from "../../../Hooks/auth/useGoogleAuth";

function Signup() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    identity: "", // Add role to form data
  });

  const [searchParams] = useSearchParams(); // Retrieve URL parameters
  const identity = searchParams.get("identity"); // Get the role from the URL
  const navigate = useNavigate(); // Initialize useNavigate

  const { loading, error, success, signup } = useSignup();
  const { loading: googleLoading, error: googleError, authenticateWithGoogle } = useGoogleAuth(); // Use the useGoogleAuth hook
  

  useEffect(() => {
    // Set the role in formData when the component mounts
    if (identity) {
      setFormData((prevData) => ({
        ...prevData,
        identity: identity.replace(/-/g, " ").toUpperCase(), // Convert hyphens back to spaces and uppercase
      }));
    }
  }, [identity]);

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setPasswordVisible(!passwordVisible);
    } else if (field === "confirmPassword") {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    const userData = {
      username: formData.username,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      identity: formData.identity,
    };
  
    const success = await signup(userData);
    console.log("Signup success:", success);
    if (success) {
      navigate("/verify");
    }
  };
  
  // Handle Google authentication
  const handleGoogleAuth = () => {
    authenticateWithGoogle(); // Call the Google authentication function
  };

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".fade-in");
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 100) {
          element.classList.add("show");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="bg-cover bg-center bg-no-repeat bg-fixed min-h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(18, 121, 155, 0.89), rgba(18, 101, 180, 0.89)), url(${a})`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-lg w-full rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <img src={b} alt="Logo" className="w-24 h-auto" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-6">Signup as {formData.identity}</h1>
          <form className="login-form p-2 rounded-lg shadow-lg w-full max-w-lg mx-auto" onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="relative mb-4">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Username"
                id="username"
                className="w-full px-10 py-2 border rounded-lg bg-white focus:outline-none focus:border-blue-500 text-black"
                required
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>

            {/* Email Input */}
            <div className="relative mb-4">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                placeholder="Email"
                id="email"
                className="w-full px-10 py-2 border rounded-lg bg-white focus:outline-none focus:border-blue-500 text-black"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            {/* Phone Number Input */}
            <div className="relative mb-4">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="tel"
                placeholder="Phone Number"
                id="phoneNumber"
                className="w-full px-10 py-2 border rounded-lg bg-white focus:outline-none focus:border-blue-500 text-black"
                required
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>

            {/* Password Input */}
            <div className="relative mb-4">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                id="password"
                className="w-full px-10 py-2 border rounded-lg bg-white focus:outline-none focus:border-blue-500 text-black"
                required
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                onClick={() => togglePasswordVisibility("password")}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative mb-4">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Confirm Password"
                id="confirmPassword"
                className="w-full px-10 py-2 border rounded-lg bg-white focus:outline-none focus:border-blue-500 text-black"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                onClick={() => togglePasswordVisibility("confirmPassword")}
              >
                {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="rememberMe"
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-none"
              />
              <label htmlFor="rememberMe" className="ml-2 text-gray-300 hover:text-gray-400 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Error Message */}
            {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

            {/* Success Message */}
           
            {/* Signup Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Signup"}
            </button>

            {/* Separator */}
            <p className="text-center my-4">
              <span className="relative px-4 text-white">or continue with</span>
            </p>

            {/* Social Login Buttons */}
            <div className="flex justify-center ">
              <button
                className="flex items-center w-full mx-15  justify-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                onClick={handleGoogleAuth} // Add onClick handler for Google authentication
                disabled={googleLoading} // Disable button while loading
              >
                 <FcGoogle className="w-6 h-6 mr-2" /> Google
              </button>
              
            </div>

            {/* Login Link */}
            <p className="text-center mt-4 text-white">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;