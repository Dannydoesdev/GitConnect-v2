# GitConnect-v2

## The Portfolio creation and sharing hub for Developers

---
## Live site

### [Find the live site by clicking here](https://www.gitconnect.dev/)

---
## Contact

### You can find me at [Linkedin](https://www.linkedin.com/in/danieltmcgee/)
### Please reach out if you want to contribute to this project! Very open to it

--- 
## Introduction

GitConnect is a platform for developers to create, host and share their portfolios, while also discovering projects from other devs in the community. 

Think Dribbble or Behance for engineers. 


It comes with simple onboarding - via GitHub OAuth into adding repos directly in the UI while the server handles fetching them from GitHubs API.

When a repo is added from Github it becomes a 'GitConnect Project' - allowing developers to add GitConnect specific information about the process, challenges, outcomes etc of the project. They can also add a live version of the project direct on the site which imports it as an iFrame.

--- 
## Inspiration
The inspiration for this project comes from my time in General Assemblies Software Engineering intensive, where we spoke about portfolios regularly. 

However the findability of other engineer portfolios on the internet leaves a lot to be desired.

 While designer projects are hosted on several popular sites (Behance, Dribbble, Awwwards etc) - developers portfolios might appear on a blog or two. But, they mostly remain hidden in corners of peoples personal sites - only shared when they might want to apply for a new job.

--- 
## Why V2?

Glad you asked! When the first GitConnect was made we were using mostly vanilla Javascript, with Node.js and Express for the backend. The authentication was made by us and the database used SQL schemas etc. While this ended up working well, the scalability, security and dev experience were still lacking.

Having spent much more time with React, and having genuinely enjoyed working with the concept so much I was inspired to re-create it from scratch. I also wanted to use this time to learn and apply as many new technologies as I could - which has been a blessing and a curse!

v2 is built in Next.JS which saves a lot of time when managing the back-end, as well as allowing for static pages to be created in HTML at build time for SEO etc (this isn't fully implemented yet)

Firebase provides GitConnect with a NoSQL database that can be iterated upon much more easily, and also brings in authentication secured by Google with OAuth integrated much more easily.

MantineUI is a relatively new React component library, while starting with Tailwind, Mantine became the primary UI toolkit given it's extendibility and customisation options.

Much of the above were new concepts when starting the project, so learning and applying them in short loops was both enjoyable and at times, frustrating.

v2 is a work in progress and though my 'formal' studies are behind me I plan to continue iterating and improving the site as I do think the core concept is very strong.

--- 

## User stories:

As a developer, I want an easy way to upload and showcase my projects, so that I can share them with the development community, recruiters & friends

As a developer, I want a place where I can view interesting and inspiring projects by other devs, so that I can find inspiration, motivation, as well as connect with/work with other devs

As a recruiter/hiring engineer, I want a place where I can seek out and contact fresh talent so that I can proactively bring great engineers into our businesses

---
## v1 project:
### [Find the Live site by clicking here](https://git--connect.herokuapp.com/)
### [Find the Repo site by clicking here](https://github.com/Dannydoesdev/project3)
---
## v2 Stack:
- Next.js
- React
- MantineUI
- TailwindCSS
- Firebase (OAuth, file hosting etc)
- Firestore, with NoSQL
- Typescript
- Vercel for hosting and easy restore
--- 
## Features:
(Some features still in progress but available on v1)

- GitHub OAuth
- Github API integration for importing repos as GitConnect Projects
- Project editing tools for 'GitConnect specific' information on the projects
- Profile editing tools
- Light/dark mode
- A profile page for each user
- A project page for each projects
- Landing page for viewing other GitConnect profiles and projects

---
## Planned features:

- Finish the above in v2 (first)
- Recruiter/visiter account & experience
- Jobs board
- Highly customisable project pages likely using a rich text editor
- Further integration and imported functionality from the GitHub API
---
## Installing and running the application locally:
- Clone or Download a zip of the repo
- CD into gitconnect-v2-next
- Install all necessary dependencies: ```npm install ```
- Run the project with: ```yarn dev``` or ```npm run start```
- Build the project with: ```yarn build```
### Note without a firebase project, you may run into issues:
#### You will need to create a firebase project and add the config settings firebase gives you in a ```.env.local``` file in the root of the ```gitconnect-v2-next``` folder

--- 

## Running tests:

Tests use Cypress to run
(from gitconnect-vs-next folder)
- run ```npm run build```
- run ```npm run start```
- run ```npm run test```

Cypress app will run and confirm results in terminal
