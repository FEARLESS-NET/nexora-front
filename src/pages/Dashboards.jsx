import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  Eye,
  MessageCircle,
  Users,
  ArrowUpRight,
  Plus,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";

const stats = [
  {
    title: "Profile Views",
    value: "1,248",
    change: "+18.4%",
    icon: Eye,
  },
  {
    title: "Projects",
    value: "24",
    change: "+4 this month",
    icon: BriefcaseBusiness,
  },
  {
    title: "Messages",
    value: "18",
    change: "+6 today",
    icon: MessageCircle,
  },
  {
    title: "Connections",
    value: "386",
    change: "+12 this week",
    icon: Users,
  },
];

const projects = [
  ["Nexora Platform", "React · Node.js · MongoDB", "Active"],
  ["Restaurant Management", "Next.js · Tailwind · API", "Completed"],
  ["MLBB Store", "React · Express · Telegram", "In progress"],
];

const messages = [
  ["TechVision", "We liked your portfolio..."],
  ["StartupHub", "Are you available for..."],
  ["John Developer", "Let's discuss the project..."],
];

const Dashboard = () => {
  const { user, loading } = useAuth();

  const currentDate = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(new Date());
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <div className="h-6 w-48 animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-10 w-80 animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-white/10" />
        </div>
      </div>
    );
  }

  const firstName =
    user?.name?.trim()?.split(" ")[0] || "Developer";

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-20">

      {/* ===============================
          WELCOME
      ================================ */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-green-400">
            {currentDate}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Welcome back, {firstName} 👋
          </h1>

          <p className="mt-2 text-gray-400">
            Here's what's happening with your workspace today.
          </p>
        </div>

        <Link
          to="/dashboard/portfolio"
          className="flex w-fit items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-green-400"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Link>
      </section>

      {/* ===============================
          STATS
      ================================ */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-green-500/20 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                  <Icon className="h-5 w-5 text-green-400" />
                </div>

                <ArrowUpRight className="h-4 w-4 text-gray-600" />
              </div>

              <p className="mt-5 text-sm text-gray-500">
                {stat.title}
              </p>

              <div className="mt-1 flex items-end justify-between gap-2">
                <p className="text-2xl font-bold text-white">
                  {stat.value}
                </p>

                <span className="text-xs font-medium text-green-400">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* ===============================
          MAIN GRID
      ================================ */}
      <section className="grid gap-6 xl:grid-cols-3">

        {/* ===============================
            PROJECTS
        ================================ */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] xl:col-span-2">

          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div>
              <h2 className="font-semibold text-white">
                Recent Projects
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest portfolio activity
              </p>
            </div>

            <Link
              to="/dashboard/portfolio"
              className="text-sm font-medium text-green-400 hover:text-green-300"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-white/10">
            {projects.map(([name, tech, status]) => (
              <div
                key={name}
                className="flex items-center justify-between gap-4 p-5 transition hover:bg-white/[0.02]"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">
                    {name}
                  </p>

                  <p className="mt-1 truncate text-sm text-gray-500">
                    {tech}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ===============================
            MESSAGES
        ================================ */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">

          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div>
              <h2 className="font-semibold text-white">
                Recent Messages
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest conversations
              </p>
            </div>

            <Link
              to="/dashboard/messages"
              className="text-xs font-medium text-green-400 hover:text-green-300"
            >
              View all
            </Link>
          </div>

          <div className="space-y-1 p-3">
            {messages.map(([name, message]) => (
              <Link
                key={name}
                to="/dashboard/messages"
                className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-white/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-sm font-bold text-green-400">
                  {name.charAt(0)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {name}
                  </p>

                  <p className="truncate text-xs text-gray-500">
                    {message}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
};

export default Dashboard;