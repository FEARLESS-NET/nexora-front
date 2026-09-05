import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useState, useCallback } from "react";

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
// PARTICLES
// ======================================================

const particles = [
  [8, 18, 2, 1],
  [14, 72, 1, 2],
  [21, 34, 2, 3],
  [27, 84, 1, 1],
  [32, 14, 2, 2],
  [39, 68, 1, 3],
  [44, 26, 2, 1],
  [49, 90, 1, 2],
  [55, 12, 2, 3],
  [61, 76, 1, 1],
  [67, 29, 2, 2],
  [72, 63, 1, 3],
  [78, 18, 2, 1],
  [84, 81, 1, 2],
  [91, 39, 2, 3],
  [5, 51, 1, 2],
  [17, 91, 2, 1],
  [25, 9, 1, 3],
  [35, 48, 2, 2],
  [47, 5, 1, 1],
  [58, 45, 2, 3],
  [69, 94, 1, 2],
  [76, 47, 2, 1],
  [88, 14, 1, 3],
  [95, 68, 2, 2],
];

// ======================================================
// NEXORA INTRO
// ======================================================

const NexoraIntro = ({ onFinish }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  // Pointer-driven parallax — this is what gives the portal
  // its "8D" depth: every ring/layer reacts to the cursor at a
  // different intensity, so they appear to sit at different
  // distances from the screen plane.
  useEffect(() => {
    const handleMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      setTilt({ x: nx, y: ny });
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden bg-[#010402] text-white">

      {/* =================================================
          DEEP BACKGROUND
      ================================================= */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,120,0.07)_0%,rgba(0,20,10,0.35)_28%,#010402_70%)]" />

      {/* Large atmospheric glow */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[900px]
          w-[900px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-green-500/[0.05]
          blur-[150px]
          animate-pulse
        "
      />

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[550px]
          w-[550px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-emerald-400/[0.07]
          blur-[100px]
        "
      />

      {/* =================================================
          PARTICLES
      ================================================= */}

      <div
        className="pointer-events-none absolute inset-0 transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${tilt.x * 10}px, ${tilt.y * 10}px)`,
        }}
      >

        {particles.map(([left, top, size, delay], index) => (
          <span
            key={index}
            className="
              absolute
              rounded-full
              bg-green-300
              shadow-[0_0_8px_rgba(74,222,128,0.9)]
              animate-pulse
            "
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay * 0.4}s`,
              animationDuration: `${1.5 + delay * 0.4}s`,
            }}
          />
        ))}

      </div>

      {/* =================================================
          CENTER STAGE
      ================================================= */}

      <div className="relative z-20 flex min-h-screen items-center justify-center">

        <div className="relative flex flex-col items-center justify-center">

          {/* =================================================
              HUGE ENERGY RAYS
          ================================================= */}

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[850px] w-[850px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-out"
            style={{
              transform: `translate(${tilt.x * -18}px, ${tilt.y * -18}px)`,
            }}
          >

            {/* Vertical */}

            <div
              className="
                absolute
                left-1/2
                top-0
                h-[280px]
                w-[3px]
                -translate-x-1/2
                bg-gradient-to-b
                from-transparent
                via-green-300
                to-transparent
                opacity-70
                blur-[2px]
                animate-pulse
              "
            />

            <div
              className="
                absolute
                bottom-0
                left-1/2
                h-[280px]
                w-[3px]
                -translate-x-1/2
                bg-gradient-to-t
                from-transparent
                via-green-300
                to-transparent
                opacity-70
                blur-[2px]
                animate-pulse
              "
            />

            {/* Horizontal */}

            <div
              className="
                absolute
                left-0
                top-1/2
                h-[3px]
                w-[280px]
                -translate-y-1/2
                bg-gradient-to-r
                from-transparent
                via-green-300
                to-transparent
                opacity-70
                blur-[2px]
                animate-pulse
              "
            />

            <div
              className="
                absolute
                right-0
                top-1/2
                h-[3px]
                w-[280px]
                -translate-y-1/2
                bg-gradient-to-l
                from-transparent
                via-green-300
                to-transparent
                opacity-70
                blur-[2px]
                animate-pulse
              "
            />

            {/* Diagonal rays */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-[500px]
                w-[2px]
                origin-center
                -translate-x-1/2
                -translate-y-1/2
                rotate-45
                bg-gradient-to-b
                from-transparent
                via-green-400/60
                to-transparent
                blur-[2px]
              "
            />

            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-[500px]
                w-[2px]
                origin-center
                -translate-x-1/2
                -translate-y-1/2
                -rotate-45
                bg-gradient-to-b
                from-transparent
                via-emerald-300/60
                to-transparent
                blur-[2px]
              "
            />

          </div>

          {/* =================================================
              PORTAL SYSTEM — 8D DEPTH STAGE
              A perspective wrapper turns every ring/layer into
              its own "depth plane": each one gets a distinct
              translateZ + rotateX/rotateY so the whole portal
              reads as a real volumetric tunnel instead of a
              flat spinning graphic. Layers react to the cursor
              at different strengths (parallax) to sell the depth.
          ================================================= */}

          <div
            className="relative h-[380px] w-[380px]"
            style={{ perspective: "1400px" }}
          >

            <div
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateX(${tilt.y * -14}deg) rotateY(${tilt.x * 14}deg)`,
              }}
            >

              {/* Outer aura */}

              <div
                className="
                  absolute
                  -inset-[70px]
                  rounded-full
                  bg-green-400/[0.05]
                  blur-[45px]
                  animate-pulse
                "
                style={{ transform: "translateZ(-160px)" }}
              />

              {/* Farthest depth ring — deep background layer */}

              <div
                className="
                  absolute
                  -inset-[20px]
                  rounded-full
                  border
                  border-green-200/20
                  shadow-[0_0_50px_rgba(34,197,94,0.25)]
                  animate-[spin_20s_linear_infinite_reverse]
                "
                style={{ transform: "translateZ(-120px) scale(1.15)" }}
              />

              {/* Outer rotating ring */}

              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  border
                  border-green-300/40
                  shadow-[0_0_35px_rgba(34,197,94,0.45),0_0_90px_rgba(34,197,94,0.3),0_0_180px_rgba(34,197,94,0.15)]
                  animate-[spin_14s_linear_infinite]
                "
                style={{ transform: "translateZ(-80px)" }}
              />

              {/* Outer broken energy ring */}

              <div
                className="
                  absolute
                  inset-[12px]
                  rounded-full
                  border-[3px]
                  border-dashed
                  border-green-400/60
                  shadow-[0_0_30px_rgba(34,197,94,0.35)]
                  animate-[spin_8s_linear_infinite_reverse]
                "
                style={{ transform: "translateZ(-40px)" }}
              />

              {/* Third ring */}

              <div
                className="
                  absolute
                  inset-[30px]
                  rounded-full
                  border
                  border-emerald-300/50
                  shadow-[0_0_25px_rgba(52,211,153,0.4),inset_0_0_35px_rgba(34,197,94,0.25)]
                  animate-[spin_10s_linear_infinite]
                "
                style={{ transform: "translateZ(-10px)" }}
              />

              {/* Inner rotating ring */}

              <div
                className="
                  absolute
                  inset-[48px]
                  rounded-full
                  border-2
                  border-green-400/30
                  border-dotted
                  animate-[spin_6s_linear_infinite_reverse]
                "
                style={{ transform: "translateZ(20px)" }}
              />

              {/* Fine tilted ring — closest ring, tilts opposite the
                  outer ones so the tunnel appears to rotate around
                  more than one axis at once */}

              <div
                className="
                  absolute
                  inset-[40px]
                  rounded-full
                  border
                  border-lime-200/25
                  animate-[spin_16s_linear_infinite]
                "
                style={{
                  transform: "translateZ(35px) rotateX(55deg)",
                }}
              />

              {/* =================================================
                  PORTAL CORE
              ================================================= */}

              <div
                className="
                  absolute
                  inset-[65px]
                  overflow-hidden
                  rounded-full
                  bg-[#010603]
                  shadow-[inset_0_0_50px_rgba(34,197,94,0.9),inset_0_0_110px_rgba(34,197,94,0.4),0_0_50px_rgba(34,197,94,0.5),0_0_100px_rgba(34,197,94,0.3)]
                "
                style={{ transform: "translateZ(45px)" }}
              >

                {/* Core glow */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[180px]
                    w-[180px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-green-400/[0.14]
                    blur-[45px]
                    animate-pulse
                  "
                />

                {/* Core vortex */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[135px]
                    w-[135px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    border
                    border-green-300/40
                    shadow-[0_0_35px_rgba(34,197,94,0.5),inset_0_0_35px_rgba(34,197,94,0.4)]
                    animate-[spin_5s_linear_infinite]
                  "
                />

                {/* Secondary vortex, counter-spinning, slightly
                    offset scale — adds a "tunneling" flicker */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[105px]
                    w-[105px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    border
                    border-lime-200/50
                    shadow-[0_0_25px_rgba(163,230,53,0.5)]
                    animate-[spin_3.2s_linear_infinite_reverse]
                  "
                />

                {/* Core center */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[75px]
                    w-[75px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-[radial-gradient(circle,rgba(220,255,230,0.95)_0%,rgba(134,239,172,0.8)_18%,rgba(34,197,94,0.35)_38%,rgba(0,0,0,0.95)_72%)]
                    shadow-[0_0_40px_rgba(220,255,230,1),0_0_90px_rgba(74,222,128,0.7),0_0_150px_rgba(34,197,94,0.4)]
                    animate-pulse
                  "
                />

              </div>

              {/* =================================================
                  ENERGY POINTS — pushed slightly forward (positive Z)
                  so they read as sparks flying off the front rim
              ================================================= */}

              <div
                className="absolute inset-0 animate-[spin_10s_linear_infinite]"
                style={{ transform: "translateZ(50px)" }}
              >

                <span
                  className="
                    absolute
                    left-1/2
                    top-[-5px]
                    h-10
                    w-2
                    -translate-x-1/2
                    rounded-full
                    bg-green-200
                    shadow-[0_0_12px_#86efac,0_0_30px_#22c55e,0_0_60px_#22c55e]
                  "
                />

                <span
                  className="
                    absolute
                    bottom-[-5px]
                    left-1/2
                    h-10
                    w-2
                    -translate-x-1/2
                    rounded-full
                    bg-green-300
                    shadow-[0_0_12px_#86efac,0_0_30px_#22c55e]
                  "
                />

                <span
                  className="
                    absolute
                    left-[-5px]
                    top-1/2
                    h-2
                    w-10
                    -translate-y-1/2
                    rounded-full
                    bg-green-300
                    shadow-[0_0_12px_#86efac,0_0_30px_#22c55e]
                  "
                />

                <span
                  className="
                    absolute
                    right-[-5px]
                    top-1/2
                    h-2
                    w-10
                    -translate-y-1/2
                    rounded-full
                    bg-green-300
                    shadow-[0_0_12px_#86efac,0_0_30px_#22c55e]
                  "
                />

              </div>

              {/* Secondary energy points on the opposite spin
                  direction and a different Z depth, for extra
                  layered motion parallax */}

              <div
                className="absolute inset-0 animate-[spin_7s_linear_infinite_reverse]"
                style={{ transform: "translateZ(-30px) rotate(45deg)" }}
              >

                <span
                  className="
                    absolute
                    left-1/2
                    top-[6px]
                    h-6
                    w-[6px]
                    -translate-x-1/2
                    rounded-full
                    bg-lime-200/80
                    shadow-[0_0_10px_#bef264,0_0_24px_#22c55e]
                  "
                />

                <span
                  className="
                    absolute
                    bottom-[6px]
                    left-1/2
                    h-6
                    w-[6px]
                    -translate-x-1/2
                    rounded-full
                    bg-lime-200/80
                    shadow-[0_0_10px_#bef264,0_0_24px_#22c55e]
                  "
                />

              </div>

            </div>

          </div>

          {/* =================================================
              NEXORA LOGO
          ================================================= */}

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">

            <div className="relative flex flex-col items-center">

              <div
                className="
                  absolute
                  inset-0
                  bg-green-400/30
                  blur-[30px]
                "
              />

              <h1
                className="
                  relative
                  whitespace-nowrap
                  text-5xl
                  font-black
                  tracking-[0.32em]
                  text-white
                  drop-shadow-[0_0_10px_rgba(134,239,172,0.9)]
                  drop-shadow-[0_0_30px_rgba(34,197,94,0.7)]
                "
              >
                NEXORA
              </h1>

            </div>

          </div>

          {/* =================================================
              WELCOME TEXT
          ================================================= */}

          <div className="mt-16 text-center">

            <p
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.6em]
                text-green-300
                drop-shadow-[0_0_12px_rgba(74,222,128,0.8)]
                animate-pulse
              "
            >
              WELCOME DEVELOPERS
            </p>

            <p
              className="
                mt-4
                text-xs
                font-medium
                uppercase
                tracking-[0.45em]
                text-gray-500
              "
            >
              BUILD • CONNECT • CREATE
            </p>

          </div>

          {/* =================================================
              LOADING PROGRESS
          ================================================= */}

          <div className="mt-9">

            <div className="h-[2px] w-56 overflow-hidden rounded-full bg-white/10">

              <div
                className="
                  h-full
                  w-full
                  origin-left
                  bg-gradient-to-r
                  from-transparent
                  via-green-300
                  to-transparent
                  animate-[scaleX_3.7s_ease-in-out_forwards]
                "
              />

            </div>

            <p className="mt-3 text-[10px] uppercase tracking-[0.4em] text-gray-600">
              Initializing Nexora
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          VIGNETTE
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          shadow-[inset_0_0_180px_rgba(0,0,0,0.9)]
        "
      />

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

  const finishIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <BrowserRouter>

      {/* =========================================
          NEXORA SPLASH
      ========================================= */}

      {showIntro && (
        <NexoraIntro onFinish={finishIntro} />
      )}

      {/* =========================================
          ROUTES
      ========================================= */}

      <Suspense fallback={<PageLoader />}>

        <Routes>

          {/* PUBLIC */}

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

          {/* PROTECTED */}

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

          {/* 404 */}

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
