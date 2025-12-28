interface LabeledDividerProps {
  label: string;
  className?: string;
}

export default function LabeledDivider({
  label,
  className = "",
}: LabeledDividerProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 h-px bg-default-200" />
      <span className="text-sm text-default-400">{label}</span>
      <div className="flex-1 h-px bg-default-200" />
    </div>
  );
}
