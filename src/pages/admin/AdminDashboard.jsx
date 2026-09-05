
import { useEffect, useState } from "react";
import {
  Users,
  Briefcase,
  MessageSquare,
  Trash2,
  Loader2,
  Shield,
} from "lucide-react";

import { API_URL as BASE_API_URL } from "../../utils/config";

const API_URL = `${BASE_API_URL}/admin`;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);

  // ==========================================
  // GET TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // FETCH DASHBOARD STATS
  // ==========================================

  const fetchStats = async () => {
    try {
      const token = getToken();

      if (!token) {
        console.error("Token not found");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("ADMIN STATS:", data);

      if (response.ok && data.success) {
        setStats(data.stats);
      } else {
        console.error("Admin stats error:", data.message);
      }
    } catch (error) {
      console.error("Fetch stats error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH USERS
  // ==========================================

  const fetchUsers = async () => {
    try {
      const token = getToken();

      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("ADMIN USERS:", data);

      if (response.ok && data.success) {
        setUsers(data.users || []);
      } else {
        console.error("Admin users error:", data.message);
      }
    } catch (error) {
      console.error("Fetch users error:", error);
    }
  };

  // ==========================================
  // FETCH PROJECTS
  // ==========================================

  const fetchProjects = async () => {
    try {
      const token = getToken();

      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await fetch(`${API_URL}/projects`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("ADMIN PROJECTS:", data);

      if (response.ok && data.success) {
        setProjects(data.projects || []);
      } else {
        console.error("Admin projects error:", data.message);
      }
    } catch (error) {
      console.error("Fetch projects error:", error);
    }
  };

  // ==========================================
  // FETCH PROPOSALS
  // ==========================================

  const fetchProposals = async () => {
    try {
      const token = getToken();

      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await fetch(`${API_URL}/proposals`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("ADMIN PROPOSALS:", data);

      if (response.ok && data.success) {
        setProposals(data.proposals || []);
      } else {
        console.error("Admin proposals error:", data.message);
      }
    } catch (error) {
      console.error("Fetch proposals error:", error);
    }
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const deleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      const token = getToken();

      if (!token) {
        alert("Authentication required");
        return;
      }

      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("DELETE USER:", data);

      if (response.ok && data.success) {
        setUsers((prev) =>
          prev.filter((user) => user._id !== userId)
        );

        fetchStats();
      } else {
        alert(data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      alert("Failed to delete user");
    }
  };

  // ==========================================
  // DELETE PROJECT
  // ==========================================

  const deleteProject = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      const token = getToken();

      if (!token) {
        alert("Authentication required");
        return;
      }

      const response = await fetch(`${API_URL}/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("DELETE PROJECT:", data);

      if (response.ok && data.success) {
        setProjects((prev) =>
          prev.filter((project) => project._id !== projectId)
        );

        fetchStats();
      } else {
        alert(data.message || "Failed to delete project");
      }
    } catch (error) {
      console.error("Delete project error:", error);
      alert("Failed to delete project");
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchStats();
  }, []);

  // ==========================================
  // TAB DATA
  // ==========================================

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }

    if (activeTab === "projects") {
      fetchProjects();
    }

    if (activeTab === "proposals") {
      fetchProposals();
    }
  }, [activeTab]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-400" />
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <p className="text-sm font-medium text-green-400">
          Admin Panel
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          Platform Management
        </h1>

        <p className="mt-2 text-gray-400">
          Manage users, projects, and platform statistics
        </p>
      </div>

      {/* STATS */}
      {stats && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {/* USERS */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <Users className="h-6 w-6 text-blue-400" />
              </div>

              <div>
                <p className="text-2xl font-bold text-white">
                  {stats.totalUsers ?? 0}
                </p>

                <p className="text-sm text-gray-500">
                  Total Users
                </p>
              </div>

            </div>
          </div>

          {/* DEVELOPERS */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                <Shield className="h-6 w-6 text-green-400" />
              </div>

              <div>
                <p className="text-2xl font-bold text-white">
                  {stats.totalDevelopers ?? 0}
                </p>

                <p className="text-sm text-gray-500">
                  Developers
                </p>
              </div>

            </div>
          </div>

          {/* PROJECTS */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                <Briefcase className="h-6 w-6 text-purple-400" />
              </div>

              <div>
                <p className="text-2xl font-bold text-white">
                  {stats.totalProjects ?? 0}
                </p>

                <p className="text-sm text-gray-500">
                  Projects
                </p>
              </div>

            </div>
          </div>

          {/* PROPOSALS */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                <MessageSquare className="h-6 w-6 text-orange-400" />
              </div>

              <div>
                <p className="text-2xl font-bold text-white">
                  {stats.totalProposals ?? 0}
                </p>

                <p className="text-sm text-gray-500">
                  Proposals
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TABS */}
      <div className="flex gap-2 overflow-x-auto border-b border-white/10">

        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-3 text-sm font-medium transition ${
            activeTab === "dashboard"
              ? "border-b-2 border-green-500 text-green-400"
              : "text-gray-500 hover:text-white"
          }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-3 text-sm font-medium transition ${
            activeTab === "users"
              ? "border-b-2 border-green-500 text-green-400"
              : "text-gray-500 hover:text-white"
          }`}
        >
          Users
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-3 text-sm font-medium transition ${
            activeTab === "projects"
              ? "border-b-2 border-green-500 text-green-400"
              : "text-gray-500 hover:text-white"
          }`}
        >
          Projects
        </button>

        <button
          onClick={() => setActiveTab("proposals")}
          className={`px-4 py-3 text-sm font-medium transition ${
            activeTab === "proposals"
              ? "border-b-2 border-green-500 text-green-400"
              : "text-gray-500 hover:text-white"
          }`}
        >
          Proposals
        </button>

      </div>

      {/* CONTENT */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div>
            <h2 className="mb-4 text-xl font-semibold text-white">
              Recent Activity
            </h2>

            <div className="text-sm text-gray-500">
              Dashboard overview and recent activity would be displayed here.
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <div>

            <h2 className="mb-4 text-xl font-semibold text-white">
              User Management
            </h2>

            {users.length === 0 ? (
              <p className="text-sm text-gray-500">
                No users found
              </p>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>
                    <tr className="border-b border-white/10 text-left">

                      <th className="pb-3 text-sm font-medium text-gray-400">
                        Name
                      </th>

                      <th className="pb-3 text-sm font-medium text-gray-400">
                        Email
                      </th>

                      <th className="pb-3 text-sm font-medium text-gray-400">
                        Role
                      </th>

                      <th className="pb-3 text-sm font-medium text-gray-400">
                        Available
                      </th>

                      <th className="pb-3 text-sm font-medium text-gray-400">
                        Actions
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-white/5"
                      >

                        <td className="py-3 text-sm text-white">
                          {user.name || "Unknown"}
                        </td>

                        <td className="py-3 text-sm text-gray-400">
                          {user.email || "No email"}
                        </td>

                        <td className="py-3 text-sm">

                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              user.role === "admin"
                                ? "bg-red-500/10 text-red-400"
                                : user.role === "company"
                                ? "bg-blue-500/10 text-blue-400"
                                : "bg-green-500/10 text-green-400"
                            }`}
                          >
                            {user.role || "user"}
                          </span>

                        </td>

                        <td className="py-3 text-sm text-gray-400">
                          {user.isAvailable ? "Yes" : "No"}
                        </td>

                        <td className="py-3">

                          <button
                            onClick={() => deleteUser(user._id)}
                            disabled={user.role === "admin"}
                            className={`rounded-lg p-2 transition ${
                              user.role === "admin"
                                ? "cursor-not-allowed text-gray-600"
                                : "text-red-400 hover:bg-red-500/10"
                            }`}
                            title={
                              user.role === "admin"
                                ? "Admin cannot be deleted"
                                : "Delete user"
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>
        )}

        {/* PROJECTS */}
        {activeTab === "projects" && (
          <div>

            <h2 className="mb-4 text-xl font-semibold text-white">
              Project Management
            </h2>

            {projects.length === 0 ? (
              <p className="text-sm text-gray-500">
                No projects found
              </p>
            ) : (
              <div className="space-y-4">

                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4"
                  >

                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {project.title || "Untitled Project"}
                      </h3>

                      <p className="text-xs text-gray-500">
                        {project.owner?.name || "Unknown"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">

                      <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">
                        {project.status || "Unknown"}
                      </span>

                      <button
                        onClick={() => deleteProject(project._id)}
                        className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
                        title="Delete project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>
        )}

        {/* PROPOSALS */}
        {activeTab === "proposals" && (
          <div>

            <h2 className="mb-4 text-xl font-semibold text-white">
              Proposal Management
            </h2>

            {proposals.length === 0 ? (
              <p className="text-sm text-gray-500">
                No proposals found
              </p>
            ) : (
              <div className="space-y-4">

                {proposals.map((proposal) => (
                  <div
                    key={proposal._id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4"
                  >

                    <div>

                      <h3 className="text-sm font-semibold text-white">
                        {proposal.title || "Untitled Proposal"}
                      </h3>

                      <p className="text-xs text-gray-500">
                        {proposal.sender?.name || "Unknown"} →{" "}
                        {proposal.receiver?.name || "Unknown"}
                      </p>

                    </div>

                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        proposal.status === "Pending"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : proposal.status === "Accepted"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {proposal.status || "Unknown"}
                    </span>

                  </div>
                ))}

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;

