# Quickstart State Management

## Overview

The quickstart flow uses a centralized state management pattern with a custom hook called `useQuickstartState`. This hook handles data from multiple sources:

1. Server-side props from static/server rendering
2. Jotai atoms for local state
3. Client-side fetching with SWR when needed

## Main Components

The quickstart flow consists of three main pages:

1. `pages/quickstart.tsx` - Initial form to enter a GitHub username and select repositories
2. `pages/quickstart/[anonymousId].tsx` - Portfolio profile page showing selected repositories
3. `pages/quickstart/[anonymousId]/[repoId].tsx` - Individual project detail page

## How Data Flows

1. When a user creates a quickstart portfolio:
   - Data is saved to Firebase
   - Data is also stored in Jotai atoms for immediate use
   - User is redirected to the profile page

2. When loading the profile or project pages directly:
   - Data is fetched from Firebase via getStaticProps/getServerSideProps
   - Data is passed to the component as initialProps
   - The useQuickstartState hook manages this data

3. State Priority:
   - Server-fetched data is prioritized over atom state
   - Latest data from SWR is used when available
   - Atoms are used as fallbacks

## Using the Hook

```typescript
// Import the hook
import { useQuickstartState } from '@/hooks/useQuickstartState';

// Use the hook in your component
function MyQuickstartComponent({ initialProfile, initialProjects, initialProject, initialReadme }) {
  const {
    profile,
    projects,
    draftProjects,
    publishedProjects,
    currentProject,
    readme,
    anonymousId,
    repoId,
    isReady,
    isFallback
  } = useQuickstartState({
    initialProfile,
    initialProjects,
    initialProject,
    initialReadme
  });
  
  // Rest of your component logic
}
```

## Benefits

1. **Single Source of Truth**: All state management logic is encapsulated in the hook
2. **Simplified Components**: Components only need to use the hook instead of managing state directly
3. **Consistent Data Flow**: Data is processed consistently across pages
4. **Better Performance**: Reduces redundant data fetching
5. **Easier Maintenance**: State management logic is centralized and easier to update

## Implementation Details

The hook handles:
- Loading state (isReady, isFallback)
- Data normalization (processing different data formats)
- Prioritizing data sources
- Separating projects into draft and published
- Finding the current project based on repoId
- Managing profile data

This approach replaces the previous complex state management that used multiple useEffect calls in each component with conditionals for different data sources. 