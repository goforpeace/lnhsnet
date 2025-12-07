import { Building2, KeyRound, Laptop, Paintbrush2 } from 'lucide-react';
import type { HeroImage, Service, FaqItem, Project } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  // Return a default or throw an error. For scaffolding, returning an object with empty strings is safer.
  if (!image) {
    console.warn(`Image with id "${id}" not found in placeholder images.`);
    return { imageUrl: '', description: '', imageHint: '' };
  }
  return image;
};

export const heroImages: HeroImage[] = [
  { id: '1', url: getImage('hero-1').imageUrl, alt: getImage('hero-1').description },
  { id: '2', url: getImage('hero-2').imageUrl, alt: getImage('hero-2').description },
  { id: '3', url: getImage('hero-3').imageUrl, alt: getImage('hero-3').description },
];

export const services: Service[] = [
  {
    icon: Building2,
    title: 'Developer',
    description: 'Building dreams from the ground up with precision and passion. We create spaces that inspire and endure.',
  },
  {
    icon: KeyRound,
    title: 'Property Management',
    description: 'Seamless management for your valuable assets. We handle the details, so you can enjoy the returns.',
  },
  {
    icon: Paintbrush2,
    title: 'Interior Design',
    description: 'Crafting interiors that reflect your personality and lifestyle. Beautiful, functional, and uniquely you.',
  },
  {
    icon: Laptop,
    title: 'IT Solutions',
    description: 'Innovative technology solutions to streamline operations for any business, enhancing efficiency and growth.',
  },
];

export const faqItems: FaqItem[] = [
    {
        question: "What makes Landmark New Homest Ltd different?",
        answer: "Our commitment to quality, innovation, and customer satisfaction sets us apart. We don't just build structures; we build long-lasting relationships and communities. Every project is a testament to our pursuit of excellence."
    },
    {
        question: "Can I customize my apartment's interior?",
        answer: "Yes, we offer extensive interior design customization options. Our design team works closely with you to create a space that perfectly matches your vision and lifestyle, from layout adjustments to material selection."
    },
    {
        question: "What is the process for purchasing a property?",
        answer: "Our process is transparent and straightforward. It starts with a consultation, followed by site visits, booking, legal paperwork, and finally, handover. Our sales team will guide you at every step."
    },
    {
        question: "Do you offer property management services after purchase?",
        answer: "Absolutely. We provide comprehensive property management services to ensure your investment is well-maintained and profitable. This includes rental management, maintenance, and security."
    }
];

export const projects: Project[] = [
  {
    id: 'premium-residency',
    title: 'Premium Residency',
    shortDescription: 'Experience luxury living in the heart of the city.',
    longDescription: 'Premium Residency redefines urban living with its state-of-the-art amenities and breathtaking views. Each apartment is meticulously designed to offer a blend of comfort, style, and functionality. With a prime location, you are never far from the city\'s best dining, shopping, and entertainment.',
    status: 'Ongoing',
    imageUrls: [
      getImage('project-1-exterior').imageUrl,
      getImage('project-1-kitchen').imageUrl,
      getImage('project-1-living').imageUrl,
    ],
    flatSizes: [
      { type: 'A', sft: 1150, beds: 3, verandas: 2, toilets: 2 },
      { type: 'B', sft: 1500, beds: 3, verandas: 3, toilets: 3 },
    ],
    landArea: '10 Katha',
    totalFloors: 14,
    parking: 'Available',
    elevator: '2 Lifts',
    googleMapsUrl: 'https://maps.app.goo.gl/Fk5Jk9jZJqJjQj8J8',
  },
  {
    id: 'green-valley',
    title: 'Green Valley',
    shortDescription: 'Serene living spaces surrounded by nature.',
    longDescription: 'Escape the hustle and bustle of the city at Green Valley. Nestled amidst lush greenery, this project offers a tranquil environment without compromising on modern conveniences. Enjoy spacious apartments, beautiful landscapes, and a strong sense of community.',
    status: 'Completed',
    imageUrls: [
      getImage('project-2-living').imageUrl,
      getImage('project-2-bedroom').imageUrl,
    ],
    flatSizes: [
      { type: 'A', sft: 2050, beds: 4, verandas: 3, toilets: 4 },
      { type: 'B', sft: 1800, beds: 3, verandas: 2, toilets: 3 },
    ],
    landArea: '2 Bigha',
    totalFloors: 9,
    parking: 'Available',
    elevator: '1 Lift',
    googleMapsUrl: 'https://maps.app.goo.gl/Fk5Jk9jZJqJjQj8J8',
  },
  {
    id: 'urban-oasis',
    title: 'Urban Oasis',
    shortDescription: 'A new wave of urban architecture.',
    longDescription: 'Urban Oasis is an upcoming architectural marvel set to transform the city skyline. It features futuristic design, sustainable technologies, and smart home features. Be a part of the future of living.',
    status: 'Upcoming',
    imageUrls: [
      getImage('project-3-exterior').imageUrl
    ],
    flatSizes: [
        { type: 'Studio', sft: 800, beds: 1, verandas: 1, toilets: 1 },
        { type: 'Penthouse', sft: 3500, beds: 5, verandas: 4, toilets: 5 },
    ],
    landArea: '15 Katha',
    totalFloors: 25,
    parking: 'Underground, 2 levels',
    elevator: '4 High-speed Lifts',
    googleMapsUrl: 'https://maps.app.goo.gl/Fk5Jk9jZJqJjQj8J8',
  },
];
