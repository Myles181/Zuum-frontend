import React, { useEffect } from 'react';
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
import LockedMusicPlayer from './components/homepage/sale/Locked';
import PurchaseFeed from './components/homepage/sale/Purchase';
import MusicDashboard from './pages/Dashboard';
import BeatDetails from './components/homepage/details/BeatDetails';
import PurchasedBeats from './components/homepage/details/PurchasedBeats';
import PromotionPage from './pages/Promotion';
import SharedAudioPage from './components/homepage/SharePage';
import { usePreloadEssentialData } from '../Hooks/UsePreLoader';
import { AlertProvider } from './contexts/AlertConntexts';


// Auth state management
export const AuthContext = React.createContext();

// Custom Loader Component
const CustomLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#2D8C72] border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading your experience...</p>
    </div>
  </div>
);

// Custom Error Component
const AuthErrorDisplay = ({ errorMessage }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-white p-4">
    <div className="text-center max-w-md">
      <div className="text-red-500 text-5xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Error</h2>
      <p className="text-gray-600 mb-6">
        {errorMessage || 'Failed to load your profile data'}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-[#2D8C72] text-white px-6 py-2 rounded-lg font-medium"
      >
        Try Again
      </button>
      <p className="mt-4 text-sm text-gray-500">
        Still having issues? <a href="/login" className="text-[#2D8C72]">Try logging in again</a>
      </p>
    </div>
  </div>
);

// Payment Error Toast
const PaymentErrorToast = () => (
  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 fixed top-4 right-4 z-50 max-w-md shadow-lg">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm text-amber-700">
          Payment information couldn't be loaded. Some features may be limited.
        </p>
        <div className="mt-2">
          <button 
            onClick={() => window.location.reload()}
            className="text-sm text-amber-700 font-medium underline hover:text-amber-800"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  const {
    authProfile,
    paymentDetails,
    isLoading,
    errors,
    authLoading,
  } = usePreloadEssentialData();

  // Initialize socket when auth is ready
  useEffect(() => {
    if (authProfile?.id) {
      initializeSocket(authProfile.id);
    }
  }, [authProfile?.id]);

  const ProtectedRoutesWithLoader = () => {
    if (isLoading) {
      return <CustomLoader />;
    }
    
    if (errors?.auth) {
      return <AuthErrorDisplay errorMessage={errors.auth.message} />;
    }
    
    return (
      <>
        {errors?.payment && <PaymentErrorToast />}
        
        <Routes>
          <Route path="/home" element={<Homepage details={paymentDetails} profile={authProfile}/>} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<ArtistPage profile={authProfile} error={errors} />} />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          <Route path="/editprofile" element={<EditProfile profile={authProfile} />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/messages" element={<Chat />} />
          <Route path="/message" element={<ChatListPage />} />
          <Route path="/chat/:roomId" element={<MessagePage />} />
          <Route path="/music/:postId" element={<MusicDetailsPage />} />
          <Route path="/add" element={<UploadPage profile={authProfile} />} />
          <Route path="/addpaybeat" element={<UploadBeat />} />
          <Route path="/addbeat" element={<MusicUploadInterface />} />
          <Route path="/addvideo" element={<UploadVideo />} />
          <Route path="/video/:postId" element={<VideoDetails />} />
          <Route path="/all" element={<FollowersListPage />} />
          <Route path="/subscribe" element={<SubscriptionPage profile={authProfile} />} />
          <Route path="/details" element={<SubscriptionDetails />} />
          <Route path="/lock" element={<LockedMusicPlayer />} />
          <Route path="/userbeats/:userId" element={<PurchaseFeed />} />
          <Route path="/dashboard" element={<MusicDashboard />} />
          <Route path="/beats/:id" element={<BeatDetails />} />
          <Route path="/purchasedbeats" element={<PurchasedBeats />} />
          <Route path="/promotion" element={<PromotionPage />} />
          <Route path="/shared-audio/:shareId" element={<SharedAudioPage />} />
        </Routes>
      </>
    );
  };
  
  return (
    <AlertProvider>
      <AuthContext.Provider value={{ 
        profile: authProfile, 
        loading: authLoading, 
      }}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/start" element={<GetStarted />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login  />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/verify" element={<VerifyOTP />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/*" element={<ProtectedRoutesWithLoader />} />
            </Route>
          </Routes>
        </Router>
      </AuthContext.Provider>
    </AlertProvider>
  );
};

export default App;