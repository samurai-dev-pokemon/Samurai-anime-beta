import { Link } from "react-router-dom";
import { cn } from "../utils/cn";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2 shrink-0", className)}>
      <img src="/images/logo-mark.png" alt="" className="h-8 w-8 object-contain drop-shadow-[0_0_10px_rgba(229,9,20,0.5)]" />
      <span className="text-lg font-black uppercase tracking-tight text-white sm:text-xl">
        Samurai<span className="text-red-600">Anime</span>
      </span>
    </Link>
  );
}
