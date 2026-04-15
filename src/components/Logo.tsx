import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  light?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 28, text: "text-sm" },
  md: { icon: 36, text: "text-lg" },
  lg: { icon: 48, text: "text-2xl" },
};

export default function Logo({ size = "md", showText = true, light = false, className = "" }: LogoProps) {
  const s = sizes[size];

  return (
    <Link href="/" className={`flex items-center gap-2 flex-shrink-0 ${className}`}>
      <Image
        src="/logo.svg"
        alt="POLY Store"
        width={s.icon}
        height={s.icon}
        className="rounded-md"
      />
      {showText && (
        <span className={`${s.text} font-bold leading-none`}>
          <span className="text-[#1f8f4e]">POLY</span>
          {" "}
          <span className={light ? "text-white" : "text-gray-900"}>Store</span>
        </span>
      )}
    </Link>
  );
}
