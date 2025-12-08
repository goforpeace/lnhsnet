import { Building2, KeyRound, Laptop, Paintbrush2 } from 'lucide-react';
import type { Service, FaqItem } from './types';
// Note: Project and HeroImage data is now fetched from Firebase, 
// so the static arrays have been removed from this file.

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
        question: "What makes Landmark New Homes Ltd. different?",
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

// projects and heroImages are now fetched from Firebase.
export const projects = [];
export const heroImages = [];
