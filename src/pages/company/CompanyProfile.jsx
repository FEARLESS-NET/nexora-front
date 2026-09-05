import { useEffect, useState } from "react";
import {
  Building2,
  Globe,
  MapPin,
  Briefcase,
  Save,
  Loader2,
} from "lucide-react";

import { API_URL as BASE_API_URL } from "../../utils/config";

const API_URL = `${BASE_API_URL}/companies`;

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    logo: "",
    website: "",
    location: "",
    industry: "",
    size: "1-10",
  });

  // Fetch company profile
  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 404) {
        // Company profile doesn't exist yet
        setCompany(null);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to load company profile");
      }

      if (data.success) {
        setCompany(data.company);
        setForm({
          name: data.company.name || "",
          description: data.company.description || "",
          logo: data.company.logo || "",
          website: data.company.website || "",
          location: data.company.location || "",
          industry: data.company.industry || "",
          size: data.company.size || "1-10",
        });
      }
    } catch (error) {
      console.error("Fetch company error:", error);
      setError(error.message || "Failed to load company profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        logo: form.logo.trim(),
        website: form.website.trim(),
        location: form.location.trim(),
        industry: form.industry.trim(),
        size: form.size,
      };

      let response;
      if (company) {
        // Update existing company
        response = await fetch(`${API_URL}/my`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new company
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save company profile");
      }

      if (data.success) {
        setCompany(data.company);
        setSuccess(company ? "Company profile updated successfully" : "Company profile created successfully");
      }
    } catch (error) {
      console.error("Save company error:", error);
      setError(error.message || "Failed to save company profile");
    } finally {
      setSaving(false);
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
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-green-400">Company Profile</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          {company ? "Edit Company Profile" : "Create Company Profile"}
        </h1>
        <p className="mt-2 text-gray-400">
          {company
            ? "Update your company information"
            : "Create your company profile to start connecting with developers"}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Name */}
        <div>
          <label className="mb-2 block text-sm text-gray-400">Company Name</label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Acme Corporation"
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/50"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm text-gray-400">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            placeholder="Tell us about your company..."
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/50"
          />
        </div>

        {/* Website */}
        <div>
          <label className="mb-2 block text-sm text-gray-400">Website</label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="url"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://yourcompany.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/50"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="mb-2 block text-sm text-gray-400">Location</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Tashkent, Uzbekistan"
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/50"
            />
          </div>
        </div>

        {/* Industry */}
        <div>
          <label className="mb-2 block text-sm text-gray-400">Industry</label>
          <input
            type="text"
            name="industry"
            value={form.industry}
            onChange={handleChange}
            placeholder="Technology, Finance, Healthcare..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/50"
          />
        </div>

        {/* Company Size */}
        <div>
          <label className="mb-2 block text-sm text-gray-400">Company Size</label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <select
              name="size"
              value={form.size}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-sm text-white outline-none transition focus:border-green-500/50"
            >
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </div>
        </div>

        {/* Logo URL */}
        <div>
          <label className="mb-2 block text-sm text-gray-400">Logo URL</label>
          <input
            type="url"
            name="logo"
            value={form.logo}
            onChange={handleChange}
            placeholder="https://yourcompany.com/logo.png"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/50"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-gray-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {company ? "Update Profile" : "Create Profile"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfile;