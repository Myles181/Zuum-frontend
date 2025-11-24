import React, { useEffect, useState } from 'react';
import HeroSection from '../components/landingPage/HeroSection';
import MusicPotential from '../components/landingPage/MusicPotential';
import CoreFeatures from '../components/landingPage/CoreFeatures';
import ReviewSection from '../components/landingPage/ReviewSection';
import a from '../assets/img/favicon.png'
import Footers from '../components/getStarted/Footer';


const LandingPage = () => { 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Simulate a loading delay
      const timer = setTimeout(() => {
        setLoading(false);
      }, 5000); // Adjust the time as needed
  
      return () => clearTimeout(timer);
    }, []);
  
    return (
      <div className="min-h-screen bg-gray-100">
        {loading ? <LoadingScreen /> : <PageContent />}
      </div>
    );
  
};

const LoadingScreen = () => {
    return (
      <div className="loading-screen">
        <div className="loading-animation">
          <div className="progress-bar">
            <div className="progress"></div>
          </div>
        </div>
        <img src={a} alt="Loading Image" className="loading-image" />
        <b className="text-white text-lg">Where artist and industry meet</b>
      </div>
    );
  };
  
  const PageContent = () => {
    return (
      <div id="page-content">
        <HeroSection />
        <MusicPotential />
        <CoreFeatures />
        <ReviewSection />
        <Footers />
      </div>
    );
  };


export default LandingPage;