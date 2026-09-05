import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Code2,
  Users,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  UserRound,
  Sparkles,
} from "lucide-react";

import { API_URL } from "../utils/config.js";

const Developers = () => {
  const [developers, setDevelopers] = useState([]);
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [availability, setAvailability] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH DEVELOPERS
  // ==========================================

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/developers`);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load developers");
      }

      setDevelopers(Array.isArray(data.developers) ? data.developers : []);
    } catch (error) {
      console.error("Developers API error:", error);

      setError(
        error.message ||
          "Developersni yuklashda xatolik yuz berdi."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  // ==========================================
  // ALL SKILLS
  // ==========================================

  const allSkills = useMemo(() => {
    const skills = developers.flatMap((developer) =>
      Array.isArray(developer.skills)
        ? developer.skills
        : []
    );

    return [...new Set(skills)]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [developers]);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredDevelopers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return developers.filter((developer) => {
      const name = developer.name?.toLowerCase() || "";
      const username = developer.username?.toLowerCase() || "";
      const bio = developer.bio?.toLowerCase() || "";
      const location = developer.location?.toLowerCase() || "";

      const developerSkills = Array.isArray(developer.skills)
        ? developer.skills
        : [];

      const matchesSearch =
        !query ||
        name.includes(query) ||
        username.includes(query) ||
        bio.includes(query) ||
        location.includes(query) ||
        developerSkills.some((skill) =>
          skill.toLowerCase().includes(query)
        );

      const matchesSkill =
        skillFilter === "all" ||
        developerSkills.includes(skillFilter);

      const matchesAvailability =
        availability === "all" ||
        (availability === "available" &&
          developer.isAvailable === true) ||
        (availability === "unavailable" &&
          developer.isAvailable === false);

      return (
        matchesSearch &&
        matchesSkill &&
        matchesAvailability
      );
    });
  }, [
    developers,
    search,
    skillFilter,
    availability,
  ]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-950 text-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-green-500" />

              <p className="text-gray-400">
                Developers yuklanmoqda...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <section className="min-h-screen bg-gray-950 px-4 py-16 text-white">
        <div className="mx-auto flex min-h-[500px] max-w-2xl items-center justify-center">
          <div className="w-full rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <XCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />

            <h2 className="mb-2 text-xl font-semibold">
              Developers yuklanmadi
            </h2>

            <p className="mb-6 text-sm text-gray-400">
              {error}
            </p>

            <button
              onClick={fetchDevelopers}
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-medium text-black transition hover:bg-green-400"
            >
              <RefreshCw size={17} />
              Qayta urinish
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-4 py-2 text-sm text-green-400">
            <Sparkles size={16} />
            Nexora Developers
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Discover talented{" "}
            <span className="text-green-500">
              developers
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            O‘zbekistondagi va boshqa hududlardagi
            developerlarni toping, portfolio va
            ko‘nikmalarini ko‘ring.
          </p>
        </div>

        {/* ==========================================
            SEARCH + FILTERS
        ========================================== */}

        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">

            {/* SEARCH */}

            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Developer, skill, location..."
                className="h-12 w-full rounded-xl border border-white/10 bg-gray-900 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/50"
              />
            </div>

            {/* SKILL */}

            <select
              value={skillFilter}
              onChange={(e) =>
                setSkillFilter(e.target.value)
              }
              className="h-12 rounded-xl border border-white/10 bg-gray-900 px-4 text-sm text-white outline-none focus:border-green-500/50"
            >
              <option value="all">
                All skills
              </option>

              {allSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>

            {/* AVAILABILITY */}

            <select
              value={availability}
              onChange={(e) =>
                setAvailability(e.target.value)
              }
              className="h-12 rounded-xl border border-white/10 bg-gray-900 px-4 text-sm text-white outline-none focus:border-green-500/50"
            >
              <option value="all">
                All developers
              </option>

              <option value="available">
                Available
              </option>

              <option value="unavailable">
                Not available
              </option>
            </select>
          </div>
        </div>

        {/* ==========================================
            RESULT COUNT
        ========================================== */}

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users size={17} />

            <span>
              {filteredDevelopers.length} developer
              {filteredDevelopers.length !== 1
                ? "s"
                : ""}
            </span>
          </div>
        </div>

        {/* ==========================================
            EMPTY
        ========================================== */}

        {filteredDevelopers.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-20 text-center">
            <UserRound className="mx-auto mb-4 h-12 w-12 text-gray-600" />

            <h2 className="mb-2 text-xl font-semibold">
              Developer topilmadi
            </h2>

            <p className="text-sm text-gray-500">
              Search yoki filterlarni o‘zgartirib
              ko‘ring.
            </p>
          </div>
        ) : (
          /* ==========================================
              DEVELOPER GRID
          ========================================== */

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDevelopers.map((developer) => {
              const skills = Array.isArray(
                developer.skills
              )
                ? developer.skills
                : [];

              return (
                <article
                  key={developer._id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-green-500/30 hover:bg-white/[0.05]"
                >
                  <div className="p-6">

                    {/* AVATAR + STATUS */}

                    <div className="mb-5 flex items-start justify-between">
                      <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-gray-900">
                        {developer.avatar ? (
                          <img
                            src={developer.avatar}
                            alt={developer.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-green-500/10 text-green-400">
                            <UserRound size={28} />
                          </div>
                        )}
                      </div>

                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                          developer.isAvailable
                            ? "bg-green-500/10 text-green-400"
                            : "bg-gray-500/10 text-gray-400"
                        }`}
                      >
                        {developer.isAvailable ? (
                          <CheckCircle2 size={13} />
                        ) : (
                          <XCircle size={13} />
                        )}

                        {developer.isAvailable
                          ? "Available"
                          : "Unavailable"}
                      </div>
                    </div>

                    {/* NAME */}

                    <h2 className="truncate text-xl font-semibold">
                      {developer.name}
                    </h2>

                    <p className="mt-1 text-sm text-green-400">
                      @{developer.username}
                    </p>

                    {/* LOCATION */}

                    {developer.location && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                        <MapPin
                          size={15}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {developer.location}
                        </span>
                      </div>
                    )}

                    {/* BIO */}

                    <p className="mt-4 line-clamp-3 min-h-[60px] text-sm leading-6 text-gray-400">
                      {developer.bio ||
                        "Developer profile description not available."}
                    </p>

                    {/* SKILLS */}

                    <div className="mt-5 flex min-h-[58px] flex-wrap content-start gap-2">
                      {skills.length > 0 ? (
                        <>
                          {skills
                            .slice(0, 4)
                            .map((skill) => (
                              <span
                                key={skill}
                                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-gray-900 px-2.5 py-1.5 text-xs text-gray-300"
                              >
                                <Code2 size={12} />
                                {skill}
                              </span>
                            ))}

                          {skills.length > 4 && (
                            <span className="rounded-lg border border-white/10 bg-gray-900 px-2.5 py-1.5 text-xs text-gray-500">
                              +{skills.length - 4}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-gray-600">
                          No skills added
                        </span>
                      )}
                    </div>

                    {/* BUTTON */}

                    <Link
                      to={`/developers/${developer.username}`}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-green-500 hover:text-black"
                    >
                      View profile
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Developers;