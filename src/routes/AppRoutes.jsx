import { BrowserRouter, Routes, Route } from "react-router-dom";

// ===============================
// LAYOUTS
// ===============================

import MainLayout from "../layouts/MainLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

// ===============================
// PUBLIC PAGES
// ===============================

import Home from "../pages/Home.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";

import Developers from "../pages/Developers.jsx";
import DeveloperProfile from "../pages/DeveloperProfile.jsx";

import Companies from "../pages/Companies.jsx";
import CompanyDetail from "../pages/CompanyDetail.jsx";
import ResumeBuilder from "../pages/ResumeBuilder.jsx";
import AllProjects from "../pages/AllProjects.jsx";

import AdminDashboard from "../pages/admin/AdminDashboard.jsx";

// ===============================
// DASHBOARD PAGES
// ===============================

import Dashboards from "../pages/Dashboards.jsx";
import Profile from "../pages/dashboard/Profile.jsx";
import Portfolio from "../pages/dashboard/Portfolio.jsx";
import Messages from "../pages/dashboard/Messages.jsx";
import Notifications from "../pages/dashboard/Notifications.jsx";
import Settings from "../pages/dashboard/Settings.jsx";
import Discover from "../pages/dashboard/Discover.jsx";
import Proposals from "../pages/dashboard/Proposals.jsx";

// ===============================
// AUTH
// ===============================

import ProtectedRoute from "../components/ProtectedRoute.jsx";

// ===============================
// ROUTES
// ===============================

const AppRoutes = () => {
  return (
    <BrowserRouter>
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

          {/* MAIN DASHBOARD */}
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

          {/* ADMIN DASHBOARD */}
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
    </BrowserRouter>
  );
};

export default AppRoutes;