import React from 'react'
import a from '../../assets/icons/Vector.png'
import b from '../../assets/icons/Vector (1).png'
import c from '../../assets/icons/Vector (2).png'
import d from '../../assets/icons/Vector.png'
import e from '../../assets/icons/music-schol.png'

const CoreFeatures = () => {
  return (
    <div> <section className="core-features py-10 bg-gray-900 text-white text-center">
    <h2 className="text-3xl font-bold mb-6">Core Features of Zuum</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto max-w-4xl">
      <Feature icon={a} title="Unlimited Music Uploads" description="Share as many tracks as you want with no limits." />
      <Feature icon={b} title="Support for Music Videos" description="Upload and showcase your music videos effortlessly." />
      <Feature icon={c} title="Artist Spotlight" description="Feature and promote top artists on our platform." />
      <Feature icon={d} title="Record Label Integration" description="Connect with record labels to elevate your career." />
    </div>
    <button className="cta-button mt-8 px-6 py-3 bg-blue-600 text-white rounded hover:bg-white hover:text-blue-600 transition duration-300">
      <a href="../getstarted/index.html" className="text-white hover:text-blue-600">Get started</a>
    </button>
    <div className="feature-illustration mt-8">
      <img src={e} alt="Music Illustration" className="w-full max-w-sm mx-auto" />
    </div>
  </section></div>
  )
}

export default CoreFeatures


const Feature = ({ icon, title, description }) => {
    return (
      <div className="flex flex-col items-center">
        <img src={icon} alt="Feature Icon" className="w-10 mb-2" />
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    );
  };