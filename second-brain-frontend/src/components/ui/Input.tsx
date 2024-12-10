interface InputProps {
    placeholder: string;
    reference?: React.RefObject<HTMLInputElement>;
    error?: string; // Optional error message
    type?: "text" | "password"; // Input type, default is "text"
    className?: string; // Optional className for custom styling
  }
  
  export function Input({ placeholder, reference, error, type = "text", className }: InputProps) {
    return (
      <div className="flex flex-col w-full space-y-1">
        <input
          ref={reference}
          placeholder={placeholder}
          type={type}
          className={`px-4 py-3 border rounded-lg text-gray-700 
            focus:ring-2 focus:ring-blue-500 focus:outline-none 
            transition-all duration-200 ease-in-out 
            border-gray-300 bg-gray-50 hover:bg-white
            focus:bg-white focus:shadow-lg 
            ${error ? "border-red-500 focus:ring-red-500" : ""} 
            ${className}`} // Merge custom className
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
  