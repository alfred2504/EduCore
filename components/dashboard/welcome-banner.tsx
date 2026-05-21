import { Star } from "lucide-react";

interface WelcomeBannerProps {
  name: string;
  greeting?: string;
}

export function WelcomeBanner({
  name,
  greeting = "Have a good day at work",
}: WelcomeBannerProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-lg dark:from-slate-950 dark:to-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Welcome Back, {name}
          </h2>
          <p className="mt-1 text-slate-300">
            {greeting}
          </p>
        </div>
        <button className="rounded-lg bg-slate-800 p-2 transition hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
          <Star
            size={20}
            className="fill-yellow-400 text-yellow-400"
          />
        </button>
      </div>
    </div>
  );
}
