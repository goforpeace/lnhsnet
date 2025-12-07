
"use client";

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, PlusCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';


interface LetUsDiscussSectionProps {
  projectId: string;
  projectName: string;
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  phone: z.string().min(10, { message: 'A valid phone number is required.' }),
});

export function LetUsDiscussSection({ projectId, projectName }: LetUsDiscussSectionProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', phone: '' },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Database not connected. Please try again later.',
      });
      return;
    }

    try {
      const requestData = {
        ...values,
        projectId,
        projectName,
        submissionDate: serverTimestamp(),
        status: 'New'
      };

      await addDocumentNonBlocking(collection(firestore, "call_requests"), requestData);

      toast({
        title: 'Request Sent!',
        description: 'We have received your request and will call you back shortly.',
      });
      form.reset();
      setDialogOpen(false);
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: "An error occurred while submitting your request. Please try again.",
      });
    }
  }

  return (
    <section className="my-16 p-8 bg-primary/5 rounded-lg border border-primary/20">
      <div className="text-center">
        <h2 className="font-headline text-3xl font-bold">Let's Discuss Your Next Home</h2>
        <p className="mt-2 text-muted-foreground">
          Ready to take the next step? Get in touch with our expert team today.
        </p>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <a href="tel:+8809649699499">
            <Phone className="mr-2 h-5 w-5" />
            Call Now
          </a>
        </Button>
        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
          <a href="https://wa.me/8801920709034" target="_blank" rel="noopener noreferrer">
            <MessageSquare className="mr-2 h-5 w-5" />
            Chat with Us
          </a>
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" />
              Request a Call
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request a Call Back</DialogTitle>
              <DialogDescription>
                Provide your details and we'll call you back to discuss the "{projectName}" project.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
