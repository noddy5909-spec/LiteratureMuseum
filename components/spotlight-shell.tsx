type SpotlightShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function SpotlightShell({ children, className = "" }: SpotlightShellProps) {
  return (
    <div className={`relative min-h-screen text-stone-700 ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-neutral-50 to-neutral-100"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[url('/bg-literature-museum.png')] bg-cover bg-center bg-no-repeat opacity-[0.14]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-white/25"
      />
      <div className="relative z-10 min-h-screen isolate">{children}</div>
    </div>
  );
}
