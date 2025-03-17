import React from 'react'
import a from "../../assets/img/favicon.png";

const Header = () => {
  return (
    <div><header className="bg-[#6FA1E0] p-5 flex flex-col items-center text-center">
    <div className="flex flex-col items-center">
      <img
        src={a}
        alt="Zuum Logo"
        className="w-24 mb-4"
      />
      <h1 className="text-2xl font-bold text-black fade-in">
        Which Category Do You Belong?
      </h1>
    </div>
  </header></div>
  )
}

export default Header