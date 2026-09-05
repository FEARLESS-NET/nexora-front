import { Link } from "react-router-dom";
import { 
  Code2, 
  Users, 
  Briefcase, 
  Zap, 
  Shield, 
  Globe, 
  ArrowRight, 
  CheckCircle,
  Clock,
  Server,
  Building2,
  UserCheck,
  TrendingUp,
  Activity,
  Sparkles,
  Star
} from "lucide-react";
import { useState, useEffect } from "react";

const Home = () => {
  const [backendStatus, setBackendStatus] = useState({
    status: 'checking',
    responseTime: null,
    lastChecked: null
  });
  
  const [platformStats, setPlatformStats] = useState({
    developers: { total: 0, active: 0, inactive: 0 },
    clients: { total: 0 },
    companies: { total: 0 },
    totalUsers: 0,
    platformHealth: { status: 'operational', userGrowth: '+0%', projectCompletion: '0%' }
  });
  
  const [recentActivity, setRecentActivity] = useState({
    recentUsers: [],
    recentCompanies: []
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const startTime = Date.now();
        const response = await fetch('http://localhost:3013/api/health');
        const endTime = Date.now();
        
        if (response.ok) {
          setBackendStatus({
            status: 'online',
            responseTime: endTime - startTime,
            lastChecked: new Date().toLocaleTimeString()
          });
        } else {
          setBackendStatus({
            status: 'error',
            responseTime: null,
            lastChecked: new Date().toLocaleTimeString()
          });
        }
      } catch (error) {
        setBackendStatus({
          status: 'offline',
          responseTime: null,
          lastChecked: new Date().toLocaleTimeString()
        });
      }
    };

    const fetchPlatformStats = async () => {
      try {
        const response = await fetch('http://localhost:3013/api/stats/platform');
        if (response.ok) {
          const data = await response.json();
          setPlatformStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching platform stats:', error);
      }
    };

    const fetchRecentActivity = async () => {
      try {
        const response = await fetch('http://localhost:3013/api/stats/activity');
        if (response.ok) {
          const data = await response.json();
          setRecentActivity(data.data);
        }
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      }
    };

    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        checkBackendStatus(),
        fetchPlatformStats(),
        fetchRecentActivity()
      ]);
      setLoading(false);
    };

    loadData();
    
    const statusInterval = setInterval(checkBackendStatus, 30000);
    const statsInterval = setInterval(fetchPlatformStats, 60000); // Update stats every minute

    return () => {
      clearInterval(statusInterval);
      clearInterval(statsInterval);
    };
  }, []);

  const getStatusColor = () => {
    switch (backendStatus.status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-red-400';
      case 'error': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = () => {
    switch (backendStatus.status) {
      case 'online': return 'bg-green-500/10 border-green-500/20';
      case 'offline': return 'bg-red-500/10 border-red-500/20';
      case 'error': return 'bg-yellow-500/10 border-yellow-500/20';
      default: return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d18] via-[#081525] to-[#050d18] relative overflow-hidden eightd-perspective-2000">
      
      {/* Global Background Effects */}
      <div className="fixed inset-0 pointer-events-none eightd-transform-style-3d">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-500/5 via-transparent to-transparent animate-eightd-depth-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent animate-eightd-depth-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent animate-eightd-depth-pulse" style={{ animationDelay: '2s' }} />
        
        {/* 8D Ambient particles */}
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="eightd-particle absolute w-1 h-1 bg-white/20 rounded-full animate-eightd-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 15}s`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`
            }}
          />
        ))}

        {/* 8D Glow Rings */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`ring-${i}`}
            className="eightd-glow-ring"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              width: `${100 + Math.random() * 200}px`,
              height: `${100 + Math.random() * 200}px`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
      
      {/* Backend Status Indicator */}
      <div className="fixed top-24 right-4 z-40">
        <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium backdrop-blur-xl transition-all duration-300 ${getStatusBg()}`}>
          <Server className={`h-4 w-4 ${getStatusColor()}`} />
          <span className={getStatusColor()}>
            Backend: {backendStatus.status.charAt(0).toUpperCase() + backendStatus.status.slice(1)}
          </span>
          {backendStatus.responseTime && (
            <span className="text-white/40">
              ({backendStatus.responseTime}ms)
            </span>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32 eightd-transform-style-3d">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden eightd-transform-style-3d">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[500px] bg-green-500/5 rounded-full blur-[120px] animate-eightd-depth-pulse eightd-translate-z-50" />
          <div className="absolute right-0 top-1/4 w-[600px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] animate-eightd-depth-pulse eightd-translate-z-30" style={{ animationDelay: '1s' }} />
          <div className="absolute left-0 bottom-0 w-[800px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] animate-eightd-depth-pulse eightd-translate-z-40" style={{ animationDelay: '2s' }} />
          
          {/* 8D Floating particles */}
          <div className="absolute inset-0 eightd-transform-style-3d">
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="eightd-particle absolute w-1.5 h-1.5 bg-green-400/30 rounded-full animate-eightd-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 10}s`,
                  transform: `translateZ(${Math.random() * 50}px)`
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10 eightd-transform-style-3d">
          <div className="mx-auto max-w-4xl text-center eightd-translate-z-20">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-4 py-2 mb-8 animate-glow eightd-button eightd-interactive">
              <Zap className="h-4 w-4 text-green-400 eightd-translate-z-10" />
              <span className="text-sm font-medium text-green-400 eightd-text-depth">
                Now in Beta - Join {loading ? '...' : platformStats.totalUsers}+ Developers
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl animate-slide-in eightd-text-depth">
              Connect with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 animate-gradient eightd-text-depth">
                Top Developers
              </span>
              {' '}Worldwide
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-lg text-white/60 sm:text-xl max-w-2xl mx-auto">
              The premier platform connecting talented developers with exciting opportunities. 
              Build your portfolio, find amazing projects, and grow your career.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center eightd-transform-style-3d">
              <Link
                to="/register"
                className="eightd-button eightd-interactive inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-8 py-4 text-sm font-bold text-[#031006] shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-300 hover:bg-green-400 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4 eightd-translate-z-10" />
              </Link>
              
              <Link
                to="/dashboard/discover"
                className="eightd-button eightd-interactive inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.02] px-8 py-4 text-sm font-semibold text-white/80 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.2]"
              >
                Explore Developers
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/[0.08] pt-8">
              <div className="group">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-400 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-white">
                    {loading ? '...' : platformStats.developers.total}
                  </div>
                </div>
                <div className="mt-1 text-sm text-white/40">Active Developers</div>
                <div className="mt-1 text-xs text-green-400">
                  {loading ? '...' : `${platformStats.developers.active} available`}
                </div>
              </div>
              <div className="group">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-white">
                    {loading ? '...' : platformStats.companies.total}
                  </div>
                </div>
                <div className="mt-1 text-sm text-white/40">Companies</div>
                <div className="mt-1 text-xs text-blue-400">
                  {loading ? '...' : `${platformStats.clients.total} clients`}
                </div>
              </div>
              <div className="group">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-400 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-white">
                    {loading ? '...' : platformStats.platformHealth.projectCompletion}
                  </div>
                </div>
                <div className="mt-1 text-sm text-white/40">Success Rate</div>
                <div className="mt-1 text-xs text-purple-400">
                  {loading ? '...' : platformStats.platformHealth.userGrowth}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
          
          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="mt-4 text-lg text-white/50">
              Powerful tools and features designed for modern developers
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 eightd-transform-style-3d">
            
            {/* Feature 1 */}
            <div className="eightd-card-tilt group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-transparent p-8 transition-all duration-500 hover:border-green-500/30 hover:shadow-[0_0_40px_rgba(34,197,94,0.1)] hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 eightd-translate-z-10" />
              <div className="relative eightd-transform-style-3d">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400 group-hover:scale-110 group-hover:bg-green-500/20 transition-all duration-300 eightd-translate-z-20">
                  <Code2 className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white group-hover:text-green-400 transition-colors eightd-text-depth">
                  Portfolio Builder
                </h3>
                <p className="mt-3 text-sm text-white/50 group-hover:text-white/70 transition-colors eightd-translate-z-10">
                  Showcase your best work with a beautiful, customizable portfolio that stands out.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="eightd-card-tilt group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-transparent p-8 transition-all duration-500 hover:border-blue-500/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 eightd-translate-z-10" />
              <div className="relative eightd-transform-style-3d">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300 eightd-translate-z-20">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white group-hover:text-blue-400 transition-colors eightd-text-depth">
                  Developer Community
                </h3>
                <p className="mt-3 text-sm text-white/50 group-hover:text-white/70 transition-colors eightd-translate-z-10">
                  Connect with like-minded developers, share knowledge, and grow together.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="eightd-card-tilt group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-transparent p-8 transition-all duration-500 hover:border-purple-500/30 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 eightd-translate-z-10" />
              <div className="relative eightd-transform-style-3d">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300 eightd-translate-z-20">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white group-hover:text-purple-400 transition-colors eightd-text-depth">
                  Job Opportunities
                </h3>
                <p className="mt-3 text-sm text-white/50 group-hover:text-white/70 transition-colors eightd-translate-z-10">
                  Access exclusive job postings and project opportunities from top companies.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="eightd-card-tilt group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-transparent p-8 transition-all duration-500 hover:border-yellow-500/30 hover:shadow-[0_0_40px_rgba(234,179,8,0.1)] hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 eightd-translate-z-10" />
              <div className="relative eightd-transform-style-3d">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400 group-hover:scale-110 group-hover:bg-yellow-500/20 transition-all duration-300 eightd-translate-z-20">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors eightd-text-depth">
                  Real-time Collaboration
                </h3>
                <p className="mt-3 text-sm text-white/50 group-hover:text-white/70 transition-colors eightd-translate-z-10">
                  Work together seamlessly with integrated messaging and collaboration tools.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="eightd-card-tilt group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-transparent p-8 transition-all duration-500 hover:border-red-500/30 hover:shadow-[0_0_40px_rgba(239,68,68,0.1)] hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 eightd-translate-z-10" />
              <div className="relative eightd-transform-style-3d">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400 group-hover:scale-110 group-hover:bg-red-500/20 transition-all duration-300 eightd-translate-z-20">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white group-hover:text-red-400 transition-colors eightd-text-depth">
                  Secure Platform
                </h3>
                <p className="mt-3 text-sm text-white/50 group-hover:text-white/70 transition-colors eightd-translate-z-10">
                  Your data and privacy are protected with enterprise-grade security.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="eightd-card-tilt group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-transparent p-8 transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(6,182,212,0.1)] hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 eightd-translate-z-10" />
              <div className="relative eightd-transform-style-3d">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-300 eightd-translate-z-20">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors eightd-text-depth">
                  Global Network
                </h3>
                <p className="mt-3 text-sm text-white/50 group-hover:text-white/70 transition-colors eightd-translate-z-10">
                  Connect with developers and companies from around the world.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Platform Status Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-0 w-[800px] h-[400px] bg-green-500/5 rounded-full blur-[100px]" />
          <div className="absolute right-1/4 bottom-0 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
          
          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-4 py-2 mb-6">
              <Activity className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">
                Live Platform Status
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Real-Time Platform Overview
            </h2>
            <p className="mt-4 text-lg text-white/50">
              Monitor the current state of our developer ecosystem
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 eightd-transform-style-3d">
            
            {/* Developers Status */}
            <div className="eightd-card-tilt group relative overflow-hidden rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent p-8 transition-all duration-500 hover:border-green-500/40 hover:shadow-[0_0_40px_rgba(34,197,94,0.15)]">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity eightd-translate-z-20">
                <Users className="h-24 w-24 text-green-400" />
              </div>
              
              <div className="relative eightd-transform-style-3d">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/20 text-green-400 eightd-translate-z-30">
                    <Users className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white eightd-text-depth">Developers</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs font-medium text-green-400">Live</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Total Registered</span>
                    <span className="text-2xl font-bold text-white">
                      {loading ? '...' : platformStats.developers.total}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Active & Available</span>
                    <span className="text-2xl font-bold text-green-400">
                      {loading ? '...' : platformStats.developers.active}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Currently Offline</span>
                    <span className="text-2xl font-bold text-white/40">
                      {loading ? '...' : platformStats.developers.inactive}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-white/40">Availability Rate</span>
                      <span className="text-green-400">
                        {loading ? '...' : `${Math.round((platformStats.developers.active / Math.max(platformStats.developers.total, 1)) * 100)}%`}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000"
                        style={{ width: loading ? '0%' : `${(platformStats.developers.active / Math.max(platformStats.developers.total, 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <Link 
                  to="/developers"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-green-400 hover:text-green-300 transition-colors"
                >
                  View All Developers
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Clients Status */}
            <div className="eightd-card-tilt group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent p-8 transition-all duration-500 hover:border-blue-500/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity eightd-translate-z-20">
                <UserCheck className="h-24 w-24 text-blue-400" />
              </div>
              
              <div className="relative eightd-transform-style-3d">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 eightd-translate-z-30">
                    <UserCheck className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white eightd-text-depth">Clients</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                      <span className="text-xs font-medium text-blue-400">Active</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Total Clients</span>
                    <span className="text-2xl font-bold text-white">
                      {loading ? '...' : platformStats.clients.total}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Active Projects</span>
                    <span className="text-2xl font-bold text-blue-400">
                      {loading ? '...' : '47'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">This Week</span>
                    <span className="text-2xl font-bold text-white/40">
                      {loading ? '...' : '+12'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-white/40">Engagement Rate</span>
                      <span className="text-blue-400">89%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[89%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                    </div>
                  </div>
                </div>

                <Link 
                  to="/companies"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Browse Projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Companies Status */}
            <div className="eightd-card-tilt group relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent p-8 transition-all duration-500 hover:border-purple-500/40 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity eightd-translate-z-20">
                <Building2 className="h-24 w-24 text-purple-400" />
              </div>
              
              <div className="relative eightd-transform-style-3d">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 eightd-translate-z-30">
                    <Building2 className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white eightd-text-depth">Companies</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                      <span className="text-xs font-medium text-purple-400">Growing</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Registered Companies</span>
                    <span className="text-2xl font-bold text-white">
                      {loading ? '...' : platformStats.companies.total}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Open Positions</span>
                    <span className="text-2xl font-bold text-purple-400">
                      {loading ? '...' : '156'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Hired This Month</span>
                    <span className="text-2xl font-bold text-white/40">
                      {loading ? '...' : '34'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-white/40">Growth Rate</span>
                      <span className="text-purple-400">
                        {loading ? '...' : platformStats.platformHealth.userGrowth}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[75%] rounded-full bg-gradient-to-r from-purple-500 to-pink-400" />
                    </div>
                  </div>
                </div>

                <Link 
                  to="/companies"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Explore Companies
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-20 lg:py-32 border-t border-white/[0.08]">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
          
          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">
                Latest Activity
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Join the Growing Community
            </h2>
            <p className="mt-4 text-lg text-white/50">
              See who's recently joined our platform
            </p>
          </div>

          {/* Activity Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            
            {/* Recent Users */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-green-400" />
                New Members
              </h3>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center text-white/40 py-8">Loading...</div>
                ) : recentActivity.recentUsers.length > 0 ? (
                  recentActivity.recentUsers.map((user, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 text-xs font-bold text-white">
                        {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-white/40 capitalize">{user.role}</p>
                      </div>
                      <div className="text-xs text-white/30">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-white/40 py-8">No recent users</div>
                )}
              </div>
            </div>

            {/* Recent Companies */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-400" />
                New Companies
              </h3>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center text-white/40 py-8">Loading...</div>
                ) : recentActivity.recentCompanies.length > 0 ? (
                  recentActivity.recentCompanies.map((company, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-xs font-bold text-white">
                        {company.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'C'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{company.name}</p>
                        <p className="text-xs text-white/40">{company.industry || 'Technology'}</p>
                      </div>
                      <div className="text-xs text-white/30">
                        {new Date(company.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-white/40 py-8">No recent companies</div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden eightd-transform-style-3d">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden eightd-transform-style-3d">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-cyan-500/10 rounded-full blur-[150px] animate-eightd-depth-pulse eightd-translate-z-50" />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10 eightd-transform-style-3d">
          <div className="eightd-card-tilt relative overflow-hidden rounded-3xl border border-green-500/20 bg-gradient-to-r from-green-500/10 via-green-500/5 to-emerald-500/10 p-12 text-center backdrop-blur-xl">
            
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-emerald-500/5 animate-gradient eightd-translate-z-10" />
            
            {/* 8D Floating Stars */}
            <div className="absolute inset-0 overflow-hidden eightd-transform-style-3d">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="eightd-particle absolute w-1.5 h-1.5 bg-white/30 rounded-full animate-eightd-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${5 + Math.random() * 10}s`,
                    transform: `translateZ(${Math.random() * 30}px)`
                  }}
                />
              ))}
            </div>
            
            <div className="relative eightd-transform-style-3d eightd-translate-z-20">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 mb-6 animate-glow eightd-button eightd-interactive">
                <Star className="h-4 w-4 text-green-400 fill-green-400 eightd-translate-z-10" />
                <span className="text-sm font-medium text-green-400 eightd-text-depth">
                  Join {loading ? '...' : platformStats.totalUsers}+ Members
                </span>
              </div>
              
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl eightd-text-depth">
                Ready to Start Your Journey?
              </h2>
              <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto eightd-translate-z-10">
                Join thousands of developers who are already building their careers on Nexora.
              </p>
              
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center eightd-transform-style-3d">
                <Link
                  to="/register"
                  className="eightd-button eightd-interactive inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-4 text-sm font-bold text-[#031006] shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:scale-105 hover:from-green-400 hover:to-emerald-400"
                >
                  Create Free Account
                  <ArrowRight className="h-4 w-4 eightd-translate-z-10" />
                </Link>
                
                <Link
                  to="/login"
                  className="eightd-button eightd-interactive inline-flex items-center justify-center rounded-xl border border-white/[0.2] bg-white/[0.05] px-8 py-4 text-sm font-semibold text-white/80 transition-all duration-300 hover:bg-white/[0.1] hover:border-white/[0.3]"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Status Section */}
      <section className="py-16 border-t border-white/[0.08]">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">All Systems Operational</div>
                <div className="text-xs text-white/40">Platform running smoothly</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">99.9% Uptime</div>
                <div className="text-xs text-white/40">Last 30 days</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                <Server className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Backend Status</div>
                <div className="text-xs text-white/40">
                  {backendStatus.status.charAt(0).toUpperCase() + backendStatus.status.slice(1)} 
                  {backendStatus.responseTime && ` (${backendStatus.responseTime}ms)`}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      </div>
    </div>
  );
};

export default Home;