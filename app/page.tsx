export default function Page() {
  return (
    <main className="flex flex-1 flex-col items-start justify-center gap-6 p-6 pt-20 md:p-12 font-(family-name:--font-ubuntu-mono)">
      <h1 className="text-3xl md:text-5xl font-bold">animation sandbox</h1>
      <p className="max-w-xl text-foreground/70 leading-relaxed">
        Isolated demos for testing animation libraries — GSAP, Framer Motion,
        and friends. Each route is a self-contained playground. Pick a category
        from the sidebar.
      </p>
      <div className="mt-8 flex flex-col gap-2 text-sm text-foreground/50">
        <span>stack:</span>
        <code className="text-foreground/80">
          next 16 · react 19 · tailwind 4 · gsap · motion
        </code>
      </div>
    </main>
  );
}
