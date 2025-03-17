

import React from "react";
import c from "../../assets/icons/ORSJOS0 1.png";
import d from "../../assets/icons/Mask group1.svg";

const ProfileSection = () => {
  return (
    <div className="profile-container flex flex-col mt-15 mb-20 items-center  w-full max-w-lg mx-auto overflow-hidden">
      <div className="profile-container relative">
           {/* Background Image */}
           <div className="profile-background h-40 overflow-hidden rounded-t-lg relative">
             <img src={c} alt="Profile Background" className="w-full h-full object-cover" />
           </div>
       
           {/* Profile Image (Absolute Positioning) */}
           <div className="profile-header absolute bottom-0 left-4 translate-y-1/2">
             <img src={d} alt="Profile Picture" className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
           </div>
         </div>

      <div className="stats-container flex flex-col items-center mt-16 w-full px-5 text-center">
        <div className="username">
          <h2 className="text-2xl text-[#008066]">Dave_sings</h2>
          <p className="text-gray-500">Artist</p>
        </div>

        <div className="stats flex justify-around w-full max-w-md mt-4 gap-5 text-gray-500 flex-wrap">
          <div className="followers text-center">
            <p>Followers</p>
            <span className="text-[#008066] font-bold">42k</span>
          </div>
          <div className="following text-center">
            <p>Following</p>
            <span className="text-[#008066] font-bold">5.2k</span>
          </div>
        </div>
      </div>

      <p className="bio text-gray-700 text-center px-5 mt-5">
        I'm a singer-songwriter, weaving emotions into melodies that touch hearts and inspire minds.
      </p>

      <div className="buttons flex justify-center mt-5 w-full gap-3">
        <button className="bg-gray-200 text-[#008066] px-6 py-2 rounded-lg">Message</button>
        <button className="bg-gray-200 text-[#008066] px-6 py-2 rounded-lg">Following</button>
      </div>
    </div>
  );
};

export default ProfileSection;
