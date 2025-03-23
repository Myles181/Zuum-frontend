import React, { useState, useRef } from 'react';
import Navbar from '../../components/profile/NavBar';
import Sidebar from '../../components/homepage/Sidebar';
import Overlay from '../../components/homepage/Overlay';
import BottomNav from '../../components/homepage/BottomNav';
import VideoUpload from '../../components/upload/VideoUpload';
import Options from '../../components/upload/Options';
import { useCreateVideoPost } from '../../../Hooks/videoPosts/useCreateVideo';

const UploadVideo = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isPublic, setIsPublic] = useState(true); // Set to true by default
  const [taggedPeople, setTaggedPeople] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isCropMode, setIsCropMode] = useState(false);
  const [isTrimMode, setIsTrimMode] = useState(false);
  const [cropRect, setCropRect] = useState({ top: 0, left: 0, width: 0, height: 0 });

  const videoRef = useRef(null); // Create the videoRef

  // Use the hook
  const { createVideoPost, loading, error, success } = useCreateVideoPost();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setVideoPreview(event.target.result);
        setupVideo(event.target.result);
      };
      reader.readAsDataURL(file);
      setVideoFile(file);
    }
  };

  const setupVideo = (videoSrc) => {
    const video = videoRef.current; // Use the videoRef
    if (video) {
      video.src = videoSrc;
      video.load();
      video.play();
      video.pause();
    }
  };

  const openEditor = () => setIsEditing(true);
  const closeEditor = () => {
    setIsEditing(false);
    setIsCropMode(false);
    setIsTrimMode(false);
  };

  const toggleCropMode = () => setIsCropMode(!isCropMode);
  const toggleTrimMode = () => setIsTrimMode(!isTrimMode);

  const applyChanges = () => {
    alert('Changes applied! In a real app, the video would be cropped and trimmed according to your selections.');
    closeEditor();
  };

  const handleSubmit = async () => {
    if (!videoFile) {
      alert('Please select a video file.');
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('location', location);
    formData.append('public', isPublic); // Ensure `public` is set correctly

    // Append tagged people as an array
    taggedPeople.forEach((person) => formData.append('tagged_people[]', person));

    // Append the video file
    formData.append('video_upload', videoFile);

    // Log FormData for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Call the hook to create the video post
    await createVideoPost(formData);

    // Reset form on success
    if (success) {
      setVideoFile(null);
      setVideoPreview(null);
      setCaption('');
      setLocation('');
      setIsPublic(true); // Reset to true
      setTaggedPeople([]);
    }
  };

  return (
    <div className="bg-gray-100 mt-20 flex items-center justify-center mb-10">
      <div className="container bg-white overflow-hidden">
        <Navbar name={"Upload Video"} toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="content p-6">
          <input
            type="text"
            className="caption-input w-full border-b border-gray-300 focus:outline-none focus:border-green-500 text-gray-800 px-4 py-2 mb-6"
            placeholder="Write a Caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <VideoUpload
            handleVideoFileChange={handleVideoFileChange}
            videoPreview={videoPreview}
            openEditor={openEditor}
            videoRef={videoRef} // Pass the videoRef to VideoUpload
          />
          <Options
            taggedPeople={taggedPeople}
            setTaggedPeople={setTaggedPeople}
            isPublic={isPublic}
            setIsPublic={setIsPublic}
            location={location}
            setLocation={setLocation}
          />
          <div className="button-container flex justify-between mt-6">
            <button
              className="cancel-btn bg-gray-100 text-green-800 px-6 py-3 rounded-full font-medium hover:bg-green-600 hover:text-white transition-colors duration-200"
              onClick={() => {
                setVideoFile(null);
                setVideoPreview(null);
                setCaption('');
                setLocation('');
                setIsPublic(true); // Reset to true
                setTaggedPeople([]);
              }}
            >
              Cancel
            </button>
            <button
              className="submit-btn bg-green-800 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition-colors duration-200"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {/* Display error or success messages */}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {success && <p className="text-green-500 text-center mt-4">Video post created successfully!</p>}
        </div>
      </div>

      {isEditing && (
        <VideoEditor
          isEditing={isEditing}
          closeEditor={closeEditor}
          isCropMode={isCropMode}
          toggleCropMode={toggleCropMode}
          isTrimMode={isTrimMode}
          toggleTrimMode={toggleTrimMode}
          applyChanges={applyChanges}
          cropRect={cropRect}
        />
      )}

      <BottomNav activeTab="upload" />
    </div>
  );
};

export default UploadVideo;