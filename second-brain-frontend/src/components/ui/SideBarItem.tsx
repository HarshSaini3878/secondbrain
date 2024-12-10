import { ReactElement } from "react";

interface SidebarItemProps {
  text: string;
  icon: ReactElement;
}

export function SidebarItem({ text, icon }: SidebarItemProps) {
  return (
    <div
      className="flex items-center text-gray-700 py-3 px-4 cursor-pointer 
                 hover:bg-gray-100 rounded-lg max-w-full transition-all duration-150
                 group"
    >
      {/* Icon Section */}
      <div className="text-gray-500  group-hover:text-blue-500 pr-6 transition-colors duration-150">
        {icon}
      </div>

      {/* Text Section */}
      <div className=" font-bold text-gray-700 group-hover:text-blue-500 transition-colors duration-150">
        {text}
      </div>
    </div>
  );
}
