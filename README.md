# GitConnect

## The Portfolio creation and sharing hub for Developers

[Find the live site by clicking here](https://www.gitconnect.dev/landing)

---

## Status & Open Source

GitConnect is a Portfolio creation platform for developers - built by [@DannyDoesDev](https://github.com/dannydoesdev). 

The project is open source as of August 2025 - feel free to contribute, open issues or contact Danny directly on [Linkedin](https://www.linkedin.com/in/danieltmcgee/) with any questions.

The platform will remain live and freely available for the forseeable future and monetisation has been removed - however, no guarantees are made of future development.

<!---
### Quickstart
- Node 18+
- Copy `.env.example` to `.env.local` and fill required keys.
- `npm i` (or pnpm/yarn) then `npm run dev` to start.


### Contributing
Please see `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md`.

### Security
Please see `SECURITY.md` for how to report vulnerabilities.

### License
MIT
--->
---

## Introduction

GitConnect is a platform for developers to create, host and share their portfolios, while also discovering projects from other devs in the community. Think Dribbble or Behance for engineers.

Going from sign-up to shareable portfolio takes a matter of minutes. Accounts are made with Github OAuth and this credential is used to fetch repo data directly from the Github API - users can then choose projects to add to their portfolio in a couple of clicks.

When a repo is added from Github it becomes a 'GitConnect Project' - developers can then add custom images, rich text and code snippets - or simply use the 'Import Readme' tool as a starting point and go from there!

## Inspiration
The inspiration for this project came from way back, during my time in a coding bootcamp (General Assembly) where we talked about portfolios regularly. However, the findability of other engineer portfolios on the internet leaves a lot to be desired - GitHub provides a great home for project code but is not focussed on discoverability or making navigation easy for non-tech users like recruiters.

While designer projects are hosted on several popular sites (Behance, Dribbble etc) dev portfolios mostly remain hidden in corners of personal sites, only to be shared when applying for a new job. Often these portfolios stop being maintained and updating them becomes a headache in itself.

Gitconnect aimed to be the bridge between GitHub, and visual portfolios for developers - making it easy for devs to setup and update an online presence based on their work that was easy to understand and looked good out of the box.


## User stories:
- As a developer, I want an easy way to upload and showcase my projects, so that I can share them with the development community, recruiters & friends
- As a developer, I want a place where I can view interesting and inspiring projects by other devs, so that I can find inspiration, motivation, as well as connect with/work with other devs
- As a recruiter/hiring engineer, I want a place where I can seek out and contact fresh talent so that I can proactively bring great engineers into our businesses

---

## Tech Stack:
- Next.js
- React
- Typescript
- MantineUI
- TailwindCSS
- Firebase (OAuth, file hosting etc)
- Firestore NoSQL
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

