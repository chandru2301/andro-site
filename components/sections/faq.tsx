import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/reveal";
import { Accent, SectionHeading } from "@/components/ui/section-heading";

const faqs = [
  {
    q: "What is Andro?",
    a: "Andro is a code intelligence and context engine for AI engineering agents. It builds a structured understanding of a repository — its files, symbols, dependencies and relationships — then gives agents the relevant context they need to reason about and modify real software.",
  },
  {
    q: "Is Andro an AI model?",
    a: "No. Andro is the intelligence layer beneath the model. Claude, Codex, Gemini or any other agent does the reasoning — Andro makes sure it reasons over the right context. You can switch models without re-teaching them your codebase.",
  },
  {
    q: "How is this different from a vector database?",
    a: "A vector index answers “what text looks similar?”. Andro also knows how the code is connected — calls, imports, implementations, reads and writes — and fuses keyword, semantic, symbol and graph signals into one ranking for the task at hand.",
  },
  {
    q: "Which agents can use it?",
    a: "Any agent that can call tools. Andro exposes operations like search_context(), find_symbol() and find_dependents(), so Claude Code, Codex, Gemini CLI, Cursor and others can ask structural questions instead of blindly searching the filesystem.",
  },
  {
    q: "How does Andro fit with Tempest and Picto?",
    a: "Andro understands the code. Picto represents the architecture. Agents running in Tempest do the work. Together they form one engineering loop: intent on the diagram, context from Andro, execution by the agent — and an architecture that stays in sync with the code.",
  },
];

export function Faq() {
  return (
    <section className="relative px-5 py-24 md:py-36">
      <SectionHeading
        index="11"
        eyebrow="Questions"
        title={
          <>
            The short <Accent>answers.</Accent>
          </>
        }
      />
      <Reveal className="mx-auto mt-14 max-w-3xl">
        <Accordion type="single" collapsible defaultValue="item-0" className="border-t border-line">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}
