import { Button } from "./ui/button";
import { Sparkles, Hash } from "lucide-react";
import { cn } from "./ui/utils";

interface HeaderProps {
  currentPage?: "home" | "tools" | "symbols";
  onNavigate?: (page: "home" | "tools" | "symbols") => void;
}

export function Header({ currentPage = "home", onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate?.("home")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <h2 className="text-primary">모달카피</h2>
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate?.("symbols")}
            className={cn(
              "flex items-center gap-2",
              currentPage === "symbols" && "bg-muted"
            )}
          >
            <Hash className="size-4" />
            특수기호
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate?.("tools")}
            className={cn(
              "flex items-center gap-2",
              currentPage === "tools" && "bg-muted"
            )}
          >
            <Sparkles className="size-4" />
            기획약국
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Made with ♥ for tired PMs</p>
      </div>
    </header>
  );
}
