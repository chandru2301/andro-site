"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/** 21st.dev / shadcn accordion, restyled: hairline rows and a plus that turns into a cross. */
export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({ className, ...props }: ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("border-b border-line", className)} {...props} />;
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 items-center justify-between gap-6 py-6 text-left text-[17px] font-medium tracking-[-0.01em] text-fg-2 transition-colors hover:text-fg md:text-lg",
          "data-[state=open]:text-fg",
          className,
        )}
        {...props}
      >
        {children}
        <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line-2 text-fg-3 transition-all duration-300 group-hover:border-line-3 group-data-[state=open]:rotate-45 group-data-[state=open]:border-mint/40 group-data-[state=open]:text-mint">
          <Plus className="size-4" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("max-w-3xl pb-7 pr-12 text-[15.5px] leading-relaxed text-fg-3", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
