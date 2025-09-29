"use client";

import React, { useState, useEffect } from "react";
import { Menu, Send, Plus, ArrowLeft, Settings, Trash2 } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { streamMessage, ChatMessage, Chat } from "../../actions/stream-message";
import { readStreamableValue } from "ai/rsc";
import Link from "next/link";
import { ChatConfig, MarkdownRenderer } from "../../components/chat";
import { getAllDailyData, getWeightEntries } from "../../lib/diet-data";

async function getChatsFromLocalStorage(): Promise<Chat[]> {
  if (typeof window !== "undefined") {
    const chats = localStorage.getItem("chats");
    return chats ? JSON.parse(chats) : [];
  }
  return [];
}

async function saveChatsToLocalStorage(chats: Chat[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("chats", JSON.stringify(chats));
  }
}

async function getSystemPromptFromLocalStorage(): Promise<string> {
  if (typeof window !== "undefined") {
    const prompt = localStorage.getItem("systemPrompt");
    return (
      prompt ||
      `You are a knowledgeable and supportive health and nutrition assistant. Your expertise includes:

• Nutrition and dietary guidance
• Exercise and fitness recommendations
• Weight management strategies
• Healthy lifestyle habits
• Meal planning and food choices
• Supplement information
• General health and wellness advice

Guidelines for your responses:
- Provide evidence-based, practical advice
- Always recommend consulting healthcare professionals for medical concerns
- Be encouraging and non-judgmental
- Focus on sustainable, realistic approaches
- Consider individual differences and preferences
- Emphasize balance and moderation
- Provide specific, actionable recommendations when possible

Remember: You're here to support healthy choices and provide educational information, not to replace professional medical advice.`
    );
  }
  return "";
}

async function saveSystemPromptToLocalStorage(prompt: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("systemPrompt", prompt);
  }
}

