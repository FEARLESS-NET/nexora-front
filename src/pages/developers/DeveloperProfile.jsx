import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  MapPin,
  Linkedin,
  Github,
  ExternalLink,
  Code2,
  FolderGit2,
  UserRound,
  RefreshCw,
} from "lucide-react";

import { API_URL } from "../utils/config.js";

const DeveloperProfile = () => {
  const { username } = useParams();

  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH DEVELOPER
  // ==========================================

  const fetchDeveloper = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/developers/${encodeURIComponent(
          username
        )}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Developer not found"
        );
      }

      setDeveloper(data.developer);
    } catch (error) {
      console.error(
        "Developer profile API error:",
        error
      );

      setError(
        error.message ||
          "Developer profilini yuklashda xatolik yuz berdi."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchDeveloper();
    }
  }, [username]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-950 px-4 py-16 text-white">
        <div className="mx-auto flex min-h-[600px] max-w-5xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-green-500" />

            <p className="text-gray-400">
              Developer profile yuklanmoqda...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !developer) {
    return (
      <section className="min-h-screen bg-gray-950 px-4 py-16 text-white">
        <div className="mx-auto flex min-h-[600px] max-w-2xl items-center justify-center">
          <div className="w-full rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <XCircle className="mx-auto mb-4 h-14 w-14 text-red-400" />

            <h1 className="mb-2 text-2xl font-bold">
              Developer topilmadi
            </h1>

            <p className="mb-6 text-sm text-gray-400">
              {error ||
                "Bu developer mavjud emas yoki o‘chirilgan."}
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={fetchDeveloper}
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-medium text-black transition hover:bg-green-400"
              >
                <RefreshCw size={16} />
                Qayta urinish
              </button>

              <Link
                to="/developers"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
              >
                <ArrowLeft size={16} />
                Developers
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const skills = Array.isArray(developer.skills)
    ? developer.skills
    : [];

  const projects = Array.isArray(developer.projects)
    ? developer.projects
    : [];

  return (
    <section className="min-h-screen bg-gray-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* ==========================================
            BACK
        ========================================== */}

        <Link
          to="/developers"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to developers
        </Link>

        {/* ==========================================
            PROFILE HEADER
        ========================================== */}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="h-32 bg-gradient-to-r from-green-500/20 via-green-500/5 to-transparent sm:h-40" />

          <div className="px-5 pb-7 sm:px-8 sm:pb-9">
            <div className="-mt-12 flex flex-col gap-6 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">

              {/* AVATAR */}

              <div className="h-24 w-24 overflow-hidden rounded-3xl border-4 border-gray-950 bg-gray-900 sm:h-32 sm:w-32">
                {developer.avatar ? (
                  <img
                    src={developer.avatar}
                    alt={developer.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-green-500/10 text-green-400">
                    <UserRound
                      size={46}
                      strokeWidth={1.5}
                    />
                  </div>
                )}
              </div>

              {/* STATUS */}

              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                  developer.isAvailable
                    ? "bg-green-500/10 text-green-400"
                    : "bg-gray-500/10 text-gray-400"
                }`}
              >
                {developer.isAvailable ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <XCircle size={16} />
                )}

                {developer.isAvailable
                  ? "Available for work"
                  : "Currently unavailable"}
              </div>
            </div>

            {/* INFO */}

            <div className="mt-6">
              <h1 className="text-3xl font-bold sm:text-4xl">
                {developer.name}
              </h1>

              <p className="mt-1 text-green-400">
                @{developer.username}
              </p>

              {developer.location && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                  <MapPin size={16} />
                  {developer.location}
                </div>
              )}

              {developer.bio && (
                <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-gray-400 sm:text-base">
                  {developer.bio}
                </p>
              )}

              {/* SOCIAL */}

              <div className="mt-6 flex flex-wrap gap-3">
                {developer.linkedinUrl && (
                  <a
                    href={developer.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
                  >
                    <Linkedin size={17} />
                    LinkedIn
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            MAIN CONTENT
        ========================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">

          {/* ========================================
              LEFT SIDEBAR
          ======================================== */}

          <aside className="space-y-6">

            {/* SKILLS */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5 flex items-center gap-2">
                <Code2
                  size={18}
                  className="text-green-400"
                />

                <h2 className="font-semibold">
                  Skills
                </h2>
              </div>

              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-green-500/10 bg-green-500/5 px-3 py-2 text-sm text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No skills added yet.
                </p>
              )}
            </div>

            {/* PROFILE INFO */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="mb-5 font-semibold">
                Profile
              </h2>

              <div className="space-y-4 text-sm">

                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">
                    Username
                  </span>

                  <span className="truncate text-gray-300">
                    @{developer.username}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">
                    Status
                  </span>

                  <span
                    className={
                      developer.isAvailable
                        ? "text-green-400"
                        : "text-gray-400"
                    }
                  >
                    {developer.isAvailable
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">
                    Projects
                  </span>

                  <span className="text-gray-300">
                    {projects.length}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* ========================================
              PROJECTS
          ======================================== */}

          <main>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <FolderGit2
                    size={20}
                    className="text-green-400"
                  />

                  <h2 className="text-xl font-bold">
                    Projects
                  </h2>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  {projects.length} project
                  {projects.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
                <FolderGit2 className="mx-auto mb-4 h-12 w-12 text-gray-600" />

                <h3 className="text-lg font-semibold">
                  No projects yet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Bu developer hali portfolio
                  project qo‘shmagan.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {projects.map((project) => {
                  const projectSkills =
                    Array.isArray(project.tech)
                      ? project.tech
                      : [];

                  return (
                    <article
                      key={project._id}
                      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-green-500/30"
                    >
                      {/* PREVIEW */}

                      {project.previewImage ? (
                        <div className="aspect-video overflow-hidden bg-gray-900">
                          <img
                            src={project.previewImage}
                            alt={project.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-green-500/10 to-gray-900">
                          <FolderGit2
                            size={42}
                            className="text-green-500/40"
                          />
                        </div>
                      )}

                      <div className="p-5">
                        <h3 className="line-clamp-1 text-lg font-semibold">
                          {project.title}
                        </h3>

                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-400">
                          {project.description ||
                            "No project description."}
                        </p>

                        {/* TECH */}

                        {projectSkills.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {projectSkills
                              .slice(0, 5)
                              .map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded-md bg-gray-900 px-2 py-1 text-xs text-gray-400"
                                >
                                  {tech}
                                </span>
                              ))}
                          </div>
                        )}

                        {/* LINKS */}

                        <div className="mt-5 flex flex-wrap gap-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium transition hover:bg-white/10"
                            >
                              <Github size={14} />
                              GitHub
                            </a>
                          )}

                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-3 py-2 text-xs font-medium text-black transition hover:bg-green-400"
                            >
                              <ExternalLink size={14} />
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
};

export default DeveloperProfile;