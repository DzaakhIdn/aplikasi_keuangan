interface ButtonProps {
  isGradient?: boolean;
  text: string;
  onClick?: () => void;
  className?: string;
  size: "sm" | "md" | "lg";
}


export default function Button({
  isGradient,
  text,
  onClick,
  className,
  size,
}: ButtonProps) {

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };
  return (
    <button
      className={`group relative ${sizeClasses[size]} ${className} ${
        isGradient
          ? `bg-gradient-to-r from-blue-500 hover:cursor-pointer  to-blue-600 text-white border-yellow-500 shadow-[5px_5px_0px_0px_oklch(79.5%_0.184_86.047)]`
          : `bg-white text-slate-700 border-blue-500 border-2 shadow-[5px_5px_0px_0px_oklch(62.3%_0.214_259.815)]`
      } font-semibold rounded-md overflow-hidden transition-all duration-300 border-2 active:translate-y-1 active:shadow-none ${className}`}
      onClick={onClick}
    >
      <span className={`relative z-10`}>{text}</span>
      <div
        className={`absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          isGradient ? `` : `hidden`
        }`}
      ></div>
    </button>
  );
}
