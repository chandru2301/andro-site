import Image from "next/image";
import { cn } from "@/lib/utils";

/** Andro lockup: the orbit mark plus the official ANDRO wordmark. */
export function AndroLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image src="/brand/andro-mark.png" alt="" width={26} height={26} priority className="size-[26px]" />
      <Image
        src="/brand/andro-wordmark.png"
        alt="Andro"
        width={1068}
        height={200}
        priority
        className="h-[15px] w-auto"
      />
    </span>
  );
}
