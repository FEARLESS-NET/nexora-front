import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Users,
  ArrowLeft,
  Clock,
  DollarSign,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { API_URL } from "../utils/config";

const CompanyDetail = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);

        const [companyResponse, jobsResponse] = await Promise.all([
          fetch(`${API_URL}/companies/${id}`),
          fetch(`${API_URL}/companies/${id}/jobs`),
        ]);

        const companyData = await companyResponse.json();
        const jobsData = await jobsResponse.json();

        if (companyResponse.ok) {
          setCompany(companyData.company);
        }

        if (jobsResponse.ok) {
          setJobs(jobsData.jobs || []);
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompany();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-green-400" />
              <p className="mt-4 text-sm text-gray-500">
                Loading company details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/companies"
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-green-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Companies
          </Link>

          <div className="mt-8 text-center">
            <Building2 className="mx-auto h-16 w-16 text-gray-600" />
            <h1 className="mt-4 text-2xl font-bold">
              Company Not Found
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-8 eightd-perspective-2000">
      <div className="mx-auto max-w-6xl eightd-transform-style-3d">

        {/* Back Button */}
        <Link
          to="/companies"
          className="eightd-button eightd-interactive mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-green-400 eightd-translate-z-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Companies
        </Link>

        {/* Company Header */}
        <div className="eightd-card-tilt overflow-hidden rounded-3xl border border-white/10 bg-gray-900">

          {/* Banner */}
          {company.banner ? (
            <div className="h-48 overflow-hidden sm:h-64 eightd-transform-style-3d">
              <img
                src={company.banner}
                alt={company.name}
                className="h-full w-full object-cover eightd-translate-z-10"
              />
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-green-500/10 to-gray-900 sm:h-64 eightd-transform-style-3d" />
          )}

          <div className="px-5 pb-6 sm:px-8 sm:pb-8 eightd-transform-style-3d">
            <div className="-mt-12 flex flex-col gap-6 sm:-mt-16 lg:flex-row lg:items-end lg:justify-between">

              {/* Company Info */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

                {/* Logo */}
                <div className="eightd-interactive relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-gray-900 bg-white/5 sm:h-28 sm:w-28 eightd-translate-z-30">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-10 w-10 text-gray-500" />
                  )}
                </div>

                {/* Company Details */}
                <div className="eightd-translate-z-20">
                  <h1 className="text-2xl font-bold sm:text-3xl eightd-text-depth">
                    {company.name}
                  </h1>

                  {company.industry && (
                    <p className="mt-1 text-sm text-gray-400">
                      {company.industry}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500 eightd-translate-z-10">
                    {company.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {company.location}
                      </span>
                    )}

                    {company.employeeCount && (
                      <span className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        {company.employeeCount} employees
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 eightd-translate-z-20">
                {company.website && (
                  <a
                    href={
                      company.website.startsWith("http")
                        ? company.website
                        : `https://${company.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="eightd-button eightd-interactive flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:border-green-500/30 hover:text-green-400"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        {company.description && (
          <section className="eightd-card-tilt mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 eightd-translate-z-10">
            <h2 className="text-xl font-semibold eightd-text-depth">
              About
            </h2>

            <p className="mt-4 leading-7 text-gray-400 eightd-translate-z-5">
              {company.description}
            </p>
          </section>
        )}

        {/* Job Listings */}
        <section className="mt-6 eightd-transform-style-3d">
          <div className="mb-4 flex items-center justify-between eightd-translate-z-10">
            <h2 className="text-xl font-semibold eightd-text-depth">
              Open Positions
            </h2>

            <span className="text-sm text-gray-500">
              {jobs.length} position
              {jobs.length !== 1 ? "s" : ""}
            </span>
          </div>

          {jobs.length > 0 ? (
            <div className="space-y-4 eightd-transform-style-3d">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="eightd-card-tilt overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-green-500/30"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between eightd-transform-style-3d">

                    <div className="flex-1 eightd-translate-z-10">
                      <h3 className="text-lg font-semibold text-white eightd-text-depth">
                        {job.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm text-gray-400 eightd-translate-z-5">
                        {job.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500 eightd-translate-z-10">

                        {job.type && (
                          <span className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5">
                            <Briefcase className="h-4 w-4" />
                            {job.type}
                          </span>
                        )}

                        {job.salary && (
                          <span className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5">
                            <DollarSign className="h-4 w-4" />
                            {job.salary}
                          </span>
                        )}

                        {job.location && (
                          <span className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                        )}

                        {job.postedDate && (
                          <span className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5">
                            <Clock className="h-4 w-4" />
                            {new Date(
                              job.postedDate
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      className="eightd-button eightd-interactive rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-gray-950 transition hover:bg-green-400 sm:ml-4 eightd-translate-z-20"
                    >
                      Apply Now
                    </button>
                  </div>

                  {/* Requirements */}
                  {job.requirements &&
                    job.requirements.length > 0 && (
                      <div className="mt-4 border-t border-white/10 pt-4 eightd-translate-z-5">
                        <h4 className="mb-2 text-sm font-semibold text-gray-300">
                          Requirements
                        </h4>

                        <ul className="list-inside list-disc space-y-1 text-sm text-gray-500">
                          {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <div className="eightd-card-tilt rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-12 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-gray-600 eightd-translate-z-10" />

              <p className="mt-4 text-gray-500 eightd-translate-z-5">
                No open positions at the moment.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CompanyDetail;