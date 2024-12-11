import { ReactElement } from "react";
import { Loader2 } from 'lucide-react'
interface ButtonProps {
    variant: "primary" | "secondary";
    text: string;
    startIcon?: ReactElement;
    onClick?: () => void;
    fullWidth?: boolean;
    loading?: boolean;
}

const variantClasses = {
    "primary": "bg-purple-600 text-white hover:bg-purple-700",
    "secondary": "bg-purple-200 text-purple-600 hover:bg-purple-300",
};

const defaultStyles = "px-4 py-2 rounded-lg font-medium flex items-center";

export function Button({ variant, text, startIcon, onClick, fullWidth, loading }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`${variantClasses[variant]} ${defaultStyles} ${fullWidth ? "w-full flex justify-center items-center" : ""} ${loading ? "opacity-45" : ""}`}
            disabled={loading}
        >
            <div className="pr-2">
                {startIcon}
            </div>
            {text}
        </button>
    );
}
