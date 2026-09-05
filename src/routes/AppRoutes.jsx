import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";

// ===============================
// LAYOUTS
// ===============================

import MainLayout from "../layouts/MainLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

// ===============================
// AUTH
// ===============================

import ProtectedRoute from "../components/ProtectedRoute.jsx";

// ===============================
// LAZY PAGES
// ===============================

// Public
const Home = lazy(() => import("../pages/Home.jsx"));
const Login = lazy(() => import("../pages/auth/Login.jsx"));
const Register = lazy(() => import("../pages/auth/Register.jsx"));

const Developers = lazy(() => import("../pages/Developers.jsx"));

const DeveloperProfile = lazy(() =>
  import("../pages/DeveloperProfile.jsx")
);

const Companies = lazy(() => import("../pages/Companies.jsx"));

const CompanyDetail = lazy(() =>
  import("../pages/CompanyDetail.jsx")
);

const ResumeBuilder = lazy(() =>
  import("../pages/ResumeBuilder.jsx")
);

const AllProjects = lazy(() =>
  import("../pages/AllProjects.jsx")
);

// Dashboard
const Dashboards = lazy(() =>
  import("../pages/Dashboards.jsx")
);

const Profile = lazy(() =>
  import("../pages/dashboard/Profile.jsx")
);

const Portfolio = lazy(() =>
  import("../pages/dashboard/Portfolio.jsx")
);

const Messages = lazy(() =>
  import("../pages/dashboard/Messages.jsx")
);

const Notifications = lazy(() =>
  import("../pages/dashboard/Notifications.jsx")
);

const Settings = lazy(() =>
  import("../pages/dashboard/Settings.jsx")
);

const Discover = lazy(() =>
  import("../pages/dashboard/Discover.jsx")
);

const Proposals = lazy(() =>
  import("../pages/dashboard/Proposals.jsx")
);

const AdminDashboard = lazy(() =>
  import("../pages/admin/AdminDashboard.jsx")
);

// ======================================================
// NEXORA INTRO / SPLASH SCREEN
// ======================================================

const NexoraIntro = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden bg-[#010503] text-white">

      {/* =========================================
          BACKGROUND GLOW
      ========================================= */}

      <div className="absolute inset-0">

        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/[0.06] blur-[120px] animate-pulse" />

        <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.05] blur-[80px]" />

      </div>

      {/* =========================================
          PARTICLES
      ========================================= */}

      <div className="absolute inset-0 pointer-events-none">

        {Array.from({ length: 35 }).map((_, index) => (
          <span
            key={index}
            className="absolute h-1 w-1 rounded-full bg-green-400/60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1.5 + Math.random() * 2}s`,
            }}
          />
        ))}

      </div>

      {/* =========================================
          CENTER
      ========================================= */}

      <div className="relative z-10 flex min-h-screen items-center justify-center">

        <div className="relative flex flex-col items-center">

          {/* =====================================
              ENERGY RAYS
          ===================================== */}

          <div className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2">

            <div className="absolute left-1/2 top-0 h-40 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-green-400 to-transparent opacity-60 blur-[1px] animate-pulse" />

            <div className="absolute bottom-0 left-1/2 h-40 w-[2px] -translate-x-1/2 rotate-180 bg-gradient-to-b from-transparent via-green-400 to-transparent opacity-60 blur-[1px] animate-pulse" />

            <div className="absolute left-0 top-1/2 h-[2px] w-40 -translate-y-1/2 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60 blur-[1px] animate-pulse" />

            <div className="absolute right-0 top-1/2 h-[2px] w-40 -translate-y-1/2 rotate-180 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60 blur-[1px] animate-pulse" />

          </div>

          {/* =====================================
              OUTER PORTAL
          ===================================== */}

          <div
            className="
              relative
              h-[310px]
              w-[310px]
              rounded-full
              animate-[spin_12s_linear_infinite]
            "
          >

            {/* Outer glow */}

            <div
              className="
                absolute
                inset-0
                rounded-full
                border
                border-green-400/30
                shadow-[0_0_30px_rgba(34,197,94,0.35),0_0_80px_rgba(34,197,94,0.2),0_0_140px_rgba(34,197,94,0.12)]
              "
            />

            {/* Second ring */}

            <div
              className="
                absolute
                inset-[14px]
                rounded-full
                border-2
                border-green-400/50
                border-dashed
                shadow-[0_0_20px_rgba(34,197,94,0.3)]
              "
            />

            {/* Third ring */}

            <div
              className="
                absolute
                inset-[30px]
                rounded-full
                border
                border-emerald-300/40
                shadow-[inset_0_0_30px_rgba(34,197,94,0.3)]
              "
            />

            {/* Portal light */}

            <div
              className="
                absolute
                inset-[48px]
                rounded-full
                bg-[radial-gradient(circle,rgba(34,197,94,0.3)_0%,rgba(16,185,129,0.08)_35%,rgba(0,0,0,0.9)_70%)]
                shadow-[inset_0_0_60px_rgba(34,197,94,0.5),0_0_40px_rgba(34,197,94,0.25)]
              "
            />

            {/* Rotating energy */}

            <div
              className="
                absolute
                left-1/2
                top-0
                h-20
                w-3
                -translate-x-1/2
                rounded-full
                bg-green-300
                shadow-[0_0_15px_#22c55e,0_0_40px_#22c55e]
              "
            />

            <div
              className="
                absolute
                bottom-0
                left-1/2
                h-16
                w-2
                -translate-x-1/2
                rounded-full
                bg-emerald-300
                shadow-[0_0_15px_#34d399,0_0_40px_#34d399]
              "
            />

          </div>

          {/* =====================================
              CENTER LOGO
          ===================================== */}

          <div className="absolute flex flex-col items-center justify-center">

            <div className="relative">

              <div className="absolute inset-0 blur-2xl bg-green-400/30" />

              <h1
                className="
                  relative
                  text-5xl
                  font-black
                  tracking-[0.28em]
                  text-white
                  drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]
                "
              >
                NEXORA
              </h1>

            </div>

          </div>

          {/* =====================================
              TEXT
          ===================================== */}

          <div className="mt-14 text-center">

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.55em]
                text-green-400
                animate-pulse
              "
            >
              Welcome Developers
            </p>

            <p className="mt-4 text-sm tracking-[0.3em] text-gray-500">
              BUILD • CONNECT • CREATE
            </p>

          </div>

          {/* =====================================
              LOADING LINE
          ===================================== */}

          <div className="mt-8 h-[2px] w-48 overflow-hidden rounded-full bg-white/10">

            <div
              className="
                h-full
                w-full
                origin-left
                animate-[scaleX_3.2s_ease-in-out_forwards]
                bg-gradient-to-r
                from-transparent
                via-green-400
                to-transparent
              "
            />

          </div>

        </div>

      </div>

    </div>
  );
};

