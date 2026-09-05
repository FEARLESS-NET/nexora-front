import { useState, useEffect } from "react";
import { Heart, MessageCircle, ExternalLink, Code2, User, Building2, Grid, Terminal, Cpu, Database } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3013/api";

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, developers, companies

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/projects/all`);
        const data = await response.json();
        
        if (response.ok) {
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    if (filter === "all") return true;
    if (filter === "developers") return project.developerId;
    if (filter === "companies") return project.companyId;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#050d18] via-[#081525] to-[#050d18] cyber-grid px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="relative mx-auto h-16 w-16">
                <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-2 border-green-500/20 border-t-green-400" />
                <div className="absolute inset-2 h-12 w-12 animate-spin rounded-full border-2 border-green-500/30 border-t-green-500" style={{ animationDirection: 'reverse' }} />
              </div>
              <div className="mt-6 font-mono text-sm text-green-400 animate-pulse">
                <Terminal className="inline-block h-4 w-4 mr-2" />
                Loading projects...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d18] via-[#081525] to-[#050d18] cyber-grid px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 animate-slide-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/30 animate-pulse-glow">
              <Terminal className="h-5 w-5 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl font-mono text-glow">
              All Projects
            </h1>
          </div>
          <p className="mt-2 text-gray-400 font-mono text-sm">
            <span className="text-green-400">$</span> Discover amazing projects from developers and companies
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex gap-2 animate-slide-in" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setFilter("all")}
            className={`btn-cyber flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium font-mono ${
              filter === "all"
                ? "bg-green-500/20 border-green-500/50 text-green-400 animate-pulse-glow"
                : "bg-white/5 border-white/10 text-gray-400 hover:border-green-500/30"
            }`}
          >
            <Grid className="h-4 w-4" />
            All Projects
          </button>
          <button
            onClick={() => setFilter("developers")}
            className={`btn-cyber flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium font-mono ${
              filter === "developers"
                ? "bg-green-500/20 border-green-500/50 text-green-400 animate-pulse-glow"
                : "bg-white/5 border-white/10 text-gray-400 hover:border-green-500/30"
            }`}
          >
            <User className="h-4 w-4" />
            Developers
          </button>
          <button
            onClick={() => setFilter("companies")}
            className={`btn-cyber flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium font-mono ${
              filter === "companies"
                ? "bg-green-500/20 border-green-500/50 text-green-400 animate-pulse-glow"
                : "bg-white/5 border-white/10 text-gray-400 hover:border-green-500/30"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Companies
          </button>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProjects.map((project, index) => (
              <div
                key={project._id}
                className="card-cyber glass-cyber rounded-2xl overflow-hidden animate-slide-in"
                style={{ animationDelay: `${0.2 + (index * 0.05)}s` }}
              >
                {/* Project Image */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-green-500/5 to-gray-900">
                  {project.previewImage ? (
                    <img
                      src={project.previewImage}
                      alt={project.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="relative">
                        <Code2 className="h-20 w-20 text-green-400/20 animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Terminal className="h-8 w-8 text-green-400/30" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Scan line effect */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="animate-scan-line h-full w-full bg-gradient-to-b from-transparent via-green-400/5 to-transparent" />
                  </div>

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/70 opacity-0 transition-all duration-300 group-hover:opacity-100 backdrop-blur-sm">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-cyber flex items-center gap-2 rounded-lg bg-green-500/20 border border-green-500/50 px-4 py-2 text-sm font-semibold text-green-400 hover:bg-green-500/30"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="font-mono">Live Demo</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-cyber flex items-center gap-2 rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
                      >
                        <Code2 className="h-4 w-4" />
                        <span className="font-mono">GitHub</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-white line-clamp-1 font-mono text-sm">{project.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500 font-mono text-xs">{project.description}</p>

                  {/* Author Info */}
                  <div className="mt-3 flex items-center gap-2">
                    {project.developerName ? (
                      <Link
                        to={`/developers/${project.developerUsername}`}
                        className="flex items-center gap-2 text-xs text-gray-400 hover:text-green-400 transition font-mono"
                      >
                        <User className="h-3 w-3" />
                        {project.developerName}
                      </Link>
                    ) : project.companyName ? (
                      <Link
                        to={`/companies/${project.companyId}`}
                        className="flex items-center gap-2 text-xs text-gray-400 hover:text-green-400 transition font-mono"
                      >
                        <Building2 className="h-3 w-3" />
                        {project.companyName}
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-500 font-mono">Unknown author</span>
                    )}
                  </div>

                  {/* Technologies */}
                  {project.tech && project.tech.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tech.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          className="rounded-lg border border-green-500/20 bg-green-500/5 px-2 py-1 text-xs text-green-400 font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-gray-400 font-mono">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Engagement Stats */}
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 font-mono">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-400/50" />
                      {project.likes || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3 text-blue-400/50" />
                      {project.comments || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-cyber rounded-2xl border border-dashed border-green-500/20 py-16 text-center animate-slide-in">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/30 animate-pulse-glow">
              <Terminal className="h-8 w-8 text-green-400/50" />
            </div>
            <p className="font-mono text-sm text-gray-500">
              <span className="text-green-400">$</span> {filter === "all" 
                ? "No projects available yet." 
                : `No ${filter} projects available yet.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects;