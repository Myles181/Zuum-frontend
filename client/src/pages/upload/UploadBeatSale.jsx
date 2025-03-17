import React, { useState } from 'react';

import Sidebar from '../../components/homepage/Sidebar';
import Overlay from '../../components/homepage/Overlay';
import BottomNav from '../../components/homepage/BottomNav';
import Navbar from '../../components/profile/NavBar';
import MusicUpload from '../../components/upload/MusicUpload';
import CoverUpload from '../../components/upload/CoverUpload';
import PlatformLinks from '../../components/upload/PlatformLinks';
import ImageEditor from '../../components/upload/ImageEditor';

const UploadBeat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [musicFile, setMusicFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleMusicFileChange = (e) => setMusicFile(e.target.files[0]);
  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setCoverPreview(event.target.result);
      reader.readAsDataURL(file);
      setCoverFile(file);
    }
  };

  return (
    <div className="bg-gray-100  flex items-center justify-center">
      <div className="container bg-white  overflow-hidden rounded-lg shadow-lg">
        <div className="containerwrapper flex flex-col mt-20 mb-20">
          <Navbar toggleSidebar={toggleSidebar} name={"Upload Beat"} />
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="content flex-1 p-6">
            <input
              type="text"
              className="caption-input w-full border-b border-gray-300 focus:outline-none focus:border-green-500 text-gray-800 px-4 py-2 mb-6"
              placeholder="Write a Caption..."
            />
            <MusicUpload handleMusicFileChange={handleMusicFileChange} musicFile={musicFile} />
            <CoverUpload handleCoverFileChange={handleCoverFileChange} coverPreview={coverPreview} setIsEditing={setIsEditing} />
            <PlatformLinks />
          </div>
        </div>
      </div>
      {isEditing && (
        <ImageEditor
          coverPreview={coverPreview}
          handleMouseDown={handleMouseDown}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
          handleToolClick={handleToolClick}
          handleRotate={handleRotate}
          handleColorChange={handleColorChange}
          handleCancelEdit={handleCancelEdit}
          handleSaveEdit={handleSaveEdit}
          editorTool={editorTool}
          color={color}
        />
      )}
      <BottomNav activeTab="add" />
    </div>
  );
};

export default UploadBeat;