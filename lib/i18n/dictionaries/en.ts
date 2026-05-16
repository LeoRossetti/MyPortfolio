const en = {
  meta: {
    title: "Leo Rossetti — Full-stack Developer",
    titleTemplate: "%s · Leo Rossetti",
    description:
      "Full-stack developer. Ships products, not prototypes. TypeScript, React, Next.js, React Native, Node.js, Python, C#.",
    ogTitle: "Leo Rossetti — Full-stack Developer",
    ogDescription: "Full-stack developer. Ships products, not prototypes.",
  },
  locale: {
    ariaLabel: "Language",
    en: "EN",
    pt: "PT",
  },
  nav: {
    portfolio: "portfolio",
    home: "Home",
    about: "About",
    work: "Work",
    projects: "Projects",
    experience: "Experience",
    contact: "Contact",
    goTo: "Go to",
  },
  hero: {
    eyebrow: "Full-stack developer",
    name: "Leo Rossetti",
    taglineLead: "Full-stack developer.",
    tagline: "Ships products, not prototypes.",
    scrollHint: "scroll ↓",
    cta: {
      primary: "View work",
      secondary: "Get in touch",
    },
    terminal: {
      whoami: "whoami",
      whoamiOutput: "leo.rossetti --role=fullstack --location=remote",
      stackList: "stack --list",
      stackOutput: "[typescript, react, next.js, react-native, node, python, c#]",
      current: "current",
      currentOutput: "shipping next.js + react native",
    },
  },
  stackStrip: {
    ariaLabel: "Technology stack",
  },
  about: {
    eyebrow: "// about",
    heading: "Hi, I'm Leo.",
    paragraphLeadFrom: "A full-stack developer from",
    paragraphCountry: "Brazil",
    paragraphTail:
      ", three years into the craft. I like shipping whole products end-to-end — the data model, the backend, the UI, the polish — not just prototypes.",
    status: "Remote · always shipping",
  },
  services: {
    eyebrow: "// work",
    headingLead: "What I",
    headingAccent: "work on",
    subheading:
      "A few overlapping lanes — most of my projects blend web, mobile, and a little design engineering.",
    items: {
      "full-stack-web": {
        title: "Full-Stack Web",
        pitch:
          "Next.js apps with real backends, auth, and deploy pipelines. Where most of my time goes.",
      },
      mobile: {
        title: "Mobile",
        pitch:
          "Cross-platform iOS/Android with the same JS/TS that powers the web side.",
      },
      backend: {
        title: "API & Backend",
        pitch:
          "Typed APIs, background jobs, and integrations. Meet the data where it lives — Node, Python, or .NET.",
      },
      "design-engineering": {
        title: "Design Engineering",
        pitch:
          "Motion-rich interfaces with Motion and GSAP. Interfaces that feel, not just look.",
      },
    },
  },
  projects: {
    eyebrow: "// projects",
    headingLead: "Shipped",
    headingAccent: "& shipping",
    subheading:
      "A small slice for now — more to come. Each tile links to source or a live demo when there is one.",
    statusLabels: {
      "in-progress": "In progress",
      "coming-soon": "Coming soon",
    },
    linkLabels: {
      github: "GitHub",
      demo: "Demo",
      external: "External",
    },
    items: {
      "dealfuel-mobile": {
        title: "DealFuel Mobile",
        description:
          "Native iOS + Android app for DealFuel. Expo + React Native sharing a Convex backend with the web product — real-time sync, Clerk auth, rich text editing, drag-and-drop kanban ordering, and push notifications.",
      },
      "yt-timestamp-saver": {
        title: "YouTube Timestamp Saver",
        description:
          "A browser extension that lets you save and organise timestamps inside YouTube videos. Cross-device sync, keyboard shortcuts, and quick-jump navigation.",
      },
      "next-1": {
        title: "In the works",
        description: "Next project — details soon.",
      },
      "next-2": {
        title: "In the works",
        description: "Next project — details soon.",
      },
      "next-3": {
        title: "In the works",
        description: "Next project — details soon.",
      },
    },
  },
  experience: {
    eyebrow: "// experience",
    headingLead: "Currently at",
    presentLabel: "Present",
    items: {
      dealfuel: {
        role: "Full-Stack Developer",
        location: "Remote",
        summary:
          "Building and shipping production web + mobile features across the DealFuel product stack.",
        highlights: [
          "Owning features end-to-end across Next.js and React Native.",
          "Shipping TypeScript — frontend, backend, and the integrations that glue them together.",
          "Partnering with design to keep the UI consistent across platforms.",
        ],
      },
    },
  },
  contact: {
    eyebrow: "// contact",
    headingLead: "Say",
    headingAccent: "hi.",
    paragraph:
      "Questions, collaborations, or just want to chat about a stack? Any of these lands straight with me — I usually reply within a day.",
    channels: {
      linkedin: "LinkedIn",
      github: "GitHub",
      email: "Email",
    },
    copy: {
      action: "Copy email to clipboard",
      copied: "Email copied",
      toastSuccess: "Email copied to clipboard",
      toastError: "Couldn't copy — select and copy manually",
    },
  },
  footer: {
    ariaLabel: "Footer",
    rights: "All rights reserved",
    socials: {
      linkedin: "LinkedIn",
      github: "GitHub",
      email: "Email",
    },
  },
  terminal: {
    title: "leo@portfolio  ~  zsh",
    ariaLabel: "Terminal showcase",
  },
} as const;

export default en;
