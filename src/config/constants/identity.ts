import { PersonalInfo, Urls, Skill, Meta } from './types';

export const PERSONAL_INFO: PersonalInfo = {
    name: 'Bangyen Pham',
    title: 'Backend Developer & AI/ML Engineer',
    location: 'Chicago, IL',
    greeting: "Hey, I'm Bangyen",
};

export const URLS: Urls = {
    githubProfile: 'https://github.com/bangyen',
    zsharpRepo: 'https://github.com/bangyen/zsharp',
    oligopolyRepo: 'https://github.com/bangyen/oligopoly',
    esolangsRepo: 'https://github.com/bangyen/esolangs',
    publications: {
        cluster2023: 'https://ieeexplore.ieee.org/document/10319968',
        sc2024: 'https://ieeexplore.ieee.org/document/10793131',
    },
    fonts: {
        googleFonts: 'https://fonts.googleapis.com',
        googleFontsStatic: 'https://fonts.gstatic.com',
        interFont:
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    },
    local: {
        localhost: 'http://localhost:3000',
        liveSite: 'https://bangyen.github.io',
    },
};

export const SKILLS: Skill[] = [
    { name: 'Python', icon: 'Code' },
    { name: 'PyTorch', icon: 'Psychology' },
    { name: 'JavaScript', icon: 'Code' },
    { name: 'AWS/GCP', icon: 'Cloud' },
    { name: 'Docker', icon: 'Work' },
    { name: 'TensorFlow', icon: 'Psychology' },
];

export const META: Meta = {
    title: `${PERSONAL_INFO.name} - ${PERSONAL_INFO.title}`,
    description: `${PERSONAL_INFO.name} - Backend Developer and AI/ML Engineer specializing in cloud architecture, HPC systems, and machine learning research. Northwestern MS Computer Science graduate with experience at Volta Health and Center for Nuclear Femtography.`,
    themeColor: '#ffffff',
    backgroundColor: '#ffffff',
};
