import { useEffect, useState } from "react";
import { FaTwitter, FaYoutube, FaTrashAlt, FaShareAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../../../config";
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast';
import { useContent } from "../../Hooks/useContent";

interface CardProps {
  title: string;
  link: string;
  type: "twitter" | "youtube";
  contentId: any;
}

export function Card({ title, link, type, contentId }: CardProps) {
 
  const [loading, setLoading] = useState(false); // Add loading state

  const handleDelete = async () => {
    setLoading(true); // Set loading to true when delete is triggered
    try {
      console.log("hello");
      const response = await axios.delete(`${BACKEND_URL}/api/v1/content`, {
        //@ts-ignore
        data: { contentId },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      console.log("hello2");

      // Delay for 1 second before showing the toast
      setTimeout(() => {
        // Show success message after the delay
        //@ts-ignore
        toast.success(response.data.message, {
          position: "top-right",
          duration: 2000,
        });
      }, 1000); // 1 second delay

      // Optionally trigger a refresh to update the UI
      
    } catch (error) {
      console.error("Error deleting content:", error);

      // Show error toast immediately after failure
      toast.error("Failed to delete content.", {
        position: "top-right",
        duration: 5000,
      });
    } finally {
      setLoading(false); // Set loading to false after the operation is complete
    }
  };

  // Dynamically load Twitter embed script if the content is from Twitter
  useEffect(() => {
    if (type === "twitter") {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);

      // Cleanup script when component unmounts
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [type]);

  // Function to format YouTube URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.*\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return ""; // Return empty if the URL is not valid
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 max-w-sm min-w-0 mx-auto">
      {/* Card Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          {type === "twitter" && <FaTwitter className="mr-2 text-blue-500" />}
          {type === "youtube" && <FaYoutube className="mr-2 text-red-500" />}
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          {/* Share Icon */}
          <Link
            to={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-500 transition"
          >
            <FaShareAlt />
          </Link>

          {/* Trash Icon */}
          <button
            onClick={handleDelete} // Implement delete logic as required
            className="text-gray-500 hover:text-red-500 transition disabled:opacity-50"
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <span>Loading...</span> // Show loading text or spinner
            ) : (
              <FaTrashAlt />
            )}
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="pt-4">
        {type === "youtube" && (
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-full rounded-lg"
              src={getYouTubeEmbedUrl(link)}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {type === "twitter" && (
          <blockquote className="twitter-tweet">
            <a href={link.replace("x.com", "twitter.com")}></a>
          </blockquote>
        )}
      </div>
      <Toaster />
    </div>
  );
}
