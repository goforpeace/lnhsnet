
"use server";

import { z } from "zod";
import { firestore } from "@/firebase/server-admin";

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
  
  await firestore.collection("contact_form_submissions").add({
    ...parsed.data,
    submissionDate: new Date(),
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

    await firestore.collection("call_requests").add({
        ...parsed.data,
        submissionDate: new Date(),
        status: 'New'
    });
    
    return {
        success: true,
        message: "Call request submitted successfully!",
    };
}
