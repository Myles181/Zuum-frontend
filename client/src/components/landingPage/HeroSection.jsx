import React from "react";
import a from "../../assets/image/Group 4.png";
import b from "../../assets/image/bg-image.jpg";
import {Link} from 'react-router-dom';

const HeroSection = () => {
  return (
    <div>
      <section
        className="hero relative bg-cover bg-center h-screen flex items-center justify-center text-center text-white"
        style={{ backgroundImage: `url(${b})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

        {/* Hero Content */}
        <div className="hero-content z-10 flex flex-col items-center">
          <img
            src={a}
            alt="ZUUM"
            className="w-36 h-16 mb-4" // Centered using flexbox
          />
          <p className="text-2xl font-bold">
            Time to let your music shine and go global
          </p>
          <p className="text-xl mt-4">
            Enjoy the freedom of unlimited music uploads. Zuum helps your music
            get recognition it deserves and promotes it to a global audience.
          </p>
          <button className="cta-button mt-8 px-6 py-3 bg-white text-blue-600 rounded hover:bg-blue-600 hover:text-white transition duration-300">
           <Link to="/start">Get Started</Link>
          </button>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;