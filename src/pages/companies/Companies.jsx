import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Search,
  MapPin,
  Users,
  BriefcaseBusiness,
  ArrowRight,
  Loader2,
  RefreshCw,
  Factory,
} from "lucide-react";

import { API_URL } from "../utils/config";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET ALL COMPANIES
  // ==========================================

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/companies`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Companiesni yuklashda xatolik"
        );
      }

      setCompanies(data.companies || []);
    } catch (error) {
      console.error("Companies fetch error:", error);

      setError(
        error.message || "Companiesni yuklab bo'lmadi"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredCompanies = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return companies;
    }

    return companies.filter((company) => {
      return (
        company.name?.toLowerCase().includes(value) ||
        company.description
          ?.toLowerCase()
          .includes(value) ||
        company.location
          ?.toLowerCase()
          .includes(value) ||
        company.industry
          ?.toLowerCase()
          .includes(value)
      );
    });
  }, [companies, search]);

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ======================================
          HERO
      ====================================== */}

      <section className="border-b border-white/10 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-3xl text-center">

            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10">
              <Building2 className="h-8 w-8 text-green-400" />
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Discover{" "}
              <span className="text-green-400">
                Companies
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              Nexora'dagi kompaniyalarni kashf qiling,
              ularning profillarini ko'ring va yangi
              professional imkoniyatlarni toping.
            </p>

          </div>

          {/* SEARCH */}

          <div className="mx-auto mt-10 max-w-2xl">

            <div className="relative">

              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Company, industry yoki location..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 pl-12 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/50 focus:bg-white/[0.06]"
              />

            </div>

          </div>

        </div>
      </section>

      {/* ======================================
          CONTENT
      ====================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* TOP BAR */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>

            <h2 className="text-2xl font-bold">
              Companies
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {loading
                ? "Loading..."
                : `${filteredCompanies.length} ta company topildi`}
            </p>

          </div>

          <button
            onClick={fetchCompanies}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-gray-300 transition hover:border-green-500/30 hover:bg-green-500/10 hover:text-green-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />

            Refresh
          </button>

        </div>

        {/* ======================================
            LOADING
        ====================================== */}

        {loading && (
          <div className="flex min-h-[350px] items-center justify-center">

            <div className="flex flex-col items-center gap-4">

              <Loader2 className="h-10 w-10 animate-spin text-green-400" />

              <p className="text-sm text-gray-500">
                Companies yuklanmoqda...
              </p>

            </div>

          </div>
        )}

        {/* ======================================
            ERROR
        ====================================== */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
              <Building2 className="h-8 w-8 text-red-400" />
            </div>

            <h3 className="text-xl font-semibold">
              Companies yuklanmadi
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">
              {error}
            </p>

            <button
              onClick={fetchCompanies}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-green-400"
            >
              <RefreshCw className="h-4 w-4" />
              Qayta urinish
            </button>

          </div>
        )}

        {/* ======================================
            EMPTY
        ====================================== */}

        {!loading &&
          !error &&
          filteredCompanies.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-20 text-center">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                <Building2 className="h-8 w-8 text-gray-600" />
              </div>

              <h3 className="text-xl font-semibold">
                Company topilmadi
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {search
                  ? "Qidiruvingiz bo'yicha company topilmadi."
                  : "Hozircha ro'yxatda company mavjud emas."}
              </p>

            </div>
          )}

        {/* ======================================
            COMPANY GRID
        ====================================== */}

        {!loading &&
          !error &&
          filteredCompanies.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filteredCompanies.map((company) => {

                const companyId =
                  company._id || company.id;

                return (
                  <article
                    key={companyId}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-green-500/30 hover:bg-white/[0.05]"
                  >

                    {/* BANNER */}

                    <div className="relative h-32 overflow-hidden bg-gradient-to-br from-green-500/10 via-gray-900 to-gray-950">

                      {company.banner ? (
                        <img
                          src={company.banner}
                          alt=""
                          className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Building2 className="h-16 w-16 text-green-500/10" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent" />

                    </div>

                    {/* CARD */}

                    <div className="relative px-6 pb-6">

                      {/* LOGO */}

                      <div className="-mt-10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-gray-950 bg-gray-900 shadow-xl">

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
                          <Building2 className="h-9 w-9 text-green-400" />
                        )}

                      </div>

                      {/* NAME */}

                      <div className="mt-5">

                        <div className="flex items-start justify-between gap-3">

                          <h3 className="min-w-0 truncate text-xl font-semibold text-white transition group-hover:text-green-400">
                            {company.name ||
                              "Unnamed Company"}
                          </h3>

                          <span className="shrink-0 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-[11px] font-medium text-green-400">
                            Company
                          </span>

                        </div>

                      </div>

                      {/* DESCRIPTION */}

                      <p className="mt-3 min-h-[48px] line-clamp-2 text-sm leading-6 text-gray-400">
                        {company.description ||
                          "Company haqida ma'lumot mavjud emas."}
                      </p>

                      {/* INDUSTRY */}

                      {company.industry && (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400">

                          <Factory className="h-3.5 w-3.5 text-green-400" />

                          {company.industry}

                        </div>
                      )}

                      {/* LOCATION */}

                      {company.location && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">

                          <MapPin className="h-4 w-4 shrink-0 text-green-400" />

                          <span className="truncate">
                            {company.location}
                          </span>

                        </div>
                      )}

                      {/* STATS */}

                      <div className="mt-5 grid grid-cols-2 gap-3">

                        <div className="rounded-xl border border-white/5 bg-black/20 p-3">

                          <div className="flex items-center gap-2 text-gray-500">
                            <Users className="h-4 w-4" />

                            <span className="text-xs">
                              Employees
                            </span>
                          </div>

                          <p className="mt-1 text-sm font-semibold text-white">
                            {company.employeeCount ?? 0}
                          </p>

                        </div>

                        <div className="rounded-xl border border-white/5 bg-black/20 p-3">

                          <div className="flex items-center gap-2 text-gray-500">
                            <BriefcaseBusiness className="h-4 w-4" />

                            <span className="text-xs">
                              Open Jobs
                            </span>
                          </div>

                          <p className="mt-1 text-sm font-semibold text-white">
                            {company.openJobs ?? 0}
                          </p>

                        </div>

                      </div>

                      {/* SIZE */}

                      {company.size && (
                        <div className="mt-3 text-xs text-gray-600">
                          Company size:{" "}
                          <span className="text-gray-400">
                            {company.size}
                          </span>
                        </div>
                      )}

                      {/* BUTTON */}

                      <Link
                        to={`/companies/${companyId}`}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-gray-300 transition hover:border-green-500/30 hover:bg-green-500/10 hover:text-green-400"
                      >
                        View Company

                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>

                    </div>
                  </article>
                );
              })}

            </div>
          )}

      </section>
    </div>
  );
};

export default Companies;