import {
  Search,
  Send,
  MoreHorizontal,
  Paperclip,
  Smile,
  CheckCheck,
  ArrowLeft,
  Loader2,
  X,
  Image as ImageIcon,
} from "lucide-react";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import { io } from "socket.io-client";

const API_URL =
  "http://localhost:3013/api/messages";

const SOCKET_URL =
  "http://localhost:3013";

const EMOJIS = [
  "😀",
  "😂",
  "😍",
  "🥰",
  "😎",
  "🤝",
  "👍",
  "👏",
  "🔥",
  "❤️",
  "💯",
  "🚀",
  "🎉",
  "😄",
  "😅",
  "🤣",
  "😊",
  "😉",
  "😇",
  "🤩",
  "😢",
  "😭",
  "😡",
  "🤔",
  "🙌",
  "💪",
  "👀",
  "✨",
  "⭐",
  "💚",
];

const Messages = () => {
  const location = useLocation();

  const [conversations, setConversations] =
    useState([]);

  const [selectedChat, setSelectedChat] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [showEmoji, setShowEmoji] =
    useState(false);

  const [typing, setTyping] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [socket, setSocket] =
    useState(null);

  const fileInputRef =
    useRef(null);

  const messagesEndRef =
    useRef(null);

  const typingTimeoutRef =
    useRef(null);

  // ========================================
  // FETCH CONVERSATIONS
  // ========================================

  const fetchConversations = async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) return;

      const response = await fetch(
        `${API_URL}/conversations`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const data =
        await response.json();

      if (data.success) {
        const serverConversations =
          data.conversations || [];

        setConversations(
          serverConversations
        );

        // --------------------------------
        // URL ORQALI KELGAN USER
        // --------------------------------

        const params =
          new URLSearchParams(
            location.search
          );

        const userId =
          params.get("user");

        const stateUser =
          location.state?.user;

        if (userId) {
          // Existing conversation
          const existingConversation =
            serverConversations.find(
              (item) =>
                item.user?._id === userId
            );

          if (existingConversation) {
            setSelectedChat(
              existingConversation
            );
          }

          // New conversation
          else if (
            stateUser &&
            stateUser._id === userId
          ) {
            setSelectedChat({
              user: {
                _id: stateUser._id,
                name:
                  stateUser.name ||
                  "User",
                username:
                  stateUser.username ||
                  "",
                avatar:
                  stateUser.avatar ||
                  "",
              },
              lastMessage: null,
              unreadCount: 0,
            });
          }

          return;
        }

        // --------------------------------
        // OLD SELECTED CHAT
        // --------------------------------

        setSelectedChat(
          (current) => {
            if (current) {
              const updated =
                serverConversations.find(
                  (item) =>
                    item.user?._id ===
                    current.user?._id
                );

              return (
                updated ||
                current
              );
            }

            return (
              serverConversations[0] ||
              null
            );
          }
        );
      }
    } catch (error) {
      console.error(
        "❌ Fetch conversations error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // FETCH MESSAGES
  // ========================================

  const fetchMessages = async (
    userId
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) return;

      const response = await fetch(
        `${API_URL}/conversation/${userId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const data =
        await response.json();

      if (data.success) {
        setMessages(
          data.messages || []
        );
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error(
        "❌ Fetch messages error:",
        error
      );

      setMessages([]);
    }
  };

  // ========================================
  // INITIAL
  // ========================================

  useEffect(() => {
    fetchConversations();
  }, [location.search]);

  // ========================================
  // SELECTED CHAT
  // ========================================

  useEffect(() => {
    if (
      !selectedChat?.user?._id
    ) {
      setMessages([]);
      return;
    }

    fetchMessages(
      selectedChat.user._id
    );
  }, [
    selectedChat?.user?._id,
  ]);

  // ========================================
  // SOCKET CONNECTION
  // ========================================

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      console.warn(
        "⚠️ No token. Socket not connected."
      );

      return;
    }

    const newSocket = io(
      SOCKET_URL,
      {
        auth: {
          token,
        },

        transports: [
          "websocket",
          "polling",
        ],

        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
      }
    );

    newSocket.on(
      "connect",
      () => {
        console.log(
          "🟢 Socket connected:",
          newSocket.id
        );
      }
    );

    newSocket.on(
      "connect_error",
      (error) => {
        console.error(
          "❌ Socket connection error:",
          error.message
        );
      }
    );

    newSocket.on(
      "disconnect",
      (reason) => {
        console.log(
          "🔴 Socket disconnected:",
          reason
        );
      }
    );

    setSocket(newSocket);

    return () => {
      newSocket.removeAllListeners();
      newSocket.disconnect();
    };
  }, []);

  // ========================================
  // REALTIME MESSAGES
  // ========================================

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage =
      (newMessage) => {
        console.log(
          "📩 NEW MESSAGE:",
          newMessage
        );

        const senderId =
          newMessage.sender?._id ||
          newMessage.sender;

        const receiverId =
          newMessage.receiver?._id ||
          newMessage.receiver;

        const selectedUserId =
          selectedChat?.user?._id;

        if (
          selectedUserId &&
          (
            senderId ===
              selectedUserId ||
            receiverId ===
              selectedUserId
          )
        ) {
          setMessages(
            (current) => {
              if (
                current.some(
                  (item) =>
                    item._id ===
                    newMessage._id
                )
              ) {
                return current;
              }

              return [
                ...current,
                newMessage,
              ];
            }
          );

          return;
        }

        fetchConversations();
      };

    const handleTyping =
      ({ userId }) => {
        if (
          userId ===
          selectedChat?.user?._id
        ) {
          setTyping(true);
        }
      };

    const handleStopTyping =
      ({ userId }) => {
        if (
          userId ===
          selectedChat?.user?._id
        ) {
          setTyping(false);
        }
      };

    const handleMessageSent =
      (sentMessage) => {
        console.log(
          "📤 MESSAGE SENT:",
          sentMessage
        );

        setMessages(
          (current) => {
            if (
              current.some(
                (item) =>
                  item._id ===
                  sentMessage._id
              )
            ) {
              return current;
            }

            return [
              ...current,
              sentMessage,
            ];
          }
        );
      };

    socket.on(
      "new_message",
      handleNewMessage
    );

    socket.on(
      "user_typing",
      handleTyping
    );

    socket.on(
      "user_stop_typing",
      handleStopTyping
    );

    socket.on(
      "message_sent",
      handleMessageSent
    );

    return () => {
      socket.off(
        "new_message",
        handleNewMessage
      );

      socket.off(
        "user_typing",
        handleTyping
      );

      socket.off(
        "user_stop_typing",
        handleStopTyping
      );

      socket.off(
        "message_sent",
        handleMessageSent
      );
    };
  }, [
    socket,
    selectedChat?.user?._id,
  ]);

  // ========================================
  // AUTO SCROLL
  // ========================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [
    messages,
    typing,
  ]);

  // ========================================
  // IMAGE SELECT
  // ========================================

  const handleImageSelect = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith("image/")
    ) {
      alert(
        "Faqat rasm fayllarini yuborish mumkin."
      );

      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      alert(
        "Rasm hajmi 10MB dan oshmasligi kerak."
      );

      return;
    }

    setSelectedImage(file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  // ========================================
  // REMOVE IMAGE
  // ========================================

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setSelectedImage(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  };

  // ========================================
  // EMOJI
  // ========================================

  const addEmoji = (emoji) => {
    setMessage(
      (current) =>
        current + emoji
    );
  };

  // ========================================
  // TYPING
  // ========================================

  const handleTypingChange = (
    event
  ) => {
    const value =
      event.target.value;

    setMessage(value);

    if (
      !socket ||
      !selectedChat?.user?._id
    ) {
      return;
    }

    socket.emit(
      "typing",
      {
        receiverId:
          selectedChat.user._id,
      }
    );

    clearTimeout(
      typingTimeoutRef.current
    );

    typingTimeoutRef.current =
      setTimeout(() => {
        socket.emit(
          "stop_typing",
          {
            receiverId:
              selectedChat.user._id,
          }
        );
      }, 1000);
  };

  // ========================================
  // SEND MESSAGE
  // ========================================

  const sendMessage = async () => {
    const trimmed =
      message.trim();

    if (
      !trimmed &&
      !selectedImage
    ) {
      return;
    }

    if (
      !selectedChat?.user?._id ||
      sending
    ) {
      return;
    }

    try {
      setSending(true);

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        alert(
          "Login qilishingiz kerak."
        );

        return;
      }

      const formData =
        new FormData();

      if (trimmed) {
        formData.append(
          "content",
          trimmed
        );
      }

      formData.append(
        "receiverId",
        selectedChat.user._id
      );

      if (selectedImage) {
        formData.append(
          "image",
          selectedImage
        );
      }

      console.log(
        "📤 Sending message to:",
        selectedChat.user._id
      );

      const response =
        await fetch(
          API_URL,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            body: formData,
          }
        );

      const data =
        await response.json();

      console.log(
        "📨 Send response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to send message"
        );
      }

      if (data.success) {
        setMessages(
          (current) => {
            if (
              current.some(
                (item) =>
                  item._id ===
                  data.message._id
              )
            ) {
              return current;
            }

            return [
              ...current,
              data.message,
            ];
          }
        );

        setMessage("");

        removeImage();

        setShowEmoji(false);

        if (socket) {
          socket.emit(
            "stop_typing",
            {
              receiverId:
                selectedChat
                  .user
                  ._id,
            }
          );
        }

        await fetchConversations();
      }
    } catch (error) {
      console.error(
        "❌ Send message error:",
        error
      );

      alert(
        error.message ||
          "Message yuborishda xatolik."
      );
    } finally {
      setSending(false);
    }
  };

  // ========================================
  // ENTER
  // ========================================

  const handleKeyDown = (
    event
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  };

  // ========================================
  // FORMAT TIME
  // ========================================

  const formatTime = (
    dateString
  ) => {
    if (!dateString) return "";

    const date =
      new Date(dateString);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return date.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center eightd-perspective-1000">
        <Loader2 className="h-8 w-8 animate-spin text-green-400 eightd-rotate-3d" />
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="h-full flex flex-col eightd-transform-style-3d  p-20">

      {/* HEADER */}

      <div className="eightd-card-tilt mb-3 shrink-0 eightd-translate-z-20">

        <p className="text-xs font-medium text-green-400 eightd-text-depth">
          Stay connected
        </p>

        <h1 className="mt-1 text-xl font-bold tracking-tight text-white eightd-text-depth">
          Messages
        </h1>

      </div>

      {/* CHAT */}

      <div className="eightd-card-tilt flex-1 min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] lg:grid lg:grid-cols-[280px_1fr] eightd-transform-style-3d">

        {/* SIDEBAR */}

        <div
          className={`eightd-transform-style-3d min-h-0 border-r border-white/10 ${
            selectedChat
              ? "hidden lg:flex"
              : "flex"
          } flex-col`}
        >

          <div className="shrink-0 border-b border-white/10 p-3 eightd-translate-z-10">

            <div className="eightd-interactive flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">

              <Search className="h-3.5 w-3.5 text-gray-600 eightd-translate-z-5" />

              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent text-xs text-white outline-none placeholder:text-gray-600 eightd-translate-z-5"
              />

            </div>

          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">

            {conversations.length === 0 ? (
              <div className="p-3 text-center text-xs text-gray-500">
                No conversations yet
              </div>
            ) : (
              conversations.map(
                (chat) => (
                  <button
                    key={
                      chat.user._id
                    }
                    onClick={() =>
                      setSelectedChat(
                        chat
                      )
                    }
                    className={`flex w-full gap-2 border-b border-white/5 p-2.5 text-left transition ${
                      selectedChat
                        ?.user?._id ===
                      chat.user._id
                        ? "bg-green-500/5"
                        : "hover:bg-white/[0.03]"
                    }`}
                  >

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-500/10 font-semibold text-green-400">

                      {chat.user?.avatar ? (
                        <img
                          src={
                            chat.user
                              .avatar
                          }
                          alt={
                            chat.user
                              .name
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        chat.user?.name?.charAt(
                          0
                        ) || "U"
                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center justify-between gap-2">

                        <p className="truncate text-xs font-semibold text-white">
                          {
                            chat.user
                              ?.name
                          }
                        </p>

                        <span className="text-[10px] text-gray-600">
                          {formatTime(
                            chat
                              .lastMessage
                              ?.createdAt
                          )}
                        </span>

                      </div>

                      <p className="mt-0.5 truncate text-[10px] text-gray-500">

                        {chat.lastMessage
                          ?.imageUrl &&
                        !chat.lastMessage
                          ?.content
                          ? "📷 Image"
                          : chat
                              .lastMessage
                              ?.content}

                      </p>

                      {chat.unreadCount >
                        0 && (
                        <span className="mt-2 inline-flex min-w-5 items-center justify-center rounded-full bg-green-500 px-1.5 py-0.5 text-[10px] font-bold text-gray-950">
                          {
                            chat.unreadCount
                          }
                        </span>
                      )}

                    </div>

                  </button>
                )
              )
            )}

          </div>

        </div>

        {/* CHAT */}

        <div
          className={`min-h-0 min-w-0 flex-col ${
            selectedChat
              ? "flex"
              : "hidden lg:flex"
          }`}
        >

          {/* CHAT HEADER */}

          <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4">

            <div className="flex min-w-0 items-center gap-3">

              <button
                onClick={() =>
                  setSelectedChat(null)
                }
                className="rounded-lg p-1.5 text-gray-500 hover:bg-white/5 hover:text-white lg:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-500/10 font-semibold text-green-400">

                {selectedChat?.user?.avatar ? (
                  <img
                    src={
                      selectedChat
                        .user
                        .avatar
                    }
                    alt={
                      selectedChat
                        .user
                        .name
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  selectedChat
                    ?.user
                    ?.name?.charAt(
                      0
                    ) || "U"
                )}

              </div>

              <div>

                <p className="truncate text-xs font-semibold text-white">
                  {
                    selectedChat
                      ?.user?.name
                  }
                </p>

                <p className="text-[10px] text-green-400">
                  @
                  {
                    selectedChat
                      ?.user
                      ?.username
                  }
                </p>

                {typing && (
                  <p className="text-[10px] text-gray-500">
                    typing...
                  </p>
                )}

              </div>

            </div>

            <button className="rounded-lg p-1.5 text-gray-500 hover:bg-white/5 hover:text-white">
              <MoreHorizontal className="h-4 w-4" />
            </button>

          </div>

          {/* MESSAGES */}

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">

            <div className="flex justify-center">
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-gray-600">
                Today
              </span>
            </div>

            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-gray-500">
                No messages yet.
                Start the conversation!
              </div>
            ) : (
              messages.map(
                (item) => {
                  const senderId =
                    item.sender?._id ||
                    item.sender;

                  const selectedUserId =
                    selectedChat
                      ?.user?._id;

                  const isIncoming =
                    senderId ===
                    selectedUserId;

                  return (
                    <div
                      key={
                        item._id
                      }
                      className={`flex ${
                        isIncoming
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >

                      <div
                        className={`max-w-[75%] overflow-hidden rounded-xl ${
                          isIncoming
                            ? "rounded-bl-md bg-white/[0.06] text-gray-300"
                            : "rounded-br-md bg-green-500 text-gray-950"
                        }`}
                      >

                        {item.imageUrl && (
                          <a
                            href={
                              item.imageUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img
                              src={
                                item.imageUrl
                              }
                              alt="Message attachment"
                              className="max-h-60 w-full max-w-md object-cover"
                            />
                          </a>
                        )}

                        {item.content && (
                          <div className="px-3 py-2">

                            <p className="break-words text-xs leading-5">
                              {
                                item.content
                              }
                            </p>

                            <div
                              className={`mt-0.5 flex items-center justify-end gap-1 text-[10px] ${
                                isIncoming
                                  ? "text-gray-600"
                                  : "text-gray-800"
                              }`}
                            >

                              {formatTime(
                                item.createdAt
                              )}

                              {!isIncoming && (
                                <CheckCheck className="h-3 w-3" />
                              )}

                            </div>

                          </div>
                        )}

                        {!item.content && (
                          <div className="px-3 pb-2 pt-1">

                            <div
                              className={`flex items-center justify-end gap-1 text-[10px] ${
                                isIncoming
                                  ? "text-gray-600"
                                  : "text-gray-800"
                              }`}
                            >

                              {formatTime(
                                item.createdAt
                              )}

                              {!isIncoming && (
                                <CheckCheck className="h-3 w-3" />
                              )}

                            </div>

                          </div>
                        )}

                      </div>

                    </div>
                  );
                }
              )
            )}

            <div
              ref={messagesEndRef}
            />

          </div>

          {/* IMAGE PREVIEW */}

          {imagePreview && (
            <div className="border-t border-white/10 bg-gray-950 px-3 pt-2">

              <div className="relative inline-block">

                <img
                  src={
                    imagePreview
                  }
                  alt="Preview"
                  className="h-20 w-20 rounded-xl border border-white/10 object-cover"
                />

                <button
                  type="button"
                  onClick={
                    removeImage
                  }
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

              </div>

            </div>
          )}

          {/* EMOJI */}

          {showEmoji && (
            <div className="border-t border-white/10 bg-gray-950 p-2">

              <div className="grid grid-cols-10 gap-1">

                {EMOJIS.map(
                  (emoji) => (
                    <button
                      key={
                        emoji
                      }
                      type="button"
                      onClick={() =>
                        addEmoji(
                          emoji
                        )
                      }
                      className="rounded-lg p-2 text-xl transition hover:bg-white/10"
                    >
                      {emoji}
                    </button>
                  )
                )}

              </div>

            </div>
          )}

          {/* INPUT */}

          <div className="shrink-0 border-t border-white/10 bg-gray-950/80 p-4">

            <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2">

              <input
                ref={
                  fileInputRef
                }
                type="file"
                accept="image/*"
                className="hidden"
                onChange={
                  handleImageSelect
                }
              />

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="shrink-0 rounded-lg p-1.5 text-gray-600 transition hover:bg-white/5 hover:text-gray-300"
                title="Send image"
              >
                <Paperclip className="h-4 w-4" />
              </button>

              <textarea
                value={
                  message
                }
                onChange={
                  handleTypingChange
                }
                onKeyDown={
                  handleKeyDown
                }
                rows={1}
                placeholder="Write a message..."
                className="max-h-24 min-h-[32px] flex-1 resize-none overflow-y-auto bg-transparent px-2 py-1.5 text-xs leading-4 text-white outline-none placeholder:text-gray-600"
              />

              <button
                type="button"
                onClick={() =>
                  setShowEmoji(
                    (value) =>
                      !value
                  )
                }
                className={`shrink-0 rounded-lg p-1.5 transition ${
                  showEmoji
                    ? "bg-green-500/10 text-green-400"
                    : "text-gray-600 hover:bg-white/5 hover:text-gray-300"
                }`}
                title="Emoji"
              >
                <Smile className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={
                  sendMessage
                }
                disabled={
                  (
                    !message.trim() &&
                    !selectedImage
                  ) ||
                  sending ||
                  !selectedChat
                }
                className="shrink-0 rounded-lg bg-green-500 p-1.5 text-gray-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-40"
              >

                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}

              </button>

            </div>

            <div className="mt-2 flex items-center justify-between">

              <p className="text-[10px] text-gray-700">
                Enter to send • Shift
                + Enter for new line
              </p>

              {selectedImage && (
                <p className="flex items-center gap-1 text-[10px] text-green-400">

                  <ImageIcon className="h-3 w-3" />

                  Image ready

                </p>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Messages;