import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { FcGoogle } from 'react-icons/fc';
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import a from "../../assets/public/Group 14.png";
import b from "../../assets/public/logo.png";
import { useSignup } from "../../../Hooks/auth/useSignup";
import useGoogleAuth from "../../../Hooks/auth/useGoogleAuth";

console.log();


function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [animation, setAnimation] = useState(""); 
  const [direction, setDirection] = useState("next");
  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    username: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
    identity: "",
  });
  const [errors, setErrors] = useState({});

  const [searchParams] = useSearchParams();
  const identity = searchParams.get("identity");
  const navigate = useNavigate();

  const { loading, error, signup } = useSignup();
  const { loading: googleLoading, authenticateWithGoogle } = useGoogleAuth();

  useEffect(() => {
    if (identity) {
      setFormData(prevData => ({
        ...prevData,
        identity: identity.replace(/-/g, " "),
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
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
    
    // Clear error when user types
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstname.trim()) newErrors.firstname = "First name is required";
      if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";
    }
    
    if (step === 2) {
      if (!formData.username.trim()) newErrors.username = "Username is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!formData.phonenumber.trim()) {
        newErrors.phonenumber = "Phone number is required";
      } else if (!/^[0-9]{10,15}$/.test(formData.phonenumber)) {
        newErrors.phonenumber = "Invalid phone number";
      }
    }
    
    if (step === 3) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) return;
    
    setDirection("next");
    setAnimation("slide-out");
    
    setTimeout(() => {
      setCurrentStep(currentStep + 1);
      setAnimation("slide-in");
    }, 300);
  };

  const prevStep = () => {
    setDirection("prev");
    setAnimation("slide-out");
    
    setTimeout(() => {
      setCurrentStep(currentStep - 1);
      setAnimation("slide-in");
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    
    const success = await signup(formData);
    if (success) {
      navigate("/verify");
    }
  };
  
  const handleGoogleAuth = () => {
    authenticateWithGoogle();
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${currentStep === 1 ? "bg-[#2D8C72] text-white" : "bg-white text-[#2D8C72] border-2 border-[#2D8C72]"}`}>1</div>
          <div className={`h-1 w-12 transition-colors duration-300 ${currentStep > 1 ? "bg-[#2D8C72]" : "bg-gray-300"}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${currentStep === 2 ? "bg-[#2D8C72] text-white" : currentStep > 2 ? "bg-white text-[#2D8C72] border-2 border-[#2D8C72]" : "bg-white text-gray-500 border-2 border-gray-300"}`}>2</div>
          <div className={`h-1 w-12 transition-colors duration-300 ${currentStep > 2 ? "bg-[#2D8C72]" : "bg-gray-300"}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${currentStep === 3 ? "bg-[#2D8C72] text-white" : "bg-white text-gray-500 border-2 border-gray-300"}`}>3</div>
        </div>
      </div>
    );
  };

  const renderNameStep = () => {
    return (
      <div className={`rounded-lg shadow-lg p-2 mb-6 transition-all duration-300 ${animation} ${direction}`}>
        <h2 className="text-xl font-semibold text-white mb-4 text-center">Personal Information</h2>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="First Name"
              id="firstname"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D8C72] text-black bg-white"
              required
              value={formData.firstname}
              onChange={handleInputChange}
            />
            {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>}
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Middle Name"
              id="middlename"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D8C72] text-black bg-white"
              value={formData.middlename}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Last Name"
              id="lastname"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D8C72] text-black bg-white"
              required
              value={formData.lastname}
              onChange={handleInputChange}
            />
            {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-[#2D8C72] text-white font-medium p-3 rounded-lg hover:bg-[#246d59] transition duration-300 flex items-center"
            onClick={nextStep}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    );
  };

  const renderDetailsStep = () => {
    return (
      <div className={`rounded-lg shadow-lg p-2 mb-6 transition-all duration-300 ${animation} ${direction}`}>
        <h2 className="text-xl font-semibold text-white mb-4 text-center">Account Details</h2>
        
        <div className="relative mb-4">
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
          <input
            type="text"
            placeholder="Username"
            id="username"
            className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D8C72] text-black bg-white"
            required
            value={formData.username}
            onChange={handleInputChange}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        <div className="relative mb-4">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D8C72] text-black bg-white"
            required
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="relative mb-6">
          <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
          <input
            type="number"
            placeholder="Phone Number"
            id="phonenumber"
            className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D8C72] text-black bg-white"
            required
            value={formData.phonenumber}
            onChange={handleInputChange}
          />
          {errors.phonenumber && <p className="text-red-500 text-sm mt-1">{errors.phonenumber}</p>}
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-gray-400 text-white font-medium p-3 rounded-lg hover:bg-gray-500 transition duration-300 flex items-center"
            onClick={prevStep}
          >
            <FaArrowLeft />
          </button>
          <button
            type="button"
            className="bg-[#2D8C72] text-white font-medium p-3 rounded-lg hover:bg-[#246d59] transition duration-300 flex items-center"
            onClick={nextStep}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    );
  };

  const renderPasswordStep = () => {
    return (
      <div className={`rounded-lg shadow-lg p-2 mb-6 transition-all duration-300 ${animation} ${direction}`}>
        <h2 className="text-xl font-semibold text-white mb-4 text-center">Set Password</h2>
        
        <div className="relative mb-4">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            id="password"
            className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D8C72] text-black bg-white"
            required
            value={formData.password}
            onChange={handleInputChange}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none z-10"
            onClick={() => togglePasswordVisibility("password")}
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div className="relative mb-4">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
          <input
            type={confirmPasswordVisible ? "text" : "password"}
            placeholder="Confirm Password"
            id="confirmPassword"
            className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D8C72] text-black bg-white"
            required
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none z-10"
            onClick={() => togglePasswordVisibility("confirmPassword")}
          >
            {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="rememberMe"
            className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-none"
          />
          <label htmlFor="rememberMe" className="ml-2 text-white hover:text-gray-400 cursor-pointer">
            Remember me
          </label>
        </div>

        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-gray-400 text-white font-medium p-3 rounded-lg hover:bg-gray-500 transition duration-300 flex items-center"
            onClick={prevStep}
          >
            <FaArrowLeft />
          </button>
          <button
            type="submit"
            className="bg-[#2D8C72] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#246d59] transition duration-300"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className="bg-cover bg-center bg-no-repeat bg-fixed min-h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(18, 121, 155, 0.89), rgba(18, 101, 180, 0.89)), url(${a})`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen py-10 px-4">
        <div className="max-w-lg w-full">
          <div className="flex items-center justify-center mb-4">
            <img src={b} alt="Logo" className="w-24 h-auto" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">Signup as {formData.identity}</h1>
          
          {renderStepIndicator()}
          
          <form className="w-full relative overflow-hidden" onSubmit={handleSubmit}>
            {currentStep === 1 && renderNameStep()}
            {currentStep === 2 && renderDetailsStep()}
            {currentStep === 3 && renderPasswordStep()}
          </form>

          {currentStep === 3 && (
            <>
              <div className="flex items-center my-6 animate-fade-in">
                <div className="flex-grow border-t border-gray-500"></div>
                <span className="mx-4 text-white text-sm">or continue with</span>
                <div className="flex-grow border-t border-gray-500"></div>
              </div>

              <div className="rounded-lg shadow-lg p-4 animate-fade-in">
                <button
                  className="flex items-center w-full justify-center bg-[#2D8C72] text-white py-3 px-4 rounded-lg hover:bg-[#246d59] transition duration-300"
                  onClick={handleGoogleAuth}
                  disabled={googleLoading}
                >
                  <FcGoogle className="w-6 h-6 mr-2" /> Sign up with Google
                </button>
              </div>
            </>
          )}

          <p className="text-center mt-6 text-white">
            Already have an account?{" "}
            <Link to="/login" className="text-green-300 hover:text-blue-200 hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// CSS for animations
const styles = `
@keyframes slideOutToLeft {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideOutToRight {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInFromRight {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in.next {
  animation: slideInFromRight 0.3s forwards;
}

.slide-in.prev {
  animation: slideInFromLeft 0.3s forwards;
}

.slide-out.next {
  animation: slideOutToLeft 0.3s forwards;
}

.slide-out.prev {
  animation: slideOutToRight 0.3s forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in;
}

/* Add some smooth transitioning to all elements */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
`;

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default Signup;