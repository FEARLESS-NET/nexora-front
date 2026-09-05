import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  UserRound,
  BriefcaseBusiness,
  MessageCircle,
  Bell,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building2,
  Users,
  FolderKanban,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

const Sidebar = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem(
      "sidebar-collapsed",
      String(collapsed)
    );
  }, [collapsed]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ===============================
  // ROLE
  // ===============================

  const role = user?.role;

  // ===============================
  // MENU
  // ===============================

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: ["client", "developer", "company", "admin"],
    },

    {
      label: "Profile",
      path: "/dashboard/profile",
      icon: UserRound,
      roles: ["client", "developer", "company", "admin"],
    },

    {
      label: "Portfolio",
      path: "/dashboard/portfolio",
      icon: BriefcaseBusiness,
      roles: ["developer"],
    },

    {
      label: "Projects",
      path: "/dashboard/portfolio",
      icon: FolderKanban,
      roles: ["company"],
    },

    {
      label: "Discover",
      path: "/dashboard/discover",
      icon: Search,
      roles: ["client", "developer", "company"],
    },

    {
      label: "Developers",
      path: "/developers",
      icon: Users,
      roles: ["company", "client"],
    },

    {
      label: "Messages",
      path: "/dashboard/messages",
      icon: MessageCircle,
      roles: ["client", "developer", "company"],
    },

    {
      label: "Notifications",
      path: "/dashboard/notifications",
      icon: Bell,
      roles: ["client", "developer", "company", "admin"],
    },

    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: Settings,
      roles: ["client", "developer", "company", "admin"],
    },

    {
      label: "Admin Panel",
      path: "/admin",
      icon: Building2,
      roles: ["admin"],
    },
  ];

  // ===============================
  // FILTER MENU BY ROLE
  // ===============================

  const visibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <aside
      className={`sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 overflow-y-auto border-r border-white/10 bg-gray-950 transition-all duration-300 lg:block ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex min-h-full flex-col p-3">

        {/* =========================
            TOP
        ========================== */}

        <div
          className={`mb-5 flex items-center ${
            collapsed
              ? "justify-center"
              : "justify-between"
          }`}
        >
          {!collapsed && (
            <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-gray-500">
                Workspace
              </p>

              <p className="mt-1 truncate font-semibold text-white">
                {user?.name || "My Workspace"}
              </p>

              {user?.role && (
                <p className="mt-1 text-xs capitalize text-gray-500">
                  {user.role}
                </p>
              )}
            </div>
          )}

          {/* COLLAPSE */}

          <button
            type="button"
            onClick={() =>
              setCollapsed((value) => !value)
            }
            title={
              collapsed
                ? "Open sidebar"
                : "Collapse sidebar"
            }
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gray-500 transition-all duration-200 hover:border-green-500/30 hover:bg-green-500/10 hover:text-green-400 ${
              collapsed ? "" : "ml-2"
            }`}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* =========================
            NAVIGATION
        ========================== */}

        <nav className="space-y-1">

          {visibleMenuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={
                  collapsed
                    ? item.label
                    : undefined
                }
                className={({ isActive }) =>
                  `group relative flex items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-200 ${
                    collapsed
                      ? "justify-center px-0"
                      : "gap-3 px-3"
                  } ${
                    isActive
                      ? "bg-green-500/10 text-green-400"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* ACTIVE INDICATOR */}

                    {isActive && (
                      <span className="absolute left-0 h-6 w-0.5 rounded-full bg-green-400" />
                    )}

                    <Icon
                      className={`h-5 w-5 shrink-0 transition-all duration-200 ${
                        isActive
                          ? "text-green-400"
                          : "text-gray-500 group-hover:text-green-400"
                      } group-hover:scale-110`}
                    />

                    {!collapsed && (
                      <span className="truncate">
                        {item.label}
                      </span>
                    )}

                    {/* TOOLTIP */}

                    {collapsed && (
                      <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg border border-white/10 bg-gray-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100">
                        {item.label}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

        </nav>

        {/* =========================
            BOTTOM
        ========================== */}

        <div className="mt-auto border-t border-white/10 pt-4">

          {/* USER */}

          {!collapsed && user && (
            <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-green-500/10 font-semibold text-green-400">

                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user.name
                      ?.charAt(0)
                      ?.toUpperCase() || "U"
                  )}

                </div>

                <div className="min-w-0">

                  <p className="truncate text-sm font-semibold text-white">
                    {user.name}
                  </p>

                  <p className="truncate text-xs text-gray-500">
                    @{user.username}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-gray-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>

            </div>
          )}

          {/* COLLAPSED USER */}

          {collapsed && (
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="group flex w-full justify-center rounded-xl py-2.5 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-5 w-5 transition group-hover:scale-110" />
            </button>
          )}

          {/* NEXORA */}

          {!collapsed ? (
            <div className="rounded-2xl bg-green-500/5 p-4">

              <p className="text-sm font-medium text-green-400">
                Build your future
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Connect with developers, clients and companies.
              </p>

            </div>
          ) : (
            <div className="mt-3 flex justify-center">

              <div
                title="Nexora"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/5 text-green-400"
              >
                <BriefcaseBusiness className="h-5 w-5" />
              </div>

            </div>
          )}

        </div>

      </div>
    </aside>
  );
};

export default Sidebar;