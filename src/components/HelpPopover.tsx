import type { ReactNode } from "react";
import { HelpCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface HelpPopoverProps {
  title: string;
  children: ReactNode;
  align?: "start" | "center" | "end";
}

export function HelpPopover({ title, children, align = "center" }: HelpPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="도움말 보기"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align={align} className="w-72 p-3">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{children}</div>
      </PopoverContent>
    </Popover>
  );
}
