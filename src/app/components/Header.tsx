interface HeaderProps {
  currentPage?: "home" | "tools" | "symbols" | "planning-compass" | "design-description";
  onNavigate?: (page: "home" | "tools" | "symbols" | "planning-compass" | "design-description") => void;
  menuItems?: Array<{
    id: string;
    label: string;
    page: "home" | "tools" | "symbols" | "planning-compass" | "design-description";
  }>;
}

export function Header({ currentPage = "home", onNavigate, menuItems = [] }: HeaderProps) {
  const currentMenuItem = menuItems.find(item => item.page === currentPage);
  const headerTitle = currentMenuItem?.label || "모달카피";

  const handleHomeClick = () => {
    // 홈으로 이동 시에도 메뉴 클릭 이벤트 추적
    if (currentPage !== "home") {
      const homeMenuItem = menuItems.find(item => item.page === "home");
      if (homeMenuItem && typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "menu_click", {
          event_category: "navigation",
          event_label: homeMenuItem.label,
          menu_id: homeMenuItem.id,
          menu_name: homeMenuItem.label,
        });
      }
    }
    onNavigate?.("home");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border w-full">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        <button
          onClick={handleHomeClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <h2 className="text-base font-medium text-foreground">{headerTitle}</h2>
        </button>
        <p className="text-sm text-muted-foreground">Made with ♥ for tired PMs</p>
      </div>
    </header>
  );
}
