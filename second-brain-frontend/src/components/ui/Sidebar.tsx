import { useState } from "react";
import { motion } from "framer-motion";
import { SidebarItem } from "./SideBarItem";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { Logo } from "../../icons/Logo";
import { LeftIcon } from "../../icons/LeftIcon";
import { RightIcon } from "../../icons/RightIcon";
import { div } from "framer-motion/client";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      className="h-screen bg-white border-r fixed left-0 top-0 shadow-lg"
      animate={{ width: isOpen ? "15rem" : "5rem" }} // Sidebar width
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Toggle Button */}
      <div
        className="absolute top-4 right-[-1rem] cursor-pointer bg-purple-300 rounded-full shadow-md p-2 border"
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
      <RightIcon/>
          ) : (
            <RightIcon/>
          
          )}
        </motion.div>
      </div>

      {/* Sidebar Content */}
      <div className={`h-full flex flex-col min-w-9 ${isOpen ? "pl-2" : "pl-2"}`}>
        {/* Logo */}
        <motion.div
  className="flex items-center justify-center gap-2 text-2xl pt-8"
  initial={false}
  animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
  transition={{ duration: 0.3 }}
>
  <div className="pr-2 text-purple-600">
    <Logo />
  </div>
  {isOpen && (
    <span className="text-3xl font-bold mr-4  text-purple-600">Brainly</span>
  )}
</motion.div>


        {/* Sidebar Items */}
        <div className={`pt-8 mr-4 ${isOpen ? "pl-4" : "pl-1"}`}>
  <SidebarItem text={isOpen ? "Twitter" : ""} icon={<TwitterIcon />} />
  <SidebarItem text={isOpen ? "Youtube" : ""} icon={<YoutubeIcon />} />
</div>
      </div>
    </motion.div>
  );
}
