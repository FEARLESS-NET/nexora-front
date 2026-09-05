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
  Trash2,
  Ban,
  Check,
  Square,
  CheckSquare,
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

import {
  API_URL as BASE_API_URL,
  SOCKET_URL,
} from "../../utils/config";

const API_URL =
  `${BASE_API_URL}/messages`;

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
  const location =
    useLocation();

  // ========================================
  // STATE
  // ========================================

  const [
    conversations,
    setConversations,
  ] = useState([]);

  const [
    selectedChat,
    setSelectedChat,
  ] = useState(null);

  const [
    messages,
    setMessages,
  ] = useState([]);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(null);

  const [
    imagePreview,
    setImagePreview,
  ] = useState("");

  const [
    showEmoji,
    setShowEmoji,
  ] = useState(false);

  const [
    showMenu,
    setShowMenu,
  ] = useState(false);

  const [
    selectMode,
    setSelectMode,
  ] = useState(false);

  const [
    selectedMessageIds,
    setSelectedMessageIds,
  ] = useState([]);

  const [
    typing,
    setTyping,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    sending,
    setSending,
  ] = useState(false);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [
    socket,
    setSocket,
  ] = useState(null);

  // ========================================
  // REFS
  // ========================================

  const fileInputRef =
    useRef(null);

  const messagesEndRef =
    useRef(null);

  const typingTimeoutRef =
    useRef(null);

  const selectedChatRef =
    useRef(null);

  const messagesRequestRef =
    useRef(null);

  // ========================================
  // SYNC SELECTED CHAT
  // ========================================

  useEffect(() => {
    selectedChatRef.current =
      selectedChat;
  }, [selectedChat]);

  // ========================================
  // FETCH CONVERSATIONS
  // ========================================

  const fetchConversations =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {
          setLoading(false);
          return;
        }

        const response =
          await fetch(
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

        if (!data.success) {
          setConversations([]);
          return;
        }

        const list =
          data.conversations ||
          [];

        setConversations(list);

        // ==================================
        // URL USER
        // ==================================

        const params =
          new URLSearchParams(
            location.search
          );

        const userId =
          params.get("user");

        const stateUser =
          location.state?.user;

        if (userId) {
          const existing =
            list.find(
              (chat) =>
                chat.user?._id ===
                userId
            );

          if (existing) {
            selectedChatRef.current =
              existing;

            setSelectedChat(
              existing
            );

            return;
          }

          if (
            stateUser &&
            stateUser._id ===
              userId
          ) {
            const newChat = {
              user: {
                _id:
                  stateUser._id,

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

              lastMessage:
                null,

              unreadCount:
                0,

              isBlocked:
                false,
            };

            selectedChatRef.current =
              newChat;

            setSelectedChat(
              newChat
            );

            return;
          }
        }

        // ==================================
        // PRESERVE CURRENT CHAT
        // ==================================

        setSelectedChat(
          (current) => {
            if (
              current?.user?._id
            ) {
              const updated =
                list.find(
                  (chat) =>
                    chat.user?._id ===
                    current.user._id
                );

              if (updated) {
                selectedChatRef.current =
                  updated;

                return updated;
              }

              return current;
            }

            const first =
              list[0] || null;

            selectedChatRef.current =
              first;

            return first;
          }
        );

      } catch (error) {
        console.error(
          "❌ Conversations error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  // ========================================
  // FETCH MESSAGES
  // ========================================

  const fetchMessages =
    async (userId) => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        if (
          !token ||
          !userId
        ) {
          setMessages([]);
          return;
        }

        if (
          messagesRequestRef.current
        ) {
          messagesRequestRef.current.abort();
        }

        const controller =
          new AbortController();

        messagesRequestRef.current =
          controller;

        setMessages([]);

        const response =
          await fetch(
            `${API_URL}/conversation/${userId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              signal:
                controller.signal,
            }
          );

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        const data =
          await response.json();

        if (
          selectedChatRef.current
            ?.user?._id !== userId
        ) {
          return;
        }

        if (data.success) {
          setMessages(
            data.messages || []
          );

          if (
            typeof data.isBlocked ===
            "boolean"
          ) {
            setSelectedChat(
              (current) =>
                current
                  ? {
                      ...current,
                      isBlocked:
                        data.isBlocked,
                    }
                  : current
            );
          }
        } else {
          setMessages([]);
        }

      } catch (error) {
        if (
          error.name ===
          "AbortError"
        ) {
          return;
        }

        console.error(
          "❌ Messages error:",
          error
        );

        if (
          selectedChatRef.current
            ?.user?._id === userId
        ) {
          setMessages([]);
        }
      }
    };

  // ========================================
  // SELECT CHAT
  // ========================================

  const handleSelectChat =
    (chat) => {
      const userId =
        chat?.user?._id;

      if (!userId) {
        return;
      }

      if (
        selectedChatRef.current
          ?.user?._id === userId
      ) {
        setShowMenu(false);
        return;
      }

      // stop typing
      setTyping(false);

      if (
        typingTimeoutRef.current
      ) {
        clearTimeout(
          typingTimeoutRef.current
        );

        typingTimeoutRef.current =
          null;
      }

      // abort old request
      if (
        messagesRequestRef.current
      ) {
        messagesRequestRef.current.abort();

        messagesRequestRef.current =
          null;
      }

      selectedChatRef.current =
        chat;

      setSelectedChat(chat);

      setMessages([]);

      setSelectedMessageIds([]);

      setSelectMode(false);

      setShowMenu(false);

      setShowEmoji(false);

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

      fetchMessages(userId);
    };

  // ========================================
  // INITIAL FETCH
  // ========================================

  useEffect(() => {
    fetchConversations();
  }, [
    location.search,
  ]);

  // ========================================
  // SOCKET
  // ========================================

  useEffect(() => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      return;
    }

    const newSocket =
      io(
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
          "❌ Socket error:",
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
  // SOCKET EVENTS
  // ========================================

  useEffect(() => {
    if (!socket) {
      return;
    }

    // --------------------------------------
    // NEW MESSAGE
    // --------------------------------------

    const handleNewMessage =
      (newMessage) => {
        const senderId =
          newMessage.sender?._id ||
          newMessage.sender;

        const receiverId =
          newMessage.receiver?._id ||
          newMessage.receiver;

        const selectedUserId =
          selectedChatRef.current
            ?.user?._id;

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

    // --------------------------------------
    // MESSAGE DELETED
    // --------------------------------------

    const handleMessageDeleted =
      ({
        messageId,
      }) => {
        setMessages(
          (current) =>
            current.filter(
              (msg) =>
                msg._id !==
                messageId
            )
        );

        setSelectedMessageIds(
          (current) =>
            current.filter(
              (id) =>
                id !== messageId
            )
        );

        fetchConversations();
      };

    // --------------------------------------
    // MULTIPLE DELETED
    // --------------------------------------

    const handleMessagesDeleted =
      ({
        messageIds,
      }) => {
        setMessages(
          (current) =>
            current.filter(
              (msg) =>
                !messageIds.includes(
                  msg._id
                )
            )
        );

        setSelectedMessageIds(
          (current) =>
            current.filter(
              (id) =>
                !messageIds.includes(
                  id
                )
            )
        );

        fetchConversations();
      };

    // --------------------------------------
    // CONVERSATION DELETED
    // --------------------------------------

    const handleConversationDeleted =
      ({
        userId,
      }) => {
        const selectedUserId =
          selectedChatRef.current
            ?.user?._id;

        if (
          selectedUserId ===
          userId
        ) {
          selectedChatRef.current =
            null;

          setSelectedChat(null);

          setMessages([]);

          setSelectedMessageIds(
            []
          );

          setSelectMode(false);
        }

        fetchConversations();
      };

    // --------------------------------------
    // USER BLOCKED
    // --------------------------------------

    const handleUserBlocked =
      ({
        userId,
      }) => {
        if (
          selectedChatRef.current
            ?.user?._id ===
          userId
        ) {
          setSelectedChat(
            (current) =>
              current
                ? {
                    ...current,
                    isBlocked:
                      true,
                  }
                : current
          );
        }

        fetchConversations();
      };

    // --------------------------------------
    // USER UNBLOCKED
    // --------------------------------------

    const handleUserUnblocked =
      ({
        userId,
      }) => {
        if (
          selectedChatRef.current
            ?.user?._id ===
          userId
        ) {
          setSelectedChat(
            (current) =>
              current
                ? {
                    ...current,
                    isBlocked:
                      false,
                  }
                : current
          );
        }

        fetchConversations();
      };

    // --------------------------------------
    // TYPING
    // --------------------------------------

    const handleTyping = ({
      userId,
    }) => {
      if (
        userId ===
        selectedChatRef.current
          ?.user?._id
      ) {
        setTyping(true);
      }
    };

    // --------------------------------------
    // STOP TYPING
    // --------------------------------------

    const handleStopTyping =
      ({
        userId,
      }) => {
        if (
          userId ===
          selectedChatRef.current
            ?.user?._id
        ) {
          setTyping(false);
        }
      };

    socket.on(
      "new_message",
      handleNewMessage
    );

    socket.on(
      "message_deleted",
      handleMessageDeleted
    );

    socket.on(
      "messages_deleted",
      handleMessagesDeleted
    );

    socket.on(
      "conversation_deleted",
      handleConversationDeleted
    );

    socket.on(
      "user_blocked",
      handleUserBlocked
    );

    socket.on(
      "user_unblocked",
      handleUserUnblocked
    );

    socket.on(
      "user_typing",
      handleTyping
    );

    socket.on(
      "user_stop_typing",
      handleStopTyping
    );

    return () => {
      socket.off(
        "new_message",
        handleNewMessage
      );

      socket.off(
        "message_deleted",
        handleMessageDeleted
      );

      socket.off(
        "messages_deleted",
        handleMessagesDeleted
      );

      socket.off(
        "conversation_deleted",
        handleConversationDeleted
      );

      socket.off(
        "user_blocked",
        handleUserBlocked
      );

      socket.off(
        "user_unblocked",
        handleUserUnblocked
      );

      socket.off(
        "user_typing",
        handleTyping
      );

      socket.off(
        "user_stop_typing",
        handleStopTyping
      );
    };
  }, [socket]);

  // ========================================
  // AUTO SCROLL
  // ========================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior:
          "smooth",
      }
    );
  }, [
    messages,
    typing,
  ]);

  // ========================================
  // IMAGE
  // ========================================

  const handleImageSelect =
    (event) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        alert(
          "Faqat rasm yuborish mumkin."
        );

        event.target.value =
          "";

        return;
      }

      if (
        file.size >
        10 * 1024 * 1024
      ) {
        alert(
          "Rasm hajmi 10MB dan oshmasligi kerak."
        );

        event.target.value =
          "";

        return;
      }

      if (imagePreview) {
        URL.revokeObjectURL(
          imagePreview
        );
      }

      setSelectedImage(file);

      setImagePreview(
        URL.createObjectURL(
          file
        )
      );
    };

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

  const addEmoji = (
    emoji
  ) => {
    setMessage(
      (current) =>
        current + emoji
    );
  };

  // ========================================
  // TYPING
  // ========================================

  const handleTypingChange =
    (event) => {
      const value =
        event.target.value;

      setMessage(value);

      if (
        !socket ||
        !selectedChatRef.current
          ?.user?._id
      ) {
        return;
      }

      socket.emit(
        "typing",
        {
          receiverId:
            selectedChatRef.current
              .user._id,
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
                selectedChatRef.current
                  .user._id,
            }
          );
        }, 1000);
    };

  // ========================================
  // SEND MESSAGE
  // ========================================

  const sendMessage =
    async () => {
      const trimmed =
        message.trim();

      if (
        !trimmed &&
        !selectedImage
      ) {
        return;
      }

      const receiverId =
        selectedChatRef.current
          ?.user?._id;

      if (
        !receiverId ||
        sending
      ) {
        return;
      }

      if (
        selectedChatRef.current
          ?.isBlocked
      ) {
        alert(
          "Bu user bloklangan."
        );

        return;
      }

      try {
        setSending(true);

        const token =
          localStorage.getItem(
            "token"
          );

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
          receiverId
        );

        if (selectedImage) {
          formData.append(
            "image",
            selectedImage
          );
        }

        const response =
          await fetch(
            API_URL,
            {
              method:
                "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              body:
                formData,
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to send message"
          );
        }

        if (
          data.success
        ) {
          setMessages(
            (current) => {
              if (
                current.some(
                  (item) =>
                    item._id ===
                    data.message
                      ._id
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
                receiverId,
              }
            );
          }

          await fetchConversations();
        }

      } catch (error) {
        console.error(
          "❌ Send error:",
          error
        );

        alert(
          error.message
        );
      } finally {
        setSending(false);
      }
    };

  // ========================================
  // ENTER
  // ========================================

  const handleKeyDown =
    (event) => {
      if (
        event.key ===
          "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();

        sendMessage();
      }
    };

  // ========================================
  // FORMAT TIME
  // ========================================

  const formatTime =
    (dateString) => {
      if (!dateString) {
        return "";
      }

      const date =
        new Date(
          dateString
        );

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
          hour:
            "2-digit",

          minute:
            "2-digit",
        }
      );
    };

  // ========================================
  // SELECT MESSAGE
  // ========================================

  const toggleMessageSelect =
    (item) => {
      const currentUser =
        localStorage.getItem("user");

      let currentUserId = null;

      try {
        const user = JSON.parse(
          currentUser || "{}"
        );

        currentUserId = user?._id;
      } catch {
        currentUserId = null;
      }

      const senderId =
        item.sender?._id ||
        item.sender;

      // Faqat o'z xabaringni tanlash mumkin
      if (
        !currentUserId ||
        senderId?.toString() !==
          currentUserId.toString()
      ) {
        return;
      }

      setSelectedMessageIds(
        (current) =>
          current.includes(item._id)
            ? current.filter(
                (id) =>
                  id !== item._id
              )
            : [
                ...current,
                item._id,
              ]
      );
    };

  // ========================================
  // SELECT ALL
  // ========================================

  const toggleSelectAll =
    () => {
      const currentUser =
        localStorage.getItem("user");

      let currentUserId = null;

      try {
        const user = JSON.parse(
          currentUser || "{}"
        );

        currentUserId = user?._id;
      } catch {
        currentUserId = null;
      }

      if (!currentUserId) {
        return;
      }

      const ownMessageIds =
        messages
          .filter((msg) => {
            const senderId =
              msg.sender?._id ||
              msg.sender;

            return (
              senderId?.toString() ===
              currentUserId.toString()
            );
          })
          .map((msg) => msg._id);

      if (
        selectedMessageIds.length ===
        ownMessageIds.length
      ) {
        setSelectedMessageIds(
          []
        );

        return;
      }

      setSelectedMessageIds(
        ownMessageIds
      );
    };

  // ========================================
  // DELETE SELECTED
  // ========================================

  const deleteSelected =
    async () => {
      if (
        selectedMessageIds.length ===
        0
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          `${selectedMessageIds.length} ta xabarni o‘chirmoqchimisiz?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(
          true
        );

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await fetch(
            `${API_URL}/bulk`,
            {
              method:
                "DELETE",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  messageIds:
                    selectedMessageIds,
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Delete failed"
          );
        }

        setMessages(
          (current) =>
            current.filter(
              (msg) =>
                !selectedMessageIds.includes(
                  msg._id
                )
            )
        );

        setSelectedMessageIds(
          []
        );

        setSelectMode(
          false
        );

        await fetchConversations();

      } catch (error) {
        console.error(
          "❌ Delete selected error:",
          error
        );

        alert(
          error.message
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  // ========================================
  // DELETE SINGLE
  // ========================================

  const deleteSingleMessage =
    async (
      messageId
    ) => {
      const confirmed =
        window.confirm(
          "Bu xabarni o‘chirmoqchimisiz?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(
          true
        );

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await fetch(
            `${API_URL}/${messageId}`,
            {
              method:
                "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Delete failed"
          );
        }

        setMessages(
          (current) =>
            current.filter(
              (msg) =>
                msg._id !==
                messageId
            )
        );

        setSelectedMessageIds(
          (current) =>
            current.filter(
              (id) =>
                id !==
                messageId
            )
        );

        await fetchConversations();

      } catch (error) {
        console.error(
          "❌ Delete message error:",
          error
        );

        alert(
          error.message
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  // ========================================
  // DELETE CHAT
  // ========================================

  const deleteChat =
    async () => {
      const userId =
        selectedChatRef.current
          ?.user?._id;

      if (!userId) {
        return;
      }

      const confirmed =
        window.confirm(
          "Butun chatni o‘chirmoqchimisiz? Bu chatdagi barcha xabarlar o‘chadi."
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(
          true
        );

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await fetch(
            `${API_URL}/conversation/${userId}`,
            {
              method:
                "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Delete chat failed"
          );
        }

        setConversations(
          (current) =>
            current.filter(
              (chat) =>
                chat.user?._id !==
                userId
            )
        );

        selectedChatRef.current =
          null;

        setSelectedChat(
          null
        );

        setMessages([]);

        setSelectedMessageIds(
          []
        );

        setSelectMode(
          false
        );

        setShowMenu(
          false
        );

      } catch (error) {
        console.error(
          "❌ Delete chat error:",
          error
        );

        alert(
          error.message
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  // ========================================
  // BLOCK
  // ========================================

  const blockSelectedUser =
    async () => {
      const userId =
        selectedChatRef.current
          ?.user?._id;

      if (!userId) {
        return;
      }

      const confirmed =
        window.confirm(
          "Bu userni block qilmoqchimisiz?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(
          true
        );

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await fetch(
            `${API_URL}/block/${userId}`,
            {
              method:
                "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Block failed"
          );
        }

        setSelectedChat(
          (current) =>
            current
              ? {
                  ...current,
                  isBlocked:
                    true,
                }
              : current
        );

        selectedChatRef.current = {
          ...selectedChatRef.current,
          isBlocked: true,
        };

        setShowMenu(
          false
        );

        await fetchConversations();

      } catch (error) {
        console.error(
          "❌ Block error:",
          error
        );

        alert(
          error.message
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  // ========================================
  // UNBLOCK
  // ========================================

  const unblockSelectedUser =
    async () => {
      const userId =
        selectedChatRef.current
          ?.user?._id;

      if (!userId) {
        return;
      }

      try {
        setActionLoading(
          true
        );

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await fetch(
            `${API_URL}/block/${userId}`,
            {
              method:
                "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unblock failed"
          );
        }

        setSelectedChat(
          (current) =>
            current
              ? {
                  ...current,
                  isBlocked:
                    false,
                }
              : current
        );

        selectedChatRef.current = {
          ...selectedChatRef.current,
          isBlocked: false,
        };

        setShowMenu(
          false
        );

        await fetchConversations();

      } catch (error) {
        console.error(
          "❌ Unblock error:",
          error
        );

        alert(
          error.message
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  // ========================================
  // CLOSE CHAT
  // ========================================

  const closeChat =
    () => {
      if (
        messagesRequestRef.current
      ) {
        messagesRequestRef.current.abort();

        messagesRequestRef.current =
          null;
      }

      setTyping(false);

      setMessages([]);

      setSelectedMessageIds(
        []
      );

      setSelectMode(
        false
      );

      selectedChatRef.current =
        null;

      setSelectedChat(
        null
      );

      setShowMenu(
        false
      );

      setShowEmoji(
        false
      );

      removeImage();
    };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-400" />
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="h-full flex flex-col p-5 lg:p-8">

      {/* HEADER */}

      <div className="mb-4 shrink-0">
        <p className="text-xs font-medium text-green-400">
          Stay connected
        </p>

        <h1 className="mt-1 text-xl font-bold text-white">
          Messages
        </h1>
      </div>

      {/* CHAT */}

      <div className="flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">

        {/* SIDEBAR */}

        <div
          className={`w-full shrink-0 border-r border-white/10 lg:flex lg:w-[280px] lg:flex-col ${
            selectedChat
              ? "hidden"
              : "flex"
          }`}
        >

          {/* SEARCH */}

          <div className="border-b border-white/10 p-3">

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">

              <Search className="h-4 w-4 text-gray-600" />

              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent text-xs text-white outline-none placeholder:text-gray-600"
              />

            </div>

          </div>

          {/* CHATS */}

          <div className="min-h-0 flex-1 overflow-y-auto">

            {conversations.length ===
            0 ? (
              <div className="p-5 text-center text-xs text-gray-500">
                No conversations yet
              </div>
            ) : (
              conversations.map(
                (chat) => (
                  <button
                    key={
                      chat.user
                        ._id
                    }
                    onClick={() =>
                      handleSelectChat(
                        chat
                      )
                    }
                    className={`flex w-full gap-3 border-b border-white/5 p-3 text-left transition ${
                      selectedChat
                        ?.user?._id ===
                      chat.user
                        ?._id
                        ? "bg-green-500/10"
                        : "hover:bg-white/[0.03]"
                    }`}
                  >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-500/10 font-semibold text-green-400">

                      {chat.user
                        ?.avatar ? (
                        <img
                          src={
                            chat
                              .user
                              .avatar
                          }
                          alt={
                            chat
                              .user
                              .name
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        chat
                          .user
                          ?.name?.charAt(
                            0
                          ) ||
                        "U"
                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center justify-between gap-2">

                        <p className="truncate text-xs font-semibold text-white">
                          {
                            chat
                              .user
                              ?.name
                          }
                        </p>

                        {chat.isBlocked && (
                          <Ban className="h-3.5 w-3.5 shrink-0 text-red-400" />
                        )}

                      </div>

                      <p className="mt-1 truncate text-[10px] text-gray-500">
                        {chat
                          .lastMessage
                          ?.imageUrl &&
                        !chat
                          .lastMessage
                          ?.content
                          ? "📷 Image"
                          : chat
                              .lastMessage
                              ?.content ||
                            "No messages"}
                      </p>

                      {chat
                        .unreadCount >
                        0 && (
                        <span className="mt-1 inline-flex min-w-5 items-center justify-center rounded-full bg-green-500 px-1.5 py-0.5 text-[10px] font-bold text-gray-950">
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

        {/* CHAT AREA */}

        <div
          className={`min-h-0 min-w-0 flex-1 flex-col ${
            selectedChat
              ? "flex"
              : "hidden lg:flex"
          }`}
        >

          {/* CHAT HEADER */}

          <div className="relative flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">

            <div className="flex min-w-0 items-center gap-3">

              <button
                onClick={
                  closeChat
                }
                className="rounded-lg p-1.5 text-gray-500 hover:bg-white/5 hover:text-white lg:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-500/10 font-semibold text-green-400">

                {selectedChat
                  ?.user
                  ?.avatar ? (
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
                    ) ||
                  "U"
                )}

              </div>

              <div className="min-w-0">

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

                {selectedChat
                  ?.isBlocked && (
                  <p className="text-[10px] text-red-400">
                    Blocked
                  </p>
                )}

                {typing &&
                  !selectedChat
                    ?.isBlocked && (
                    <p className="text-[10px] text-gray-500">
                      typing...
                    </p>
                  )}

              </div>

            </div>

            <div className="relative">

              <button
                onClick={() =>
                  setShowMenu(
                    (value) =>
                      !value
                  )
                }
                className="rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-white"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>

              {/* MENU */}

              {showMenu && (
                <div className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#111] p-1 shadow-2xl">

                  {/* SELECT */}

                  <button
                    onClick={() => {
                      setSelectMode(
                        true
                      );

                      setShowMenu(
                        false
                      );
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-gray-300 hover:bg-white/5"
                  >
                    <CheckSquare className="h-4 w-4" />
                    Select messages
                  </button>

                  {/* DELETE CHAT */}

                  <button
                    onClick={
                      deleteChat
                    }
                    disabled={
                      actionLoading
                    }
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete chat
                  </button>

                  {/* BLOCK */}

                  {selectedChat
                    ?.isBlocked ? (
                    <button
                      onClick={
                        unblockSelectedUser
                      }
                      disabled={
                        actionLoading
                      }
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-green-400 hover:bg-green-500/10"
                    >
                      <Check className="h-4 w-4" />
                      Unblock user
                    </button>
                  ) : (
                    <button
                      onClick={
                        blockSelectedUser
                      }
                      disabled={
                        actionLoading
                      }
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10"
                    >
                      <Ban className="h-4 w-4" />
                      Block user
                    </button>
                  )}

                </div>
              )}

            </div>

          </div>

          {/* SELECT TOOLBAR */}

          {selectMode && (
            <div className="flex shrink-0 items-center justify-between border-b border-green-500/10 bg-green-500/5 px-4 py-2">

              <div className="flex items-center gap-3">

                <button
                  onClick={
                    toggleSelectAll
                  }
                  className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white"
                >
                  {(() => {
                    const currentUser =
                      localStorage.getItem("user");

                    let currentUserId = null;

                    try {
                      const user = JSON.parse(
                        currentUser || "{}"
                      );

                      currentUserId =
                        user?._id;
                    } catch {
                      currentUserId = null;
                    }

                    const ownCount =
                      messages.filter(
                        (msg) => {
                          const senderId =
                            msg.sender?._id ||
                            msg.sender;

                          return (
                            senderId?.toString() ===
                            currentUserId?.toString()
                          );
                        }
                      ).length;

                    return (
                      selectedMessageIds.length ===
                        ownCount &&
                      ownCount > 0
                    );
                  })() ? (
                    <CheckSquare className="h-4 w-4 text-green-400" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}

                  Select my messages
                </button>

                <span className="text-[10px] text-gray-600">
                  {
                    selectedMessageIds.length
                  }{" "}
                  selected
                </span>

              </div>

              <div className="flex items-center gap-2">

                <button
                  onClick={() => {
                    setSelectMode(
                      false
                    );

                    setSelectedMessageIds(
                      []
                    );
                  }}
                  className="rounded-lg px-2 py-1.5 text-xs text-gray-500 hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    deleteSelected
                  }
                  disabled={
                    selectedMessageIds.length ===
                      0 ||
                    actionLoading
                  }
                  className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/20 disabled:opacity-40"
                >
                  {actionLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}

                  Delete
                </button>

              </div>

            </div>
          )}

          {/* MESSAGES */}

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">

            <div className="flex justify-center">
              <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-gray-600">
                Today
              </span>
            </div>

            {messages.length ===
            0 ? (
              <div className="flex h-full items-center justify-center text-xs text-gray-500">
                No messages yet.
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

                  const isOwnMessage =
                    !isIncoming;

                  const isSelected =
                    selectedMessageIds.includes(
                      item._id
                    );

                  return (
                    <div
                      key={
                        item._id
                      }
                      className={`group flex ${
                        isIncoming
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >

                      {/* SELECT CHECKBOX */}

                      {selectMode &&
                        isOwnMessage && (
                          <button
                            onClick={() =>
                              toggleMessageSelect(
                                item
                              )
                            }
                            className="order-last ml-2 mr-0 self-center"
                            title="Select message"
                          >
                            {isSelected ? (
                              <CheckSquare className="h-5 w-5 text-green-400" />
                            ) : (
                              <Square className="h-5 w-5 text-gray-600 hover:text-gray-300" />
                            )}
                          </button>
                        )}

                      <div
                        className={`relative max-w-[75%] overflow-visible ${
                          isSelected
                            ? "rounded-xl ring-2 ring-green-400/40"
                            : ""
                        }`}
                      >

                        {/* SINGLE DELETE */}

                        {!selectMode &&
                          isOwnMessage && (
                            <button
                              onClick={() =>
                                deleteSingleMessage(
                                  item._id
                                )
                              }
                              disabled={actionLoading}
                              className="absolute -top-2 right-1 z-10 hidden rounded-full border border-white/10 bg-[#111] p-1.5 text-gray-500 shadow-lg group-hover:block hover:text-red-400 disabled:opacity-40"
                              title="Delete message"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}

                        <div
                          className={`overflow-hidden rounded-xl ${
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
                                alt="Attachment"
                                className="max-h-60 w-full object-cover"
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
                                className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                                  isIncoming
                                    ? "text-gray-600"
                                    : "text-gray-800"
                                }`}
                              >
                                {
                                  formatTime(
                                    item.createdAt
                                  )
                                }

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
                                {
                                  formatTime(
                                    item.createdAt
                                  )
                                }

                                {!isIncoming && (
                                  <CheckCheck className="h-3 w-3" />
                                )}
                              </div>

                            </div>
                          )}

                        </div>

                      </div>

                    </div>
                  );
                }
              )
            )}

            <div
              ref={
                messagesEndRef
              }
            />

          </div>

          {/* IMAGE PREVIEW */}

          {imagePreview && (
            <div className="border-t border-white/10 bg-gray-950 px-4 pt-2">

              <div className="relative inline-block">

                <img
                  src={
                    imagePreview
                  }
                  alt="Preview"
                  className="h-20 w-20 rounded-xl border border-white/10 object-cover"
                />

                <button
                  onClick={
                    removeImage
                  }
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                >
                  <X className="h-3 w-3" />
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
                      onClick={() =>
                        addEmoji(
                          emoji
                        )
                      }
                      className="rounded-lg p-2 text-lg hover:bg-white/10"
                    >
                      {emoji}
                    </button>
                  )
                )}

              </div>

            </div>
          )}

          {/* INPUT */}

          <div className="shrink-0 border-t border-white/10 bg-gray-950/80 p-3">

            {selectedChat
              ?.isBlocked ? (
              <div className="flex items-center justify-between rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-3">

                <div className="flex items-center gap-2 text-xs text-red-400">
                  <Ban className="h-4 w-4" />
                  User blocked
                </div>

                <button
                  onClick={
                    unblockSelectedUser
                  }
                  className="rounded-lg bg-green-500/10 px-3 py-1.5 text-xs text-green-400 hover:bg-green-500/20"
                >
                  Unblock
                </button>

              </div>
            ) : (
              <>
                <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2">

                  {/* FILE */}

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
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="shrink-0 rounded-lg p-1.5 text-gray-600 hover:bg-white/5 hover:text-gray-300"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>

                  {/* INPUT */}

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
                    className="max-h-24 min-h-[32px] flex-1 resize-none bg-transparent px-2 py-1.5 text-xs text-white outline-none placeholder:text-gray-600"
                  />

                  {/* EMOJI */}

                  <button
                    onClick={() =>
                      setShowEmoji(
                        (value) =>
                          !value
                      )
                    }
                    className={`rounded-lg p-1.5 ${
                      showEmoji
                        ? "text-green-400"
                        : "text-gray-600"
                    }`}
                  >
                    <Smile className="h-4 w-4" />
                  </button>

                  {/* SEND */}

                  <button
                    onClick={
                      sendMessage
                    }
                    disabled={
                      (
                        !message.trim() &&
                        !selectedImage
                      ) ||
                      sending
                    }
                    className="rounded-lg bg-green-500 p-1.5 text-gray-950 hover:bg-green-400 disabled:opacity-40"
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
              </>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Messages;