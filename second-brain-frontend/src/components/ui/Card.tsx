import { ShareIcon } from "../../icons/ShareIcon";

interface CardProps {
  title: string;
  link: string;
  type: "twitter" | "youtube";
}

export function Card({ title, link, type }: CardProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 max-w-sm min-w-0 mx-auto">
      {/* Card Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <ShareIcon  />
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-500 transition"
          >
            <ShareIcon />
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(link)}
            className="text-gray-500 hover:text-green-500 transition"
          >
            <ShareIcon />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="pt-4">
        {type === "youtube" && (
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-full rounded-lg"
              src={link
                .replace("watch", "embed")
                .replace("?v=", "/")}
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
