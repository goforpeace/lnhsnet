
import { Timestamp } from "firebase/firestore";

export type HeroImage = {
  id: string;
  imageUrl: string;
  altText: string;
  order: number;
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
  isFeatured?: boolean;
};

export type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  submissionDate: Timestamp;
};

export type Note = {
  text: string;
  createdAt: Timestamp;
}

export type CallRequest = {
    id: string;
    name: string;
    phone: string;
    projectId: string;
    projectName: string;
    submissionDate: Timestamp;
    status: 'New' | 'Contacted' | 'Closed';
    notes?: Note[];
};
