import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { ImprovedAuthProvider, useImprovedAuth } from './contexts/ImprovedAuthContext';
import LoadingScreen from './components/LoadingScreen';

// Import all your existing components
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

// Improved App Routes Component
const AppRoutes = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    loadingProgress, 
    errors, 
    hasErrors, 
    retry 
  } = useImprovedAuth();
  const location = useLocation();

  // Initialize socket when user is available
  React.useEffect(() => {
    if (user?.id) {
      initializeSocket(user.id);
    }
  }, [user]);

  // Show loading screen during authentication
  if (isLoading) {
    return (
      <LoadingScreen
        currentStep={loadingProgress.currentStep}
        totalSteps={loadingProgress.totalSteps}
        stepMessages={loadingProgress.stepMessages}
        isError={hasErrors}
        errorMessage={errors.auth || errors.profile || errors.payment}
        onRetry={retry}
      />
    );
  }

  // Show error screen if there are errors and user is not authenticated
  if (hasErrors && !isAuthenticated) {
    return (
      <LoadingScreen
        isError={true}
        errorMessage={errors.auth || errors.profile || errors.payment}
        onRetry={retry}
      />
    );
  }

  return (
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
        <Route path="/home" element={<Homepage details={user?.paymentDetails} profile={user} />} />
        <Route path="/search" element={<Search />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<ArtistPage profile={user} />} />
        <Route path="/profile/:userId" element={<UserProfilePage />} />
        <Route path="/editprofile" element={<EditProfile profile={user} />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/messages" element={<Chat />} />
        <Route path="/message" element={<ChatListPage />} />
        <Route path="/chat/:roomId" element={<MessagePage />} />
        <Route path="/music/:postId" element={<MusicDetailsPage />} />
        <Route path="/add" element={<UploadPage profile={user} />} />
        <Route path="/addpaybeat" element={<UploadBeat />} />
        <Route path="/addbeat" element={<MusicUploadInterface />} />
        <Route path="/addvideo" element={<UploadVideo />} />
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
        <Route path="/subscribe" element={<SubscriptionPage profile={user} details={user?.paymentDetails} />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/users" element={<AdminDashboard />} />
        <Route path="/distribution" element={<DistributionRequestsPage />} />
        <Route path="/beat" element={<AdminBeatPurchasesPage />} />
        <Route path="/promotion" element={<AdminPromotionsPage />} />
      </Route>
    </Routes>
  );
};

// Improved Protected Route Component
const ImprovedProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useImprovedAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <LoadingScreen
        currentStep={1}
        totalSteps={4}
        stepMessages={["Checking authentication..."]}
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

// Main App Component
const App = () => (
  <DarkModeProvider>
    <AlertProvider>
      <ImprovedAuthProvider>
        <AdminProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AdminProvider>
      </ImprovedAuthProvider>
    </AlertProvider>
  </DarkModeProvider>
);

export default App; 