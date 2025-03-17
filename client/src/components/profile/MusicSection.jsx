import React from 'react';
import c from "../../assets/image/11429433 1.svg";

const MusicSection = () => {
  return (
    <div className="music-section flex justify-center mb-20 mt-10">
      <div className="music-list ">
        <div className="music-item bg-white rounded-lg shadow-md p-3 flex justify-between">
          <img src={c} alt="Cover" className="cover mx-2 w-30 h-30 rounded-lg" />
          <img src={c} alt="Cover" className="cover mx-2 w-30 h-30 rounded-lg" />
     
        </div>
        <div className="music-item bg-white rounded-lg shadow-md p-3 flex justify-between">
          <img src={c} alt="Cover" className="cover mx-2 w-30 h-30 rounded-lg" />
       
          <img src={c} alt="Cover" className="cover mx-2 w-30 h-30 rounded-lg" />
        </div>
        <div className="music-item bg-white rounded-lg shadow-md p-3 flex justify-between">
          <img src={c} alt="Cover" className="cover mx-2 w-30 h-30 rounded-lg" />
          <img src={c} alt="Cover" className="cover mx-2 w-30 h-30 rounded-lg" />
        
        </div>
        <div className="music-item bg-white rounded-lg shadow-md p-3 flex justify-between">
          <img src={c} alt="Cover" className="cover mx-2 w-30 h-30 rounded-lg" />
          <img src={c} alt="Cover" className="cover mx-2 w-30 h-30 rounded-lg" />
          
        </div>
      </div>
    </div>
  );
};

export default MusicSection;