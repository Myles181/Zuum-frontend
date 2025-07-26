import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import { initializeSocket } from './socket';
import FollowersListPage from './components/homepage/FollowingList ';
import SubscriptionPage from './components/subscription/Account';
import SubscriptionDetails from './components/subscription/SubDetails';
import ZuumNews from './pages/ZuumNews';

import LockedMusicPlayer from './components/homepage/sale/Locked';
import PurchaseFeed from './components/homepage/sale/Purchase';
import MusicDashboard from './pages/Dashboard';
import BeatDetails from './components/homepage/details/BeatDetails';
import PurchasedBeats from './components/homepage/details/PurchasedBeats';
import PromotionPage from './pages/Promotion';
import SharedAudioPage from './components/homepage/SharePage';

import { AlertProvider } from './contexts/AlertConntexts';
import SubscriptionPopup from './components/subscription/Popup';
import {Jet} from './pages/Jet';
import { AuthProvider, useAuth } from './contexts/AuthContexts';
import Distribution from './pages/Distribution';
import AdminLogin from './admin/pages/Login';
import AdminSignup from './admin/pages/Signup';
import VerifyEmailForm from './admin/pages/Verify';
import AdminDashboard from './admin/pages/Users';
import { AdminProvider } from './contexts/AdminContexts';
import AdminProtectedRoute from './contexts/AdminProtectedRoutes';
import PromotionPlatforms from './pages/upload/GlobalPromotion';
import VideoViewerPage from './components/homepage/sale/ViewVideo';
import PromotionRequirementsForm from './components/upload/Globalreq';
import { UserPromotions } from './pages/UserPromotions';
import DistributionRequestsPage from './admin/pages/Distribution';
import AdminBeatPurchasesPage from './admin/pages/Beats';
import AdminPromotionsPage from './admin/pages/promotion';
import { DarkModeProvider } from './contexts/DarkModeContext';

const CustomLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#2D8C72] border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your experience...</p>
    </div>
  </div>
);

const AuthErrorDisplay = ({ errorMessage }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 p-4">
    <div className="text-center max-w-md">
      <div className="text-red-500 text-5xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Authentication Error</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{errorMessage}</p>
      <button onClick={() => window.location.reload()} className="bg-[#2D8C72] text-white px-6 py-2 rounded-lg font-medium">
        Try Again
      </button>
    </div>
  </div>
);

const PaymentErrorToast = () => (
  <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 fixed top-4 right-4 z-50 max-w-md shadow-lg">
    <p className="text-sm text-amber-700 dark:text-amber-300">
      Payment information couldn't be loaded. Some features may be limited.
    </p>
  </div>
);

// Component handling protected routes and popups
const AppRoutes = () => {
  const { profile, paymentDetails, loading, error } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!profile) return; // wait for profile
    console.log(profile);
    

    // Initialize socket once
    if (profile.id) {
      initializeSocket(profile.id);
    }
  }, [profile, location.pathname]);

  if (loading) return <CustomLoader />;
  if (error) return <AuthErrorDisplay errorMessage={error} />;

  return (
    <>
      {paymentDetails === null && <PaymentErrorToast />}

      <Routes>
        {/* Subscription page should not trigger the popup */}
        <Route path="/subscribe" element={<SubscriptionPage profile={profile} details={paymentDetails} />} />
        <Route path="/home" element={<Homepage details={paymentDetails} profile={profile} />} />
        {/* Rest of protected routes */}
       
        <Route path="/search" element={<Search />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<ArtistPage profile={profile} />} />
        <Route path="/profile/:userId" element={<UserProfilePage />} />
        <Route path="/editprofile" element={<EditProfile profile={profile} />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/messages" element={<Chat />} />
        <Route path="/message" element={<ChatListPage />} />
        <Route path="/chat/:roomId" element={<MessagePage />} />
        <Route path="/music/:postId" element={<MusicDetailsPage />} />
        <Route path="/add" element={<UploadPage profile={profile} />} />
        <Route path="/addpaybeat" element={<UploadBeat />} />
        <Route path="/addbeat" element={<MusicUploadInterface />} />
        <Route path="/addvideo" element={<UploadVideo />} />
        {/* <Route path="/video/:postId" element={<VideoDetails />} /> */}
        <Route path="/all" element={<FollowersListPage />} />
        <Route path="/details" element={<SubscriptionDetails />} />
        <Route path="/lock" element={<LockedMusicPlayer />} />
        <Route path="/userbeats/:userId" element={<PurchaseFeed />} />
        <Route path="/dashboard" element={<MusicDashboard />} />
        <Route path="/beats/:id" element={<BeatDetails />} />
        <Route path="/purchasedbeats" element={<PurchasedBeats />} />
        <Route path="/promotion" element={<PromotionPage />} />
        <Route path="/distribution" element={<Distribution />} />
        <Route path="/jet" element={<Jet />} />
        <Route path="/global" element={<PromotionPlatforms />} />
         <Route path="/req" element={<PromotionRequirementsForm />} />
        <Route path="/shared-audio/:shareId" element={<SharedAudioPage />} />
        <Route path="/videos/:id" element={<VideoViewerPage />} />
        <Route path="/user/promotions" element={<UserPromotions />} />
        <Route path="/zuum-news" element={<ZuumNews />} />
      </Routes>
    </>
  );
};

const App = () => (
  <DarkModeProvider>
    <AlertProvider>
      <AuthProvider>
        {/* <SocketContextProvider> */}
        <AdminProvider>
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
            <Route path="/adlog" element={<AdminLogin />} />
              <Route path="/adsin" element={<AdminSignup />} />
               <Route path="/adver" element={<VerifyEmailForm />} />
               
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/*" element={<AppRoutes />} />
            </Route>

                {/* Admin Protected Routes - Must come before the wildcard */}
              <Route element={<AdminProtectedRoute />}>
                <Route path="/admin/*" element={<AdminDashboard />} />
                <Route path="/users" element={<AdminDashboard />} />
                <Route path="/distribution" element={<DistributionRequestsPage />} />
                <Route path="/beat" element={<AdminBeatPurchasesPage />} />
                <Route path="/promotion" element={<AdminPromotionsPage />} />

              </Route>
          </Routes>
        </Router>
        </AdminProvider>
        {/* </SocketContextProvider> */}
      </AuthProvider>
    </AlertProvider>
  </DarkModeProvider>
);

export default App;
