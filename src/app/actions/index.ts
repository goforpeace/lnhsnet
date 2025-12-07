
"use server";

import { z } from "zod";
import { firestore } from "@/firebase/server-admin";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

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
  
  if (!firestore) {
    console.error("Firestore admin instance is not available.");
    return { success: false, message: "Server error: Database connection failed." };
  }
  
  try {
    const submissionData = {
        ...parsed.data,
        submissionDate: FieldValue.serverTimestamp(),
    };
    await firestore.collection("contact_form_submissions").add(submissionData);

    return {
      success: true,
      message: "Inquiry submitted successfully!",
    };
  } catch (error) {
    console.error("Error submitting contact inquiry:", error);
    return { success: false, message: "An error occurred while submitting your inquiry. Please try again." };
  }
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

    if (!firestore) {
      console.error("Firestore admin instance is not available.");
      return { success: false, message: "Server error: Database connection failed." };
    }

    try {
        const requestData = {
            ...parsed.data,
            submissionDate: FieldValue.serverTimestamp(),
            status: 'New'
        };
        await firestore.collection("call_requests").add(requestData);
        
        return {
            success: true,
            message: "Call request submitted successfully!",
        };
    } catch (error) {
        console.error("Error submitting call request:", error);
        return { success: false, message: "An error occurred while submitting your request. Please try again." };
    }
}


const featureToggleSchema = z.object({
  projectId: z.string(),
  newFeaturedStatus: z.boolean(),
});

export async function toggleFeaturedProject(values: z.infer<typeof featureToggleSchema>) {
  const parsed = featureToggleSchema.safeParse(values);
  if (!parsed.success) {
    console.error("Invalid data for toggling feature", parsed.error);
    return { success: false, message: "Invalid project data." };
  }

  if (!firestore) {
    console.error("Firestore admin instance is not available.");
    return { success: false, message: "Server error: Database connection failed." };
  }

  const { projectId, newFeaturedStatus } = parsed.data;

  try {
    await firestore.runTransaction(async (transaction) => {
      const projectsCollection = firestore.collection("projects");
      
      // If we are setting a new project as featured, un-feature all others first.
      if (newFeaturedStatus) {
        const featuredProjectsSnapshot = await transaction.get(
          projectsCollection.where("isFeatured", "==", true)
        );
        featuredProjectsSnapshot.forEach((doc) => {
          transaction.update(doc.ref, { isFeatured: false });
        });
      }
      
      // Now, set the new featured status for the target project.
      const projectRef = projectsCollection.doc(projectId);
      transaction.update(projectRef, { isFeatured: newFeaturedStatus });
    });

    // Revalidate paths to ensure data is fresh on the client
    revalidatePath("/cmi/projects");
    revalidatePath("/");

    return { success: true, message: "Featured project updated successfully." };
  } catch (error) {
    console.error("Error in toggleFeaturedProject transaction:", error);
    return { success: false, message: "An error occurred while updating the featured project." };
  }
}
