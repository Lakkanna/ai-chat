"use client";

import React, { useState, useEffect } from "react";
import { Menu, Send, Plus } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { streamMessage, ChatMessage, Chat } from "../actions/stream-message";
import { readStreamableValue } from "ai/rsc";

async function getChatsFromLocalStorage(): Promise<Chat[]> {
  if (typeof window !== "undefined") {
    const chats = localStorage.getItem("chats");
    return chats ? JSON.parse(chats) : [];
  }
  return [];
}

async function saveChatsToLocalStorage(chats: Chat[]) {
  if (typeof window !== "undefined") {
    debugger;
    localStorage.setItem("chats", JSON.stringify(chats));
  }
}

async function createNewChat(name: string): Promise<Chat> {
  return {
    id: Date.now().toString(),
    name,
    messages: [],
  };
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputText, setInputText] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  useEffect(() => {
    (async () => {
      const savedChats = await getChatsFromLocalStorage();
      setChats(savedChats);
      if (savedChats.length > 0) {
        setCurrentChat(savedChats[0]);
      } else {
        // Create a new chat if there are no saved chats
        const newChat = await createNewChat("New Chat");
        setChats([newChat]);
        setCurrentChat(newChat);
      }
    })();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !currentChat) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: inputText,
    };

    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
      // Update the chat name if this is the first message
      name:
        currentChat.messages.length === 0
          ? inputText.slice(0, 30)
          : currentChat.name,
    };

    setCurrentChat(updatedChat);
    setInputText("");

    const { output } = await streamMessage(updatedChat.messages);

    const assistantMessageId = Date.now();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant" as const,
      content: "",
    };

    const updatedChatWithAssistant = {
      ...updatedChat,
      messages: [...updatedChat.messages, assistantMessage],
    };

    setCurrentChat(updatedChatWithAssistant);

    let currentMessageContent = "";
    for await (const delta of readStreamableValue(output)) {
      currentMessageContent += delta;
      setCurrentChat((prevChat) => {
        if (!prevChat) return null;
        const updatedMessages = prevChat.messages.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: currentMessageContent }
            : msg
        );
        return { ...prevChat, messages: updatedMessages };
      });
    }

    // Update chats state and save to local storage
    const finalUpdatedChat = {
      ...updatedChatWithAssistant,
      messages: updatedChatWithAssistant.messages.map((msg) =>
        msg.id === assistantMessageId
          ? { ...msg, content: currentMessageContent }
          : msg
      ),
      // Ensure the updated name is preserved
      name: updatedChat.name,
    };
    const updatedChats = chats.map((chat) =>
      chat.id === finalUpdatedChat.id ? finalUpdatedChat : chat
    );
    setChats(updatedChats);
    await saveChatsToLocalStorage(updatedChats);
  };

  const handleCreateNewChat = async () => {
    const newChat = await createNewChat(`Chat ${chats.length + 1}`);
    setChats([...chats, newChat]);
    setCurrentChat(newChat);
    saveChatsToLocalStorage([...chats, newChat]);
  };

  return (
    <div className="bg-gray-900 min-h-screen flex">
      {/* Sidebar */}
      <div
        className={`w-[300px] bg-gray-800 transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 h-full z-20`}
      >
        <h2 className="text-xl font-semibold mb-4 text-white mt-16 ml-4">
          Chats
        </h2>
        <ul className="space-y-2 px-4">
          {chats.map((chat) => (
            <li
              key={chat.id}
              className={`cursor-pointer p-3 rounded-lg transition-colors ${
                currentChat?.id === chat.id
                  ? "bg-gray-700 text-white font-medium"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setCurrentChat(chat)}
            >
              <span className="truncate block">{chat.name}</span>
            </li>
          ))}
        </ul>

        {/* Create new chat button - moved inside sidebar */}
        <button
          onClick={handleCreateNewChat}
          className="text-white p-4 absolute top-4 right-4 z-30 hover:bg-gray-700 rounded-full transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-[300px]" : "ml-0"
        }`}
      >
        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className="text-white p-4 fixed top-4 left-4 z-30"
        >
          <Menu size={24} />
        </button>

        {/* Chat area */}
        <div className="flex-1 flex flex-col p-4 max-w-[800px] mx-auto w-full">
          {/* Chat title */}
          <h1 className="text-2xl font-bold text-white mb-4">
            {currentChat ? currentChat.name : "Select or create a chat"}
          </h1>

          {/* Message rendering area */}
          <div className="flex-1 overflow-y-auto mb-4 bg-gray-800 rounded-lg">
            <div className="p-4 space-y-4">
              {currentChat?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`${
                    message.role === "user"
                      ? "bg-blue-500 text-white self-end ml-auto"
                      : "bg-gray-700 text-white self-start"
                  } p-3 rounded-lg max-w-[80%]`}
                >
                  {message.content}
                </div>
              ))}
            </div>
          </div>

          {/* Input area */}
          <div className="relative">
            <TextareaAutosize
              className="w-full bg-gray-800 text-white rounded-lg pl-4 pr-12 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-white/50"
              minRows={1}
              maxRows={5}
              placeholder="Type your message..."
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              className={`absolute right-2 bottom-2 text-white rounded-lg p-2 transition-colors flex items-center justify-center ${
                !inputText.trim()
                  ? "text-gray-500 cursor-not-allowed"
                  : "hover:bg-gray-700"
              }`}
              aria-label="Send message"
              disabled={!inputText.trim()}
              onClick={handleSendMessage}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
