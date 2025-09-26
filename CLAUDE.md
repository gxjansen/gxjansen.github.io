# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start local development server (port 4321)
- `npm run dev:netlify` - Start Netlify dev environment (port 8888)

### Build & Deploy
- `npm run build` - Build for production
- `npm run preview` - Build and preview locally
- `npm run production` - Production build

### Testing
- `npm test` - Run Vitest tests with jsdom environment
- Test files pattern: `src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}`
- Coverage thresholds: 80% for all metrics

### Dark Mode Utilities
- `npm run check-dark-mode` - Check dark mode implementation
- `npm run fix-dark-mode` - Fix dark mode issues
- `npm run fix-dark-mode:dry` - Dry run for dark mode fixes

## Architecture

This is a personal website and blog built with Astro 5.13.10, featuring:
- **Static Site Generation** with Astro
- **Content Management** via Keystatic (Git-based CMS)
- **Styling** with Tailwind CSS and custom theme
- **Interactive Components** using React 18.3.1
- **Deployment** on Netlify with serverless functions

### Key Directories
- `src/content/` - Content collections (blog posts, authors, pages)
- `src/components/` - Reusable Astro and React components
- `src/pages/` - Route pages including dynamic catch-all routes
- `src/data/` - JSON data files for events, presentations, etc.
- `netlify/functions/` - Serverless functions for dynamic features

### Dynamic Routing Pattern
The site uses a two-stage routing system to prevent render errors:
1. `/[...page].astro` - Catches requests and redirects to `/other/[page]`
2. `/other/[...page].astro` - Actually renders the content with full error handling

This pattern prevents "page.render is not a function" errors by ensuring proper page structure validation before rendering.

### Testing Strategy
- Unit tests for components, utilities, and layouts using Vitest
- Test setup file at `src/test/setup.ts`
- Path aliases configured: `@components`, `@data`, `@js`, `@config`, `@utils`

### Content Collections
All content is type-safe through Astro's content collections:
- Blog posts with MDX support
- Author profiles
- Other pages with draft status filtering
- Events, presentations, and press coverage data

### Performance Optimizations
- Image optimization with Sharp
- CSS code splitting with Lightning CSS
- Critical CSS inlining with Critters
- HTML compression
- PurgeCSS for unused styles removal

## Solving Issues
When the user tells you to fix a bug/error or when you encounter an error yourself, I want you to:
#1 implement a fix
#2 test the netlify build locally
#3 If #2 fails: take the errors and go back to #1. If #2 succeeds: go to next step
#4 commit and sync
#5 If needed, trigger the relevant Github action and wait for it to complete
#6 If #5 fails: take the error log go back to #1. If #5 succeeds: go to next step
#7 If needed, use the Github MCP to validate if the Github action successfully updated the episode files.
#8 If the Github Action updated the files correctly: go to next step. If not: go back to step #1
#9 Use the Netlify MCP to trigger a new Netlify build. If it completes successfully: you are done! If not: fetch the error log and return to #1

## Performance & Accessibility
- Implement proper loading states for async operations
- Use proper semantic HTML elements
- Follow WCAG 2.2 AA standards
- Include proper ARIA labels and roles
- Ensure proper color contrast (minimum 4.5:1 for normal text)
- Implement keyboard navigation support
- Optimize images and assets
- Implement proper code splitting
- Use proper caching strategies

## Available MCP (Model Context Protocol) Servers

The following MCP servers are available for use:

### 1. **Puppeteer** - Browser Automation
- **Navigate**: Open web pages (`mcp__puppeteer__puppeteer_navigate`)
- **Screenshot**: Capture screenshots of pages or elements (`mcp__puppeteer__puppeteer_screenshot`)
- **Interact**: Click, fill forms, select options, hover elements (`mcp__puppeteer__puppeteer_click`, `mcp__puppeteer__puppeteer_fill`, `mcp__puppeteer__puppeteer_select`, `mcp__puppeteer__puppeteer_hover`)
- **Execute JS**: Run JavaScript in browser console (`mcp__puppeteer__puppeteer_evaluate`)
- **Resources**: Access browser console logs

### 2. **Firecrawl** - Advanced Web Scraping & Search
- **Scrape**: Extract content from single URLs with caching support (`mcp__firecrawl__firecrawl_scrape`)
- **Map**: Discover all URLs on a website (`mcp__firecrawl__firecrawl_map`)
- **Crawl**: Extract content from multiple pages asynchronously (`mcp__firecrawl__firecrawl_crawl`)
- **Search**: Web search with content extraction (`mcp__firecrawl__firecrawl_search`)
- **Extract**: Get structured data using LLM (`mcp__firecrawl__firecrawl_extract`)
- **Deep Research**: Conduct comprehensive web research (`mcp__firecrawl__firecrawl_deep_research`)
- **LLMs.txt**: Generate AI interaction guidelines (`mcp__firecrawl__firecrawl_generate_llmstxt`)

### 3. **Tavily** - AI-Powered Search Engine
- **Search**: Real-time web search with customizable parameters (`mcp__tavily__tavily-search`)
- **Extract**: Retrieve and process raw content from URLs (`mcp__tavily__tavily-extract`)
- **Crawl**: Structured web crawling from base URL (`mcp__tavily__tavily-crawl`)
- **Map**: Create structured website maps (`mcp__tavily__tavily-map`)

### 4. **Transistor** - Podcast Management
- **Authentication**: Get authenticated user details (`mcp__transistor__get_authenticated_user`)
- **Shows**: List and manage podcast shows (`mcp__transistor__list_shows`)
- **Episodes**: Create, update, list episodes (`mcp__transistor__create_episode`, `mcp__transistor__update_episode`, `mcp__transistor__list_episodes`)
- **Analytics**: Get show/episode analytics (`mcp__transistor__get_analytics`, `mcp__transistor__get_all_episode_analytics`)
- **Uploads**: Authorize audio file uploads (`mcp__transistor__authorize_upload`)
- **Webhooks**: Manage webhook subscriptions (`mcp__transistor__list_webhooks`, `mcp__transistor__subscribe_webhook`)

### 5. **Netlify** - Deployment & Site Management
- **Coding Rules**: Get Netlify coding guidelines (`mcp__netlify__netlify-coding-rules`)
- **User Services**: User account operations (`mcp__netlify__netlify-user-services`)
- **Deploy Services**: Deploy sites and manage deployments (`mcp__netlify__netlify-deploy-services`)
- **Team Services**: Team management (`mcp__netlify__netlify-team-services`)
- **Project Services**: Site/project configuration, env vars, forms (`mcp__netlify__netlify-project-services`)
- **Extension Services**: Manage Netlify extensions (`mcp__netlify__netlify-extension-services`)

### 6. **GitHub** - Repository & Code Management
- **Issues**: Create, update, comment on issues (`mcp__github__create_issue`, `mcp__github__update_issue`, `mcp__github__add_issue_comment`)
- **Pull Requests**: Create, update, review PRs (`mcp__github__create_pull_request`, `mcp__github__merge_pull_request`)
- **Reviews**: Create and submit PR reviews (`mcp__github__create_and_submit_pull_request_review`)
- **Files**: Create, update, delete files (`mcp__github__create_or_update_file`, `mcp__github__delete_file`)
- **Branches**: Create branches, list commits (`mcp__github__create_branch`, `mcp__github__list_commits`)
- **Actions**: Run workflows, check status (`mcp__github__run_workflow`, `mcp__github__get_workflow_run`)
- **Search**: Search code, issues, PRs, repos (`mcp__github__search_code`, `mcp__github__search_issues`)
- **Notifications**: List and manage notifications (`mcp__github__list_notifications`, `mcp__github__dismiss_notification`)
- **Copilot**: Assign Copilot to issues, request reviews (`mcp__github__assign_copilot_to_issue`, `mcp__github__request_copilot_review`)

### 7. **Serena** - Code Analysis & Navigation
- **Project Activation**: Always activate the correct project first (`mcp__serena__activate_project`)
- **File Operations**: Read files and list directories (`mcp__serena__read_file`, `mcp__serena__list_dir`)
- **Search**: Pattern search and symbol finding (`mcp__serena__search_for_pattern`, `mcp__serena__find_symbol`, `mcp__serena__find_referencing_symbols`)
- **File Management**: Find files and create new ones (`mcp__serena__find_file`, `mcp__serena__create_text_file`)
- **Code Manipulation**: Replace symbol bodies and regex patterns (`mcp__serena__replace_symbol_body`, `mcp__serena__replace_regex`)

**IMPORTANT**: Before using any Serena tools, ALWAYS first activate this specific project using `mcp__serena__activate_project` to ensure you're working with the correct project data. Serena contains data from multiple projects and needs to be properly scoped.

## Write valid Typescript code that uses state-of-the-art Node.js v24 features and follows best practices:
- Always use ES6+ syntax
- Always use the built-in 'fetch' for HTTP requests, rather than using the 'node-fetch' package
- Always use Node.js 'import', never use 'require'
- Use TypeScript strict mode with no any types
- Implement proper type guards and type narrowing
- Use discriminated unions for complex state management