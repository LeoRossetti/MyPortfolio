import type { Dictionary } from "../types";

const pt: Dictionary = {
  meta: {
    title: "Leo Rossetti — Desenvolvedor Full-stack",
    titleTemplate: "%s · Leo Rossetti",
    description:
      "Desenvolvedor full-stack. Entrega produtos, não protótipos. TypeScript, React, Next.js, React Native, Node.js, Python, C#.",
    ogTitle: "Leo Rossetti — Desenvolvedor Full-stack",
    ogDescription: "Desenvolvedor full-stack. Entrega produtos, não protótipos.",
  },
  locale: {
    ariaLabel: "Idioma",
    en: "EN",
    pt: "PT",
  },
  nav: {
    portfolio: "portfolio",
    home: "Início",
    about: "Sobre",
    work: "Trabalho",
    projects: "Projetos",
    experience: "Experiência",
    contact: "Contato",
    goTo: "Ir para",
  },
  hero: {
    eyebrow: "Desenvolvedor full-stack",
    name: "Leo Rossetti",
    taglineLead: "Desenvolvedor full-stack.",
    tagline: "Entrega produtos, não protótipos.",
    scrollHint: "rolar ↓",
    cta: {
      primary: "Ver projetos",
      secondary: "Entrar em contato",
    },
    terminal: {
      whoami: "whoami",
      whoamiOutput: "leo.rossetti --role=fullstack --location=remote",
      stackList: "stack --list",
      stackOutput: "[typescript, react, next.js, react-native, node, python, c#]",
      current: "atual",
      currentOutput: "trabalhando com next.js + react native",
    },
  },
  stackStrip: {
    ariaLabel: "Stack de tecnologia",
  },
  about: {
    eyebrow: "// sobre",
    heading: "Olá, eu sou o Leo.",
    paragraphLeadFrom: "Desenvolvedor full-stack do",
    paragraphCountry: "Brasil",
    paragraphTail:
      ", há três anos no ofício. Gosto de entregar produtos completos do início ao fim — modelo de dados, backend, UI, polimento — não só protótipos.",
    status: "Remoto · sempre entregando",
  },
  services: {
    eyebrow: "// trabalho",
    headingLead: "No que eu",
    headingAccent: "trabalho",
    subheading:
      "Algumas frentes que se sobrepõem — a maioria dos meus projetos mistura web, mobile e um pouco de design engineering.",
    items: {
      "full-stack-web": {
        title: "Web Full-Stack",
        pitch:
          "Apps em Next.js com backend de verdade, autenticação e pipelines de deploy. É onde passo a maior parte do tempo.",
      },
      mobile: {
        title: "Mobile",
        pitch:
          "iOS/Android multiplataforma com o mesmo JS/TS que move o lado web.",
      },
      backend: {
        title: "API & Backend",
        pitch:
          "APIs tipadas, jobs em segundo plano e integrações. Encontro os dados onde eles vivem — Node, Python ou .NET.",
      },
      "design-engineering": {
        title: "Design Engineering",
        pitch:
          "Interfaces ricas em motion com Motion e GSAP. Interfaces que sentem, não só aparentam.",
      },
    },
  },
  projects: {
    eyebrow: "// projetos",
    headingLead: "Entregues",
    headingAccent: "& em andamento",
    subheading:
      "Uma pequena amostra por enquanto — mais por vir. Cada bloco leva ao código ou a uma demo quando há.",
    statusLabels: {
      "in-progress": "Em andamento",
      "coming-soon": "Em breve",
    },
    linkLabels: {
      github: "GitHub",
      demo: "Demo",
      external: "Externo",
    },
    items: {
      "dealfuel-mobile": {
        title: "DealFuel Mobile",
        description:
          "App nativo iOS + Android da DealFuel. Expo + React Native compartilhando um backend Convex com o produto web — sync em tempo real, autenticação com Clerk, edição rich text, ordenação kanban arrastável e push notifications.",
      },
      "yt-timestamp-saver": {
        title: "YouTube Timestamp Saver",
        description:
          "Uma extensão de navegador para salvar e organizar timestamps dentro de vídeos do YouTube. Sincronização entre dispositivos, atalhos de teclado e navegação rápida.",
      },
      "next-1": {
        title: "Em desenvolvimento",
        description: "Próximo projeto — detalhes em breve.",
      },
      "next-2": {
        title: "Em desenvolvimento",
        description: "Próximo projeto — detalhes em breve.",
      },
      "next-3": {
        title: "Em desenvolvimento",
        description: "Próximo projeto — detalhes em breve.",
      },
    },
  },
  experience: {
    eyebrow: "// experiência",
    headingLead: "Atualmente na",
    presentLabel: "Atual",
    items: {
      dealfuel: {
        role: "Desenvolvedor Full-Stack",
        location: "Remoto",
        summary:
          "Construindo e entregando funcionalidades web + mobile em produção dentro do stack da DealFuel.",
        highlights: [
          "Dono de funcionalidades de ponta a ponta entre Next.js e React Native.",
          "Entregando TypeScript — frontend, backend e as integrações que conectam tudo.",
          "Trabalhando junto com design para manter a UI consistente entre plataformas.",
        ],
      },
    },
  },
  contact: {
    eyebrow: "// contato",
    headingLead: "Manda",
    headingAccent: "um oi.",
    paragraph:
      "Dúvidas, colaborações ou só quer trocar ideia sobre stack? Qualquer um destes chega direto em mim — costumo responder em até um dia.",
    channels: {
      linkedin: "LinkedIn",
      github: "GitHub",
      email: "Email",
    },
    copy: {
      action: "Copiar email para a área de transferência",
      copied: "Email copiado",
      toastSuccess: "Email copiado para a área de transferência",
      toastError: "Não foi possível copiar — selecione e copie manualmente",
    },
  },
  footer: {
    ariaLabel: "Rodapé",
    rights: "Todos os direitos reservados",
    socials: {
      linkedin: "LinkedIn",
      github: "GitHub",
      email: "Email",
    },
  },
  terminal: {
    title: "leo@portfolio  ~  zsh",
    ariaLabel: "Demonstração do terminal",
  },
} as const;

export default pt;
