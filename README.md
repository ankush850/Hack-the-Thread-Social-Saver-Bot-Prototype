# Hack-the-Thread-Social-Saver-Bot-Prototype

[![Hack the Thread](https://img.shields.io/badge/Hack_the_Thread-2026-8A2BE2?style=flat&logo=hackthebox)](https://github.com/ankush850/Hack-the-Thread-Social-Saver-Bot-Prototype)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-2D3748?style=flat&logo=prisma)](https://www.prisma.io)
[![GitHub Repo](https://img.shields.io/badge/github-repo-black?style=flat&logo=github)](https://github.com/ankush850/Hack-the-Thread-Social-Saver-Bot-Prototype)

A smart bookmarking tool that saves and organizes links from WhatsApp messages, with a beautiful dashboard to view, search, filter, and share your saved content.


## 🎯 Overview

Social Saver Bot helps you never lose interesting links shared on WhatsApp again. Simply forward messages containing links to your bot, and they'll be automatically saved, organized by platform, and accessible through a beautiful dashboard.


# Watch demo video 

[![Watch Demo](https://img.shields.io/badge/Watch-Demo-blue?style=flat&logo=google-drive)](https://drive.google.com/file/d/1ykjenvMyH7XygMGk8JxJesTQdCHNkvxi/view?usp=drive_link)

## click on this badge to see

### Perfect for:
- **Content curators** saving inspiration from social media
- **Researchers** collecting resources from WhatsApp groups
- **Teams** sharing relevant links with each other
- **Personal use** bookmarking interesting content on the go

##  Features

### Core Functionality
- ** WhatsApp Integration** - Save links directly from WhatsApp messages via webhook
- ** Passwordless Authentication** - Login with email or phone using OTP
- ** Beautiful Dashboard** - View all your saved links in a clean, organized interface
- ** Smart Search & Filtering** - Search by title or filter by platform
- ** Email Sharing** - Share collections of links with formatted previews


### Platform Detection
Automatically detects and tags links from:
- Instagram
- Twitter/X
- YouTube
- Dribbble
- Blog posts (Medium, Substack, etc.)
- Other websites

  


## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with App Router |
| TypeScript | Type safety and better developer experience |
| Tailwind CSS 4 | Styling and responsive design |
| Radix UI | Accessible UI primitives |
| SWR | Data fetching and caching |
| next-themes | Dark/light mode support |
| Lucide React | Icon library |
| Sonner | Toast notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| Next.js API Routes | Backend API endpoints |
| Prisma | ORM for database operations |
| SQLite/PostgreSQL | Database (SQLite for dev, PostgreSQL for prod) |
| Session Cookies | Authentication management |
| Custom Validation | Input validation utilities |


##  Authentication Flow

``` mermaid
graph TD
    A[Enter Email/Phone] --> B[Request OTP]
    B --> C[Receive OTP]
    C --> D[Verify OTP]
    D --> E[Session Created]
    E --> F[Access Dashboard]
```



## Data Flow Diagram

```mermaid
graph TB
    subgraph "Social Saver Bot System"
        SSB[Social Saver Bot]
    end

    User((User)) -->|Interacts with| SSB
    SSB -->|Displays dashboard| User
    
    WhatsApp((WhatsApp)) -->|Sends messages with links| SSB
    SSB -->|Confirms receipt| WhatsApp
    
    Email((Email)) <-->|Sends shared links| SSB
    
    Database[(Database)] <-->|Reads/Writes data| SSB
```



