import axios from 'axios';
import { Octokit } from '@octokit/rest';
import DOMPurify from 'isomorphic-dompurify';


export const cleanReadme = (readme: any) => {
  // First, configure DOMPurify with stricter options
  const config = {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'a', 'ul', 'ol', 'li', 'code',
      'pre', 'blockquote', 'em', 'strong',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'hr', 'br', 'div', 'span'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    ALLOWED_CLASSES: {
      'div': ['markdown-body', 'highlight'],
      'pre': ['highlight'],
      'code': ['language-*']
    },
    KEEP_CONTENT: true,
  };

  // Add hook to clean up GitHub-specific elements
  DOMPurify.addHook('uponSanitizeElement', (node: any, data: any) => {
    // Remove GitHub anchor links
    if (data.tagName === 'a' && (
      node.classList.contains('heading-link') || 
      node.classList.contains('anchor')
    )) {
      node.parentNode?.removeChild(node);
      return;
    }

    // Clean up div elements
    if (data.tagName === 'div') {
      // Remove all data-* attributes
      const attributes = Array.from(node.attributes) as Attr[];
      for (const attr of attributes) {
        if (attr.name.startsWith('data-')) {
          node.removeAttribute(attr.name);
        }
      }
    }
  });

  // Sanitize the HTML and get it as a string
  const sanitizedHTML = DOMPurify.sanitize(readme, config);

  // Remove any remaining GitHub-specific classes and IDs
  return sanitizedHTML
    .replace(/\s(id|class)="user-content-[^"]*"/g, '')
    .replace(/\s(id|class)="octicon[^"]*"/g, '')
    .replace(/\sdir="auto"/g, '')
    .replace(/\sitemprop="[^"]*"/g, '');
}

// Utilising this version as it runs on the server
export const fetchReadmeNoapi = async (
  userName: string,
  repoName: string
) => {

  try {
    const octokit = new Octokit();
    const { data: readme } = await octokit.repos.getReadme({
      owner: userName.toString(),
      repo: repoName.toString(),
      mediaType: {
        // format: 'raw', // fetch the raw markdown content
        format: 'html',
      },
    });

    // console.log('readme:', readme);

    const cleanedReadme = cleanReadme(readme);
    // const readmeContent =  cleanMarkdown(readme);
    // console.log('cleaned readmeContent:', cleanedReadme);

    return cleanedReadme;
  
  } catch (error) {
    console.error('Error fetching README from GitHub:', error);
    return null;
  }
}

// Utility function to fetch readme content for a given Github repository based on username and repo name
export const fetchReadme = async (
  userName: string,
  repoName: string
): Promise<string | null> => {

  const readmeUrl = `/api/quickstart/fetchReadme`;

  try {
    const response = await axios.get(readmeUrl, {
      params: { owner: userName, repo: repoName },
    });

    // return cleanMarkdown(response.data);
    return cleanReadme(response.data);
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Remove markdown syntax and newlines - OLD
// export const cleanMarkdown = (rawText: any) => {
//   const strippedMarkdown = removeMarkdown(rawText);
//   return strippedMarkdown.replace(/\n/g, ' ');
// };