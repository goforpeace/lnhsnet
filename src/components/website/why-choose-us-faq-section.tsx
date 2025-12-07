import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/lib/data";
import { Award, ShieldCheck, Smile, TrendingUp } from "lucide-react";

const whyChooseUsItems = [
    {
        icon: Award,
        title: "Unmatched Quality",
        description: "We use premium materials and adhere to the highest standards of construction.",
    },
    {
        icon: ShieldCheck,
        title: "Transparent Process",
        description: "From booking to handover, we maintain clarity and honesty in every step.",
    },
    {
        icon: Smile,
        title: "Customer-Centric",
        description: "Your satisfaction is our priority. We are dedicated to exceeding your expectations.",
    },
    {
        icon: TrendingUp,
        title: "Proven Track Record",
        description: "With years of experience, we have a history of delivering successful projects on time.",
    },
];

export function WhyChooseUsFaqSection() {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Why Choose Us</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Building trust with every brick.
              </p>
            </div>
            <ul className="space-y-6">
                {whyChooseUsItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                            <item.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg">{item.title}</h4>
                            <p className="text-muted-foreground">{item.description}</p>
                        </div>
                    </li>
                ))}
            </ul>
          </div>
          <div className="space-y-8">
             <div className="text-center lg:text-left">
                <h2 className="font-headline text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Answers to your common queries.
                </p>
             </div>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
