import React from 'react'
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

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/start" element={<GetStarted />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="/verify" element={<VerifyOTP />} />
      <Route path="/home" element={<Homepage />} />
      <Route path="/search" element={<Search />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<ArtistPage />} />
      <Route path="/editprofile" element={<EditProfile />} />
      <Route path="/activity" element={<ActivityPage />} />
      <Route path="/messages" element={<Chat />} />
      <Route path="/add" element={<UploadPage />} />
      <Route path="/addpaybeat" element={<UploadBeat />} />
      <Route path="/addbeat" element={<MusicUploadInterface />} />
      <Route path="/addvideo" element={<UploadVideo />} />
      </Routes>
      </Router>
  )
}

export default App