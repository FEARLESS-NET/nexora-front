import { useState, useEffect } from "react";
import { Building2, MapPin, Users, ArrowRight, Search, Terminal, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3013/api";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${API_URL}/companies`);
        const data = await response.json();
        
        if (response.ok) {
          setCompanies(data.companies || []);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#050d18] via-[#081525] to-[#050d18] cyber-grid px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="relative mx-auto h-16 w-16">
                <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-2 border-green-500/20 border-t-green-400" />
                <div className="absolute inset-2 h-12 w-12 animate-spin rounded-full border-2 border-green-500/30 border-t-green-500" style={{ animationDirection: 'reverse' }} />
              </div>
              <div className="mt-6 font-mono text-sm text-green-400 animate-pulse">
                <Terminal className="inline-block h-4 w-4 mr-2" />
                Loading companies...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d18] via-[#081525] to-[#050d18] cyber-grid px-4 py-8 text-white sm:px-6 lg:px-8 eightd-perspective-2000">
      <div className="mx-auto max-w-6xl eightd-transform-style-3d">
        {/* Header */}
        <div className="mb-8 animate-slide-in eightd-translate-z-20">
          <div className="flex items-center gap-3 mb-2">
            <div className="eightd-button eightd-interactive flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/30 animate-pulse-glow">
              <Building2 className="h-5 w-5 text-green-400 eightd-translate-z-10" />
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl font-mono text-glow eightd-text-depth">
              Companies
            </h1>
          </div>
          <p className="mt-2 text-gray-400 font-mono text-sm eightd-translate-z-10">
            <span className="text-green-400">$</span> Discover amazing companies and job opportunities
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 animate-slide-in eightd-translate-z-15" style={{ animationDelay: '0.1s' }}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-cyber w-full rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 font-mono text-sm eightd-interactive"
            />
          </div>
        </div>

        {/* Companies Grid */}
        {filteredCompanies.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 eightd-transform-style-3d">
            {filteredCompanies.map((company, index) => (
              <Link
                key={company._id}
                to={`/companies/${company._id}`}
                className="eightd-card-tilt card-cyber glass-cyber group overflow-hidden rounded-2xl animate-slide-in"
                style={{ animationDelay: `${0.2 + (index * 0.05)}s` }}
              >
                {/* Banner */}
                {company.banner ? (
                  <div className="h-32 overflow-hidden relative eightd-transform-style-3d">
                    <img
                      src={company.banner}
                      alt={company.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110 eightd-translate-z-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050d18] to-transparent" />
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-br from-green-500/10 to-gray-900 relative overflow-hidden eightd-transform-style-3d">
                    <div className="absolute inset-0 cyber-grid opacity-30 eightd-translate-z-5" />
                  </div>
                )}

                <div className="p-5 -mt-8 relative eightd-transform-style-3d">
                  {/* Company Info */}
                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className="eightd-interactive flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-green-500/30 bg-green-500/10 shadow-lg shadow-green-500/20 eightd-translate-z-20">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Building2 className="h-6 w-6 text-green-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 eightd-translate-z-10">
                      <h3 className="font-semibold text-white group-hover:text-green-400 transition font-mono text-sm eightd-text-depth">
                        {company.name}
                      </h3>
                      {company.industry && (
                        <p className="mt-1 text-sm text-gray-500 font-mono text-xs">{company.industry}</p>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500 font-mono eightd-translate-z-10">
                    {company.location && (
                      <span className="flex items-center gap-1.5 text-green-400/70">
                        <MapPin className="h-4 w-4" />
                        {company.location}
                      </span>
                    )}
                    {company.employeeCount && (
                      <span className="flex items-center gap-1.5 text-green-400/70">
                        <Users className="h-4 w-4" />
                        {company.employeeCount} employees
                      </span>
                    )}
                  </div>

                  {/* Open Jobs */}
                  {company.openJobs && company.openJobs > 0 && (
                    <div className="mt-4 flex items-center justify-between eightd-translate-z-10">
                      <span className="text-sm text-gray-400 font-mono">
                        <span className="text-green-400">{company.openJobs}</span> open position{company.openJobs > 1 ? 's' : ''}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-green-400 transition eightd-translate-z-5" />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="eightd-card-tilt glass-cyber rounded-2xl border border-dashed border-green-500/20 py-16 text-center animate-slide-in">
            <div className="mx-auto mb-4 eightd-button eightd-interactive flex h-16 w-16 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/30 animate-pulse-glow">
              <Building2 className="h-8 w-8 text-green-400/50 eightd-translate-z-10" />
            </div>
            <p className="font-mono text-sm text-gray-500 eightd-translate-z-10">
              <span className="text-green-400">$</span> {searchTerm ? "No companies found matching your search." : "No companies available yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;