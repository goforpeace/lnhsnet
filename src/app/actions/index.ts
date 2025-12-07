
"use server";

import { z } from "zod";
import { initializeFirebase, addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase/index";
import { collection, doc, serverTimestamp } from "firebase/firestore";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function submitContactInquiry(values: z.infer<typeof contactSchema>) {
  const parsed = contactSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, message: "Invalid form data.", errors: parsed.error.flatten().fieldErrors };
  }
  
  const { firestore } = initializeFirebase();
  const submissionsCollection = collection(firestore, "contact_form_submissions");
  
  addDocumentNonBlocking(submissionsCollection, {
    ...parsed.data,
    submissionDate: serverTimestamp(),
  });

  return {
    success: true,
    message: "Inquiry submitted successfully!",
  };
}

const callRequestSchema = z.object({
    name: z.string().min(2, "Name is required"),
    phone: z.string().min(10, "A valid phone number is required"),
    projectId: z.string(),
    projectName: z.string(),
});

export async function submitCallRequest(values: z.infer<typeof callRequestSchema>) {
    const parsed = callRequestSchema.safeParse(values);

    if(!parsed.success) {
        return { success: false, message: "Invalid form data.", errors: parsed.error.flatten().fieldErrors };
    }

    const { firestore } = initializeFirebase();
    const callRequestsCollection = collection(firestore, "call_requests");

    addDocumentNonBlocking(callRequestsCollection, {
        ...parsed.data,
        submissionDate: serverTimestamp(),
        status: 'New'
    });
    
    return {
        success: true,
        message: "Call request submitted successfully!",
    };
}
