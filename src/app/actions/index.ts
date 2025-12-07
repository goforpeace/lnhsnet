"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  message: z.string(),
});

export async function submitContactInquiry(values: z.infer<typeof contactSchema>) {
  const parsed = contactSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error("Invalid form data.");
  }
  
  // Here you would typically save the data to your database (e.g., Firebase)
  // For demonstration, we'll just log it to the console.
  console.log("New Contact Inquiry:", parsed.data);

  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    success: true,
    message: "Inquiry submitted successfully!",
  };
}
