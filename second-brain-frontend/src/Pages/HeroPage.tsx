import {Link} from 'react-router-dom'
import { Twitter, Youtube, ArrowRight } from 'lucide-react'

export default function HeroPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
      
      {/* Glassmorphism Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl p-8 sm:p-12 animate-fade-in-up">
        <div className="text-center space-y-8">
          {/* Title Section */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Brainly</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 max-w-2xl mx-auto">
            Save your important tweets, YouTube links, and share your brain with the world!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link to="/signin" className="group bg-white text-violet-600 hover:bg-violet-100 py-3 px-8 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center">
              <Twitter className="mr-2 h-5 w-5" />
              Sign In
              <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link to="/signup" className="group bg-transparent border-2 border-white hover:bg-white hover:text-violet-600 py-3 px-8 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center">
              <Youtube className="mr-2 h-5 w-5" />
              Sign Up
              <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>

          {/* Features/Tagline */}
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Join today and store your important content in one place. Keep track of what matters most!
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
      <div className="absolute top-10 right-10 w-20 h-20 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute bottom-10 left-1/2 w-20 h-20 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
    </div>
  )
}