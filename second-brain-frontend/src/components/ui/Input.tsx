interface InputProps {
    placeholder: string;
    reference?: React.RefObject<HTMLInputElement>;
    error?: string; // Optional error message
  }
  
  export function Input({ placeholder, reference, error }: InputProps) {
    return (
      <div className="flex flex-col w-full space-y-1">
        <input
          ref={reference}
          placeholder={placeholder}
          type="text"
          className={`px-4 py-2 border rounded-lg text-gray-700 
            focus:ring-2 focus:ring-blue-400 focus:outline-none 
            transition-shadow shadow-sm hover:shadow-md 
            border-gray-300 ${
              error ? "border-red-500 focus:ring-red-400" : ""
            }`}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
  