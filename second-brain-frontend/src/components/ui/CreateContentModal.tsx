import { useRef, useState } from "react";
import { CrossIcon } from "../../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { BACKEND_URL } from "../../../config";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter",
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateContentModal({ open, onClose }: ModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState(ContentType.Youtube);

  async function addContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;
const token=localStorage.getItem("token");
console.log(token);
    await axios.post(
      `${BACKEND_URL}/api/v1/content`,
      {
        link,
        title,
        type,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          ></motion.div>

          {/* Modal Container */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
              {/* Close Icon */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                <CrossIcon />
              </button>

              {/* Modal Content */}
              <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">
                Create Content
              </h2>
              <div className="space-y-4">
                <Input reference={titleRef} placeholder="Title" />
                <Input reference={linkRef} placeholder="Link" />
              </div>

              {/* Type Selection */}
              <div className="mt-6">
                <h3 className="text-sm text-gray-600">Type</h3>
                <div className="flex gap-2 justify-center mt-2">
                  <Button
                    text="Youtube"
                    variant={type === ContentType.Youtube ? "primary" : "secondary"}
                    onClick={() => setType(ContentType.Youtube)}
                  />
                  <Button
                    text="Twitter"
                    variant={type === ContentType.Twitter ? "primary" : "secondary"}
                    onClick={() => setType(ContentType.Twitter)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-center">
                <Button onClick={addContent} variant="primary" text="Submit" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
