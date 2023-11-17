// interface ProjectPreviewProps {
//   details: Array<{ sender: string, content: string }>;
// }

// A component that displays a real-time preview of the project narrative.

export const ProjectPreview = ({ details }: any) => {

  const projectNarrative = details
  // .filter(details => message.sender === 'ai')
  // .map(details => message.content)
  .join(' ');

  return (
    <div className="project-preview">
      <h2>{details.title}</h2>
      <p>{details.overview}</p>
      <p>{details.role}</p>
      <p>{details.challenges}</p>
      <p>{details.technologies}</p>
      <p>{details.learnings}</p>
    </div>
  )
}

// OLD
interface ProjectPreviewOldProps {
  messages: Array<{ sender: string, content: string }>;
}

export const ProjectPreviewOld = ({ messages }: ProjectPreviewOldProps) => {
  // This will process the messages into a project preview
  // For now, we will just display the messages as they are
  const projectNarrative = messages
    .filter(message => message.sender === 'ai')
    .map(message => message.content)
    .join(' ');

  return (
    <div className="project-preview">
      <h3>Project Narrative Preview</h3>
      <p>{projectNarrative}</p>
    </div>
  );
};
