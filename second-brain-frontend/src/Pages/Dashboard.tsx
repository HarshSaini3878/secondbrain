import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { CreateContentModal } from "../components/ui/CreateContentModal";
import { Sidebar } from "../components/ui/Sidebar";
import { Button } from "../components/ui/Button";
import { BACKEND_URL } from "../../config";
import { Card } from "../components/ui/Card";
import { useContent } from "../Hooks/useContent";

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const { contents, refresh } = useContent();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to /signup if no token is present
      navigate("/signup");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [modalOpen]);

  const handleShareBrain = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication token is missing. Please log in.");
      navigate("/signup");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/brain/share`,
        { share: true },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const shareUrl = `http://localhost:8080/share/${response.data.hash}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert("Share URL copied to clipboard!");
      } else {
        alert("Clipboard API not supported. Share URL: " + shareUrl);
      }
    } catch (error) {
      console.error("Error sharing brain:", error);
      alert("Failed to generate share URL. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block w-[5rem] bg-white border-r">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 md:p-8 bg-gray-100">
        <CreateContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />

        {/* Button section */}
        <div className="flex justify-end gap-4 mb-6 flex-col sm:flex-row">
          {/* Button for adding content */}
          <Button
            onClick={() => setModalOpen(true)}
            variant="primary"
            text="Add content"
            startIcon={<PlusIcon size="md" />}
          />
          {/* Button for sharing brain */}
          <Button
            onClick={handleShareBrain}
            variant="secondary"
            text="Share brain"
            startIcon={<ShareIcon size="md" />}
          />
        </div>

        {/* Content area */}
        {loading ? (
          <div className="flex justify-center items-center">
            <span>Loading content...</span>
          </div>
        ) : (
          <div className="flex gap-4 flex-wrap">
            {contents.length === 0 ? (
              <p className="text-gray-500">No content available. Add new content.</p>
            ) : (
              contents.map(({ type, link, title }) => (
                <Card key={link} type={type} link={link} title={title} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}