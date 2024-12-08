import { ReactNode } from "react";

interface ButtonInterface {
    title: string;
    size: "lg" | "sm" | "md";
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    variant: "primary" | "secondary";
}

const sizeStyles = {
    lg: "px-8 py-4 text-xl rounded-xl",
    md: "px-4 py-2 text-md rounded-md",
    sm: "px-2 py-1 text-sm rounded-sm",
};

const variantStyles = {
    primary: "bg-purple-600 text-white",
    secondary: "bg-purple-400 text-purple-600",
};

export function Button({ title, size, startIcon, endIcon, variant }: ButtonInterface) {
    return (
        <button
            className={`${sizeStyles[size]} ${variantStyles[variant]} flex items-center justify-center`}
            aria-label={title}
        >
            {startIcon && <span className="mr-2">{startIcon}</span>}
            <span>{title}</span>
            {endIcon && <span className="ml-2">{endIcon}</span>}
        </button>
    );
}
