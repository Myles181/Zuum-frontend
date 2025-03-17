import b from '../../assets/image/Group-13.svg'
import React from 'react'

const MusicPotential = () => {
  return (
    <div> 
         <section className="music-potential py-10 bg-white">
    <h2 className="text-3xl font-bold text-center mb-4">Unleash Your Music’s True Potential</h2>
    <p className="text-lg text-center mx-auto max-w-2xl mb-6">
      Upload and share your music or beats with the world, promote artists and tracks effortlessly, showcase music videos, and connect with creators globally. Built for artists, record labels, and producers, our platform is designed to help you thrive and get your music recognized everywhere.
    </p>
    <div className="image-gallery mx-auto max-w-md h-44 bg-gray-100 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: `url(${b})` }}></div>
  </section>
  </div>
  )
}

export default MusicPotential