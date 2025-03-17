import React from 'react'
import a from "../../assets/img/icon.png";



const Footers = () => {
  return (
    <div><footer className="bg-white py-5 px-4 shadow-t">
    <div className="footer-container flex flex-col items-center text-center">
      <div className="footer-logo flex items-center mb-5">
        <img
          src={a}
          alt="Zuum Logo"
          className="w-9 mr-2"
        />
      </div>
      <div className="footer-links flex justify-between w-full max-w-3xl text-left">
        <div className="footer-column">
          <h3 className="text-sm font-bold mb-2">Company</h3>
          <ul>
            <li>
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-blue-500"
              >
                Instant Share
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-blue-500"
              >
                Music promotion
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="text-sm font-bold mb-2">Products</h3>
          <ul>
            <li>
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-blue-500"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-blue-500"
              >
                Zuum News
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-blue-500"
              >
                Contact Us
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-blue-500"
              >
                About Us
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="text-sm font-bold mb-2">Help</h3>
          <ul>
            <li>
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-blue-500"
              >
                FAQ
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-blue-500"
              >
                Support Centre
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="footer-bottom text-center mt-5 text-sm text-gray-500 border-t border-gray-300 pt-3">
      <p>
        Copyright &copy; <span id="year">{new Date().getFullYear()}</span>{" "}
        Zuum. All rights reserved
      </p>
      <div className="footer-policy flex justify-center gap-5 mt-2">
        <a href="#" className="text-xs text-gray-600 hover:text-blue-500">
          Privacy Policy
        </a>
        <a href="#" className="text-xs text-gray-600 hover:text-blue-500">
          Term of Use
        </a>
      </div>
    </div>
  </footer></div>
  )
}

export default Footers