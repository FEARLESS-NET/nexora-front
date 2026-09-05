import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

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

// ===============================
// LOADING COMPONENT
// ===============================

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

// ===============================
// APP ROUTES
// ===============================

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* =================================
              PUBLIC PAGES
          ================================= */}

          {/* HOME */}
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />

          {/* LOGIN */}
          <Route
            path="/login"
            element={
              <MainLayout>
                <Login />
              </MainLayout>
            }
          />

          {/* REGISTER */}
          <Route
            path="/register"
            element={
              <MainLayout>
                <Register />
              </MainLayout>
            }
          />

          {/* DEVELOPERS */}
          <Route
            path="/developers"
            element={
              <MainLayout>
                <Developers />
              </MainLayout>
            }
          />

          {/* DEVELOPER PROFILE */}
          <Route
            path="/developers/:username"
            element={
              <MainLayout>
                <DeveloperProfile />
              </MainLayout>
            }
          />

          {/* COMPANIES */}
          <Route
            path="/companies"
            element={
              <MainLayout>
                <Companies />
              </MainLayout>
            }
          />

          {/* COMPANY DETAIL */}
          <Route
            path="/companies/:id"
            element={
              <MainLayout>
                <CompanyDetail />
              </MainLayout>
            }
          />

          {/* RESUME BUILDER */}
          <Route
            path="/resume-builder"
            element={
              <MainLayout>
                <ResumeBuilder />
              </MainLayout>
            }
          />

          {/* ALL PROJECTS */}
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

            {/* DASHBOARD */}
            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <Dashboards />
                </DashboardLayout>
              }
            />

            {/* PROFILE */}
            <Route
              path="/dashboard/profile"
              element={
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              }
            />

            {/* PORTFOLIO */}
            <Route
              path="/dashboard/portfolio"
              element={
                <DashboardLayout>
                  <Portfolio />
                </DashboardLayout>
              }
            />

            {/* MESSAGES */}
            <Route
              path="/dashboard/messages"
              element={
                <DashboardLayout>
                  <Messages />
                </DashboardLayout>
              }
            />

            {/* NOTIFICATIONS */}
            <Route
              path="/dashboard/notifications"
              element={
                <DashboardLayout>
                  <Notifications />
                </DashboardLayout>
              }
            />

            {/* SETTINGS */}
            <Route
              path="/dashboard/settings"
              element={
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              }
            />

            {/* DISCOVER */}
            <Route
              path="/dashboard/discover"
              element={
                <DashboardLayout>
                  <Discover />
                </DashboardLayout>
              }
            />

            {/* PROPOSALS */}
            <Route
              path="/dashboard/proposals"
              element={
                <DashboardLayout>
                  <Proposals />
                </DashboardLayout>
              }
            />

            {/* ADMIN */}
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