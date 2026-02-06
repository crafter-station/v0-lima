export default function CrafterStationIcon({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size * 5}
      height={size}
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Crafter Station Logo"
    >
      <text
        x="0"
        y="30"
        fontFamily="var(--font-mono), monospace"
        fontSize="24"
        fontWeight="600"
        fill="currentColor"
        letterSpacing="-0.02em"
      >
        Crafter Station
      </text>
    </svg>
  );
}
