import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GetStarted from './pages/GetStarted';
import LandingPage from './pages/LandingPage';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyOTP from './pages/auth/VerifyEmail';
import Homepage from './pages/Homepage';
import Search from './pages/Search';
import Settings from './pages/Settings';
import ArtistPage from './pages/Profile';
import ActivityPage from './pages/Activities';
import Chat from './pages/Messages';
import UploadPage from './pages/upload/Upload';
import UploadBeat from './pages/upload/UploadBeatSale';
import MusicUploadInterface from './pages/upload/UploadMusic';
import UploadVideo from './pages/upload/UploadVideo';
import ResetPassword from './pages/auth/ResetPassword';
import EditProfile from './components/profile/EditProfile';
import MusicDetailsPage from './pages/MusicDetails';
import VideoDetails from './pages/VideoDetails';
import ProtectedRoute from './contexts/ProtectedRoutes';
import UserProfilePage from './pages/UserProfilePge';
import ChatListPage from './components/messages/ChatList';
import MessagePage from './components/messages/Chat';
import useProfile from '../Hooks/useProfile';
import { initializeSocket } from './socket';





const App = () => {

    const { profile: authProfile, loading: authLoading } = useProfile();
   const userId = authProfile?.id;

  useEffect(() => {
    if (userId) {
      initializeSocket(userId);
    }
  }, [userId]);

  
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/start" element={<GetStarted />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/verify" element={<VerifyOTP />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Homepage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<ArtistPage />} />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/messages" element={<Chat />} />
          <Route path="/message" element={<ChatListPage />} />
          <Route path="/chat/:roomId" element={<MessagePage />} />
          <Route path="/music/:postId" element={<MusicDetailsPage />} />
          <Route path="/add" element={<UploadPage />} />
          <Route path="/addpaybeat" element={<UploadBeat />} />
          <Route path="/addbeat" element={<MusicUploadInterface />} />
          <Route path="/addvideo" element={<UploadVideo />} />
          <Route path="/video/:postId" element={<VideoDetails />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;