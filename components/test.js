'use client';

import React, { useState, useRef, useEffect } from "react";

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
  const [isMinimized, setIsMinimized] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Detectar modo oscuro/claro
  useEffect(() => {
    const checkDarkMode = () => {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      const documentBg = window.getComputedStyle(document.documentElement).backgroundColor;
      
      // Convertir RGB a luminancia para determinar si es oscuro
      const getLuminance = (rgb) => {
        const rgbMatch = rgb.match(/\d+/g);
        if (!rgbMatch) return 0.5;
        const [r, g, b] = rgbMatch.map(x => parseInt(x) / 255);
        return 0.299 * r + 0.587 * g + 0.114 * b;
      };
      
      const bodyLuminance = getLuminance(bodyBg);
      const docLuminance = getLuminance(documentBg);
      const avgLuminance = (bodyLuminance + docLuminance) / 2;
      
      // Si la luminancia promedio es baja, es modo oscuro
      const isSystemDark = darkModeQuery.matches;
      const isBackgroundDark = avgLuminance < 0.5;
      
      setIsDarkMode(isSystemDark || isBackgroundDark);
    };

    checkDarkMode();
    
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', checkDarkMode);
    
    // Observer para cambios en el DOM que puedan afectar el tema
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    
    return () => {
      darkModeQuery.removeEventListener('change', checkDarkMode);
      observer.disconnect();
    };
  }, []);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
      setHasNewMessage(false);
      
      if (position.x === 0 && position.y === 0 && chatWindowRef.current) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const chatWidth = chatWindowRef.current.offsetWidth;
        const chatHeight = chatWindowRef.current.offsetHeight;
        
        setPosition({
          x: windowWidth - chatWidth - 24,
          y: windowHeight - chatHeight - 100
        });
      }
    }
  }, [isOpen, isMinimized, messages, position]);

  const handleMouseDown = (e) => {
    if (chatWindowRef.current && e.target.closest('.drag-handle')) {
      setIsDragging(true);
      const boundingRect = chatWindowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - boundingRect.left,
        y: e.clientY - boundingRect.top
      });
      
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && chatWindowRef.current) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const chatWidth = chatWindowRef.current.offsetWidth;
      const chatHeight = chatWindowRef.current.offsetHeight;
      
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;
      
      newX = Math.max(0, Math.min(windowWidth - chatWidth, newX));
      newY = Math.max(0, Math.min(windowHeight - chatHeight, newY));
      
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
      if (messages.length === 0) {
        setMessages([
          {
            from: "bot",
            text: "**¡Hola! 👋 Soy tu asistente colaborativo**\n\nEstoy aquí para ayudarte con tus tareas y proyectos:\n\n- **Organización de tareas**\n- **Colaboración en equipo**\n- **Gestión de proyectos**\n- **Consultas generales**\n\n¿En qué puedo ayudarte hoy?",
          },
        ]);
      }
    } else {
      setIsOpen(false);
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMinimized) {
      setHasNewMessage(false);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { from: "user", text: userInput }];
    setMessages(newMessages);
    const currentInput = userInput;
    setUserInput("");
    setIsLoading(true);

    setMessages([...newMessages, { from: "bot", text: "..." }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      });
      const data = await res.json();

      const updatedMessages = [...newMessages, { from: "bot", text: data.reply || data.error }];
      setMessages(updatedMessages);
      
      if (isMinimized) {
        setHasNewMessage(true);
      }
    } catch (err) {
      console.error(err);
      const errorMessages = [...newMessages, { from: "bot", text: "❌ Error de conexión. Por favor, intenta de nuevo." }];
      setMessages(errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  // Clases dinámicas basadas en el tema
  const themeClasses = {
    button: isDarkMode 
      ? 'bg-blue-600 border-blue-500 hover:bg-blue-700 hover:border-blue-600' 
      : 'bg-blue-500 border-blue-400 hover:bg-blue-600 hover:border-blue-500',
    buttonShadow: isDarkMode 
      ? '0 20px 40px rgba(37, 99, 235, 0.4), 0 0 0 1px rgba(37, 99, 235, 0.2)' 
      : '0 20px 40px rgba(59, 130, 246, 0.3), 0 8px 25px rgba(59, 130, 246, 0.2)',
    closeButton: isDarkMode 
      ? 'bg-red-500 border-red-400 hover:bg-red-600 hover:border-red-500' 
      : 'bg-red-500 border-red-400 hover:bg-red-600 hover:border-red-500',
    closeShadow: isDarkMode 
      ? '0 20px 40px rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(239, 68, 68, 0.2)' 
      : '0 20px 40px rgba(239, 68, 68, 0.3), 0 8px 25px rgba(239, 68, 68, 0.2)',
    window: isDarkMode 
      ? 'bg-gray-900 border-gray-700' 
      : 'bg-white border-gray-300',
    windowShadow: isDarkMode 
      ? '0 25px 60px rgba(0, 0, 0, 0.25), 0 10px 25px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1)' 
      : '0 25px 60px rgba(0, 0, 0, 0.15), 0 10px 25px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    header: isDarkMode 
      ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700' 
      : 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600',
    headerAvatar: isDarkMode 
      ? 'bg-gradient-to-br from-white from-20% to-blue-100' 
      : 'bg-gradient-to-br from-blue-50 to-white',
    headerAvatarIcon: isDarkMode ? 'text-blue-600' : 'text-blue-700',
    messagesArea: isDarkMode 
      ? 'linear-gradient(135deg, #1f2937 0%, #374151 100%)' 
      : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    messagesBorder: isDarkMode ? 'border-gray-600' : 'border-gray-200',
    botMessage: isDarkMode 
      ? 'bg-gray-800 text-gray-100 border-gray-600' 
      : 'bg-white text-gray-900 border-gray-200',
    botMessageShadow: isDarkMode 
      ? '0 4px 20px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15)' 
      : '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
    userMessage: isDarkMode 
      ? 'bg-blue-600 text-white border-blue-400' 
      : 'bg-blue-500 text-white border-blue-300',
    userMessageShadow: isDarkMode 
      ? '0 4px 20px rgba(37, 99, 235, 0.25)' 
      : '0 4px 20px rgba(59, 130, 246, 0.2)',
    loadingMessage: isDarkMode 
      ? 'bg-gray-700 text-gray-200 border-gray-500' 
      : 'bg-gray-100 text-gray-600 border-gray-200',
    inputArea: isDarkMode 
      ? 'bg-gray-900 border-gray-700' 
      : 'bg-gray-50 border-gray-200',
    input: isDarkMode 
      ? 'bg-gray-800 border-gray-600 focus-within:border-blue-500 focus-within:bg-gray-700' 
      : 'bg-white border-gray-300 focus-within:border-blue-400 focus-within:bg-blue-50',
    inputText: isDarkMode 
      ? 'text-gray-100 placeholder-gray-400' 
      : 'text-gray-900 placeholder-gray-500',
    sendButton: isDarkMode 
      ? 'bg-blue-600 border-blue-500 hover:bg-blue-700' 
      : 'bg-blue-500 border-blue-400 hover:bg-blue-600',
    disabledButton: isDarkMode 
      ? 'bg-gray-600 border-gray-500' 
      : 'bg-gray-300 border-gray-200'
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 w-16 h-16 cursor-pointer z-50 flex items-center justify-center transition-transform duration-300 transform hover:scale-105`}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: isOpen
            ? '0 8px 15px rgba(99, 102, 241, 0.6)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
          filter: hasNewMessage ? 'drop-shadow(0 0 8px #34d399)' : 'none',
        }}
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat colaborativo'}
      >
        <div className="relative flex items-center justify-center">
          {isOpen ? (
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <>
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {hasNewMessage && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                </div>
              )}
            </>
          )}
        </div>
      </button>


      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatWindowRef}
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: '400px',
            height: isMinimized ? '70px' : '550px',
            cursor: isDragging ? 'move' : 'auto',
            zIndex: 1000,
            transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: themeClasses.windowShadow,
            backdropFilter: 'blur(20px)'
          }}
          className={`${themeClasses.window} rounded-3xl flex flex-col overflow-hidden border-2`}
          onMouseDown={handleMouseDown}
        >
          {/* Header */}
          <div className={`p-5 ${themeClasses.header} text-white flex items-center justify-between cursor-move drag-handle select-none relative overflow-hidden`}>
            {/* Patrón de fondo sutil */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px'
              }}></div>
            </div>
            
            <div className="flex items-center relative z-10">
              <div className={`w-11 h-11 rounded-xl ${themeClasses.headerAvatar} flex items-center justify-center mr-4 shadow-lg`}>
                <svg className={`w-6 h-6 ${themeClasses.headerAvatarIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Asistente IA</h3>
                <p className="text-sm text-blue-100">Colaborativo & Inteligente</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 relative z-10">
              <button 
                onClick={toggleMinimize}
                className="w-9 h-9 rounded-xl bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center backdrop-blur-sm border border-white border-opacity-20"
                aria-label={isMinimized ? "Expandir chat" : "Minimizar chat"}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMinimized ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  )}
                </svg>
              </button>
              <button 
                onClick={toggleChat}
                className="w-9 h-9 rounded-xl bg-red-500 hover:bg-red-600 transition-all duration-200 flex items-center justify-center shadow-lg"
                aria-label="Cerrar chat"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div 
                ref={messagesContainerRef}
                className={`flex-1 overflow-y-auto p-6 space-y-4 border-t-2 ${themeClasses.messagesBorder}`}
                style={{ 
                  height: '420px',
                  background: themeClasses.messagesArea
                }}
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-end space-x-3 ${msg.from === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md border-2 ${
                      msg.from === "bot" 
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 border-blue-200" 
                        : "bg-gradient-to-br from-green-500 to-teal-600 border-green-200"
                    }`}>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {msg.from === "bot" ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        )}
                      </svg>
                    </div>
                    
                    {/* Message Bubble */}
                    <div className="max-w-[75%]">
                      {msg.from === "bot" && msg.text !== "..." ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: formatBotText(msg.text) }}
                          className={`${themeClasses.botMessage} py-4 px-5 rounded-2xl rounded-bl-md shadow-sm border-2`}
                          style={{
                            boxShadow: themeClasses.botMessageShadow
                          }}
                        />
                      ) : (
                        <div
                          className={`py-4 px-5 rounded-2xl shadow-sm font-medium border-2 ${
                            msg.from === "user"
                              ? `${themeClasses.userMessage} rounded-br-md`
                              : `${themeClasses.loadingMessage} italic animate-pulse`
                          }`}
                          style={{
                            boxShadow: msg.from === "user" 
                              ? themeClasses.userMessageShadow
                              : '0 4px 20px rgba(0, 0, 0, 0.08)'
                          }}
                        >
                          {msg.text}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className={`p-6 ${themeClasses.inputArea} border-t-2 ${themeClasses.messagesBorder}`}>
                <div className={`flex items-center space-x-4 ${themeClasses.input} rounded-2xl p-4 border-2 transition-all duration-200`}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="Escribe tu mensaje..."
                    disabled={isLoading}
                    className={`flex-1 bg-transparent ${themeClasses.inputText} border-none outline-none text-base font-medium`}
                    autoFocus
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !userInput.trim()}
                    className={`w-12 h-12 rounded-2xl text-white transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100 border-2 ${
                      isLoading || !userInput.trim() 
                        ? themeClasses.disabledButton 
                        : themeClasses.sendButton
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default FloatingChat;