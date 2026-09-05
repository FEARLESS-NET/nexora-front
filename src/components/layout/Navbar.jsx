import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  MessageCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =========================
  // USER INITIALS
  // =========================

  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-blue-400/[0.08] bg-gradient-to-r from-[#050d18] via-[#081525] to-[#06111f] backdrop-blur-2xl eightd-transform-style-3d">

      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10 eightd-transform-style-3d">

        {/* =====================================================
            BRAND
        ====================================================== */}

        <Link
          to="/"
          className="eightd-button eightd-interactive group flex shrink-0 items-center gap-3"
        >

          {/* LOGO */}

          <div className="relative eightd-transform-style-3d">

            {/* Glow */}

            <div className="absolute -inset-2 rounded-2xl bg-green-500/10 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100 eightd-translate-z-10" />

            {/* Logo Box */}

            <div className="eightd-card-tilt relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-[12px] border border-white/[0.08] bg-[#0a1524] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 group-hover:scale-105 group-hover:border-green-500/30 eightd-translate-z-20">

              <img
                src="/nexora.jpg"
                alt="Nexora"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 eightd-translate-z-10"
              />

            </div>

          </div>


          {/* BRAND NAME */}

          <div className="flex flex-col justify-center eightd-translate-z-10">

            <span className="text-[17px] font-black tracking-[-0.045em] text-white transition-colors duration-300 group-hover:text-green-400 eightd-text-depth">
              NEXORA
            </span>

            <span className="-mt-0.5 text-[7px] font-semibold uppercase tracking-[0.28em] text-white/30">
              Developer Platform
            </span>

          </div>

        </Link>


        {/* =====================================================
            CENTER NAVIGATION
        ====================================================== */}

        <nav className="hidden items-center gap-1 lg:flex eightd-transform-style-3d">

          {/* HOME */}

          <Link
            to="/"
            className="eightd-button eightd-interactive group relative rounded-xl px-5 py-2.5 text-[13px] font-medium text-white/50 transition-all duration-200 hover:bg-white/[0.05] hover:text-white eightd-translate-z-10"
          >
            <span className="relative z-10">
              Home
            </span>

            <span className="absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-green-400 transition-all duration-300 group-hover:w-5" />
          </Link>


          {/* DISCOVER */}

          <Link
            to="/dashboard/discover"
            className="eightd-button eightd-interactive group relative rounded-xl px-5 py-2.5 text-[13px] font-medium text-white/50 transition-all duration-200 hover:bg-white/[0.05] hover:text-white eightd-translate-z-10"
          >
            <span className="relative z-10">
              Discover
            </span>

            <span className="absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-green-400 transition-all duration-300 group-hover:w-5" />
          </Link>


          {/* PROJECTS */}

          <Link
            to="/projects"
            className="eightd-button eightd-interactive group relative rounded-xl px-5 py-2.5 text-[13px] font-medium text-white/50 transition-all duration-200 hover:bg-white/[0.05] hover:text-white eightd-translate-z-10"
          >
            <span className="relative z-10">
              All Projects
            </span>

            <span className="absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-green-400 transition-all duration-300 group-hover:w-5" />
          </Link>


          {/* COMPANIES */}

          <Link
            to="/companies"
            className="eightd-button eightd-interactive group relative rounded-xl px-5 py-2.5 text-[13px] font-medium text-white/50 transition-all duration-200 hover:bg-white/[0.05] hover:text-white eightd-translate-z-10"
          >
            <span className="relative z-10">
              Companies
            </span>

            <span className="absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-green-400 transition-all duration-300 group-hover:w-5" />
          </Link>


          {/* RESUME BUILDER */}

          <Link
            to="/resume-builder"
            className="eightd-button eightd-interactive group relative rounded-xl px-5 py-2.5 text-[13px] font-medium text-white/50 transition-all duration-200 hover:bg-white/[0.05] hover:text-white eightd-translate-z-10"
          >
            <span className="relative z-10">
              Resume Builder
            </span>

            <span className="absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-green-400 transition-all duration-300 group-hover:w-5" />
          </Link>

        </nav>


        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}

        <div className="flex shrink-0 items-center gap-1">

          {user ? (
            <>

              {/* =================================================
                  MESSAGES
              ================================================== */}

              <Link
                to="/dashboard/messages"
                title="Messages"
                className="eightd-button eightd-interactive group relative flex h-10 w-10 items-center justify-center rounded-xl text-white/35 transition-all duration-200 hover:bg-white/[0.05] hover:text-green-400 eightd-translate-z-10"
              >

                <MessageCircle
                  className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110 eightd-translate-z-5"
                />

              </Link>


              {/* =================================================
                  NOTIFICATIONS
              ================================================== */}

              <Link
                to="/dashboard/notifications"
                title="Notifications"
                className="eightd-button eightd-interactive group relative flex h-10 w-10 items-center justify-center rounded-xl text-white/35 transition-all duration-200 hover:bg-white/[0.05] hover:text-green-400 eightd-translate-z-10"
              >

                <Bell
                  className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110 eightd-translate-z-5"
                />

                {/* Notification Dot */}

                <span className="absolute right-[9px] top-[8px] h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.9)] eightd-translate-z-5" />

              </Link>


              {/* =================================================
                  DIVIDER
              ================================================== */}

              <div className="mx-2 h-6 w-px bg-white/[0.07]" />


              {/* =================================================
                  USER PROFILE
              ================================================== */}

              <Link
                to="/dashboard/profile"
                className="eightd-button eightd-interactive group flex items-center gap-2.5 rounded-xl border border-transparent px-2 py-1.5 transition-all duration-200 hover:border-white/[0.07] hover:bg-white/[0.035] eightd-translate-z-10"
              >

                {/* Avatar */}

                <div className="relative eightd-transform-style-3d">

                  <div className="eightd-card-tilt flex h-9 w-9 items-center justify-center overflow-hidden rounded-[11px] border border-white/[0.09] bg-gradient-to-br from-green-500/20 via-green-500/5 to-transparent text-[10px] font-bold text-green-400 eightd-translate-z-20">

                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}

                  </div>


                  {/* Online */}

                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#081525] bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)] eightd-translate-z-5" />

                </div>


                {/* User Information */}

                <div className="hidden max-w-[120px] text-left sm:block eightd-translate-z-10">

                  <p className="truncate text-[12px] font-semibold text-white/80 transition-colors duration-200 group-hover:text-white eightd-text-depth">
                    {loading ? "Loading..." : user.name}
                  </p>

                  <p className="mt-0.5 truncate text-[9px] font-medium uppercase tracking-[0.12em] text-white/25">
                    {user.role}
                  </p>

                </div>


                {/* Dropdown Icon */}

                <ChevronDown className="hidden h-3.5 w-3.5 text-white/20 transition-transform duration-200 group-hover:translate-y-0.5 sm:block eightd-translate-z-5" />

              </Link>


              {/* =================================================
                  LOGOUT
              ================================================== */}

              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                className="eightd-button eightd-interactive group ml-1 flex h-10 w-10 items-center justify-center rounded-xl text-white/25 transition-all duration-200 hover:bg-red-500/[0.07] hover:text-red-400 eightd-translate-z-10"
              >

                <LogOut
                  className="h-[17px] w-[17px] transition-transform duration-200 group-hover:translate-x-0.5 eightd-translate-z-5"
                />

              </button>

            </>
          ) : (
            <>

              {/* =================================================
                  LOGIN
              ================================================== */}

              <Link
                to="/login"
                className="eightd-button eightd-interactive rounded-xl px-4 py-2.5 text-[12px] font-semibold text-white/60 transition-all duration-200 hover:bg-white/[0.04] hover:text-white eightd-translate-z-10"
              >
                Login
              </Link>


              {/* =================================================
                  GET STARTED
              ================================================== */}

              <Link
                to="/register"
                className="eightd-button eightd-interactive relative ml-1 overflow-hidden rounded-xl bg-green-500 px-4 py-2.5 text-[12px] font-bold text-[#031006] shadow-[0_0_25px_rgba(34,197,94,0.12)] transition-all duration-300 hover:bg-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] eightd-translate-z-20"
              >

                <span className="relative z-10 eightd-text-depth">
                  Get Started
                </span>

              </Link>

            </>
          )}

        </div>

      </div>

    </header>
  );
};

export default Navbar;