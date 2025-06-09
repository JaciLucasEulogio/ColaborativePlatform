'use client';

import React, { useState, useRef, useEffect } from "react";

const colors = {
  white: "#FFFFFF",
  grayLight: "#F0F0F0",
  grayMedium: "#999999",
  grayDark: "#444444",
  grayDarker: "#222222",
  grayDarkest: "#111111",
};

const shadows = {
  chatWindowLight:
    "0 4px 12px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.06)",
  chatWindowDark:
    "0 4px 12px rgba(0, 0, 0, 0.9), 0 1px 4px rgba(0, 0, 0, 0.7)",
};

const gradients = {
  headerLight: "linear-gradient(90deg, #4f46e5, #3b82f6)",
  headerDark: "linear-gradient(90deg, #2563eb, #1e40af)",
};

// Función para transformar texto markdown básico a HTML para mostrar en mensajes del bot
const formatBotText = (text) => {
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/(\n|^)[*-] (.*?)(?=\n|$)/g, "<li>$2</li>");
  formatted = formatted.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
  formatted = formatted.replace(/\n{2,}/g, "</p><p>");
  formatted = "<p>" + formatted + "</p>";
  return formatted;
};

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Scroll al final cuando llegan mensajes y el chat está abierto
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
      setHasNewMessage(false);
    }
  }, [isOpen, messages]);

  // Manejo input usuario
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // Enviar mensaje con Enter (sin Shift)
  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      await sendMessage();
    }
  };

  // Enviar mensaje y recibir respuesta del backend
  const sendMessage = async () => {
    const trimmedInput = userInput.trim();
    if (!trimmedInput) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: trimmedInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedInput }),
      });

      const data = await res.json();

      const botMessage = {
        id: Date.now() + 1,
        role: "bot",
        text: data.reply || data.error || "Sin respuesta.",
      };

      setMessages((prev) => [...prev, botMessage]);

      if (!isOpen) {
        setHasNewMessage(true);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = {
        id: Date.now() + 2,
        role: "bot",
        text: "❌ Error de conexión. Por favor, intenta de nuevo.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir/cerrar chat, y si se abre por primera vez poner mensaje de bienvenida
  const toggleOpen = () => {
    if (!isOpen) {
      setMessages([
        {
          id: Date.now(),
          role: "bot",
          text: "¡Hola! Bienvenido al chat de soporte. ¿En qué puedo ayudarte hoy?",
        },
      ]);
    }
    setIsOpen(!isOpen);
  };

  // Estilos
  const floatingButtonStyle = {
    position: "fixed",
    bottom: 40,
    right: 24,
    width: 48,
    height: 48,
    borderRadius: "50%",
    backgroundColor: isDarkMode ? colors.grayDarkest : colors.grayDark,
    color: colors.white,
    border: "none",
    fontSize: 24,
    cursor: "pointer",
    zIndex: 10000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  };

  const chatWindowStyle = {
    position: "fixed",
    bottom: 100,
    right: 24,
    width: 360,
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: isDarkMode ? colors.grayDarker : colors.white,
    borderRadius: 12,
    boxShadow: isDarkMode ? shadows.chatWindowDark : shadows.chatWindowLight,
    color: isDarkMode ? colors.grayLighter : colors.grayDarkest,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    userSelect: "auto",
    zIndex: 9999,
    overflow: "hidden",
  };

  const headerStyle = {
    background: isDarkMode ? gradients.headerDark : gradients.headerLight,
    padding: "10px 16px",
    color: colors.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontWeight: "600",
    fontSize: 18,
    userSelect: "none",
  };

  const avatarStyle = {
    marginRight: 10,
    fontSize: 24,
  };

  const messagesContainerStyle = {
    flexGrow: 1,
    padding: 12,
    overflowY: "auto",
    backgroundColor: isDarkMode ? colors.grayDarker : colors.grayLight,
  };

  const messageUserStyle = {
    backgroundColor: isDarkMode ? "#1a73e8" : "#dbeafe",
    color: isDarkMode ? "#e8f0fe" : "#1a202c",
    padding: "8px 12px",
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: "75%",
    alignSelf: "flex-end",
    whiteSpace: "pre-wrap",
    fontSize: 14,
  };

  const messageBotStyle = {
    backgroundColor: isDarkMode ? "#333" : "#f3f4f6",
    color: isDarkMode ? "#ddd" : "#111",
    padding: "8px 12px",
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: "75%",
    alignSelf: "flex-start",
    whiteSpace: "pre-wrap",
    fontSize: 14,
  };

  const footerStyle = {
    padding: 12,
    borderTop: `1px solid ${isDarkMode ? colors.grayDark : colors.grayLight}`,
    display: "flex",
    gap: 8,
  };

  const inputStyle = {
    flexGrow: 1,
    resize: "none",
    borderRadius: 20,
    border: `1px solid ${isDarkMode ? colors.grayMedium : colors.grayMedium}`,
    padding: "8px 12px",
    fontSize: 14,
    fontFamily: "inherit",
    backgroundColor: isDarkMode ? colors.grayDarker : colors.white,
    color: isDarkMode ? colors.grayLighter : colors.grayDarkest,
    outline: "none",
  };

  const sendButtonStyle = {
    backgroundColor: isDarkMode ? "#2563eb" : "#3b82f6",
    color: colors.white,
    border: "none",
    borderRadius: 20,
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: 14,
  };

  return (
    <>
      <button
        style={floatingButtonStyle}
        onClick={toggleOpen}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
        title={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? "×" : "💬"}
      </button>

      {isOpen && (
        <div
          ref={chatWindowRef}
          style={chatWindowStyle}
          aria-label="Ventana de chat"
        >
          <div style={headerStyle} aria-label="Barra de título del chat">
            <div style={avatarStyle} aria-hidden="true">
              🤖
            </div>
            <div>Chatbot de soporte</div>
          </div>

          <div
            ref={messagesContainerRef}
            style={messagesContainerStyle}
            aria-live="polite"
            aria-atomic="false"
          >
            {messages.length === 0 && (
              <p
                style={{
                  fontSize: 14,
                  color: isDarkMode ? colors.grayMedium : colors.grayMedium,
                  textAlign: "center",
                  marginTop: 20,
                }}
              >
                Envía un mensaje para empezar
              </p>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                style={msg.role === "user" ? messageUserStyle : messageBotStyle}
                dangerouslySetInnerHTML={{ __html: formatBotText(msg.text) }}
                role={msg.role === "user" ? "article" : "note"}
                aria-label={msg.role === "user" ? "Mensaje enviado" : "Mensaje recibido"}
              />
            ))}
          </div>

          <form
            style={footerStyle}
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            aria-label="Formulario para enviar mensaje"
          >
            <textarea
              ref={inputRef}
              style={inputStyle}
              rows={1}
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Escribe tu mensaje..."
              aria-label="Campo de texto para mensaje"
            />
            <button
              type="submit"
              style={sendButtonStyle}
              disabled={isLoading}
              aria-label="Enviar mensaje"
            >
              {isLoading ? "..." : "Enviar"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingChat;
