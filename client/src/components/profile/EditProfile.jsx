import React, { useState, useEffect } from 'react';

import c from "../../assets/icons/ORSJOS0 1.png"; // Default background image
import d from "../../assets/icons/Mask group1.svg"; // Default profile image
import Navbar from './NavBar';
import Sidebar from '../homepage/Sidebar';
import Overlay from '../homepage/Overlay';
import BottomNav from '../homepage/BottomNav';
import useProfile from '../../../Hooks/useProfile';
import Spinner from '../Spinner';

const EditProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(d); // State for profile image
  const [backgroundImage, setBackgroundImage] = useState(c); // State for background image

  // Use the useProfile hook
  const {
    profile,
    loading, // Loading state for fetching profile data
    fetchError,
    updateProfile,
    updateLoading, // Loading state for updating profile
    updateError,
    updateSuccess,
  } = useProfile();

  // Update profile and background images when profile data is fetched
  useEffect(() => {
    if (profile) {
      if (profile.image) {
        setProfileImage(profile.image); // Set profile image from profile data
      }
      if (profile.cover_image) {
        setBackgroundImage(profile.cover_image); // Set background image from profile data
      }
    }
  }, [profile]); // Run this effect when profile data changes

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle profile image change
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result); // Set the new profile image
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle background image change
  const handleBackgroundImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target.result); // Set the new background image
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSave = async () => {
    const formData = new FormData();

    // Append text fields
    formData.append('username', document.getElementById('username').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('phone_number', document.getElementById('phone').value);
    formData.append('bio', document.getElementById('bio').value);

    // Append image files
    const profileImageFile = document.querySelector('input[name="profileImage"]').files[0];
    const coverImageFile = document.querySelector('input[name="coverImage"]').files[0];

    if (profileImageFile) {
      formData.append('image', profileImageFile);
    }
    if (coverImageFile) {
      formData.append('cover_image', coverImageFile);
    }

    // Call the updateProfile function from the useProfile hook
    await updateProfile(formData);
  };

  // Display loading spinner while fetching profile data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <Navbar toggleSidebar={toggleSidebar} name={updateLoading ? 'Saving...' : 'Edit Profile'} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="profile-container flex flex-col items-center mt-4 mb-15">
        <section>
          <div className="profile-info bg-white mt-5 p-5 rounded-lg shadow-md relative">
            <div className="profile-container relative">
              {/* Background Image */}
              <div className="profile-background h-40 overflow-hidden rounded-t-lg relative">
                <img
                  src={backgroundImage} // Use the selected background image or fallback to the profile's background image
                  alt="Profile Background"
                  className="w-full h-full object-cover"
                />
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleBackgroundImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Profile Image (Absolute Positioning) */}
              <div className="profile-header absolute bottom-0 left-4 translate-y-1/2">
                <img
                  src={profileImage} // Use the selected profile image or fallback to the profile's image
                  alt="Profile Picture"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="profile-details mt-20">
              <div className="form-group mb-5">
                <label htmlFor="username" className="block text-sm text-gray-500">Username</label>
                <input
                  type="text"
                  id="username"
                  defaultValue={profile?.username || "Olusteve"}
                  className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-green-500 text-gray-800"
                />
              </div>
              <div className="form-group mb-5">
                <label htmlFor="bio" className="block text-sm text-gray-500">Bio</label>
                <textarea
                  id="bio"
                  defaultValue={profile?.bio || "I'm a singer-songwriter, weaving emotions into melodies that touches.."}
                  className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-green-500 text-gray-800 resize-y h-32"
                ></textarea>
              </div>
              <div className="form-group mb-5">
                <label htmlFor="email" className="block text-sm text-gray-500">Email</label>
                <input
                  type="email"
                  id="email"
                  defaultValue={profile?.email || "olusteve@gmail.com"}
                  className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-green-500 text-gray-800 bg-gray-100 cursor-not-allowed"
                  readOnly // Prevents editing
                />
              </div>
              <div className="form-group mb-5">
                <label htmlFor="phone" className="block text-sm text-gray-500">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  defaultValue={profile?.phone_number || "+2345678901"}
                  className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-green-500 text-gray-800"
                />
              </div>
            </div>
          </div>

          <div className="buttons flex justify-center mt-5 mb-10">
            <button 
              className="save bg-[#008066] text-white rounded-3xl px-4 py-2"
              onClick={handleSave}
              disabled={updateLoading}
            >
              {updateLoading ? 'Saving...' : 'Save'}
            </button>
          </div>

          {/* Display success or error messages */}
          {updateSuccess && <div className="text-green-500 text-center mt-2">Profile updated successfully!</div>}
          {updateError && <div className="text-red-500 text-center mt-2">{updateError}</div>}
        </section>

        <BottomNav />
      </div>
    </div>
  );
};

export default EditProfile;