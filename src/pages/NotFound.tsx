import { Link } from "react-router-dom";
import { Icon } from "../components/ui";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div className="space-y-4">
        <Icon.Film className="mx-auto h-12 w-12 text-red-600" />
        <h1 className="text-4xl font-black text-white">404</h1>
        <p className="text-zinc-400">This page wandered off into another dimension.</p>
        <Link to="/" className="inline-block rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-500">
          Back to home
        </Link>
      </div>
    </div>
  );
}
