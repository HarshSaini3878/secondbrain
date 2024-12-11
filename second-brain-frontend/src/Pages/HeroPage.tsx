import { Link } from "react-router-dom";
import { FaTwitter, FaYoutube } from "react-icons/fa"; // Optional: Add social media icons

export default function HeroPage() {
  return (
    <div className="relative bg-cover bg-center h-screen flex items-center justify-center text-white bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-500">
      {/* Background Image */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="relative z-10 px-6 sm:px-12 text-center">
        {/* Title Section */}
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 animate__animated animate__fadeIn animate__delay-1s">
          Welcome to Brainly
        </h1>
        <p className="text-xl sm:text-2xl mb-8 animate__animated animate__fadeIn animate__delay-2s">
          Save your important tweets, YouTube links, and share your brain with the world!
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mb-8 animate__animated animate__fadeIn animate__delay-3s">
          <Link
            to="/signin"
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
          >
            <FaTwitter className="mr-2" /> Sign In
          </Link>
          <Link
            to="/signup"
            className="bg-transparent border-2 border-white hover:bg-white hover:text-purple-600 text-white py-3 px-8 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
          >
            <FaYoutube className="mr-2" /> Sign Up
          </Link>
        </div>

        {/* Features/Tagline */}
        <div className="text-lg animate__animated animate__fadeIn animate__delay-4s">
          <p>
            Join today and store your important content in one place. Keep track of what matters most!
          </p>
        </div>
      </div>
    </div>
  );
}
