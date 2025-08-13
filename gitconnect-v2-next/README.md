# GitConnect-v2

## The Portfolio creation and sharing hub for Developers

[Find the live site by clicking here](https://www.gitconnect.dev/)

---

## GitConnect (Open Source)

This is the open-source version of GitConnect, a Next.js + Firebase project for building developer portfolios from GitHub data.

### Quickstart
- Node 18+
- Copy `.env.example` to `.env.local` and fill required keys.
- `pnpm i` (or npm/yarn) then `pnpm dev` to start.

### Contributing
Please see `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md`.

### Security
Please see `SECURITY.md` for how to report vulnerabilities.

### License
MIT

---

## Introduction

GitConnect is a platform for developers to create, host and share their portfolios, while also discovering projects from other devs in the community. Think Dribbble or Behance for engineers.

It comes with simple onboarding - via GitHub OAuth into adding repos directly in the UI while the server handles fetching them from GitHubs API.

When a repo is added from Github it becomes a 'GitConnect Project' - allowing developers to add GitConnect specific information about the project with rich text, images, and more

## Inspiration
The inspiration for this project came from way back, during my time in a coding bootcamp (General Assembly) where we talked about portfolios regularly. However the findability of other engineer portfolios on the internet leaves a lot to be desired.

While designer projects are hosted on several popular sites (Behance, Dribbble, Awwwards etc) - developers portfolios might appear on a blog or two. But, they mostly remain hidden in corners of peoples personal sites - only shared when they might want to apply for a new job.

## User stories:
- As a developer, I want an easy way to upload and showcase my projects, so that I can share them with the development community, recruiters & friends
- As a developer, I want a place where I can view interesting and inspiring projects by other devs, so that I can find inspiration, motivation, as well as connect with/work with other devs
- As a recruiter/hiring engineer, I want a place where I can seek out and contact fresh talent so that I can proactively bring great engineers into our businesses

---

## Tech Stack:
- Next.js
- React
- MantineUI
- TailwindCSS
- Firebase (OAuth, file hosting etc)
- Firestore, with NoSQL
- Typescript
- Vercel for hosting and easy restore

## Features:
- GitHub OAuth
- Github API integration for importing repos as GitConnect Projects
- Project editing tools with rich text editor, images etc
- Profile editing tools
- Light/dark mode
- A profile page for each user
- A project page for each project
- Landing page for viewing other GitConnect profiles and projects

---

## Installing and running the application locally:
- Clone or Download a zip of the repo
- Install all necessary dependencies: `npm install`
- Build the project with: `npm run build`
- Run the project with `npm run start`

### Note without a firebase project, you will likely run into issues:
#### You will need to create a firebase project and add the config settings firebase gives you in a `.env.local` file in the root folder

---

## Contact

You can find me at [Linkedin](https://www.linkedin.com/in/danieltmcgee/)

Please reach out if you want to contribute to this project! Very open to it
