import React from "react";
import { FaInstagram, FaGithub, FaGlobe } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-10">
      <div className="max-w-6xl mx-auto px-6 pb-6 grid md:grid-cols-3 gap-8 text-sm">
        {/* Section 1: Project Description */}
        <div>
          <h3 className="text-xl font-semibold mb-2 text-blue-400">🧠 Tasko</h3>
          <p className="text-gray-300 mb-1">
            A real-time task management solution built using MERN Stack and
            Socket.IO.
          </p>
          <p className="text-gray-300">
            Crafted with passion by{" "}
            <span className="text-blue-400 font-medium">Sandy Chaudhary</span>.
          </p>
        </div>

        {/* Section 2: Social Media */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Connect with Me</h4>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <FaGlobe className="text-blue-400" />
              <a
                href="https://webdevsandy.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition"
              >
                Portfolio
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <FaGlobe className="text-blue-400" />
              <a
                href="https://www.linkedin.com/in/developer-sandy/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition"
              >
                LinkedIn
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <FaGithub className="text-blue-400" />
              <a
                href="https://github.com/webdevSandy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition"
              >
                GitHub
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <FaInstagram className="text-blue-400" />
              <a
                href="https://www.instagram.com/sandy_chaudhay_._/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>

        {/* Section 3: Policies */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-blue-400 transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition">
                Support
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} All rights reserved. Made with{" "}
        <span className="text-red-500">❤</span> by{" "}
        <span className="text-white font-medium">Sandy Chaudhary</span>
      </div>
    </footer>
  );
};

export default Footer;
