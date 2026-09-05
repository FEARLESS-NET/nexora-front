import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Search,
  SlidersHorizontal,
  MapPin,
  ArrowUpRight,
  MessageCircle,
  Code2,
} from "lucide-react";

import api from "../../services/api";

const categories = [
  "All",
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile",
  "DevOps",
];

const Discover = () => {
  const navigate = useNavigate();

  const [developers, setDevelopers] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // GET DEVELOPERS
  // ===============================

 useEffect(() => {
  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/developers");

      const data = response.data;

      if (!data.success) {
        throw new Error(
          data.message || "Failed to load developers"
        );
      }

      setDevelopers(data.developers || []);
    } catch (error) {
      console.error("Fetch developers error:", error);

      setError(
        "Developersni yuklashda xatolik yuz berdi."
      );
    } finally {
      setLoading(false);
    }
  };

  fetchDevelopers();
}, []);

  // ===============================
  // FILTER
  // ===============================

  const filteredDevelopers = useMemo(() => {
    let result = [...developers];

    // SEARCH
    if (search.trim()) {
      const query = search.toLowerCase().trim();

      result = result.filter((developer) => {
        const name =
          developer.name?.toLowerCase() || "";

        const username =
          developer.username?.toLowerCase() || "";

        const bio =
          developer.bio?.toLowerCase() || "";

        const location =
          developer.location?.toLowerCase() || "";

        const skills = developer.skills || [];

        return (
          name.includes(query) ||
          username.includes(query) ||
          bio.includes(query) ||
          location.includes(query) ||
          skills.some((skill) =>
            skill.toLowerCase().includes(query)
          )
        );
      });
    }

    // CATEGORY
    if (category !== "All") {
      result = result.filter((developer) => {
        const skills = developer.skills || [];

        return skills.some((skill) =>
          skill
            .toLowerCase()
            .includes(category.toLowerCase())
        );
      });
    }

    return result;
  }, [developers, search, category]);

  // ===============================
  // OPEN MESSAGE
  // ===============================

  const openMessage = (developer) => {
    if (!developer?._id) {
      return;
    }

    navigate(
      `/dashboard/messages?user=${developer._id}`,
      {
        state: {
          user: developer,
        },
      }
    );
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-green-400">
            Explore the community
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Discover
          </h1>

          <p className="mt-2 text-gray-400">
            Find developers and connect with talented people.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] shadow-xl shadow-black/20 backdrop-blur-sm py-20 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-green-400" />

          <p className="mt-4 text-sm text-gray-500">
            Loading developers...
          </p>
        </div>
      </div>
    );
  }

  // ===============================
  // ERROR
  // ===============================

  if (error) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 py-20 text-center">
          <h2 className="text-lg font-semibold text-white">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-red-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  // ===============================
  // MAIN
  // ===============================

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* HEADER */}

      <div>
        <p className="text-sm font-medium text-green-400">
          Explore the community
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Discover
        </h1>

        <p className="mt-2 max-w-2xl text-gray-400">
          Find developers, explore their skills
          and connect with people who can help
          bring your next project to life.
        </p>
      </div>

      {/* SEARCH */}

      <div className="flex flex-col gap-3 lg:flex-row">

        <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">

          <Search className="h-5 w-5 shrink-0 text-gray-500" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search developers, skills, technologies..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-xs text-gray-500 transition hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-gray-300 transition hover:border-green-500/30 hover:text-green-400"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

      </div>

      {/* CATEGORIES */}

      <div className="flex flex-wrap gap-2">

        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition ${
              category === item
                ? "bg-gradient-to-r from-green-400 to-emerald-500 text-gray-950 shadow-md shadow-green-500/30"
                : "border border-white/10 bg-white/[0.03] text-gray-400 hover:border-green-500/30 hover:text-green-400"
            }`}
          >
            {item}
          </button>
        ))}

      </div>

      {/* RESULTS HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Developers
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            {filteredDevelopers.length} developers found
          </p>
        </div>
      </div>

      {/* EMPTY */}

      {filteredDevelopers.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] shadow-xl shadow-black/20 backdrop-blur-sm py-20 text-center">

          <Search className="mx-auto h-10 w-10 text-gray-700" />

          <h2 className="mt-4 text-lg font-semibold text-white">
            No developers found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Try another name, username or skill.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
            className="mt-5 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 px-4 py-2 text-sm font-semibold text-gray-950 shadow-lg shadow-green-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 hover:from-green-300 hover:to-emerald-400"
          >
            Reset filters
          </button>

        </div>
      ) : (

        /* CARDS */

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {filteredDevelopers.map((developer) => {

            const initials =
              developer.name
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "U";

            return (
              <div
                key={developer._id}
                className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] shadow-xl shadow-black/20 backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-green-500/30 hover:bg-white/[0.045] hover:shadow-2xl hover:shadow-green-500/10"
              >

                {/* TOP */}

                <div className="flex items-start justify-between">

                  <div className="flex min-w-0 items-center gap-3">

                    {/* AVATAR */}

                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-500/10 font-bold text-green-400">

                      {developer.avatar ? (
                        <img
                          src={developer.avatar}
                          alt={
                            developer.name ||
                            "Developer"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials
                      )}

                      {developer.isAvailable && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-gray-950 bg-green-400" />
                      )}

                    </div>

                    {/* NAME */}

                    <div className="min-w-0">

                      <h3 className="truncate font-semibold text-white">
                        {developer.name}
                      </h3>

                      <p className="mt-0.5 truncate text-xs text-gray-600">
                        @{developer.username}
                      </p>

                    </div>

                  </div>

                  {/* PROFILE ARROW */}

                  <Link
                    to={`/developers/${developer.username}`}
                    className="shrink-0 rounded-lg p-2 text-gray-600 transition hover:bg-white/5 hover:text-green-400"
                    title="View profile"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>

                </div>

                {/* ROLE */}

                <div className="mt-5 flex items-center gap-2 text-sm text-gray-400">

                  <Code2 className="h-4 w-4 text-green-400" />

                  Developer

                </div>

                {/* BIO */}

                {developer.bio && (
                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-500">
                    {developer.bio}
                  </p>
                )}

                {/* LOCATION */}

                {developer.location && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">

                    <MapPin className="h-4 w-4 shrink-0" />

                    {developer.location}

                  </div>
                )}

                {/* SKILLS */}

                {developer.skills?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">

                    {developer.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400"
                      >
                        {skill}
                      </span>
                    ))}

                  </div>
                )}

                {/* AVAILABLE */}

                <div className="mt-5 flex items-center gap-2">

                  <span
                    className={`h-2 w-2 rounded-full ${
                      developer.isAvailable
                        ? "bg-green-400"
                        : "bg-gray-600"
                    }`}
                  />

                  <span className="text-xs text-gray-500">
                    {developer.isAvailable
                      ? "Available for work"
                      : "Currently unavailable"}
                  </span>

                </div>

                {/* ACTIONS */}

                <div className="mt-5 flex gap-2 border-t border-white/10 pt-4">

                  {/* VIEW PROFILE */}

                  <Link
                    to={`/developers/${developer.username}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-gray-300 transition hover:border-green-500/30 hover:text-green-400"
                  >
                    View Profile

                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>

                  {/* MESSAGE */}

                  <button
                    type="button"
                    onClick={() => openMessage(developer)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-500 transition hover:border-green-500/30 hover:bg-green-500/10 hover:text-green-400"
                    title={`Message ${developer.name}`}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default Discover;