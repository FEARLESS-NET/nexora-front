import { useEffect, useState } from "react";
import {
  Briefcase,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Filter,
} from "lucide-react";

import { API_URL } from "../../utils/config";

const Proposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, sent, received
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    duration: "",
    receiverId: "",
    projectId: "",
  });

  const [developers, setDevelopers] = useState([]);

  // Fetch proposals
  const fetchProposals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/proposals?type=${filter === "all" ? "" : filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setProposals(data.proposals || []);
      }
    } catch (error) {
      console.error("Fetch proposals error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch developers for dropdown
  const fetchDevelopers = async () => {
    try {
      const response = await fetch(`${API_URL}/developers`);
      const data = await response.json();

      if (data.success) {
        setDevelopers(data.developers || []);
      }
    } catch (error) {
      console.error("Fetch developers error:", error);
    }
  };

  useEffect(() => {
    fetchProposals();
    fetchDevelopers();
  }, [filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/proposals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          budget: form.budget.trim(),
          duration: form.duration.trim(),
          receiverId: form.receiverId,
          projectId: form.projectId || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowModal(false);
        setForm({
          title: "",
          description: "",
          budget: "",
          duration: "",
          receiverId: "",
          projectId: "",
        });
        fetchProposals();
      }
    } catch (error) {
      console.error("Send proposal error:", error);
      alert("Failed to send proposal");
    } finally {
      setSaving(false);
    }
  };

  const handleAccept = async (proposalId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/proposals/${proposalId}/accept`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchProposals();
      }
    } catch (error) {
      console.error("Accept proposal error:", error);
    }
  };

  const handleReject = async (proposalId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/proposals/${proposalId}/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchProposals();
      }
    } catch (error) {
      console.error("Reject proposal error:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "Accepted":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "Rejected":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "Accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "Rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-20">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-green-400">Proposals</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Proposals & Offers
          </h1>
          <p className="mt-2 text-gray-400">
            Manage your proposals and offers with developers
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex w-fit items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-green-400"
        >
          <Send className="h-4 w-4" />
          Send Proposal
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Filter className="h-5 w-5 text-gray-500" />
        <div className="flex gap-2">
          <button
            onClick={() => handleFilterChange("all")}
            className={`rounded-lg px-4 py-2 text-sm transition ${
              filter === "all"
                ? "bg-green-500 text-gray-950"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange("sent")}
            className={`rounded-lg px-4 py-2 text-sm transition ${
              filter === "sent"
                ? "bg-green-500 text-gray-950"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            Sent
          </button>
          <button
            onClick={() => handleFilterChange("received")}
            className={`rounded-lg px-4 py-2 text-sm transition ${
              filter === "received"
                ? "bg-green-500 text-gray-950"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            Received
          </button>
        </div>
      </div>

      {/* Proposals List */}
      {proposals.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] py-20 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-gray-600" />
          <h2 className="mt-4 text-lg font-semibold text-white">No proposals yet</h2>
          <p className="mt-2 text-sm text-gray-500">
            {filter === "sent"
              ? "You haven't sent any proposals yet"
              : filter === "received"
              ? "You haven't received any proposals yet"
              : "No proposals found"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal._id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">
                      {proposal.title}
                    </h3>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(
                        proposal.status
                      )}`}
                    >
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(proposal.status)}
                        {proposal.status}
                      </div>
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-400">
                    {proposal.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                    {proposal.budget && (
                      <span>Budget: {proposal.budget}</span>
                    )}
                    {proposal.duration && (
                      <span>Duration: {proposal.duration}</span>
                    )}
                    <span>
                      {new Date(proposal.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions for received proposals */}
                {filter === "received" && proposal.status === "Pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(proposal._id)}
                      className="rounded-lg bg-green-500 px-3 py-2 text-sm font-semibold text-gray-950 transition hover:bg-green-400"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(proposal._id)}
                      className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Send Proposal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-gray-950 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Send Proposal</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-gray-400">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="Project proposal"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-green-500/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  rows="3"
                  placeholder="Describe your proposal..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-green-500/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">Budget</label>
                <input
                  type="text"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  placeholder="$1000 - $5000"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-green-500/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">Duration</label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="2-3 months"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-green-500/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">Select Developer</label>
                <select
                  value={form.receiverId}
                  onChange={(e) => setForm({ ...form, receiverId: e.target.value })}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-green-500/50"
                >
                  <option value="">Choose a developer...</option>
                  {developers.map((dev) => (
                    <option key={dev._id} value={dev._id}>
                      {dev.name} (@{dev.username})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-gray-950 transition hover:bg-green-400 disabled:opacity-50"
                >
                  {saving ? "Sending..." : "Send Proposal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proposals;