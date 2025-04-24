import { useState, useEffect } from "react";
import useProfile from "../../../Hooks/useProfile";
import { FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAlerts } from "../../contexts/AlertConntexts";


const EditProfilePage = ({profile}) => {
  const {
    fetchError,
    updateProfile,
    updateLoading,
    updateError,
    updateSuccess,
  } = useProfile();

  // Get alert functions from context
  const { showSuccess, showError, showInfo, showWarning } = useAlerts();

  // Form state
  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    username: "",
    email: "",
    phonenumber: "",
    bio: "",
    identity: "",
    image: null,
    cover_image: null,
  });

  // Previews
  const [previewImage, setPreviewImage] = useState(null);
  const [previewCoverImage, setPreviewCoverImage] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstname: profile.firstname || "",
        middlename: profile.middlename || "",
        lastname: profile.lastname || "",
        username: profile.username || "",
        email: profile.email || "",
        phonenumber: profile.phonenumber || "",
        bio: profile.bio || "",
        identity: profile.identity || "",
        image: null,
        cover_image: null,
      });
      if (profile.image) setPreviewImage(profile.image);
      if (profile.cover_image) setPreviewCoverImage(profile.cover_image);
    }
  }, [profile]);

  const navigate = useNavigate();

  const getInitial = () => {
    if (formData.firstname) return formData.firstname.charAt(0).toUpperCase();
    if (formData.username) return formData.username.charAt(0).toUpperCase();
    return "?";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match('image.*')) {
      showError('Please select a valid image file (JPEG, PNG)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showError('Image must be less than 5MB');
      return;
    }

    setFormData((p) => ({ ...p, [name]: file }));
    const reader = new FileReader();
    reader.onload = () => {
      if (name === "image") {
        setPreviewImage(reader.result);
        showInfo('Profile picture selected');
      } else {
        setPreviewCoverImage(reader.result);
        showInfo('Cover image selected');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== "") data.append(k, v);
      });
      await updateProfile(data);
    } catch (err) {
      showError('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    }
  };

  useEffect(() => {
    if (updateSuccess) {
      showSuccess('Profile updated successfully!');
      // Navigate after a short delay to allow the success message to be seen
      setTimeout(() => navigate("/profile"), 1500);
    }
  }, [updateSuccess, navigate, showSuccess]);

  useEffect(() => {
    if (updateError) {
      showError(updateError);
    }
  }, [updateError, showError]);

  useEffect(() => {
    if (fetchError) {
      showError(fetchError);
    }
  }, [fetchError, showError]);

  if (fetchError) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-700">{fetchError}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen ">
      <div className="max-w-5xl mx-auto">
        {/* Cover + Profile */}
        <div className="relative">
          <div className="h-60 bg-white overflow-hidden">
            {previewCoverImage ? (
              <img
                src={previewCoverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-4 border-white overflow-hidden bg-white">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200">
                    <span className="text-gray-400 text-6xl font-medium">
                      {getInitial()}
                    </span>
                  </div>
                )}
              </div>
              <label
                htmlFor="image"
                className="absolute bottom-2 right-2 bg-gray-100 text-gray-700 p-2 rounded-full cursor-pointer shadow-md hover:bg-gray-200 transition"
              >
                <FaCamera />
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
          <label
            htmlFor="cover_image"
            className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-md shadow cursor-pointer hover:bg-gray-50 transition flex items-center gap-2"
          >
            <FaCamera />
          </label>
          <input
            type="file"
            id="cover_image"
            name="cover_image"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Form */}
        <div className="mt-24 bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Basic Info
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstname"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Middle Name */}
              <div>
                <label
                  htmlFor="middlename"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Middle Name
                </label>
                <input
                  type="text"
                  id="middlename"
                  name="middlename"
                  value={formData.middlename}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastname"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Username (read‑only) */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  disabled
                  className="w-full pl-3 px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="border-b border-gray-200 pb-4 mb-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-800">
                Contact Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email (read‑only) */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-3 px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phonenumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phonenumber"
                  name="phonenumber"
                  value={formData.phonenumber || ""}
                  onChange={handleChange}
                  className="w-full pl-3 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Add your phone number"
                />
              </div>
            </div>

            {/* About You */}
            <div className="border-b border-gray-200 pb-4 mb-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-800">
                About You
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {/* Identity (read‑only) */}
              <div>
                <label
                  htmlFor="identity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Identity
                </label>
                <select
                  id="identity"
                  name="identity"
                  value={formData.identity}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                >
                  <option value="">{formData.identity}</option>
                  
                </select>
              </div>

              {/* Bio */}
              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  value={formData.bio || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Tell us a bit about yourself..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Write a short introduction about yourself. What makes you
                  unique?
                </p>
              </div>
            </div>

            {/* Account Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium text-gray-700 flex items-center">
                Account Information
              </h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>
                  Account created:{" "}
                  {new Date(profile?.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p>Account ID: {profile?.id}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateLoading}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-[#2D8C72] hover:bg-[#25725D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
              >
                {updateLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;