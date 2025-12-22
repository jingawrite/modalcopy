export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-[800px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-primary">모달카피</h2>
        </div>
        <p className="text-sm text-muted-foreground">Made with ♥ for tired PMs</p>
      </div>
    </header>
  );
}
