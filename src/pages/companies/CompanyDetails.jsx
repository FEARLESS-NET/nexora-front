import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  MapPin,
  BriefcaseBusiness,
  Users,
  Globe,
  Mail,
  Loader2,
  RefreshCw,
  ExternalLink,
  Factory,
} from "lucide-react";

import { API_URL } from "../utils/config";

const CompanyDetail = () => {
  const { id } = useParams();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET COMPANY
  // ==========================================

  const fetchCompany = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/companies/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Company ma'lumotlarini yuklashda xatolik"
        );
      }

      setCompany(data.company || null);
    } catch (error) {
      console.error(
        "Company detail error:",
        error
      );

      setError(
        error.message ||
          "Company ma'lumotlarini yuklab bo'lmadi"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET COMPANY JOBS
  // ==========================================

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);

      const response = await fetch(
        `${API_URL}/companies/${id}/jobs`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Company jobslarini yuklashda xatolik"
        );
      }

      setJobs(data.jobs || []);
    } catch (error) {
      console.error(
        "Company jobs error:",
        error
      );

      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    if (!id) return;

    fetchCompany();
    fetchJobs();
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">

        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="flex flex-col items-center gap-4">

            <Loader2 className="h-10 w-10 animate-spin text-green-400" />

            <p className="text-sm text-gray-500">
              Company yuklanmoqda...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-950 px-4 py-16 text-white">

        <div className="mx-auto max-w-2xl">

          <Link
            to="/companies"
            className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Companies
          </Link>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
              <Building2 className="h-8 w-8 text-red-400" />
            </div>

            <h1 className="text-2xl font-bold">
              Company topilmadi
            </h1>

            <p className="mt-3 text-gray-500">
              {error ||
                "Bunday company mavjud emas."}
            </p>

            <button
              onClick={() => {
                fetchCompany();
                fetchJobs();
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-green-400"
            >
              <RefreshCw className="h-4 w-4" />
              Qayta urinish
            </button>

          </div>

        </div>

      </div>
    );
  }

  const website =
    company.website || "";

  const owner =
    company.owner || null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ======================================
          BACK
      ====================================== */}

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">

        <Link
          to="/companies"
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Companies
        </Link>

      </div>

      {/* ======================================
          COMPANY HERO
      ====================================== */}

      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

          {/* BANNER */}

          <div className="relative h-48 overflow-hidden sm:h-64">

            {company.banner ? (
              <img
                src={company.banner}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-green-500/20 via-gray-900 to-gray-950">
                <div className="flex h-full items-center justify-center">
                  <Building2 className="h-24 w-24 text-green-500/10" />
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />

          </div>

          {/* COMPANY INFO */}

          <div className="relative px-6 pb-8 sm:px-8 lg:px-10">

            <div className="-mt-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

              {/* LEFT */}

              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">

                {/* LOGO */}

                <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-gray-950 bg-gray-900 shadow-2xl">

                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={
                        company.name ||
                        "Company"
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-14 w-14 text-green-400" />
                  )}

                </div>

                {/* NAME */}

                <div className="pb-1">

                  <div className="mb-2 inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                    Company
                  </div>

                  <h1 className="text-3xl font-bold sm:text-4xl">
                    {company.name ||
                      "Unnamed Company"}
                  </h1>

                  {owner?.name && (
                    <p className="mt-2 text-sm text-gray-500">
                      Managed by {owner.name}
                    </p>
                  )}

                </div>

              </div>

              {/* WEBSITE */}

              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-green-400"
                >
                  <Globe className="h-4 w-4" />

                  Website

                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

            </div>

            {/* DESCRIPTION */}

            <div className="mt-8 max-w-4xl">

              <p className="leading-7 text-gray-400">
                {company.description ||
                  "Bu company haqida hozircha ma'lumot mavjud emas."}
              </p>

            </div>

            {/* TAGS */}

            <div className="mt-7 flex flex-wrap gap-3">

              {company.industry && (
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-gray-400">
                  <Factory className="h-4 w-4 text-green-400" />
                  {company.industry}
                </div>
              )}

              {company.location && (
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-gray-400">
                  <MapPin className="h-4 w-4 text-green-400" />
                  {company.location}
                </div>
              )}

              {company.size && (
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-gray-400">
                  <Users className="h-4 w-4 text-green-400" />
                  {company.size}
                </div>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* ======================================
          MAIN
      ====================================== */}

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

          {/* ==================================
              JOBS
          ================================== */}

          <section>

            <div className="mb-6 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
                  <BriefcaseBusiness className="h-5 w-5 text-green-400" />
                </div>

                <div>

                  <h2 className="text-2xl font-bold">
                    Open Positions
                  </h2>

                  <p className="text-sm text-gray-500">
                    {jobsLoading
                      ? "Loading jobs..."
                      : `${jobs.length} ta ochiq job`}
                  </p>

                </div>

              </div>

            </div>

            {/* JOB LOADING */}

            {jobsLoading && (
              <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02]">

                <div className="flex flex-col items-center gap-3">

                  <Loader2 className="h-8 w-8 animate-spin text-green-400" />

                  <p className="text-sm text-gray-500">
                    Jobs yuklanmoqda...
                  </p>

                </div>

              </div>
            )}

            {/* NO JOBS */}

            {!jobsLoading &&
              jobs.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">

                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                    <BriefcaseBusiness className="h-7 w-7 text-gray-600" />
                  </div>

                  <h3 className="text-lg font-semibold">
                    Hozircha job yo'q
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Bu company hozircha ochiq
                    position joylashtirmagan.
                  </p>

                </div>
              )}

            {/* JOB LIST */}

            {!jobsLoading &&
              jobs.length > 0 && (
                <div className="space-y-4">

                  {jobs.map((job, index) => {

                    const jobId =
                      job._id ||
                      job.id ||
                      index;

                    return (
                      <article
                        key={jobId}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-green-500/20 hover:bg-white/[0.05]"
                      >

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                          <div className="min-w-0">

                            <h3 className="text-xl font-semibold text-white">
                              {job.title ||
                                job.name ||
                                "Untitled Job"}
                            </h3>

                            {job.description && (
                              <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">
                                {job.description}
                              </p>
                            )}

                          </div>

                          {job.status && (
                            <span className="shrink-0 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                              {job.status}
                            </span>
                          )}

                        </div>

                        {/* JOB META */}

                        <div className="mt-5 flex flex-wrap gap-2">

                          {job.location && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/20 px-3 py-1.5 text-xs text-gray-500">
                              <MapPin className="h-3.5 w-3.5" />
                              {job.location}
                            </span>
                          )}

                          {job.type && (
                            <span className="rounded-lg bg-black/20 px-3 py-1.5 text-xs text-gray-500">
                              {job.type}
                            </span>
                          )}

                          {job.salary && (
                            <span className="rounded-lg bg-black/20 px-3 py-1.5 text-xs text-gray-500">
                              {job.salary}
                            </span>
                          )}

                          {Array.isArray(
                            job.skills
                          ) &&
                            job.skills
                              .slice(0, 6)
                              .map(
                                (skill) => (
                                  <span
                                    key={skill}
                                    className="rounded-lg bg-green-500/10 px-3 py-1.5 text-xs text-green-400"
                                  >
                                    {skill}
                                  </span>
                                )
                              )}

                        </div>

                      </article>
                    );
                  })}

                </div>
              )}

          </section>

          {/* ==================================
              SIDEBAR
          ================================== */}

          <aside className="space-y-5">

            {/* COMPANY STATS */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <h3 className="text-lg font-semibold">
                Company Overview
              </h3>

              <div className="mt-5 space-y-4">

                {/* EMPLOYEES */}

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
                      <Users className="h-4 w-4 text-green-400" />
                    </div>

                    <span className="text-sm text-gray-400">
                      Employees
                    </span>

                  </div>

                  <span className="font-semibold">
                    {company.employeeCount ?? 0}
                  </span>

                </div>

                {/* JOBS */}

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
                      <BriefcaseBusiness className="h-4 w-4 text-green-400" />
                    </div>

                    <span className="text-sm text-gray-400">
                      Open Jobs
                    </span>

                  </div>

                  <span className="font-semibold">
                    {jobs.length}
                  </span>

                </div>

                {/* SIZE */}

                {company.size && (
                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
                        <Building2 className="h-4 w-4 text-green-400" />
                      </div>

                      <span className="text-sm text-gray-400">
                        Company Size
                      </span>

                    </div>

                    <span className="text-sm font-semibold">
                      {company.size}
                    </span>

                  </div>
                )}

              </div>

            </div>

            {/* CONTACT */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <h3 className="text-lg font-semibold">
                Contact
              </h3>

              <div className="mt-4 space-y-3">

                {company.location && (
                  <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/20 p-4">

                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />

                    <div>
                      <p className="text-xs text-gray-600">
                        Location
                      </p>

                      <p className="mt-1 text-sm text-gray-300">
                        {company.location}
                      </p>
                    </div>

                  </div>
                )}

                {owner?.email && (
                  <a
                    href={`mailto:${owner.email}`}
                    className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/20 p-4 transition hover:border-green-500/20"
                  >

                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />

                    <div className="min-w-0">

                      <p className="text-xs text-gray-600">
                        Email
                      </p>

                      <p className="mt-1 truncate text-sm text-gray-300">
                        {owner.email}
                      </p>

                    </div>

                  </a>
                )}

                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-4 transition hover:border-green-500/20"
                  >

                    <div className="flex items-center gap-3">

                      <Globe className="h-5 w-5 text-green-400" />

                      <span className="text-sm text-gray-300">
                        Company Website
                      </span>

                    </div>

                    <ExternalLink className="h-4 w-4 text-gray-500" />

                  </a>
                )}

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
};

export default CompanyDetail;