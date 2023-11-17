import { useEffect, useState } from 'react';
import { Message } from './Message';
import { ChatInput } from './ChatInput';
import { ProjectPreview } from './ProjectPreview';

// This is the main chat component that will hold the state of the conversation and render the UI.

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Array<{ sender: string, content: string }>>([]);
  const [projectDetails, setProjectDetails] = useState({
    title: '',
    overview: '',
    role: '',
    challenges: [],
    technologies: [],
    learnings: ''
  });


  useEffect(() => {
    // Load saved conversation from localStorage or backend
    const savedMessagesString = localStorage.getItem('savedMessages');
const savedMessages = savedMessagesString ? JSON.parse(savedMessagesString) : [];
    // const savedMessages = JSON.parse(localStorage.getItem('savedMessages')) || [];
    setMessages(savedMessages);
  }, []);

  const saveMessages = (newMessages: Array<{ sender: string, content: string }>) => {
    localStorage.setItem('savedMessages', JSON.stringify(newMessages));
  };

  const sendMessage = async (content: string) => {
    const userMessage = { sender: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    saveMessages(newMessages);
 

      // Here you would call your backend API to get a response from the AI
      const aiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content })
      }).then((res) => res.json());
  
    // Process the AI response and update the project details accordingly
    const aiMessage = { sender: 'ai', content: aiResponse.message };

      newMessages.push(aiMessage);
      setMessages(newMessages);
      saveMessages(newMessages);
      // Assume aiResponse has structured data to update project details
    setProjectDetails(prevDetails => ({ ...prevDetails, ...aiResponse.details }));
    

        // OLD

       // Update UI immediately for user message
    // const newMessage = { sender: 'user', content };
    // setMessages(prevMessages => [...prevMessages, newMessage]);


    // Call the AI API
    // const aiResponse = await fetch('/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ messages: [{ role: 'user', content }] }),
    // }).then(res => res.json());

    // Update UI with AI response
    // setMessages(prevMessages => [...prevMessages, { sender: 'ai', content: aiResponse.message }]);
  };

  

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((message, index) => (
          <Message key={index} sender={message.sender} content={message.content} />
        ))}
      </div>
      {/* <ProjectPreview messages={messages} /> */}
      <ProjectPreview details={projectDetails} />
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
};
