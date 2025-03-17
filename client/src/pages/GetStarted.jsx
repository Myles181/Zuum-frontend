import React, { useEffect, useState } from "react";
import Header from "../components/getStarted/Header";
import Options from "../components/getStarted/Options";
import Footers from "../components/getStarted/Footer";
import a from '../assets/img/favicon.png'

const GetStarted = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
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
  useEffect(() => {
    // Add scroll animation for fade-in elements
    const fadeInElements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.5 }
    );

    fadeInElements.forEach((el) => observer.observe(el));

    return () => {
      fadeInElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="page-content">
  <Header />
  <Options />
  <Footers />
    </div>
  );
};

export default GetStarted;