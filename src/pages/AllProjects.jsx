import { useEffect, useState } from "react";

import {
  Heart,
  MessageCircle,
  ExternalLink,
  Code2,
  User,
  Building2,
  Grid,
  Terminal,
  Send,
  Trash2,
  X,
  LogIn,
} from "lucide-react";

import { Link } from "react-router-dom";

import { API_URL } from "../utils/config";

const AllProjects = () => {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [filter, setFilter] =
    useState("all");

  const [error, setError] =
    useState("");

  // ==========================================
  // COMMENTS
  // ==========================================

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [comments, setComments] =
    useState([]);

  const [commentsLoading, setCommentsLoading] =
    useState(false);

  const [commentText, setCommentText] =
    useState("");

  const [commentLoading, setCommentLoading] =
    useState(false);

  const [commentError, setCommentError] =
    useState("");

  // ==========================================
  // LIKE LOADING
  // ==========================================

  const [likeLoading, setLikeLoading] =
    useState({});

  // ==========================================
  // USER
  // ==========================================

  const getCurrentUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("user") ||
          "null"
      );
    } catch {
      return null;
    }
  };

  const getToken = () => {
    return localStorage.getItem(
      "token"
    );
  };

  // ==========================================
  // FETCH ALL PROJECTS
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const fetchProjects = async () => {
      try {
        setLoading(true);

        setError("");

        const url =
          `${API_URL}/projects/all`;

        console.log(
          "📡 Fetching projects:",
          url
        );

        const response =
          await fetch(url);

        const data =
          await response.json();

        if (!response.ok) {
          console.error(
            "❌ Projects API error:",
            response.status,
            data
          );

          throw new Error(
            data.message ||
              `Projects API error: ${response.status}`
          );
        }

        console.log(
          "✅ Projects:",
          data
        );

        if (!cancelled) {
          setProjects(
            Array.isArray(
              data.projects
            )
              ? data.projects
              : []
          );
        }
      } catch (error) {
        console.error(
          "❌ Fetch projects error:",
          error
        );

        if (!cancelled) {
          setError(
            error?.message ||
              "Failed to load projects"
          );

          setProjects([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredProjects =
    projects.filter(
      (project) => {
        if (
          filter === "all"
        ) {
          return true;
        }

        if (
          filter ===
          "developers"
        ) {
          return (
            project.ownerRole ===
              "developer" ||
            Boolean(
              project.developerId
            )
          );
        }

        if (
          filter ===
          "companies"
        ) {
          return (
            project.ownerRole ===
              "company" ||
            Boolean(
              project.companyId
            )
          );
        }

        return true;
      }
    );

  // ==========================================
  // CHECK LIKE
  // ==========================================

  const isProjectLiked = (
    project
  ) => {
    const user =
      getCurrentUser();

    if (!user?.id) {
      return false;
    }

    if (
      !Array.isArray(
        project.likedBy
      )
    ) {
      return false;
    }

    return project.likedBy.some(
      (item) => {
        const id =
          typeof item ===
          "object"
            ? item?._id
            : item;

        return (
          id?.toString() ===
          user.id.toString()
        );
      }
    );
  };

  // ==========================================
  // ❤️ LIKE / UNLIKE
  // ==========================================

  const handleLike = async (
    project
  ) => {
    const token =
      getToken();

    if (!token) {
      alert(
        "Like bosish uchun avval login qiling."
      );

      return;
    }

    const projectId =
      project._id ||
      project.id;

    if (!projectId) {
      return;
    }

    if (
      likeLoading[projectId]
    ) {
      return;
    }

    const liked =
      isProjectLiked(
        project
      );

    setLikeLoading(
      (prev) => ({
        ...prev,
        [projectId]:
          true,
      })
    );

    try {
      const response =
        await fetch(
          `${API_URL}/projects/${projectId}/like`,
          {
            method:
              liked
                ? "DELETE"
                : "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Like operation failed"
        );
      }

      const user =
        getCurrentUser();

      const userId =
        user?.id;

      setProjects(
        (prev) =>
          prev.map(
            (item) => {
              const itemId =
                item._id ||
                item.id;

              if (
                itemId?.toString() !==
                projectId.toString()
              ) {
                return item;
              }

              let likedBy =
                Array.isArray(
                  item.likedBy
                )
                  ? [
                      ...item.likedBy,
                    ]
                  : [];

              if (
                data.liked
              ) {
                const exists =
                  likedBy.some(
                    (entry) => {
                      const id =
                        typeof entry ===
                        "object"
                          ? entry?._id
                          : entry;

                      return (
                        id?.toString() ===
                        userId?.toString()
                      );
                    }
                  );

                if (
                  !exists &&
                  userId
                ) {
                  likedBy.push(
                    userId
                  );
                }
              } else {
                likedBy =
                  likedBy.filter(
                    (entry) => {
                      const id =
                        typeof entry ===
                        "object"
                          ? entry?._id
                          : entry;

                      return (
                        id?.toString() !==
                        userId?.toString()
                      );
                    }
                  );
              }

              return {
                ...item,

                likedBy,

                likes:
                  data.likesCount ??
                  likedBy.length,
              };
            }
          )
      );
    } catch (error) {
      console.error(
        "❌ Like error:",
        error
      );

      alert(
        error?.message ||
          "Like qilishda xatolik"
      );
    } finally {
      setLikeLoading(
        (prev) => ({
          ...prev,
          [projectId]:
            false,
        })
      );
    }
  };

  // ==========================================
  // 💬 OPEN COMMENTS
  // ==========================================

  const openComments = async (
    project
  ) => {
    const projectId =
      project._id ||
      project.id;

    setSelectedProject(
      project
    );

    setComments([]);

    setCommentText("");

    setCommentError("");

    setCommentsLoading(
      true
    );

    try {
      const response =
        await fetch(
          `${API_URL}/projects/${projectId}/comments`
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Comments loading failed"
        );
      }

      setComments(
        Array.isArray(
          data.comments
        )
          ? data.comments
          : []
      );
    } catch (error) {
      console.error(
        "❌ Comments error:",
        error
      );

      setCommentError(
        error?.message ||
          "Comments loading failed"
      );
    } finally {
      setCommentsLoading(
        false
      );
    }
  };

  // ==========================================
  // 💬 ADD COMMENT
  // ==========================================

  const handleAddComment =
    async () => {
      const token =
        getToken();

      if (!token) {
        setCommentError(
          "Comment yozish uchun avval login qiling."
        );

        return;
      }

      if (
        !commentText.trim()
      ) {
        return;
      }

      if (
        !selectedProject
      ) {
        return;
      }

      const projectId =
        selectedProject._id ||
        selectedProject.id;

      setCommentLoading(
        true
      );

      setCommentError("");

      try {
        const response =
          await fetch(
            `${API_URL}/projects/${projectId}/comments`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify(
                {
                  content:
                    commentText.trim(),
                }
              ),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Comment yuborilmadi"
          );
        }

        if (
          data.comment
        ) {
          setComments(
            (prev) => [
              data.comment,
              ...prev,
            ]
          );
        }

        setCommentText("");

        setProjects(
          (prev) =>
            prev.map(
              (project) => {
                const id =
                  project._id ||
                  project.id;

                if (
                  id?.toString() !==
                  projectId.toString()
                ) {
                  return project;
                }

                return {
                  ...project,

                  comments:
                    data.commentsCount ??
                    ((project.comments ||
                      0) +
                      1),
                };
              }
            )
        );

        setSelectedProject(
          (prev) =>
            prev
              ? {
                  ...prev,

                  comments:
                    data.commentsCount ??
                    ((prev.comments ||
                      0) +
                      1),
                }
              : null
        );
      } catch (error) {
        console.error(
          "❌ Add comment error:",
          error
        );

        setCommentError(
          error?.message ||
            "Comment yuborishda xatolik"
        );
      } finally {
        setCommentLoading(
          false
        );
      }
    };

  // ==========================================
  // 🗑️ DELETE COMMENT
  // ==========================================

  const handleDeleteComment =
    async (
      commentId
    ) => {
      const token =
        getToken();

      if (!token) {
        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/projects/comments/${commentId}`,
            {
              method:
                "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Comment o'chirilmadi"
          );
        }

        setComments(
          (prev) =>
            prev.filter(
              (comment) =>
                comment._id !==
                commentId
            )
        );

        const projectId =
          selectedProject?._id ||
          selectedProject?.id;

        if (
          projectId
        ) {
          setProjects(
            (prev) =>
              prev.map(
                (project) => {
                  const id =
                    project._id ||
                    project.id;

                  if (
                    id?.toString() !==
                    projectId.toString()
                  ) {
                    return project;
                  }

                  return {
                    ...project,

                    comments:
                      data.commentsCount ??
                      Math.max(
                        0,
                        (project.comments ||
                          0) -
                          1
                      ),
                  };
                }
              )
          );

          setSelectedProject(
            (prev) =>
              prev
                ? {
                    ...prev,

                    comments:
                      data.commentsCount ??
                      Math.max(
                        0,
                        (prev.comments ||
                          0) -
                          1
                      ),
                  }
                : null
          );
        }
      } catch (error) {
        console.error(
          "❌ Delete comment error:",
          error
        );

        alert(
          error?.message ||
            "Comment o'chirishda xatolik"
        );
      }
    };

  // ==========================================
  // ENTER TO SEND
  // ==========================================

  const handleCommentKeyDown =
    (event) => {
      if (
        event.key ===
          "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();

        handleAddComment();
      }
    };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#050d18] via-[#081525] to-[#050d18] cyber-grid px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="relative mx-auto h-16 w-16">
                <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-2 border-green-500/20 border-t-green-400" />

                <div
                  className="absolute inset-2 h-12 w-12 animate-spin rounded-full border-2 border-green-500/30 border-t-green-500"
                  style={{
                    animationDirection:
                      "reverse",
                  }}
                />
              </div>

              <div className="mt-6 animate-pulse font-mono text-sm text-green-400">
                <Terminal className="mr-2 inline-block h-4 w-4" />

                Loading projects...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d18] via-[#081525] to-[#050d18] cyber-grid px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 animate-slide-in">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10 animate-pulse-glow">
              <Terminal className="h-5 w-5 text-green-400" />
            </div>

            <h1 className="font-mono text-3xl font-bold text-glow sm:text-4xl">
              All Projects
            </h1>
          </div>

          <p className="mt-2 font-mono text-sm text-gray-400">
            <span className="text-green-400">
              $
            </span>{" "}
            Discover amazing projects from
            developers and companies
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <div className="font-mono text-sm text-red-400">
              ❌ {error}
            </div>

            <div className="mt-2 break-all font-mono text-xs text-gray-500">
              API:{" "}
              {API_URL}/projects/all
            </div>
          </div>
        )}

        {/* FILTER */}

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() =>
              setFilter("all")
            }
            className={`btn-cyber flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-sm ${
              filter === "all"
                ? "border-green-500/50 bg-green-500/20 text-green-400"
                : "border-white/10 bg-white/5 text-gray-400 hover:border-green-500/30"
            }`}
          >
            <Grid className="h-4 w-4" />
            All Projects
          </button>

          <button
            onClick={() =>
              setFilter(
                "developers"
              )
            }
            className={`btn-cyber flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-sm ${
              filter ===
              "developers"
                ? "border-green-500/50 bg-green-500/20 text-green-400"
                : "border-white/10 bg-white/5 text-gray-400 hover:border-green-500/30"
            }`}
          >
            <User className="h-4 w-4" />
            Developers
          </button>

          <button
            onClick={() =>
              setFilter(
                "companies"
              )
            }
            className={`btn-cyber flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-sm ${
              filter ===
              "companies"
                ? "border-green-500/50 bg-green-500/20 text-green-400"
                : "border-white/10 bg-white/5 text-gray-400 hover:border-green-500/30"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Companies
          </button>
        </div>

        {/* PROJECTS */}

        {filteredProjects.length >
        0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProjects.map(
              (
                project,
                index
              ) => {
                const projectId =
                  project._id ||
                  project.id;

                const token =
                  getToken();

                const isLiked =
                  isProjectLiked(
                    project
                  );

                return (
                  <div
                    key={
                      projectId ||
                      index
                    }
                    className="card-cyber glass-cyber group overflow-hidden rounded-2xl animate-slide-in"
                    style={{
                      animationDelay: `${
                        0.2 +
                        index *
                          0.05
                      }s`,
                    }}
                  >
                    {/* IMAGE */}

                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-green-500/5 to-gray-900">
                      {project.previewImage ? (
                        <img
                          src={
                            project.previewImage
                          }
                          alt={
                            project.title ||
                            "Project"
                          }
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <div className="relative">
                            <Code2 className="h-20 w-20 animate-pulse text-green-400/20" />

                            <div className="absolute inset-0 flex items-center justify-center">
                              <Terminal className="h-8 w-8 text-green-400/30" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="animate-scan-line h-full w-full bg-gradient-to-b from-transparent via-green-400/5 to-transparent" />
                      </div>

                      {/* HOVER */}

                      <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/70 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                        {project.liveUrl && (
                          <a
                            href={
                              project.liveUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-cyber flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/20 px-4 py-2 text-sm text-green-400 hover:bg-green-500/30"
                          >
                            <ExternalLink className="h-4 w-4" />

                            <span className="font-mono">
                              Live Demo
                            </span>
                          </a>
                        )}

                        {project.githubUrl && (
                          <a
                            href={
                              project.githubUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-cyber flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
                          >
                            <Code2 className="h-4 w-4" />

                            <span className="font-mono">
                              GitHub
                            </span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* CONTENT */}

                    <div className="p-4">

                      <h3 className="line-clamp-1 font-mono text-sm font-semibold text-white">
                        {project.title ||
                          "Untitled Project"}
                      </h3>

                      <p className="mt-2 line-clamp-2 font-mono text-xs text-gray-500">
                        {project.description ||
                          "No description available."}
                      </p>

                      {/* AUTHOR */}

                      <div className="mt-3 flex items-center gap-2">
                        {project.developerName ? (
                          <Link
                            to={`/developers/${project.developerUsername}`}
                            className="flex items-center gap-2 font-mono text-xs text-gray-400 transition hover:text-green-400"
                          >
                            <User className="h-3 w-3" />

                            {
                              project.developerName
                            }
                          </Link>
                        ) : project.companyName ? (
                          <Link
                            to={`/companies/${project.companyId}`}
                            className="flex items-center gap-2 font-mono text-xs text-gray-400 transition hover:text-green-400"
                          >
                            <Building2 className="h-3 w-3" />

                            {
                              project.companyName
                            }
                          </Link>
                        ) : (
                          <span className="font-mono text-xs text-gray-500">
                            Unknown author
                          </span>
                        )}
                      </div>

                      {/* TECH */}

                      {Array.isArray(
                        project.tech
                      ) &&
                        project.tech.length >
                          0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {project.tech
                              .slice(
                                0,
                                3
                              )
                              .map(
                                (
                                  tech,
                                  techIndex
                                ) => (
                                  <span
                                    key={`${tech}-${techIndex}`}
                                    className="rounded-lg border border-green-500/20 bg-green-500/5 px-2 py-1 font-mono text-xs text-green-400"
                                  >
                                    {
                                      tech
                                    }
                                  </span>
                                )
                              )}

                            {project
                              .tech
                              .length >
                              3 && (
                              <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 font-mono text-xs text-gray-400">
                                +
                                {project
                                  .tech
                                  .length -
                                  3}
                              </span>
                            )}
                          </div>
                        )}

                      {/* ACTIONS */}

                      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">

                        <div className="flex items-center gap-4">

                          {/* ❤️ LIKE */}

                          <button
                            onClick={() =>
                              handleLike(
                                project
                              )
                            }
                            disabled={
                              Boolean(
                                likeLoading[
                                  projectId
                                ]
                              )
                            }
                            className={`group/like flex items-center gap-1.5 font-mono text-xs transition ${
                              isLiked
                                ? "text-red-400"
                                : "text-gray-500 hover:text-red-400"
                            }`}
                          >
                            <Heart
                              className={`h-4 w-4 transition ${
                                isLiked
                                  ? "fill-current"
                                  : ""
                              } ${
                                likeLoading[
                                  projectId
                                ]
                                  ? "animate-pulse"
                                  : "group-hover/like:scale-110"
                              }`}
                            />

                            <span>
                              {project.likes ||
                                0}
                            </span>
                          </button>

                          {/* 💬 COMMENTS */}

                          <button
                            onClick={() =>
                              openComments(
                                project
                              )
                            }
                            className="group/comment flex items-center gap-1.5 font-mono text-xs text-gray-500 transition hover:text-blue-400"
                          >
                            <MessageCircle className="h-4 w-4 transition group-hover/comment:scale-110" />

                            <span>
                              {project.comments ||
                                0}
                            </span>
                          </button>

                        </div>

                        {!token && (
                          <Link
                            to="/login"
                            className="flex items-center gap-1 font-mono text-[10px] text-gray-600 hover:text-green-400"
                          >
                            <LogIn className="h-3 w-3" />

                            Login
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <div className="glass-cyber rounded-2xl border border-dashed border-green-500/20 py-16 text-center">
            <Terminal className="mx-auto h-10 w-10 text-green-400/30" />

            <p className="mt-4 font-mono text-sm text-gray-500">
              {error
                ? "Unable to load projects."
                : "No projects available yet."}
            </p>
          </div>
        )}

        {/* ==================================================
            COMMENT MODAL
        ================================================== */}

        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() =>
              setSelectedProject(
                null
              )
            }
          >
            <div
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-green-500/20 bg-[#081525] shadow-2xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <div className="min-w-0">
                  <h2 className="font-mono text-lg font-semibold text-white">
                    Comments
                  </h2>

                  <p className="mt-1 truncate font-mono text-xs text-gray-500">
                    {
                      selectedProject.title
                    }
                  </p>
                </div>

                <button
                  onClick={() =>
                    setSelectedProject(
                      null
                    )
                  }
                  className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* COMMENT LIST */}

              <div className="max-h-[55vh] overflow-y-auto p-4">

                {commentsLoading ? (
                  <div className="py-10 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-green-500/20 border-t-green-400" />

                    <p className="mt-3 font-mono text-xs text-gray-500">
                      Loading comments...
                    </p>
                  </div>
                ) : comments.length ===
                  0 ? (
                  <div className="py-10 text-center">
                    <MessageCircle className="mx-auto h-10 w-10 text-gray-700" />

                    <p className="mt-3 font-mono text-xs text-gray-500">
                      No comments yet.
                    </p>

                    <p className="mt-1 font-mono text-[10px] text-gray-700">
                      Be the first to
                      comment.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {comments.map(
                      (
                        comment
                      ) => {
                        const user =
                          getCurrentUser();

                        const authorId =
                          comment
                            .author
                            ?._id ||
                          comment
                            .author
                            ?.id;

                        const isMyComment =
                          authorId?.toString() ===
                          user?.id?.toString();

                        return (
                          <div
                            key={
                              comment._id
                            }
                            className="rounded-xl border border-white/5 bg-white/[0.02] p-3"
                          >
                            <div className="flex items-start gap-3">

                              {/* AVATAR */}

                              {comment
                                .author
                                ?.avatar ? (
                                <img
                                  src={
                                    comment
                                      .author
                                      .avatar
                                  }
                                  alt=""
                                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                                />
                              ) : (
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10">
                                  <User className="h-4 w-4 text-green-400" />
                                </div>
                              )}

                              <div className="min-w-0 flex-1">

                                {/* NAME */}

                                <div className="flex items-center justify-between gap-2">
                                  <div>
                                    <p className="font-mono text-xs font-semibold text-white">
                                      {comment
                                        .author
                                        ?.name ||
                                        "Unknown User"}
                                    </p>

                                    {comment
                                      .author
                                      ?.username && (
                                      <p className="font-mono text-[10px] text-gray-600">
                                        @
                                        {
                                          comment
                                            .author
                                            .username
                                        }
                                      </p>
                                    )}
                                  </div>

                                  {/* DELETE */}

                                  {isMyComment && (
                                    <button
                                      onClick={() =>
                                        handleDeleteComment(
                                          comment._id
                                        )
                                      }
                                      className="rounded-lg p-1.5 text-gray-600 transition hover:bg-red-500/10 hover:text-red-400"
                                      title="Delete comment"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>

                                {/* CONTENT */}

                                <p className="mt-2 whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-gray-400">
                                  {
                                    comment.content
                                  }
                                </p>

                                {/* DATE */}

                                <p className="mt-2 font-mono text-[9px] text-gray-700">
                                  {comment.createdAt
                                    ? new Date(
                                        comment.createdAt
                                      ).toLocaleString()
                                    : ""}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>

              {/* INPUT */}

              <div className="border-t border-white/10 p-4">

                {commentError && (
                  <div className="mb-3 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 font-mono text-[10px] text-red-400">
                    ❌{" "}
                    {commentError}
                  </div>
                )}

                {getToken() ? (
                  <div className="flex items-end gap-2">

                    <textarea
                      value={
                        commentText
                      }
                      onChange={(
                        event
                      ) =>
                        setCommentText(
                          event
                            .target
                            .value
                        )
                      }
                      onKeyDown={
                        handleCommentKeyDown
                      }
                      placeholder="Write a comment..."
                      rows={2}
                      maxLength={1000}
                      className="min-h-[46px] flex-1 resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-2 font-mono text-xs text-white outline-none placeholder:text-gray-700 focus:border-green-500/40"
                    />

                    <button
                      onClick={
                        handleAddComment
                      }
                      disabled={
                        commentLoading ||
                        !commentText.trim()
                      }
                      className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Send
                        className={
                          commentLoading
                            ? "h-4 w-4 animate-pulse"
                            : "h-4 w-4"
                        }
                      />
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                    <p className="font-mono text-xs text-gray-500">
                      Comment yozish
                      uchun login
                      qiling.
                    </p>

                    <Link
                      to="/login"
                      className="mt-3 inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 font-mono text-xs text-green-400 hover:bg-green-500/20"
                    >
                      <LogIn className="h-3.5 w-3.5" />
                      Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects;