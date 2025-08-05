import { useEffect, useState } from "react";
import { Message } from "./Message";
import { ChatInput } from "./ChatInput";
import { ProjectPreview } from "./ProjectPreview";

// Main chat component that holds the state of the conversation and renders the UI

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Array<{ sender: string; content: string }>>([]);
  const [projectDetails, setProjectDetails] = useState({
    title: "",
    overview: "",
    role: "",
    challenges: [],
    technologies: [],
    learnings: "",
  });

  useEffect(() => {
    // Load saved conversation from localStorage or backend
    const savedMessagesString = localStorage.getItem("savedMessages");
    const savedMessages = savedMessagesString ? JSON.parse(savedMessagesString) : [];
    // const savedMessages = JSON.parse(localStorage.getItem('savedMessages')) || [];
    setMessages(savedMessages);
  }, []);

  const saveMessages = (newMessages: Array<{ sender: string; content: string }>) => {
    localStorage.setItem("savedMessages", JSON.stringify(newMessages));
  };

  const sendMessage = async (content: string) => {
    const userMessage = { sender: "user", content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    saveMessages(newMessages);

    // Call your backend API to get a response from the AI
    const aiResponse = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: content }),
    }).then((res) => res.json());

    // Process the AI response and update the project details
    const aiMessage = { sender: "ai", content: aiResponse.message };

    newMessages.push(aiMessage);
    setMessages(newMessages);
    saveMessages(newMessages);

    setProjectDetails((prevDetails) => ({ ...prevDetails, ...aiResponse.details }));
  };

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((message, index) => (
          <Message key={index} sender={message.sender} content={message.content} />
        ))}
      </div>
      <ProjectPreview details={projectDetails} />
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
};
