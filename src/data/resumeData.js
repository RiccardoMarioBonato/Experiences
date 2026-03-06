export const sectionConfig = [
  { id: 'about', title: 'About', defaultExpanded: true },
  { id: 'experience', title: 'Experience', defaultExpanded: true },
  { id: 'education', title: 'Education', defaultExpanded: true },
  { id: 'projects', title: 'Projects', defaultExpanded: true },
  { id: 'skills', title: 'Skills', defaultExpanded: true }
];

export const profile = {
  fullName: 'Riccardo M. Bonato',
  role: 'Software Engineer',
  contacts: ['Rickst0702@Gmail.com', '(66+) 96-771-5888', 'Bangkok, Thailand']
};

export const siteConfig = {
  brand: 'RickFolio',
  footerYear: 2026,
  footerName: 'Riccardo M. Bonato',
  navLinks: sectionConfig.map((section) => ({ id: section.id, label: section.title }))
};

export const aboutText =
  'Software Engineer with experience in full-stack web development, game development, and AI/ML projects. Multilingual (Thai Native, English Master, Italian Native). Currently studying B.E. in Software and Knowledge Engineering at Kasetsart University while working as IT/Tech Support and Translator at Guru Electronics. Skilled in Python, JavaScript, C#, and various frameworks including Django, Next.js, and Unity.';

export const experienceItems = [
  {
    title: 'IT/Tech Support & Translator',
    date: 'June 2023 - Present',
    company: 'Guru Electronics',
    description:
      'Multilingual translator (Thai, English, Italian). Provided software & hardware support to clients. Handled customer sales support and initial web development setup for clients. Managed product delivery across the country and performed media editing using Vegas Pro, Photoshop, and Blender. Intermediate experience with Epoxy Resin work.'
  }
];

export const educationItems = [
  {
    title: "Bachelor's Degree - B.E. in Software and Knowledge Engineering",
    date: 'June 2023 - October 2027',
    company: 'Kasetsart University'
  },
  {
    title: 'High School Diploma - English & Mathematics',
    date: 'May 2017 - March 2023',
    company: 'Satriwitthaya 2 School'
  }
];

export const projectItems = [
  {
    title: 'SleepEfficiencyPrediction',
    company: 'Django Web App',
    description:
      "Full-stack web application and API that predicts sleep efficiency and provides access to users' sleep information. Combines sensor data (temperature, humidity, heartbeat) for comprehensive analysis."
  },
  {
    title: 'UniPlus',
    company: 'Django & Next.js Web App',
    description:
      'Comprehensive university event management platform enabling event discovery and registration. Provides organizers with tools to create events, manage registrations, and track attendance through QR code scanning.'
  },
  {
    title: 'Tactical-Hero-Battle-Game',
    company: 'Python',
    description:
      '2D side-scrolling tactical strategy game combining tower defense mechanics inspired by Line Ranger and Battle Cats. Built with OOP principles.'
  },
  {
    title: 'Maze Escape',
    company: 'Unreal Engine 4 (C++, Blueprints)',
    description: '3D horror maze puzzle built with UE4 as a functional demo.'
  },
  {
    title: 'Chimera',
    company: 'Unity (C#)',
    description:
      '2D side-scrolling game that combines different mob DNA to evolve the player character. Current side project.'
  },
  {
    title: 'E-Commerce Stores',
    company: 'Shopify Web Apps',
    description:
      'Built multiple fully functional e-commerce stores: Cotour Jerdan (luxury furniture) and Chess Haven (custom chess sets). Implemented custom product catalogs, payment processing, and inventory management systems.'
  },
  {
    title: 'Fruits Anomaly Detector',
    company: 'AI/ML (Cira-core)',
    description:
      'AI deep learning model trained to detect bruises and anomalies on conveyor belt fruits for separation. Designed for farms and factories to maximize separation speed without manual labor.'
  }
];

export const skills = [
  'JavaScript/TypeScript',
  'Python',
  'C#/C++',
  'Go',
  'Kotlin',
  'Django',
  'Next.js',
  'React',
  'Unity',
  'Unreal Engine',
  'Docker',
  'Git',
  'MySQL/PostgreSQL',
  'REST APIs',
  'Blender',
  'Photoshop'
];
