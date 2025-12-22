import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

interface HeaderProps {
  currentPage?: "home" | "tools";
  onNavigate?: (page: "home" | "tools") => void;
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
          {currentPage === "home" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate?.("tools")}
              className="flex items-center gap-2"
            >
              <Sparkles className="size-4" />
              기획약국
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">Made with ♥ for tired PMs</p>
      </div>
    </header>
  );
}