async function generateEnhancedSystemPrompt(): Promise<string> {
  const basePrompt = `You are a knowledgeable and supportive health and nutrition assistant. Your expertise includes:

• Nutrition and dietary guidance
• Exercise and fitness recommendations
• Weight management strategies
• Healthy lifestyle habits
• Meal planning and food choices
• Supplement information
• General health and wellness advice

Guidelines for your responses:
- Provide evidence-based, practical advice
- Always recommend consulting healthcare professionals for medical concerns
- Be encouraging and non-judgmental
- Focus on sustainable, realistic approaches
- Consider individual differences and preferences
- Emphasize balance and moderation
- Provide specific, actionable recommendations when possible

Remember: You're here to support healthy choices and provide educational information, not to replace professional medical advice.`;

  try {
    const dietData = getAllDailyData();
    const weightEntries = getWeightEntries();

    if (dietData.length === 0 && weightEntries.length === 0) {
      return basePrompt;
    }

    let dietContext =
      "\n\nIMPORTANT: You have access to the user's personal diet tracking data. Use this information to provide personalized advice:\n\n";

    // Add recent diet data (last 7 days)
    const recentDays = dietData.slice(-7);
    if (recentDays.length > 0) {
      dietContext += "RECENT DIET DATA (Last 7 days):\n";
      recentDays.forEach((day) => {
        const date = new Date(day.date).toLocaleDateString();
        dietContext += `- ${date}: ${day.foodEntries.length} food entries, ${day.exerciseEntries.length} exercise entries\n`;
        if (day.foodEntries.length > 0) {
          const totalCalories = day.foodEntries.reduce(
            (sum, entry) => sum + entry.calories,
            0
          );
          dietContext += `  Food: ${totalCalories} calories\n`;
        }
        if (day.exerciseEntries.length > 0) {
          const totalBurned = day.exerciseEntries.reduce(
            (sum, entry) => sum + entry.caloriesBurned,
            0
          );
          dietContext += `  Exercise: ${totalBurned} calories burned\n`;
        }
      });
    }

    // Add weight tracking data
    if (weightEntries.length > 0) {
      dietContext += "\nWEIGHT TRACKING DATA:\n";
      const sortedWeights = weightEntries.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const latestWeight = sortedWeights[0];
      const oldestWeight = sortedWeights[sortedWeights.length - 1];

      dietContext += `- Current weight: ${latestWeight.weight} lbs (${new Date(
        latestWeight.date
      ).toLocaleDateString()})\n`;
      if (sortedWeights.length > 1) {
        const weightChange = latestWeight.weight - oldestWeight.weight;
        const daysDiff = Math.ceil(
          (new Date(latestWeight.date).getTime() -
            new Date(oldestWeight.date).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        dietContext += `- Weight change: ${
          weightChange > 0 ? "+" : ""
        }${weightChange.toFixed(1)} lbs over ${daysDiff} days\n`;
      }
    }

    // Add daily goals
    if (dietData.length > 0) {
      const latestDay = dietData[dietData.length - 1];
      dietContext += `\nDAILY GOALS:\n`;
      dietContext += `- Calories: ${latestDay.goals.calories}\n`;
      dietContext += `- Carbs: ${latestDay.goals.carbs}g\n`;
      dietContext += `- Protein: ${latestDay.goals.protein}g\n`;
      dietContext += `- Fat: ${latestDay.goals.fat}g\n`;
    }

    dietContext +=
      "\nWhen users ask about their diet, nutrition, or health progress, reference this data to provide specific, personalized advice. For example:\n";
    dietContext +=
      "- If they ask about their calorie intake, reference their recent food entries\n";
    dietContext +=
      "- If they ask about weight progress, reference their weight tracking data\n";
    dietContext +=
      "- If they ask about meeting goals, compare their actual intake to their daily goals\n";
    dietContext +=
      "- Provide specific recommendations based on their actual eating and exercise patterns\n";

    return basePrompt + dietContext;
  } catch (error) {
    console.error("Error generating enhanced system prompt:", error);
    return basePrompt;
  }
}

async function createNewChat(name: string): Promise<Chat> {
  return {
    id: Date.now().toString(),
    name,
    messages: [],
  };
}

async function generateChatTitle(messages: ChatMessage[]): Promise<string> {
  console.log("generateChatTitle called with messages:", messages.length);
  if (messages.length < 2) {
    console.log("Not enough messages for title generation");
    return "New Chat";
  }

  // Get the first user message and first AI response
  const userMessage = messages.find((m) => m.role === "user");
  const aiMessage = messages.find((m) => m.role === "assistant");

  console.log("User message:", userMessage?.content);
  console.log("AI message:", aiMessage?.content?.slice(0, 50));

  if (!userMessage || !aiMessage) {
    console.log("Missing user or AI message");
    return "New Chat";
  }

  try {
    // Create a simple prompt to generate a title
    const titlePrompt = `Based on this conversation, generate a short, descriptive title (max 30 characters):

User: "${userMessage.content}"
AI: "${aiMessage.content.slice(0, 100)}..."

Generate a concise title that captures the main topic:`;

    const { output } = await streamMessage(
      [{ id: 1, role: "user", content: titlePrompt }],
      "You are a helpful assistant that generates concise, descriptive titles for conversations. Respond with only the title, nothing else."
    );

    let title = "";
    for await (const delta of readStreamableValue(output)) {
      title += delta;
    }

    // Clean up the title
    title = title.trim().replace(/['"]/g, "").slice(0, 30);

    // Fallback if title generation fails
    if (!title || title.length < 3) {
      return (
        userMessage.content.slice(0, 30) +
        (userMessage.content.length > 30 ? "..." : "")
      );
    }

    return title;
  } catch (error) {
    console.error("Error generating chat title:", error);
    // Fallback to first message
    return (
      userMessage.content.slice(0, 30) +
      (userMessage.content.length > 30 ? "..." : "")
    );
  }
}

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Collapsed by default on mobile
  const [inputText, setInputText] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    (async () => {
      const savedChats = await getChatsFromLocalStorage();
      const savedSystemPrompt = await getSystemPromptFromLocalStorage();

      // If no saved prompt, generate enhanced prompt with diet data
      const finalSystemPrompt =
        savedSystemPrompt || (await generateEnhancedSystemPrompt());

      setChats(savedChats);
      setSystemPrompt(finalSystemPrompt);

      // Save the enhanced prompt if it was generated
      if (!savedSystemPrompt) {
        await saveSystemPromptToLocalStorage(finalSystemPrompt);
      }

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
      // Keep existing name for now, will update after AI response
      name: currentChat.name,
    };

    setCurrentChat(updatedChat);
    setInputText("");

    const { output } = await streamMessage(updatedChat.messages, systemPrompt);

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
    const finalMessages = updatedChatWithAssistant.messages.map((msg) =>
      msg.id === assistantMessageId
        ? { ...msg, content: currentMessageContent }
        : msg
    );

    // Generate title if this is the first AI response (after first user message)
    let finalChatName = updatedChat.name;
    console.log(
      "Messages length:",
      updatedChat.messages.length,
      "Final messages length:",
      finalMessages.length
    );
    if (updatedChat.messages.length === 1) {
      // This was the first exchange (1 user message + 1 AI response = 2 total messages)
      console.log("Generating title for first exchange");
      try {
        finalChatName = await generateChatTitle(finalMessages);
        console.log("Generated title:", finalChatName);
      } catch (error) {
        console.error("Error generating chat title:", error);
        finalChatName =
          inputText.slice(0, 30) + (inputText.length > 30 ? "..." : "");
      }
    }

    const finalUpdatedChat = {
      ...updatedChatWithAssistant,
      messages: finalMessages,
      name: finalChatName,
    };

    const updatedChats = chats.map((chat) =>
      chat.id === finalUpdatedChat.id ? finalUpdatedChat : chat
    );
    setChats(updatedChats);
    setCurrentChat(finalUpdatedChat); // Update currentChat with the new title
    await saveChatsToLocalStorage(updatedChats);
  };

  const handleCreateNewChat = async () => {
    const newChat = await createNewChat(`Chat ${chats.length + 1}`);
    setChats([...chats, newChat]);
    setCurrentChat(newChat);
    saveChatsToLocalStorage([...chats, newChat]);
  };

  const handleSystemPromptChange = async (newPrompt: string) => {
    setSystemPrompt(newPrompt);
    await saveSystemPromptToLocalStorage(newPrompt);
  };

  const handleRefreshWithDietData = async () => {
    const enhancedPrompt = await generateEnhancedSystemPrompt();
    setSystemPrompt(enhancedPrompt);
    await saveSystemPromptToLocalStorage(enhancedPrompt);
  };

  const handleDeleteChat = async (chatId: string) => {
    console.log("Deleting chat:", chatId);
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    console.log("Updated chats:", updatedChats);

    setChats(updatedChats);
    await saveChatsToLocalStorage(updatedChats);

    // If we deleted the current chat, switch to another one or create new
    if (currentChat?.id === chatId) {
      if (updatedChats.length > 0) {
        setCurrentChat(updatedChats[0]);
      } else {
        const newChat = await createNewChat("New Chat");
        setChats([newChat]);
        setCurrentChat(newChat);
        await saveChatsToLocalStorage([newChat]);
      }
    }
  };

  return (
    <div className="bg-background h-screen flex">
      {/* Sidebar */}
      <div
        className={`w-[300px] bg-card transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 h-full z-20 lg:translate-x-0 border-r border-border shadow-medium`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link
            href="/"
            className="text-card-foreground hover:text-muted-foreground transition-colors p-2 -ml-2"
          >
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-xl font-semibold text-card-foreground">Chats</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-card-foreground hover:text-muted-foreground transition-colors p-1"
            >
              <ArrowLeft size={20} className="rotate-90" />
            </button>
            <button
              onClick={() => setShowConfig(true)}
              className="text-card-foreground hover:bg-accent rounded-full p-2 transition-colors"
              title="Chat Configuration"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={handleCreateNewChat}
              className="text-card-foreground hover:bg-accent rounded-full p-2 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <ul className="space-y-2 px-4 py-4">
          {chats.map((chat) => (
            <li
              key={chat.id}
              className={`group relative p-3 rounded-lg transition-colors ${
                currentChat?.id === chat.id
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className="cursor-pointer flex-1 truncate"
                  onClick={() => setCurrentChat(chat)}
                >
                  <span className="truncate block">{chat.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Delete button clicked for chat:", chat.id);
                      handleDeleteChat(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-600 rounded text-red-400 hover:text-white"
                    title="Delete chat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-[300px]" : "ml-0"
        } lg:ml-[300px] h-screen bg-background overflow-hidden`}
      >
        {/* Mobile Menu Button and Back Button */}
        <div className="flex items-center justify-between p-4 lg:hidden flex-shrink-0">
          <button
            onClick={toggleSidebar}
            className="text-foreground p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <Link
            href="/"
            className="text-white hover:text-gray-300 transition-colors p-2 hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft size={24} />
          </Link>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col max-w-[800px] mx-auto w-full h-full chat-container">
          {/* Chat title - fixed at top */}
          <div className="p-4 pb-2 flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {currentChat ? currentChat.name : "Select or create a chat"}
            </h1>
          </div>

          {/* Message rendering area - scrollable */}
          <div className="flex-1 overflow-y-auto px-4 min-h-0 scroll-smooth chat-messages-container">
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {currentChat?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-message ${
                    message.role === "user"
                      ? "bg-blue-500 text-white self-end ml-auto"
                      : "bg-muted text-muted-foreground self-start"
                  } p-2.5 sm:p-3 rounded-lg max-w-[85%] sm:max-w-[80%] text-sm sm:text-base break-words`}
                >
                  {message.role === "assistant" ? (
                    <MarkdownRenderer content={message.content} />
                  ) : (
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Input area - sticky at bottom */}
          <div className="p-4 pt-2 flex-shrink-0 bg-background border-t border-border sticky bottom-0">
            <div className="relative">
              <TextareaAutosize
                className="w-full bg-muted text-foreground rounded-lg pl-4 pr-12 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary border border-border"
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
                className={`absolute right-2 bottom-2 text-foreground rounded-lg p-2 transition-colors flex items-center justify-center ${
                  !inputText.trim()
                    ? "text-muted-foreground cursor-not-allowed"
                    : "hover:bg-accent"
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

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-10"
          onClick={toggleSidebar}
        />
      )}

      {/* Chat Configuration Modal */}
      {showConfig && (
        <ChatConfig
          systemPrompt={systemPrompt}
          onSystemPromptChange={handleSystemPromptChange}
          onClose={() => setShowConfig(false)}
          onRefreshWithDietData={handleRefreshWithDietData}
        />
      )}
    </div>
  );
}
