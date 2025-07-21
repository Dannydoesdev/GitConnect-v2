
// Displays a real-time preview of the project narrative.
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


