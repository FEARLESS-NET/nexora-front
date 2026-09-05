import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  Briefcase,
  MessageSquare,
  Plus,
  Loader2,
} from "lucide-react";

import { API_URL } from "../../utils/config";

const CompanyDashboard = () => {
  const [company, setCompany] = useState(null);
  const [stats, setStats] = useState({
    sentProposals: 0,
    receivedResponses: 0,
    totalMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Fetch company profile
        const companyResponse = await fetch(`${API_URL}/companies/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (companyResponse.ok) {
          const companyData = await companyResponse.json();
          if (companyData.success) {
            setCompany(companyData.company);
          }
        }

        // Fetch proposals
        const proposalsResponse = await fetch(`${API_URL}/proposals?type=sent`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (proposalsResponse.ok) {
          const proposalsData = await proposalsResponse.json();
          if (proposalsData.success) {
            setStats((prev) => ({
              ...prev,
              sentProposals: proposalsData.count || 0,
              receivedResponses: proposalsData.proposals?.filter(
                (p) => p.status !== "Pending"
              ).length || 0,
            }));
          }
        }

        // Fetch messages
        const messagesResponse = await fetch(`${API_URL}/messages/conversations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          if (messagesData.success) {
            setStats((prev) => ({
              ...prev,
              totalMessages: messagesData.count || 0,
            }));
          }
        }
      } catch (error) {
        console.error("Fetch company dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-green-400">Company Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          Welcome, {company?.name || "Company"}
        </h1>
        <p className="mt-2 text-gray-400">
          Manage your company profile and connect with developers
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
              <Briefcase className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.sentProposals}</p>
              <p className="text-sm text-gray-500">Proposals Sent</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.receivedResponses}</p>
              <p className="text-sm text-gray-500">Responses Received</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
              <MessageSquare className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalMessages}</p>
              <p className="text-sm text-gray-500">Messages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <button className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-green-500/30 hover:bg-white/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <Plus className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="font-medium text-white">Send Proposal</p>
              <p className="text-sm text-gray-500">Send a proposal to a developer</p>
            </div>
          </button>

          <button className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-green-500/30 hover:bg-white/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-white">Browse Developers</p>
              <p className="text-sm text-gray-500">Find developers for your projects</p>
            </div>
          </button>
        </div>
      </div>

      {/* No Company Profile */}
      {!company && (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
          <Building2 className="mx-auto h-12 w-12 text-gray-600" />
          <h3 className="mt-4 text-lg font-semibold text-white">No Company Profile</h3>
          <p className="mt-2 text-gray-500">
            Create your company profile to start connecting with developers
          </p>
          <button className="mt-4 rounded-xl bg-green-500 px-6 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-green-400">
            Create Company Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;