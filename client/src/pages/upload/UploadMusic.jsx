import React, { useState } from 'react';
import Navbar from '../../components/profile/NavBar';
import MusicUpload from '../../components/upload/MusicUpload';
import CoverUpload from '../../components/upload/CoverUpload';
import PlatformLinks from '../../components/upload/StreamingLinks';
import ImageEditor from '../../components/upload/ImageEditor';
import Sidebar from '../../components/homepage/Sidebar';
import Overlay from '../../components/homepage/Overlay';
import BottomNav from '../../components/homepage/BottomNav';
import {useCreateAudioPost} from '../../../Hooks/audioPosts/useCreateAudio';

const MusicUploadInterface = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [musicFile, setMusicFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState('');
  const [type, setType] = useState('music'); // Default type
  const [boomplay, setBoomplay] = useState('');
  const [appleMusic, setAppleMusic] = useState('');
  const [spotify, setSpotify] = useState('');
  const [audiomark, setAudiomark] = useState('');
  const [youtubeMusic, setYoutubeMusic] = useState('');

  // Use the useCreateAudioPost hook
  const { createAudioPost, loading, error, success } = useCreateAudioPost();

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

  const handleCaptionChange = (e) => setCaption(e.target.value);

  const handleSubmit = async () => {
    if (!musicFile) {
      alert('Please select a music file');
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('type', type); // Append the type (music/beat)
    formData.append('boomplay', boomplay);
    formData.append('apple_music', appleMusic);
    formData.append('spotify', spotify);
    formData.append('audiomark', audiomark);
    formData.append('youtube_music', youtubeMusic);
    formData.append('audio_upload', musicFile); // Append the music file
    if (coverFile) {
      formData.append('cover_photo', coverFile); // Append the cover file
    }

    // Call the createAudioPost function
    await createAudioPost(formData);
  };

  return (
    <div className="bg-gray-100 mt-20 flex items-center justify-center">
      <div className="container bg-white overflow-hidden rounded-lg shadow-lg">
        <div className="containerwrapper flex flex-col mb-10">
          <Navbar name={"Upload Beats"} toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="content flex-1 p-6">
            {/* Caption Input */}
            <input
              type="text"
              className="caption-input w-full border-b border-gray-300 focus:outline-none focus:border-green-500 text-gray-800 px-4 py-2 mb-6"
              placeholder="Write a Caption..."
              value={caption}
              onChange={handleCaptionChange}
            />

            {/* Music Upload Section */}
            <MusicUpload handleMusicFileChange={handleMusicFileChange} musicFile={musicFile} />

            {/* Cover Upload Section */}
            <CoverUpload handleCoverFileChange={handleCoverFileChange} coverPreview={coverPreview} setIsEditing={setIsEditing} />

            {/* Platform Links Section */}
            <PlatformLinks
              onBoomplayChange={(e) => setBoomplay(e.target.value)}
              onAppleMusicChange={(e) => setAppleMusic(e.target.value)}
              onSpotifyChange={(e) => setSpotify(e.target.value)}
              onAudiomarkChange={(e) => setAudiomark(e.target.value)}
              onYoutubeMusicChange={(e) => setYoutubeMusic(e.target.value)}
            />

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-800 text-white rounded-2xl px-6 py-3 mt-6 w-full hover:bg-green-900 transition-colors duration-300"
            >
              {loading ? 'Uploading...' : 'Upload Beat'}
            </button>

            {/* Error and Success Messages */}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            {success && <p className="text-green-500 text-center mt-4">Beat uploaded successfully!</p>}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab="upload" />
    </div>
  );
};

export default MusicUploadInterface;