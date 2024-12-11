import { useEffect } from "react";
import { FaTwitter, FaYoutube, FaTrashAlt, FaShareAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

interface CardProps {
  title: string;
  link: string;
  type: "twitter" | "youtube";
}

export function Card({ title, link, type }: CardProps) {

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
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^/]+\/.*\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
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
            onClick={() => alert("Item deleted")} // Implement delete logic as required
            className="text-gray-500 hover:text-red-500 transition"
          >
            <FaTrashAlt />
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
    </div>
  );
}
