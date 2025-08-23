export default function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
      <span className={`rounded-full bg-white/10 text-white px-3 py-1 text-sm ${className || ''}`}>
        {children}
      </span>
    );
  }
  