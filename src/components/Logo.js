export default function Logo({ size = "default", showText = true }) {
  const sizes = {
    small: { width: 28, height: 20, scale: 0.16 },
    default: { width: 48, height: 34, scale: 0.27 },
    large: { width: 80, height: 56, scale: 0.45 },
  };

  const s = sizes[size] || sizes.default;

  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={s.width}
        height={s.height}
        viewBox="0 0 180 110"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="10" y="0" width="160" height="100" rx="6" fill="none" stroke="#7c3aed" strokeWidth="3.5"/>
        <rect x="10" y="0" width="160" height="16" rx="6" fill="#7c3aed"/>
        <circle cx="22" cy="8" r="3" fill="white" opacity="0.5"/>
        <circle cx="32" cy="8" r="3" fill="white" opacity="0.5"/>
        <circle cx="42" cy="8" r="3" fill="white" opacity="0.5"/>
        <rect x="22" y="28" width="20" height="5" rx="2" fill="#a78bfa"/>
        <rect x="46" y="28" width="38" height="5" rx="2" fill="#7c3aed" opacity="0.35"/>
        <rect x="30" y="40" width="14" height="5" rx="2" fill="#a78bfa"/>
        <rect x="48" y="40" width="28" height="5" rx="2" fill="#7c3aed" opacity="0.35"/>
        <rect x="80" y="40" width="16" height="5" rx="2" fill="#7c3aed" opacity="0.2"/>
        <rect x="30" y="52" width="10" height="5" rx="2" fill="#7c3aed" opacity="0.35"/>
        <rect x="44" y="52" width="32" height="5" rx="2" fill="#a78bfa" opacity="0.7"/>
        <rect x="80" y="52" width="12" height="5" rx="2" fill="#7c3aed" opacity="0.2"/>
        <rect x="30" y="64" width="44" height="5" rx="2" fill="#7c3aed" opacity="0.25"/>
        <rect x="30" y="76" width="14" height="5" rx="2" fill="#a78bfa"/>
        <rect x="48" y="76" width="24" height="5" rx="2" fill="#7c3aed" opacity="0.35"/>
        <rect x="22" y="88" width="2" height="8" rx="1" fill="#7c3aed" opacity="0.7"/>
        <rect x="0" y="100" width="180" height="10" rx="4" fill="none" stroke="#7c3aed" strokeWidth="3.5"/>
        <rect x="72" y="103" width="36" height="5" rx="2" fill="none" stroke="#7c3aed" strokeWidth="2" opacity="0.4"/>
      </svg>
      {showText && (
        <span className="font-bold text-[#e6edf3] tracking-wide" style={{ fontSize: size === "small" ? "13px" : size === "large" ? "20px" : "15px" }}>
          DEV STUDIO
        </span>
      )}
    </div>
  );
}
