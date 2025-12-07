export type HeroImage = {
  id: string;
  url: string;
  alt: string;
};

export type Service = {
  icon: React.ElementType;
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FlatSize = {
  type: string;
  sft: number;
  beds: number;
  verandas: number;
  toilets: number;
};

export type Project = {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  imageUrls: string[];
  flatSizes: FlatSize[];
  landArea: string;
  totalFloors: number;
  parking: string;
  elevator: string;
  googleMapsUrl: string;
};

export type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: Date;
};
