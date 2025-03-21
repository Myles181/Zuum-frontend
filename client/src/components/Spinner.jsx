import React from "react";

const Spinner = () => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-white">
      <div className="w-10 h-10 border-4 border-gray-200 rounded-full animate-spin border-t-4 border-t-[#008066]"></div>
    </div>
  );
};

export default Spinner;