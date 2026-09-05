
import { useEffect, useState } from "react";
import {
  User,
  Lock,
  Bell,
  Globe,
  ShieldCheck,
  Save,
  Trash2,
  AlertTriangle,
  X,
  CheckCircle2,
  Camera,
} from "lucide-react";

// ==========================================
// API CONFIG
// ==========================================

import { API_URL } from "../../utils/config";

const AUTH_API_URL = `${API_URL}/auth`;
const USER_API_URL = `${API_URL}/users`;

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ===============================
  // PROFILE
  // ===============================

  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    avatar: "",
    bio: "",
    location: "",
    skills: [],
    linkedinUrl: "",
    isAvailable: true,
  });

  const [skillsText, setSkillsText] = useState("");

  // ===============================
  // AVATAR
  // ===============================

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);

  // ===============================
  // PASSWORD
  // ===============================

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ===============================
  // DELETE
  // ===============================

  const [deletePassword, setDeletePassword] = useState("");

  // ===============================
  // TOKEN
  // ===============================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ===============================
  // GET PROFILE
  // ===============================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`${AUTH_API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Profile loading failed"
        );
      }

      if (data.success) {
        const user = data.user;

        setProfile({
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          avatar: user.avatar || "",
          bio: user.bio || "",
          location: user.location || "",
          skills: user.skills || [],
          linkedinUrl: user.linkedinUrl || "",
          isAvailable: user.isAvailable ?? true,
        });

        setSkillsText(
          (user.skills || []).join(", ")
        );

        setAvatarPreview(user.avatar || "");
      }
    } catch (error) {
      console.error(
        "Profile fetch error:",
        error
      );

      setError(
        error.message || "Profile loading failed"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ===============================
  // PROFILE INPUT
  // ===============================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // AVATAR CHANGE
  // ===============================

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setMessage("");
    setError("");

    // File type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setAvatarFile(file);

    // Preview
    const previewUrl = URL.createObjectURL(file);

    setAvatarPreview(previewUrl);
  };

  // ===============================
  // SAVE PROFILE
  // ===============================

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setAvatarUploading(!!avatarFile);

      setMessage("");
      setError("");

      const token = getToken();

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const skills = skillsText
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      // FormData because avatar is a file
      const formData = new FormData();

      formData.append("name", profile.name);
      formData.append(
        "username",
        profile.username
      );
      formData.append("bio", profile.bio);
      formData.append(
        "location",
        profile.location
      );

      formData.append(
        "skills",
        JSON.stringify(skills)
      );

      formData.append(
        "linkedinUrl",
        profile.linkedinUrl
      );

      formData.append(
        "isAvailable",
        String(profile.isAvailable)
      );

      // Avatar
      if (avatarFile) {
        formData.append(
          "avatar",
          avatarFile
        );
      }

      const response = await fetch(
        `${USER_API_URL}/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Profile update failed"
        );
      }

      if (data.success) {
        const updatedUser = data.user;

        setProfile((prev) => ({
          ...prev,
          ...updatedUser,
        }));

        setSkillsText(
          (updatedUser.skills || []).join(", ")
        );

        setAvatarPreview(
          updatedUser.avatar || ""
        );

        setAvatarFile(null);

        // Update localStorage user
        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        setMessage(
          "Profile updated successfully."
        );
      }
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      setError(
        error.message ||
          "Profile update failed"
      );
    } finally {
      setSaving(false);
      setAvatarUploading(false);
    }
  };

  // ===============================
  // PASSWORD INPUT
  // ===============================

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // CHANGE PASSWORD
  // ===============================

  const handleChangePassword = async () => {
    try {
      setPasswordSaving(true);
      setMessage("");
      setError("");

      if (
        !passwordForm.currentPassword ||
        !passwordForm.newPassword ||
        !passwordForm.confirmPassword
      ) {
        setError(
          "Please fill all password fields."
        );

        return;
      }

      if (
        passwordForm.newPassword.length < 6
      ) {
        setError(
          "New password must be at least 6 characters."
        );

        return;
      }

      if (
        passwordForm.newPassword !==
        passwordForm.confirmPassword
      ) {
        setError(
          "New passwords do not match."
        );

        return;
      }

      const token = getToken();

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `${AUTH_API_URL}/change-password`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            currentPassword:
              passwordForm.currentPassword,

            newPassword:
              passwordForm.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Password change failed"
        );
      }

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessage(
        "Password changed successfully."
      );
    } catch (error) {
      console.error(
        "Password change error:",
        error
      );

      setError(
        error.message ||
          "Password change failed"
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  // ===============================
  // DELETE ACCOUNT
  // ===============================

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      setMessage("");
      setError("");

      if (!deletePassword) {
        setError("Enter your password.");
        setDeleting(false);
        return;
      }

      const token = getToken();

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `${AUTH_API_URL}/account`,
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            password: deletePassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Account deletion failed"
        );
      }

      if (data.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
      }
    } catch (error) {
      console.error(
        "Delete account error:",
        error
      );

      setError(
        error.message ||
          "Account deletion failed"
      );

      setDeleting(false);
    }
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-green-400" />
      </div>
    );
  }

  // ===============================
  // UI
  // ===============================

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-20">

      {/* HEADER */}

      <div>
        <p className="text-sm font-medium text-green-400">
          Account preferences
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Settings
        </h1>

        <p className="mt-2 text-gray-400">
          Manage your account, privacy and
          notification preferences.
        </p>
      </div>

      {/* SUCCESS */}

      {message && (
        <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />

          <span>{message}</span>
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertTriangle className="h-5 w-5 shrink-0" />

          <span>{error}</span>
        </div>
      )}

      {/* ===============================
          PROFILE
      =============================== */}

      <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] shadow-xl shadow-black/20 backdrop-blur-sm">

        {/* SECTION HEADER */}

        <div className="flex items-center gap-3 border-b border-white/10 p-5">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 ring-1 ring-green-500/15 shadow-[0_0_16px_-4px_rgba(74,222,128,0.35)]">
            <User className="h-5 w-5 text-green-400" />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              Profile
            </h2>

            <p className="text-xs text-gray-500">
              Basic account information
            </p>
          </div>

        </div>

        <div className="grid gap-5 p-5 md:grid-cols-2">

          {/* ===============================
              AVATAR
          =============================== */}

          <div className="md:col-span-2">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                {/* AVATAR PREVIEW */}

                <div className="relative shrink-0">

                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile avatar"
                      className="h-28 w-28 rounded-2xl border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-white/10 bg-gray-900 text-4xl font-bold text-green-400">
                      {profile.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>
                  )}

                  {/* CAMERA ICON */}

                  <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border border-gray-900 bg-green-500 text-gray-950 shadow-lg">
                    <Camera className="h-4 w-4" />
                  </div>

                </div>

                {/* AVATAR INFO */}

                <div className="flex-1">

                  <h3 className="text-sm font-semibold text-white">
                    Profile picture
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Your profile picture will be
                    displayed on your Nexora profile
                    and dashboard.
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">

                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-green-500/30 hover:bg-white/10 hover:text-white">

                      <Camera className="h-4 w-4 text-green-400" />

                      {avatarUploading
                        ? "Uploading..."
                        : "Choose Image"}

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={
                          handleAvatarChange
                        }
                        disabled={saving}
                        className="hidden"
                      />

                    </label>

                    {avatarFile && (
                      <span className="text-xs text-green-400">
                        New image selected
                      </span>
                    )}

                  </div>

                  <p className="mt-2 text-xs text-gray-600">
                    JPG, PNG or WEBP · Maximum 5MB
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ===============================
              NAME
          =============================== */}

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Full name
            </label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              placeholder="Your full name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/50"
            />
          </div>

          {/* ===============================
              USERNAME
          =============================== */}

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleProfileChange}
              placeholder="username"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/50"
            />
          </div>

          {/* ===============================
              EMAIL
          =============================== */}

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Email
            </label>

            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-500 outline-none"
            />

            <p className="mt-1 text-xs text-gray-600">
              Email cannot be changed here.
            </p>
          </div>

          {/* ===============================
              LOCATION
          =============================== */}

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleProfileChange}
              placeholder="Tashkent, Uzbekistan"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/50"
            />
          </div>

          {/* ===============================
              BIO
          =============================== */}

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm text-gray-400">
              Bio
            </label>

            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleProfileChange}
              rows="4"
              placeholder="Tell people about yourself..."
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/50"
            />

          </div>

          {/* ===============================
              SKILLS
          =============================== */}

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm text-gray-400">
              Skills
            </label>

            <input
              type="text"
              value={skillsText}
              onChange={(e) =>
                setSkillsText(e.target.value)
              }
              placeholder="React, Node.js, MongoDB"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/50"
            />

            <p className="mt-1 text-xs text-gray-600">
              Separate skills with commas.
            </p>

          </div>

          {/* ===============================
              LINKEDIN
          =============================== */}

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm text-gray-400">
              LinkedIn URL
            </label>

            <input
              type="url"
              name="linkedinUrl"
              value={profile.linkedinUrl}
              onChange={handleProfileChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/50"
            />

          </div>

          {/* ===============================
              AVAILABLE
          =============================== */}

          <div className="md:col-span-2">

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.07]">

              <div>
                <p className="text-sm font-medium text-white">
                  Available for work
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Let companies know that you
                  are available.
                </p>
              </div>

              <input
                type="checkbox"
                checked={profile.isAvailable}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    isAvailable:
                      e.target.checked,
                  }))
                }
                className="h-5 w-5 accent-green-500"
              />

            </label>

          </div>

        </div>

      </section>

      {/* ===============================
          SECURITY
      =============================== */}

      <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] shadow-xl shadow-black/20 backdrop-blur-sm">

        <div className="flex items-center gap-3 border-b border-white/10 p-5">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 ring-1 ring-green-500/15 shadow-[0_0_16px_-4px_rgba(74,222,128,0.35)]">
            <Lock className="h-5 w-5 text-green-400" />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              Security
            </h2>

            <p className="text-xs text-gray-500">
              Protect your account
            </p>
          </div>

        </div>

        <div className="space-y-4 p-5">

          {/* CURRENT PASSWORD */}

          <div>

            <label className="mb-2 block text-sm text-gray-400">
              Current password
            </label>

            <input
              type="password"
              name="currentPassword"
              value={
                passwordForm.currentPassword
              }
              onChange={handlePasswordChange}
              placeholder="Current password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors duration-150 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/10"
            />

          </div>

          {/* NEW PASSWORD */}

          <div>

            <label className="mb-2 block text-sm text-gray-400">
              New password
            </label>

            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              placeholder="New password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors duration-150 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/10"
            />

          </div>

          {/* CONFIRM */}

          <div>

            <label className="mb-2 block text-sm text-gray-400">
              Confirm new password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={
                passwordForm.confirmPassword
              }
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors duration-150 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/10"
            />

          </div>

          <button
            onClick={handleChangePassword}
            disabled={passwordSaving}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-300 transition-all duration-200 hover:border-white/20 hover:bg-white/10 disabled:opacity-50"
          >

            <ShieldCheck className="h-4 w-4" />

            {passwordSaving
              ? "Updating..."
              : "Change Password"}

          </button>

        </div>

      </section>

      {/* ===============================
          PREFERENCES
      =============================== */}

      <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] shadow-xl shadow-black/20 backdrop-blur-sm">

        <div className="flex items-center gap-3 border-b border-white/10 p-5">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 ring-1 ring-green-500/15 shadow-[0_0_16px_-4px_rgba(74,222,128,0.35)]">
            <Bell className="h-5 w-5 text-green-400" />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              Preferences
            </h2>

            <p className="text-xs text-gray-500">
              Control your notifications
            </p>
          </div>

        </div>

        <div className="space-y-4 p-5">

          {[
            "Email notifications",
            "New message notifications",
            "Project offer notifications",
          ].map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.07]"
            >

              <span className="text-sm text-gray-300">
                {item}
              </span>

              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 accent-green-500"
              />

            </label>
          ))}

        </div>

      </section>

      {/* ===============================
          LANGUAGE
      =============================== */}

      <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] shadow-xl shadow-black/20 backdrop-blur-sm p-5">

        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <Globe className="h-5 w-5 text-green-400" />

            <div>
              <p className="text-sm font-medium text-white">
                Language
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Choose your preferred language
              </p>
            </div>

          </div>

          <select className="rounded-xl border border-white/10 bg-gray-900 px-4 py-2.5 text-sm text-gray-300 outline-none">

            <option>English</option>
            <option>Uzbek</option>
            <option>Russian</option>

          </select>

        </div>

      </section>

      {/* ===============================
          SAVE
      =============================== */}

      <div className="flex justify-end">

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 px-5 py-3 text-sm font-semibold text-gray-950 shadow-lg shadow-green-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 hover:from-green-300 hover:to-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >

          <Save className="h-4 w-4" />

          {saving
            ? "Saving..."
            : "Save Changes"}

        </button>

      </div>

      {/* ===============================
          DANGER ZONE
      =============================== */}

      <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.03]">

        <div className="flex items-center gap-3 border-b border-red-500/10 p-5">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
            <Trash2 className="h-5 w-5 text-red-400" />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              Danger Zone
            </h2>

            <p className="text-xs text-gray-500">
              Irreversible account actions
            </p>
          </div>

        </div>

        <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">

          <div>

            <p className="text-sm font-medium text-white">
              Delete account
            </p>

            <p className="mt-1 max-w-xl text-xs leading-5 text-gray-500">
              Permanently delete your account
              and remove your profile data.
              This action cannot be undone.
            </p>

          </div>

          <button
            onClick={() =>
              setShowDeleteModal(true)
            }
            className="flex w-fit items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
          >

            <Trash2 className="h-4 w-4" />

            Delete Account

          </button>

        </div>

      </section>

      {/* ===============================
          DELETE MODAL
      =============================== */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">

          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-gray-950 p-6 shadow-2xl">

            {/* HEADER */}

            <div className="flex items-start justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>

                <div>

                  <h2 className="font-bold text-white">
                    Delete Account
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    This action is permanent.
                  </p>

                </div>

              </div>

              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                  setError("");
                }}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-white"
              >

                <X className="h-5 w-5" />

              </button>

            </div>

            {/* WARNING */}

            <div className="mt-6 rounded-xl border border-red-500/10 bg-red-500/5 p-4">

              <p className="text-sm leading-6 text-gray-400">
                Your account will be permanently
                deleted. You will need to create
                a new account if you want to use
                Nexora again.
              </p>

            </div>

            {/* PASSWORD */}

            <div className="mt-5">

              <label className="mb-2 block text-sm text-gray-400">
                Enter your password
              </label>

              <input
                type="password"
                value={deletePassword}
                onChange={(e) =>
                  setDeletePassword(
                    e.target.value
                  )
                }
                placeholder="Your password"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-red-500/40"
              />

            </div>

            {/* BUTTONS */}

            <div className="mt-6 flex gap-3">

              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                  setError("");
                }}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-gray-300 transition-all duration-200 hover:border-white/20 hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {deleting
                  ? "Deleting..."
                  : "Delete Account"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Settings;
