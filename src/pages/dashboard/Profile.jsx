import { useEffect, useRef, useState } from "react";

import {
  Pencil,
  X,
  Plus,
  Save,
  Camera,
  Loader2,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

import { API_URL } from "../../utils/config";

const Profile = () => {
  const {
    user,
    loading,
    refreshUser,
  } = useAuth();

  const [editing, setEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [formData, setFormData] =
    useState({
      name: "",
      username: "",
      bio: "",
      location: "",
      skills: [],
      avatar: "",
      linkedinUrl: "",
    });

  const [skillInput, setSkillInput] =
    useState("");

  // ========================================
  // AVATAR
  // ========================================

  const [selectedAvatar, setSelectedAvatar] =
    useState(null);

  const [avatarPreview, setAvatarPreview] =
    useState("");

  const avatarInputRef =
    useRef(null);

  // =========================
  // LOAD USER DATA
  // =========================

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username:
          user.username || "",
        bio: user.bio || "",
        location:
          user.location || "",
        skills:
          user.skills || [],
        avatar:
          user.avatar || "",
        linkedinUrl:
          user.linkedinUrl || "",
      });
    }
  }, [user]);

  // =========================
  // CLEAN PREVIEW
  // =========================

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(
          avatarPreview
        );
      }
    };
  }, [avatarPreview]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] shadow-xl shadow-black/20 backdrop-blur-sm p-6">
          <p className="text-gray-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // USER NOT FOUND
  // =========================

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <p className="text-red-400">
            User information could
            not be loaded.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // INITIALS
  // =========================

  const initials =
    user.name
      ?.split(" ")
      .map(
        (word) => word[0]
      )
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  // =========================
  // CURRENT AVATAR
  // =========================

  const currentAvatar =
    avatarPreview ||
    formData.avatar ||
    user.avatar ||
    "";

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  // ========================================
  // AVATAR SELECT
  // ========================================

  const handleAvatarSelect = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // IMAGE CHECK

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "Faqat rasm fayllarini tanlash mumkin."
      );

      event.target.value = "";

      return;
    }

    // SIZE CHECK

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setError(
        "Rasm hajmi 10MB dan oshmasligi kerak."
      );

      event.target.value = "";

      return;
    }

    setError("");
    setSuccess("");

    // OLD PREVIEW CLEAN

    if (avatarPreview) {
      URL.revokeObjectURL(
        avatarPreview
      );
    }

    // SAVE FILE

    setSelectedAvatar(file);

    // CREATE PREVIEW

    const preview =
      URL.createObjectURL(
        file
      );

    setAvatarPreview(
      preview
    );
  };

  // ========================================
  // REMOVE SELECTED AVATAR
  // ========================================

  const removeSelectedAvatar =
    () => {
      if (avatarPreview) {
        URL.revokeObjectURL(
          avatarPreview
        );
      }

      setSelectedAvatar(null);
      setAvatarPreview("");

      if (
        avatarInputRef.current
      ) {
        avatarInputRef.current.value =
          "";
      };
    };

  // =========================
  // ADD SKILL
  // =========================

  const addSkill = () => {
    const skill =
      skillInput.trim();

    if (!skill) return;

    if (
      formData.skills.some(
        (item) =>
          item.toLowerCase() ===
          skill.toLowerCase()
      )
    ) {
      setSkillInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        skill,
      ],
    }));

    setSkillInput("");
  };

  // =========================
  // REMOVE SKILL
  // =========================

  const removeSkill = (
    skillToRemove
  ) => {
    setFormData((prev) => ({
      ...prev,
      skills:
        prev.skills.filter(
          (skill) =>
            skill !==
            skillToRemove
        ),
    }));
  };

  // =========================
  // NORMALIZE LINKEDIN URL
  // =========================

  const getLinkedinUrl = (
    url
  ) => {
    if (!url) return "";

    const trimmed =
      url.trim();

    if (
      trimmed.startsWith(
        "http://"
      ) ||
      trimmed.startsWith(
        "https://"
      )
    ) {
      return trimmed;
    }

    return `https://${trimmed}`;
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setError("");
      setSuccess("");
      setSaving(true);

      try {
        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {
          setError(
            "You are not authenticated."
          );

          return;
        }

        // ==================================
        // FORMDATA
        // ==================================

        const formDataToSend =
          new FormData();

        formDataToSend.append(
          "name",
          formData.name
        );

        formDataToSend.append(
          "username",
          formData.username
        );

        formDataToSend.append(
          "bio",
          formData.bio
        );

        formDataToSend.append(
          "location",
          formData.location
        );

        formDataToSend.append(
          "skills",
          JSON.stringify(
            formData.skills
          )
        );

        formDataToSend.append(
          "linkedinUrl",
          formData.linkedinUrl
        );

        formDataToSend.append(
          "isAvailable",
          String(
            user.isAvailable ??
              true
          )
        );

        // ==================================
        // AVATAR FILE
        // ==================================

        if (selectedAvatar) {
          formDataToSend.append(
            "avatar",
            selectedAvatar
          );
        } else if (
          formData.avatar
        ) {
          // Eski URL tizimi ham
          // ishlashda davom etadi.

          formDataToSend.append(
            "avatar",
            formData.avatar
          );
        }

        // ==================================
        // REQUEST
        // ==================================

        const response =
          await fetch(
            `${API_URL}/users/profile`,
            {
              method: "PUT",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              body:
                formDataToSend,
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Profile update failed"
          );

          return;
        }

        if (
          data.success
        ) {
          // =================================
          // SAVE LOCAL USER
          // =================================

          localStorage.setItem(
            "user",
            JSON.stringify(
              data.user
            )
          );

          // =================================
          // REFRESH AUTH
          // =================================

          await refreshUser();

          // =================================
          // UPDATE LOCAL FORM
          // =================================

          setFormData({
            name:
              data.user.name ||
              "",
            username:
              data.user.username ||
              "",
            bio:
              data.user.bio ||
              "",
            location:
              data.user.location ||
              "",
            skills:
              data.user.skills ||
              [],
            avatar:
              data.user.avatar ||
              "",
            linkedinUrl:
              data.user.linkedinUrl ||
              "",
          });

          // =================================
          // CLEAR AVATAR STATE
          // =================================

          if (
            avatarPreview
          ) {
            URL.revokeObjectURL(
              avatarPreview
            );
          }

          setSelectedAvatar(
            null
          );

          setAvatarPreview(
            ""
          );

          if (
            avatarInputRef.current
          ) {
            avatarInputRef.current.value =
              "";
          }

          setSuccess(
            "Profile updated successfully!"
          );

          setEditing(false);
        }
      } catch (error) {
        console.error(
          "Profile update error:",
          error
        );

        setError(
          "Server bilan bog‘lanib bo‘lmadi"
        );
      } finally {
        setSaving(false);
      }
    };

  // =========================
  // CANCEL EDIT
  // =========================

  const cancelEdit = () => {
    setEditing(false);

    setError("");

    setSuccess("");

    // REMOVE PREVIEW

    if (avatarPreview) {
      URL.revokeObjectURL(
        avatarPreview
      );
    }

    setSelectedAvatar(null);
    setAvatarPreview("");

    if (
      avatarInputRef.current
    ) {
      avatarInputRef.current.value =
        "";
    }

    // RESTORE USER DATA

    setFormData({
      name:
        user.name || "",
      username:
        user.username || "",
      bio:
        user.bio || "",
      location:
        user.location || "",
      skills:
        user.skills || [],
      avatar:
        user.avatar || "",
      linkedinUrl:
        user.linkedinUrl || "",
    });

    setSkillInput("");
  };

  return (
    <div className="mx-auto max-w-5xl p-20">

      {/* =========================
          HEADER
      ========================== */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-sm font-medium text-green-400">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Your Profile
          </h1>

          <p className="mt-2 text-gray-400">
            Manage your public profile
            and personal information.
          </p>
        </div>

        {!editing ? (
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              setError("");
              setSuccess("");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-green-400"
          >
            <Pencil className="h-4 w-4" />

            Edit Profile
          </button>
        ) : (
          <button
            type="button"
            onClick={
              cancelEdit
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />

            Cancel
          </button>
        )}

      </div>

      {/* =========================
          SUCCESS
      ========================== */}

      {success && (
        <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      )}

      {/* =========================
          ERROR
      ========================== */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* =========================
          PROFILE CARD
      ========================== */}

      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] shadow-xl shadow-black/20 backdrop-blur-sm p-6">

        {/* =========================
            USER HEADER
        ========================== */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          {/* ==================================
              AVATAR
          ================================== */}

          <div className="relative">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-500/10 text-2xl font-bold text-green-400 ring-2 ring-white/10">

              {currentAvatar ? (
                <img
                  src={
                    currentAvatar
                  }
                  alt={
                    user.name
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}

            </div>

            {/* ==================================
                CAMERA BUTTON
            ================================== */}

            {editing && (
              <>
                <input
                  ref={
                    avatarInputRef
                  }
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={
                    handleAvatarSelect
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    avatarInputRef.current?.click()
                  }
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-950 bg-green-500 text-gray-950 shadow-lg transition hover:bg-green-400"
                  title="Change avatar"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </>
            )}

          </div>

          {/* ==================================
              USER INFO
          ================================== */}

          <div className="min-w-0">

            <h2 className="text-xl font-semibold text-white">
              {user.name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              @{user.username}
            </p>

            <span className="mt-2 inline-flex rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium capitalize text-green-400">
              {user.role}
            </span>

            {/* ==================================
                SELECTED IMAGE INFO
            ================================== */}

            {editing &&
              selectedAvatar && (
                <div className="mt-3 flex items-center gap-2">

                  <p className="max-w-[220px] truncate text-xs text-green-400">
                    {selectedAvatar.name}
                  </p>

                  <button
                    type="button"
                    onClick={
                      removeSelectedAvatar
                    }
                    className="rounded-md p-1 text-gray-500 transition hover:bg-white/5 hover:text-red-400"
                    title="Remove selected image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                </div>
              )}

          </div>

        </div>

        {/* =====================================================
            VIEW MODE
        ====================================================== */}

        {!editing && (
          <div className="mt-8">

            {/* BASIC INFO */}

            <div className="grid gap-4 sm:grid-cols-2">

              {/* NAME */}

              <div className="rounded-xl border border-white/10 bg-black/10 p-4">

                <p className="text-xs text-gray-500">
                  Full Name
                </p>

                <p className="mt-1 text-sm text-white">
                  {user.name}
                </p>

              </div>

              {/* USERNAME */}

              <div className="rounded-xl border border-white/10 bg-black/10 p-4">

                <p className="text-xs text-gray-500">
                  Username
                </p>

                <p className="mt-1 text-sm text-white">
                  @{user.username}
                </p>

              </div>

              {/* EMAIL */}

              <div className="rounded-xl border border-white/10 bg-black/10 p-4">

                <p className="text-xs text-gray-500">
                  Email
                </p>

                <p className="mt-1 break-all text-sm text-white">
                  {user.email}
                </p>

              </div>

              {/* LOCATION */}

              <div className="rounded-xl border border-white/10 bg-black/10 p-4">

                <p className="text-xs text-gray-500">
                  Location
                </p>

                <p className="mt-1 text-sm text-white">
                  {user.location ||
                    "Not specified"}
                </p>

              </div>

            </div>

            {/* LINKEDIN */}

            <div className="mt-4 rounded-xl border border-white/10 bg-black/10 p-4">

              <p className="text-xs text-gray-500">
                LinkedIn
              </p>

              {user.linkedinUrl ? (
                <a
                  href={getLinkedinUrl(
                    user.linkedinUrl
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-sm font-medium text-green-400 transition hover:text-green-300"
                >
                  View LinkedIn Profile
                </a>
              ) : (
                <p className="mt-2 text-sm text-gray-500">
                  No LinkedIn profile
                  added yet.
                </p>
              )}

            </div>

            {/* BIO */}

            <div className="mt-4 rounded-xl border border-white/10 bg-black/10 p-4">

              <p className="text-xs text-gray-500">
                Bio
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-300">
                {user.bio ||
                  "No bio added yet."}
              </p>

            </div>

            {/* SKILLS */}

            <div className="mt-4 rounded-xl border border-white/10 bg-black/10 p-4">

              <p className="text-xs text-gray-500">
                Skills
              </p>

              {user.skills?.length >
              0 ? (
                <div className="mt-3 flex flex-wrap gap-2">

                  {user.skills.map(
                    (skill) => (
                      <span
                        key={
                          skill
                        }
                        className="rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500">
                  No skills added yet.
                </p>
              )}

            </div>

          </div>
        )}

        {/* =====================================================
            EDIT MODE
        ====================================================== */}

        {editing && (
          <form
            onSubmit={
              handleSubmit
            }
            className="mt-8 space-y-6"
          >

            {/* NAME */}

            <div>

              <label className="mb-2 block text-sm text-gray-300">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                required
                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition focus:border-green-500"
              />

            </div>

            {/* USERNAME */}

            <div>

              <label className="mb-2 block text-sm text-gray-300">
                Username
              </label>

              <input
                type="text"
                name="username"
                value={
                  formData.username
                }
                onChange={
                  handleChange
                }
                required
                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition focus:border-green-500"
              />

            </div>

            {/* LOCATION */}

            <div>

              <label className="mb-2 block text-sm text-gray-300">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={
                  formData.location
                }
                onChange={
                  handleChange
                }
                placeholder="Tashkent, Uzbekistan"
                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition focus:border-green-500"
              />

            </div>

            {/* LINKEDIN */}

            <div>

              <label className="mb-2 block text-sm text-gray-300">
                LinkedIn Profile
              </label>

              <input
                type="url"
                name="linkedinUrl"
                value={
                  formData.linkedinUrl
                }
                onChange={
                  handleChange
                }
                placeholder="https://www.linkedin.com/in/username"
                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition focus:border-green-500"
              />

              <p className="mt-2 text-xs text-gray-500">
                Add your professional
                LinkedIn profile.
              </p>

            </div>

            {/* BIO */}

            <div>

              <label className="mb-2 block text-sm text-gray-300">
                Bio
              </label>

              <textarea
                name="bio"
                value={
                  formData.bio
                }
                onChange={
                  handleChange
                }
                rows={5}
                placeholder="Tell people about yourself..."
                className="w-full resize-none rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition focus:border-green-500"
              />

            </div>

            {/* SKILLS */}

            <div>

              <label className="mb-2 block text-sm text-gray-300">
                Skills
              </label>

              <div className="flex gap-2">

                <input
                  type="text"
                  value={
                    skillInput
                  }
                  onChange={(e) =>
                    setSkillInput(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key ===
                      "Enter"
                    ) {
                      e.preventDefault();

                      addSkill();
                    }
                  }}
                  placeholder="React, Node.js, MongoDB..."
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition focus:border-green-500"
                />

                <button
                  type="button"
                  onClick={
                    addSkill
                  }
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500 text-black transition hover:bg-green-400"
                >
                  <Plus className="h-5 w-5" />
                </button>

              </div>

              {formData.skills.length >
                0 && (
                <div className="mt-3 flex flex-wrap gap-2">

                  {formData.skills.map(
                    (skill) => (
                      <div
                        key={
                          skill
                        }
                        className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-1.5 text-xs text-green-400"
                      >

                        <span>
                          {skill}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeSkill(
                              skill
                            )
                          }
                          className="text-green-400 transition hover:text-red-400"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>

            {/* SAVE */}

            <div className="flex justify-end border-t border-white/10 pt-6">

              <button
                type="submit"
                disabled={
                  saving
                }
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {saving
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default Profile;