// This component displays individual messages from both the user and the AI.

interface MessageProps {
  sender: string;
  content: string;
}

export const Message = ({ sender, content }: MessageProps) => {
  const messageClass = sender === 'user' ? 'user-message' : 'ai-message';

  return (
    <div className={`message ${messageClass}`}>
      <div className="message-content">{content}</div>
    </div>
  );
};
