import {
  Bell,
  MessageCircle,
  Briefcase,
  UserPlus,
  Check,
  CheckCheck,
  Settings,
  Loader2,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:3013/api";

const iconMap = {
  proposal_received: Briefcase,
  proposal_accepted: Check,
  proposal_rejected: Settings,
  new_message: MessageCircle,
  project_view: Bell,
  profile_view: UserPlus,
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Fetch notifications error:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId
              ? { ...notif, read: true }
              : notif
          )
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/notifications/read/all`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) => ({
            ...notif,
            read: true,
          }))
        );

        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Mark all as read error:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const deletedNotif = notifications.find(
          (notification) => notification._id === notificationId
        );

        setNotifications((prev) =>
          prev.filter((notif) => notif._id !== notificationId)
        );

        if (deletedNotif && !deletedNotif.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error("Delete notification error:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins} minutes ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString();
  };

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-400" />
      </div>
    );
  }

  // ================================
  // PAGE
  // ================================

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col p-20">
      {/* ================================
          HEADER
      ================================= */}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-green-400">
            Stay updated
          </p>

          <h1 className="mt-1 text-xl font-bold tracking-tight text-white">
            Notifications
          </h1>
        </div>

        <button
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="flex w-fit shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-gray-300 transition hover:border-green-500/30 hover:text-green-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Mark all as read
        </button>
      </div>

      {/* ================================
          NOTIFICATIONS CARD
      ================================= */}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        {notifications.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
            <Bell className="h-10 w-10 text-gray-600" />

            <h3 className="mt-3 text-base font-semibold text-white">
              No notifications
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              You're all caught up!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {notifications.map((notification) => {
              const Icon = iconMap[notification.type] || Bell;

              return (
                <div
                  key={notification._id}
                  className={`group flex items-start gap-3 p-3 transition hover:bg-white/[0.03] ${
                    !notification.read ? "bg-green-500/[0.03]" : ""
                  }`}
                >
                  {/* ================================
                      ICON
                  ================================= */}

                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
                    <Icon className="h-4 w-4 text-green-400" />

                    {!notification.read && (
                      <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-green-400" />
                    )}
                  </div>

                  {/* ================================
                      CONTENT
                  ================================= */}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                      <h2
                        className={`min-w-0 truncate text-xs font-semibold ${
                          !notification.read
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                      >
                        {notification.title}
                      </h2>

                      <span className="shrink-0 text-[10px] text-gray-600">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                      {notification.content}
                    </p>
                  </div>

                  {/* ================================
                      ACTIONS
                  ================================= */}

                  <div className="flex shrink-0 items-center gap-1">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        title="Mark as read"
                        className="rounded-lg p-1.5 text-gray-600 transition hover:bg-white/5 hover:text-green-400"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() =>
                        deleteNotification(notification._id)
                      }
                      title="Delete"
                      className="rounded-lg p-1.5 text-gray-600 transition hover:bg-white/5 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;