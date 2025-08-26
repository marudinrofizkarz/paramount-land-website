import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SchemaScript } from "./schema-script";
import { generateFAQSchema } from "@/lib/schema-markup";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FaqItem[];
}

export function FaqSection({
  title = "Frequently Asked Questions",
  subtitle,
  faqs,
}: FaqSectionProps) {
  // Generate FAQ schema for rich results
  const faqSchema = generateFAQSchema(faqs);

  return (
    <section className="bg-muted/30 py-12 md:py-16">
      <div className="container px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="prose prose-sm max-w-none text-muted-foreground">
                  <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Schema markup for FAQ rich results */}
        <SchemaScript schema={faqSchema} />
      </div>
    </section>
  );
}
