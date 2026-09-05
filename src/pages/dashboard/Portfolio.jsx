import { useEffect, useState } from "react";

import {
  Plus,
  ExternalLink,
  Code2,
  MoreHorizontal,
  FolderKanban,
  X,
  Trash2,
  Edit3,
  Loader2,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

import { API_URL as BASE_API_URL } from "../../utils/config";

const API_URL = `${BASE_API_URL}/projects`;

const emptyForm = {
  title: "",
  description: "",
  tech: "",
  status: "In Progress",
  githubUrl: "",
  liveUrl: "",
};

const Portfolio = () => {
  const { user } = useAuth();
  
  // ==========================================
  // STATE
  // ==========================================

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [editingProject, setEditingProject] = useState(null);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(null);

  const [openMenu, setOpenMenu] = useState(null);

  const [form, setForm] = useState(emptyForm);

  // ==========================================
  // GET PROJECTS
  // ==========================================

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      // For companies, fetch by company ID; for developers, use regular endpoint
      let url = API_URL;
      if (user?.role === "company") {
        // Company projects endpoint (will need to be added to backend)
        url = `${API_URL}/company`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }

      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Projects fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD PROJECTS
  // ==========================================

  useEffect(() => {
    fetchProjects();
  }, []);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // NORMALIZE URL
  // ==========================================

  const normalizeUrl = (url) => {
    if (!url) return "";

    const trimmed = url.trim();

    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://")
    ) {
      return trimmed;
    }

    return `https://${trimmed}`;
  };

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const openAddModal = () => {
    setEditingProject(null);

    setForm({
      ...emptyForm,
    });

    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (project) => {
    setEditingProject(project);

    setForm({
      title: project.title || "",

      description: project.description || "",

      tech: project.tech?.join(", ") || "",

      status: project.status || "In Progress",

      githubUrl: project.githubUrl || "",

      liveUrl: project.liveUrl || "",
    });

    setOpenMenu(null);

    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);

    setEditingProject(null);

    setForm({
      ...emptyForm,
    });
  };

  // ==========================================
  // ADD / UPDATE PROJECT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const payload = {
        title: form.title.trim(),

        description: form.description.trim(),

        tech: form.tech
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        status: form.status,

        githubUrl: form.githubUrl.trim(),

        liveUrl: form.liveUrl.trim(),
      };

      // Add companyId for company users
      if (user?.role === "company") {
        payload.companyId = user.companyId; // Assuming user has companyId field
      }

      // ========================================
      // UPDATE PROJECT
      // ========================================

      if (editingProject) {
        const response = await fetch(
          `${API_URL}/${editingProject._id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",

              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(
            data.message ||
              "Projectni yangilashda xatolik"
          );

          return;
        }

        if (data.success) {
          setProjects((prev) =>
            prev.map((project) =>
              project._id === editingProject._id
                ? data.project
                : project
            )
          );

          setShowModal(false);

          setEditingProject(null);

          setForm({
            ...emptyForm,
          });
        }

        return;
      }

      // ========================================
      // CREATE PROJECT
      // ========================================

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Project qo'shishda xatolik"
        );

        return;
      }

      if (data.success) {
        setProjects((prev) => [
          data.project,
          ...prev,
        ]);

        setForm({
          ...emptyForm,
        });

        setShowModal(false);
      }
    } catch (error) {
      console.error("Project save error:", error);

      alert(
        "Server bilan bog'lanishda xatolik"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE PROJECT
  // ==========================================

  const handleDelete = async (projectId) => {
    const confirmed = window.confirm(
      "Bu projectni o'chirishni xohlaysizmi?\n\nBu amalni qaytarib bo'lmaydi."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(projectId);

      setOpenMenu(null);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/${projectId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Projectni o'chirishda xatolik"
        );

        return;
      }

      if (data.success) {
        setProjects((prev) =>
          prev.filter(
            (project) =>
              project._id !== projectId
          )
        );
      }
    } catch (error) {
      console.error(
        "Delete project error:",
        error
      );

      alert(
        "Server bilan bog'lanishda xatolik"
      );
    } finally {
      setDeleting(null);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-20">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <p className="text-sm font-medium text-green-400">
            {user?.role === "company" ? "Manage your company projects" : "Showcase your work"}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {user?.role === "company" ? "Company Projects" : "Portfolio"}
          </h1>

          <p className="mt-2 text-gray-400">
            {user?.role === "company" 
              ? "Display your company's projects and achievements." 
              : "Show companies and clients what you can build."}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-gray-950 shadow-lg shadow-green-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 hover:from-green-300 hover:to-emerald-400"
        >
          <Plus className="h-4 w-4" />

          Add Project
        </button>

      </div>

      {/* =====================================
          LOADING
      ===================================== */}

      {loading && (
        <div className="flex justify-center py-20">

          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-green-400" />

        </div>
      )}

      {/* =====================================
          EMPTY
      ===================================== */}

      {!loading &&
        projects.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] shadow-xl shadow-black/20 backdrop-blur-sm py-20 text-center">

            <FolderKanban className="mx-auto h-12 w-12 text-gray-600" />

            <h2 className="mt-4 text-lg font-semibold text-white">
              No projects yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add your first project to your
              portfolio.
            </p>

            <button
              onClick={openAddModal}
              className="mt-6 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-gray-950 shadow-lg shadow-green-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 hover:from-green-300 hover:to-emerald-400"
            >
              Add Project
            </button>

          </div>
        )}

      {/* =====================================
          PROJECT CARDS
      ===================================== */}

      {!loading &&
        projects.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {projects.map((project) => (
              <div
                key={project._id}
                className="group overflow-visible rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] shadow-xl shadow-black/20 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-green-500/30"
              >

                {/* =================================
                    PREVIEW
                ================================= */}

                <div className="relative h-48 overflow-hidden rounded-t-2xl border-b border-white/10 bg-gray-950">

                  {project.previewImage ? (
                    <a
                      href={normalizeUrl(
                        project.liveUrl
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full w-full"
                    >

                      <img
                        src={project.previewImage}
                        alt={`${project.title} preview`}
                        className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition duration-300 group-hover:bg-black/30 group-hover:opacity-100">

                        <span className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/70 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md">

                          <ExternalLink className="h-4 w-4 text-green-400" />

                          Open Website

                        </span>

                      </div>

                    </a>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-green-500/10 via-gray-900 to-gray-950">

                      <FolderKanban className="h-14 w-14 text-green-400/40" />

                      <p className="mt-3 text-xs text-gray-600">
                        Preview unavailable
                      </p>

                    </div>
                  )}

                </div>

                {/* =================================
                    CONTENT
                ================================= */}

                <div className="p-5">

                  {/* TITLE + MENU */}

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <h2 className="truncate font-semibold text-white">
                        {project.title}
                      </h2>

                      <span className="mt-2 inline-block rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">
                        {project.status}
                      </span>

                    </div>

                    {/* =============================
                        THREE DOT MENU
                    ============================= */}

                    <div className="relative shrink-0">

                      <button
                        onClick={() =>
                          setOpenMenu(
                            openMenu === project._id
                              ? null
                              : project._id
                          )
                        }
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-white"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>

                      {/* MENU */}

                      {openMenu === project._id && (
                        <div className="absolute right-0 top-11 z-30 w-48 overflow-hidden rounded-xl border border-white/10 bg-gray-900 p-1.5 shadow-2xl">

                          {/* EDIT */}

                          <button
                            onClick={() =>
                              openEditModal(project)
                            }
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                          >
                            <Edit3 className="h-4 w-4" />

                            Edit Project
                          </button>

                          {/* OPEN WEBSITE */}

                          {project.liveUrl && (
                            <a
                              href={normalizeUrl(
                                project.liveUrl
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() =>
                                setOpenMenu(null)
                              }
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                            >
                              <ExternalLink className="h-4 w-4" />

                              Open Website
                            </a>
                          )}

                          <div className="my-1 border-t border-white/10" />

                          {/* DELETE */}

                          <button
                            onClick={() =>
                              handleDelete(
                                project._id
                              )
                            }
                            disabled={
                              deleting ===
                              project._id
                            }
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                          >

                            {deleting ===
                            project._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}

                            {deleting ===
                            project._id
                              ? "Deleting..."
                              : "Delete Project"}

                          </button>

                        </div>
                      )}

                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-500">
                    {project.description}
                  </p>

                  {/* TECHNOLOGIES */}

                  {project.tech?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">

                      {project.tech.map(
                        (technology, index) => (
                          <span
                            key={`${technology}-${index}`}
                            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400"
                          >
                            {technology}
                          </span>
                        )
                      )}

                    </div>
                  )}

                  {/* LINKS */}

                  {(project.githubUrl ||
                    project.liveUrl) && (
                    <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">

                      {/* GITHUB */}

                      {project.githubUrl && (
                        <a
                          href={normalizeUrl(
                            project.githubUrl
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-400"
                        >
                          <Code2 className="h-4 w-4" />

                          GitHub
                        </a>
                      )}

                      {/* LIVE */}

                      {project.liveUrl && (
                        <a
                          href={normalizeUrl(
                            project.liveUrl
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-400"
                        >
                          Live Demo

                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}

                    </div>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      {/* =====================================
          ADD / EDIT MODAL
      ===================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-b from-gray-900 to-gray-950 p-6 shadow-2xl shadow-black/60 ring-1 ring-white/5">

            {/* =================================
                MODAL HEADER
            ================================= */}

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-white">

                  {editingProject
                    ? "Edit Project"
                    : "Add Project"}

                </h2>

                <p className="mt-1 text-sm text-gray-500">

                  {editingProject
                    ? "Update your project information."
                    : "Add a new project to your portfolio."}

                </p>

              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* =================================
                FORM
            ================================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* TITLE */}

              <div>

                <label className="mb-2 block text-sm text-gray-400">
                  Project title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Nexora Platform"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-green-500/50"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-sm text-gray-400">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Describe your project..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-green-500/50"
                />

              </div>

              {/* TECHNOLOGIES */}

              <div>

                <label className="mb-2 block text-sm text-gray-400">
                  Technologies
                </label>

                <input
                  name="tech"
                  value={form.tech}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-green-500/50"
                />

                <p className="mt-1 text-xs text-gray-600">
                  Separate technologies with commas.
                </p>

              </div>

              {/* STATUS */}

              <div>

                <label className="mb-2 block text-sm text-gray-400">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition focus:border-green-500/50"
                >

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Active">
                    Active
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                </select>

              </div>

              {/* GITHUB */}

              <div>

                <label className="mb-2 block text-sm text-gray-400">
                  GitHub URL
                </label>

                <input
                  name="githubUrl"
                  value={form.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-green-500/50"
                />

              </div>

              {/* LIVE URL */}

              <div>

                <label className="mb-2 block text-sm text-gray-400">
                  Live Demo URL
                </label>

                <input
                  name="liveUrl"
                  value={form.liveUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-green-500/50"
                />

                <p className="mt-1 text-xs text-gray-600">
                  Live URL berilsa Home Page
                  screenshot avtomatik yaratiladi.
                </p>

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-3">

                {/* CANCEL */}

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-gray-300 transition-all duration-200 hover:border-white/20 hover:bg-white/10 disabled:opacity-50"
                >
                  Cancel
                </button>

                {/* SAVE */}

                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 px-4 py-3 text-sm font-semibold text-gray-950 shadow-lg shadow-green-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 hover:from-green-300 hover:to-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {saving && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {saving
                    ? editingProject
                      ? "Updating..."
                      : "Creating..."
                    : editingProject
                    ? "Update Project"
                    : "Add Project"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Portfolio;