export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-neutral-950 min-h-dvh">
      {children}
    </div>
  );
}