// ======================================================
// PAGE LOADER
// ======================================================

const PageLoader = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-950 text-white">

      <div className="flex flex-col items-center gap-4">

        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-green-500" />

        <p className="text-sm text-gray-400">
          Loading...
        </p>

      </div>

    </div>
  );
};

// ======================================================
// APP ROUTES
// ======================================================

const AppRoutes = () => {

  const [showIntro, setShowIntro] = useState(true);

  const finishIntro = () => {
    setShowIntro(false);
  };

  return (
    <BrowserRouter>

      {/* =========================================
          NEXORA INTRO
      ========================================= */}

      {showIntro && (
        <NexoraIntro onFinish={finishIntro} />
      )}

      {/* =========================================
          ROUTES
      ========================================= */}

      <Suspense fallback={<PageLoader />}>

        <Routes>

          {/* =================================
              PUBLIC PAGES
          ================================= */}

          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />

          <Route
            path="/login"
            element={
              <MainLayout>
                <Login />
              </MainLayout>
            }
          />

          <Route
            path="/register"
            element={
              <MainLayout>
                <Register />
              </MainLayout>
            }
          />

          <Route
            path="/developers"
            element={
              <MainLayout>
                <Developers />
              </MainLayout>
            }
          />

          <Route
            path="/developers/:username"
            element={
              <MainLayout>
                <DeveloperProfile />
              </MainLayout>
            }
          />

          <Route
            path="/companies"
            element={
              <MainLayout>
                <Companies />
              </MainLayout>
            }
          />

          <Route
            path="/companies/:id"
            element={
              <MainLayout>
                <CompanyDetail />
              </MainLayout>
            }
          />

          <Route
            path="/resume-builder"
            element={
              <MainLayout>
                <ResumeBuilder />
              </MainLayout>
            }
          />

          <Route
            path="/projects"
            element={
              <MainLayout>
                <AllProjects />
              </MainLayout>
            }
          />

          {/* =================================
              PROTECTED DASHBOARD
          ================================= */}

          <Route element={<ProtectedRoute />}>

            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <Dashboards />
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard/profile"
              element={
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard/portfolio"
              element={
                <DashboardLayout>
                  <Portfolio />
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard/messages"
              element={
                <DashboardLayout>
                  <Messages />
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard/notifications"
              element={
                <DashboardLayout>
                  <Notifications />
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard/settings"
              element={
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard/discover"
              element={
                <DashboardLayout>
                  <Discover />
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard/proposals"
              element={
                <DashboardLayout>
                  <Proposals />
                </DashboardLayout>
              }
            />

            <Route
              path="/admin"
              element={
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              }
            />

          </Route>

          {/* =================================
              404
          ================================= */}

          <Route
            path="*"
            element={
              <MainLayout>
                <div className="min-h-[70vh] flex items-center justify-center bg-gray-950 text-white">

                  <div className="text-center">

                    <h1 className="text-5xl font-bold mb-3">
                      404
                    </h1>

                    <p className="text-gray-400">
                      Page Not Found
                    </p>

                  </div>

                </div>
              </MainLayout>
            }
          />

        </Routes>

      </Suspense>

    </BrowserRouter>
  );
};

export default AppRoutes;