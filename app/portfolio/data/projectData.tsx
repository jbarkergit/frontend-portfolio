export const projectData = [
  {
    key: 'film database',
    url: 'film-database',
    technologies: {
      application_programming_interface: ['tmdb'],
      ui_component_libraries: ['react-youtube'],
      software_development_kits: ['firebase', 'firebase-tools'],
      utilities_and_services: ['zod'],
      tools_and_libraries: ['vite', 'react', 'react-router', 'typescript', 'sass'],
      testing_tools: ['Vitest', '@testing-library/react'],
      code_quality: ['prettier', 'eslint', 'eslint-config-airbnb'],
      content_moderation: ['naughty-words'],
    },
    insights: (
      <>
        <h2>Film Database</h2>
        <p>
          <strong>TL;DR:</strong> Built a movie trailer platform from scratch featuring a type-safe TMDB API wrapper
          with argument autocompletion, batch requests, response caching, and content filtering. Includes a custom
          YouTube iFrame solution, native JavaScript drag-and-drop collections, responsive carousels, polished
          SCSS-based animations, Firebase authentication with Firestore storage, and exploration of advanced TypeScript
          patterns with Vitest, Jest, and RTL testing.
        </p>

        <p>
          This self-initiated movie database website was built using Vite, React, TypeScript, and styled with SASS. It
          integrates TheMovieDatabase (TMDB) API for movie data, React-YouTube for embedded video playback, and Firebase
          for authentication and full CRUD operations. Form validation is handled with Zod. Vitest was used for unit
          testing, and advanced TypeScript patterns were explored to ensure the codebase is developer-friendly.
        </p>
        <p>
          TMDB presented several challenges: inconsistently formatted URLs, limited WEBP support, and adult content
          slipping through endpoint queries. To reduce API calls and prevent runtime errors, a type-safe API wrapper was
          built to handle endpoint construction, type inference, sessionStorage caching, and batch requests with{' '}
          <code>Promise.allSettled</code>. Content filtering was a head-scratcher: Since TMDB is an open platform where
          users contribute content, the 'adult' query parameter only partially filters results, requiring additional
          checks to keep content appropriate. Various options were considered, including region-locking, genre-based
          filtering, and rating restrictions. To further refine results, the <code>naughty-words</code> package was
          applied to titles and overviews, reducing adult content while remaining performant.
        </p>
        <p>
          To capture a polished feel similar to platforms like Netflix, a custom SCSS-driven loading screen (inspired by
          camillemormal's JavaScript variant) was created for initial load. It uses staggered animations, subtle
          transforms, and careful timing to produce a smooth reveal. Designing it required juggling scale effects and
          transition sequencing—a fun challenge that preserves performance. The loader integrates with React Router v7’s
          client loader, which prefetches carousel data, helping the UI feel immediately responsive.
        </p>
        <p>
          For trailer playback, YouTube’s IFrame Player API was used in combination with the React-YouTube UI library to
          manipulate the player and match TMDB’s trailer data. The iFrame was stretched beyond its native aspect ratio,
          and a custom controller was built to replace the default YouTube UI, ensuring consistent positioning and
          styling across breakpoints and preserving the desired cinematic layout. Recommended videos appear when paused,
          a limitation of the embed.
        </p>
        <p>
          A major UI challenge was implementing a responsive carousel with dynamically sized items. Instead of relying
          on JavaScript-heavy solutions, CSS with viewport-based calculations and custom properties determined item
          dimensions. This approach was inspired by examining Amazon’s DOM for reference calculations, which were then
          adapted to fit the application's design. Computed styles were placed in context, allowing consumers—like the
          carousel and collections features—to dynamically and conditionally adjust. IntersectionObserver toggles
          data-attributes to manage display properties and fetch-priority hints, minimizing network load while keeping
          the carousel smooth and responsive.
        </p>
        <p>
          Given the limitations of TMDB’s data, the only feasible feature was a collections page where users can
          organize movies into custom collections and queue trailers for sequential viewing. Drag-and-drop functionality
          was implemented natively, revealing the intricacies of drag events, state transitions, and race conditions.
          Firestore handles persistence and real-time updates. While full WAI-ARIA compliance isn’t achievable for
          draggable elements due to deprecation, interactions remain fluid and intuitive, preserving usability without
          compromising the learning experience. Due to data limitations, data visualization features weren't possible.
        </p>
        <p>
          This project served as a comprehensive exercise in building scalable front-end architecture, refining CSS
          animations, and optimizing UI responsiveness across devices. Multiple rewrites deepened understanding of React
          patterns, performance trade-offs, and type-safe API design, culminating in a polished flagship project that
          balances developer ergonomics with user experience.
        </p>
      </>
    ),
    imgSrc: '/app/portfolio/assets/filmDatabase-screenshot.webp',
    imgSrcMobile: '/app/portfolio/assets/filmDatabase-screenshot-4.5.webp',
    imgAlt: 'Film Database Development Project',
  },
  {
    key: 'ecommerce',
    url: 'ecommerce',
    technologies: {
      application_programming_interface: ['Custom JSON Store'],
      tools_and_libraries: ['vite', 'react', 'react-router', 'typescript', 'sass'],
      code_quality: ['prettier', 'eslint', 'eslint-config-airbnb'],
    },
    insights: (
      <>
        <h2>Neumorphic eCommerce Audio Shop</h2>
        <div>
          <p>
            <strong>TL;DR:</strong> Built a first-from-scratch eCommerce site featuring dynamic routing with a custom
            database, Photoshop-optimized batch exports for three device breakpoints, basic commerce functionality, and
            an experimental neumorphic UI with skeleton loaders.
          </p>
        </div>

        <p>
          This audio shop was built with maintainability and scalability in mind. Site-wide conditions were defined
          before building components, requiring a flexible database structure and consideration of routing, data
          persistence, and component re-renders—challenges that revealed the limits of my early frontend foundation and
          informed better practices in later projects.
        </p>
        <p>
          To make the project feel more personal, I opted out of API usage. Instead, I partially scraped images and
          data, optimizing them in Photoshop to meet Web Core Vitals across three device breakpoints. The database was
          initially written in TSX, converted to JSON, and later restructured during React Router V7 migration to
          support dynamic pathing as the application scaled. A simple database utility filters and returns unique,
          alphabetized data, enabling dynamic routing, product search, and basic commerce features.
        </p>
        <p>
          Components were designed to be reusable, type-safe, and performant. Lazy loading and Intersection Observer
          managed expanding lists efficiently, while careful handling of state, side effects, and conditional animations
          ensured smooth interactions.
        </p>
        <p>
          The UI blends experimental monochromatic and neumorphic styles with subtle interactive elements and loading
          skeletons. Styling may render differently across monitors depending on color calibration, which was an
          intentional design tradeoff.
        </p>
        <p>
          Core functionality, including authentication and shopping cart storage, was implemented using native
          JavaScript and localStorage rather than full solutions like Firebase or Stripe. This first-from-scratch
          application demonstrates architectural and design decisions for a maintainable eCommerce site. It is not
          production-ready, but reflects growth, experimentation, and practical problem-solving in frontend development.
        </p>
      </>
    ),
    imgSrc: '/app/portfolio/assets/ecommerce-screenshot.webp',
    imgSrcMobile: '/app/portfolio/assets/ecommerce-screenshot-4.5.webp',
    imgAlt: 'Ecommerce Web Development Project',
  },
  {
    key: '2024 portfolio',
    url: '',
    technologies: {
      utilities_and_services: ['Zod', 'Web3Forms'],
      tools_and_libraries: ['vite', 'react', 'react-router', 'typescript', 'sass'],
      code_quality: ['prettier', 'eslint', 'eslint-config-airbnb'],
    },
    insights: (
      <>
        <h2>An Application Hub with Seamless Transitions</h2>
        <div>
          <p>
            <strong>TL;DR:</strong> Built a portfolio hub consolidating multiple applications, featuring dynamic routing
            and lazy-loading, Vite-powered performance optimizations, and a migration to React Router v7 that eliminated
            a custom import queue while improving maintainability and responsiveness.
          </p>
        </div>

        <p>
          This portfolio was designed as an intuitive environment for skill demonstration, hosting multiple applications
          under one domain to improve the user experience. While working with React Router v6, I faced challenges with
          routing complexity and optimizing Web Core Vitals.
        </p>
        <p>
          Initially, I focused on lazy-loading project landing pages and improving performance metrics. Using the
          Network Developer Tool, I analyzed file sizes and transfer times, dynamically generating routes and managing a
          module loading queue in state. A key issue was the 404 error handler loading prematurely, which required a
          workaround using network observers and prop drilling to propagate error states to the Suspense loader.
        </p>
        <p>
          After experimenting with custom solutions, I implemented a simpler, manually routed system with dynamic
          imports. This reduced complexity, improved performance, and created a more maintainable structure. The focus
          remained on optimizing routing and overall user experience, resulting in a smoother and more efficient
          application hub.
        </p>
        <p>
          With the release of React Router V7, the manual routing system became unnecessary. I reviewed the new
          documentation, scaffolded a reference Vite project with React and React Router V7, and successfully migrated
          the application. This migration improved performance metrics, reduced boilerplate, and enabled efficient
          prerendering, enhancing the application's maintainability and responsiveness.
        </p>
      </>
    ),
    imgSrc: '/app/portfolio/assets/portfolio-screenshot.webp',
    imgSrcMobile: '/app/portfolio/assets/portfolio-screenshot-4.5.webp',
    imgAlt: 'Portfolio Project Hub',
  },
];
