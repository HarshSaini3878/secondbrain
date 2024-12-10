interface PlusIconProps {
    size?: "sm" | "md" | "lg"
}

const sizeVariants = {
    sm: "w-4 h-4", // 1rem
    md: "w-6 h-6", // 1.5rem
    lg: "w-8 h-8", // 2rem
}

export function PlusIcon(props: PlusIconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={sizeVariants[props.size || "sm"]}>
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>  
}