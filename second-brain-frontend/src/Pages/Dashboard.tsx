import { useEffect, useState } from "react";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import axios from "axios";
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

  useEffect(() => {
    const fetchContent = async () => {
      await refresh();
      setLoading(false);
    };
    fetchContent();
  }, [modalOpen]);

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
            onClick={async () => {
              const response = await axios.post(
                `${BACKEND_URL}/api/v1/brain/share`,
                {
                  share: true,
                },
                {
                  headers: {
                    Authorization: localStorage.getItem("token"),
                  },
                }
              );
              const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
              navigator.clipboard.writeText(shareUrl);
              alert("Share URL copied to clipboard!");
            }}
            variant="secondary"
            text="Share brain"
            startIcon={<ShareIcon size="md" />}
           // Removed fullWidth, set width to auto
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