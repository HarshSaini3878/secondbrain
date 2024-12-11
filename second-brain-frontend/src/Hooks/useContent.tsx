import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";

export function useContent() {
  const [contents, setContents] = useState<any[]>([]);  // Typed as any[] to handle different content types
  const [loading, setLoading] = useState(false);        // Loading state for better UX
  const [error, setError] = useState<string | null>(null); // Error state for handling errors

  const refresh = async () => {
    setLoading(true);
    setError(null); // Reset error state before making the request

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing.");
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          "Authorization": token,
        },
      });

      setContents(response.data.content);
    } catch (err) {
      console.error("Error fetching content:", err);
      setError("Failed to load content. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh(); // Fetch content on mount

    // Refresh content every 10 seconds
    const interval = setInterval(() => {
      refresh();
    }, 10 * 1000);

    // Cleanup the interval when component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []);

  return { contents, loading, error, refresh };
}
