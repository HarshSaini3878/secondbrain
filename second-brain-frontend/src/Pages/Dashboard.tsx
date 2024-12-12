<<<<<<< HEAD
import { useEffect, useState } from "react"

import { PlusIcon } from "../icons/PlusIcon"
import { ShareIcon } from "../icons/ShareIcon"

import axios from "axios"
import { useContent } from "../Hooks/useContent";
=======
import { useEffect, useState } from "react";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import axios from "axios";
import { CreateContentModal } from "../components/ui/CreateContentModal";
>>>>>>> parent of f2b56bd (de bugging)
import { Sidebar } from "../components/ui/Sidebar";
import { CreateContentModal } from "../components/ui/CreateContentModal";
import { Button } from "../components/ui/Button";
import { BACKEND_URL } from "../../config";
import { Card } from "../components/ui/Card";

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
<<<<<<< HEAD
  const {contents, refresh} = useContent();

  useEffect(() => {
    refresh();
  }, [modalOpen])

  return <div>
    <Sidebar />
    <div className="p-4 ml-72 min-h-screen bg-gray-100 border-2">
      <CreateContentModal
       open={modalOpen} onClose={() => {
        setModalOpen(false);
      }} />
      <div className="flex justify-end gap-4">
        <Button onClick={() => {
          setModalOpen(true)
        }} variant="primary" text="Add content" startIcon={<PlusIcon />}></Button>
        <Button onClick={async () => {
            const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
                share: true
            }, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
            const shareUrl = `http://localhost:8080/share/${response.data.hash}`;
            alert(shareUrl);
        }} variant="secondary" text="Share brain" startIcon={<ShareIcon />}></Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        {contents.map(({type, link, title}) => <Card 
            type={type}
            link={link}
            title={title}
        />)}
      </div>
    </div>
  </div>
}
=======
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block w-8 mr-12 bg-white border-r shadow-md">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 md:p-12 bg-gray-100">
        <CreateContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />

        {/* Button section */}
        <div className="flex justify-between items-center mb-8 flex-col sm:flex-row gap-4">
          {/* Button for adding content */}
          <Button
            onClick={() => setModalOpen(true)}
            variant="primary"
            text="Add Content"
            startIcon={<PlusIcon size="md" />}
            
          />
          {/* Button for sharing brain */}
          <Button
            onClick={async () => {
              try {
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
            
                //@ts-ignore
                const shareUrl = `http://localhost:8080/share/${response.data.hash}`;
                await navigator.clipboard.writeText(shareUrl);
                alert("Share URL copied to clipboard!");
              } catch (error) {
                console.error("Error sharing the URL:", error);
                alert("Failed to generate and copy the share URL. Please try again.");
              }
            }}
            
            variant="secondary"
            text="Share Brain"
            startIcon={<ShareIcon size="md" />}
            
          />
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center items-center">
            <span className="text-lg font-medium text-gray-600">Loading content...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {contents.length === 0 ? (
              <p className="text-center text-gray-500 text-lg">No content available. Add new content.</p>
            ) : (
              contents.map(({ type, link, title ,id }) => (
                <Card key={link} type={type} link={link} title={title} contentId={id} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
>>>>>>> parent of f2b56bd (de bugging)
