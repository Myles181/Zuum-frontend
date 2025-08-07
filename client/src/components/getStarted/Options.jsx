import React from "react";
import { Link } from "react-router-dom";

const Options = () => {
  return (
    <main className="p-5  flex flex-col items-center justify-center bg-gradient-to-b from-[#87CEFA] to-[#2E8B57]">
      <p className="text-white text-sm text-center mb-8 fade-in">
        Choose your role and begin your journey—artist, producer, record
        label owner, or fan
      </p>

      {/* Options */}
      <div className="flex flex-col gap-5 items-center w-full">
        {["record_label", "artist", "producer", "fans"].map((option, index) => (
          <div
            key={index}
            className="w-4/5 max-w-md bg-white p-8 rounded-lg shadow-lg text-center text-black font-bold text-lg cursor-pointer hover:bg-gray-100 fade-in"
          >
            {/* Pass the selected role as a URL parameter */}
            <Link
              to={`/signup?identity=${option.toLowerCase().replace(/\s+/g, "-")}`} // Convert to lowercase and replace spaces with hyphens
              className="text-black no-underline"
            >
              {option
  .split("_")
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ")}

            </Link>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Options;