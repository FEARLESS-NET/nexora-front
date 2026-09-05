import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  ArrowUpRight,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";

import { API_URL } from "../utils/config";

const DEVELOPERS_URL = `${API_URL}/developers`;

const Developers = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch developers from API
  const fetchDevelopers = async () => {
    try {
      setLoading(true);

      const response = await fetch(DEVELOPERS_URL);
      const data = await response.json();

      if (data.success) {
        setDevelopers(data.developers || []);
      }
    } catch (error) {
      console.error("Fetch developers error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  // Filter developers based on search
  const filteredDevelopers = developers.filter((developer) => {
    const searchLower = searchTerm.toLowerCase();

    return (
      developer.name?.toLowerCase().includes(searchLower) ||
      developer.username?.toLowerCase().includes(searchLower) ||
      developer.skills?.some((skill) =>
        skill.toLowerCase().includes(searchLower)
      ) ||
      developer.location?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-medium text-green-400">
            Find the right talent
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Discover Developers
          </h1>

          <p className="mt-3 max-w-2xl text-gray-400">
            Find skilled developers, explore their portfolios and
            connect with the right person for your project.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 flex flex-col gap-3 md:flex-row">

          <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <Search className="h-5 w-5 text-gray-500" />

            <input
              type="text"
              placeholder="Search developers, skills or technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
            />
          </div>

          <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-gray-300 transition hover:border-green-500/30 hover:text-green-400">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>

        </div>

        {/* Results */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {filteredDevelopers.length} developers found
          </p>

          <select className="rounded-lg border border-white/10 bg-gray-900 px-3 py-2 text-sm text-gray-400 outline-none">
            <option>Recommended</option>
            <option>Highest rated</option>
            <option>Most experienced</option>
            <option>Newest</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-green-400" />
          </div>
        )}

        {/* Empty */}
        {!loading && filteredDevelopers.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] py-20 text-center">
            <p className="text-gray-500">No developers found</p>
          </div>
        )}

        {/* Cards */}
        {!loading && filteredDevelopers.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredDevelopers.map((developer) => (
              <div
                key={developer.username}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-green-500/30"
              >

                {/* Profile */}
                <div className="flex items-start gap-4">

                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-lg font-bold text-green-400">
                    {developer.avatar ? (
                      <img
                        src={developer.avatar}
                        alt={developer.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      developer.name?.charAt(0) || "D"
                    )}

                    {developer.isAvailable && (
                      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-gray-950 bg-green-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-semibold text-white">
                      {developer.name}
                    </h2>

                    <p className="mt-1 text-xs text-gray-600">
                      @{developer.username}
                    </p>

                    {developer.bio && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-400">
                        {developer.bio}
                      </p>
                    )}
                  </div>

                </div>

                {/* Info */}
                {developer.location && (
                  <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="h-4 w-4" />
                    {developer.location}
                  </div>
                )}

                {/* Skills */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {developer.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Button */}
                <button
                  onClick={() =>
                    (window.location.href = `/developers/${developer.username}`)
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-gray-300 transition hover:border-green-500/40 hover:bg-green-500/10 hover:text-green-400"
                >
                  View Profile
                  <ArrowUpRight className="h-4 w-4" />
                </button>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default Developers;