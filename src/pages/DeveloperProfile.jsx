import { useEffect, useState } from "react";

import {
  MapPin,
  Code2,
  ExternalLink,
  MessageCircle,
  ArrowLeft,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";

import {
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";

const API_URL = "http://localhost:3013/api";

const DeveloperProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [developer, setDeveloper] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET DEVELOPER PROFILE
  // ==========================================

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/developers/${username}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Developer not found"
          );
        }

        const developerData =
          data.developer;

        setDeveloper(developerData);

        if (developerData?.projects) {
          setProjects(
            developerData.projects
          );
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error(
          "❌ Fetch developer error:",
          error
        );

        setError(
          "Developer profilini yuklashda xatolik yuz berdi."
        );
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchDeveloper();
    }
  }, [username]);

  // ==========================================
  // MESSAGE
  // ==========================================

  const handleMessage = () => {
    if (!developer?._id) {
      return;
    }

    navigate(
      `/dashboard/messages?user=${developer._id}`,
      {
        state: {
          user: {
            _id: developer._id,
            name: developer.name,
            username: developer.username,
            avatar: developer.avatar,
          },
        },
      }
    );
  };

  // ==========================================
  // OPEN URL
  // ==========================================

  const openLiveDemo = (url) => {
    if (!url) return;

    let finalUrl = url.trim();

    if (
      !finalUrl.startsWith("http://") &&
      !finalUrl.startsWith("https://")
    ) {
      finalUrl = `https://${finalUrl}`;
    }

    window.open(
      finalUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/dashboard/discover"
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-green-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Discover
          </Link>

          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-green-400" />

              <p className="mt-4 text-sm text-gray-500">
                Loading developer profile...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (!developer || error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-950 px-6 text-white">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <Code2 className="h-8 w-8" />
          </div>

          <h1 className="mt-5 text-3xl font-bold">
            Developer Not Found
          </h1>

          <p className="mt-2 text-gray-500">
            {error ||
              "This developer profile doesn't exist."}
          </p>

          <Link
            to="/dashboard/discover"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-gray-950 transition hover:bg-green-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // INITIALS
  // ==========================================

  const initials =
    developer.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* BACK */}

        <Link
          to="/dashboard/discover"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-green-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Discover
        </Link>

        {/* PROFILE HEADER */}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gray-900">

          <div className="h-24 bg-gray-900 sm:h-28" />

          <div className="px-5 pb-6 sm:px-8 sm:pb-8">

            <div className="-mt-10 flex flex-col gap-6 sm:-mt-12 lg:flex-row lg:items-end lg:justify-between">

              {/* USER INFO */}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

                {/* AVATAR */}

                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-gray-900 bg-green-500/10 text-3xl font-bold text-green-400 sm:h-28 sm:w-28">

                  {developer.avatar ? (
                    <img
                      src={developer.avatar}
                      alt={developer.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}

                  {developer.isAvailable && (
                    <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-gray-900 bg-green-400" />
                  )}

                </div>

                {/* USER DETAILS */}

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <h1 className="text-2xl font-bold sm:text-3xl">
                      {developer.name}
                    </h1>

                    <CheckCircle2 className="h-5 w-5 text-green-400" />

                  </div>

                  <p className="mt-1 text-sm text-gray-600">
                    @{developer.username}
                  </p>

                  <p className="mt-2 text-gray-400">
                    Developer
                  </p>

                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">

                    {developer.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {developer.location}
                      </span>
                    )}

                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" />
                      Nexora member
                    </span>

                  </div>

                </div>

              </div>

              {/* MESSAGE */}

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={handleMessage}
                  className="flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-gray-950 transition hover:bg-green-400"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* MAIN CONTENT */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* LEFT */}

          <div className="space-y-6 lg:col-span-2">

            {/* ABOUT */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <h2 className="text-xl font-semibold">
                About
              </h2>

              {developer.bio ? (
                <p className="mt-4 leading-7 text-gray-400">
                  {developer.bio}
                </p>
              ) : (
                <p className="mt-4 text-sm text-gray-600">
                  This developer hasn't added a bio yet.
                </p>
              )}

            </section>

            {/* SKILLS */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <h2 className="text-xl font-semibold">
                Skills
              </h2>

              {developer.skills?.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">

                  {developer.skills.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="rounded-xl border border-green-500/10 bg-green-500/5 px-3 py-2 text-sm text-green-400"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-600">
                  No skills added yet.
                </p>
              )}

            </section>

            {/* PORTFOLIO */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-semibold">
                    Portfolio
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Projects and work created by this developer.
                  </p>
                </div>

                <Code2 className="h-5 w-5 text-green-400" />

              </div>

              {projects.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">

                  {projects.map(
                    (project) => (
                      <div
                        key={project._id}
                        className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition hover:border-green-500/30"
                      >

                        {project.previewImage ? (
                          <button
                            type="button"
                            onClick={() =>
                              project.liveUrl &&
                              openLiveDemo(
                                project.liveUrl
                              )
                            }
                            disabled={
                              !project.liveUrl
                            }
                            className={`relative block h-40 w-full overflow-hidden ${
                              project.liveUrl
                                ? "cursor-pointer"
                                : "cursor-default"
                            }`}
                          >

                            <img
                              src={
                                project.previewImage
                              }
                              alt={
                                project.title
                              }
                              className="h-full w-full object-cover transition duration-300 hover:scale-105"
                            />

                            {project.liveUrl && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition hover:opacity-100">

                                <span className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-gray-950">
                                  <ExternalLink className="h-4 w-4" />
                                  Open Live Demo
                                </span>

                              </div>
                            )}

                          </button>
                        ) : (
                          <div className="flex h-40 items-center justify-center bg-gradient-to-br from-green-500/10 to-gray-900">
                            <Code2 className="h-10 w-10 text-green-400/40" />
                          </div>
                        )}

                        <div className="p-4">

                          <h3 className="font-semibold text-white">
                            {project.title}
                          </h3>

                          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                            {project.description}
                          </p>

                          {project.tech?.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">

                              {project.tech
                                .slice(0, 3)
                                .map(
                                  (tech) => (
                                    <span
                                      key={
                                        tech
                                      }
                                      className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-gray-400"
                                    >
                                      {tech}
                                    </span>
                                  )
                                )}

                            </div>
                          )}

                          <div className="mt-4 flex gap-2">

                            {project.liveUrl && (
                              <button
                                type="button"
                                onClick={() =>
                                  openLiveDemo(
                                    project.liveUrl
                                  )
                                }
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 px-3 py-2.5 text-xs font-semibold text-gray-950 transition hover:bg-green-400"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Live Demo
                              </button>
                            )}

                            {project.githubUrl && (
                              <button
                                type="button"
                                onClick={() =>
                                  openLiveDemo(
                                    project.githubUrl
                                  )
                                }
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-gray-300 transition hover:border-green-500/30 hover:text-green-400"
                              >
                                <Code2 className="h-4 w-4" />
                                GitHub
                              </button>
                            )}

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-12 text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                    <Code2 className="h-6 w-6" />
                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    No portfolio projects yet.
                  </p>

                </div>
              )}

            </section>

          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            {/* AVAILABILITY */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <div className="flex items-center gap-3">

                <span
                  className={`h-3 w-3 rounded-full ${
                    developer.isAvailable
                      ? "bg-green-400"
                      : "bg-gray-600"
                  }`}
                />

                <div>

                  <p className="text-sm font-semibold text-white">
                    {developer.isAvailable
                      ? "Available for work"
                      : "Currently unavailable"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {developer.isAvailable
                      ? "Open to new projects and opportunities."
                      : "Check back later for availability."}
                  </p>

                </div>

              </div>

            </section>

            {/* PROFILE INFO */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <h2 className="text-lg font-semibold">
                Profile Information
              </h2>

              <div className="mt-5 space-y-3">

                <div className="rounded-xl bg-white/[0.03] p-4">

                  <p className="text-xs text-gray-600">
                    Username
                  </p>

                  <p className="mt-1 text-sm text-white">
                    @{developer.username}
                  </p>

                </div>

                {developer.location && (
                  <div className="rounded-xl bg-white/[0.03] p-4">

                    <p className="text-xs text-gray-600">
                      Location
                    </p>

                    <p className="mt-1 text-sm text-white">
                      {developer.location}
                    </p>

                  </div>
                )}

              </div>

            </section>

            {/* LINKS */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <h2 className="text-lg font-semibold">
                Links
              </h2>

              <div className="mt-4 space-y-3">

                {developer.linkedinUrl && (
                  <a
                    href={
                      developer.linkedinUrl.startsWith(
                        "http"
                      )
                        ? developer.linkedinUrl
                        : `https://${developer.linkedinUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-gray-400 transition hover:border-green-500/30 hover:text-green-400"
                  >
                    <span className="font-semibold">
                      in
                    </span>

                    LinkedIn

                    <ExternalLink className="ml-auto h-4 w-4" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleMessage}
                  className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-gray-400 transition hover:border-green-500/30 hover:text-green-400"
                >
                  <MessageCircle className="h-5 w-5" />

                  Send Message

                  <ExternalLink className="ml-auto h-4 w-4" />
                </button>

              </div>

            </section>

          </div>

        </div>
      </div>
    </div>
  );
};

export default DeveloperProfile;