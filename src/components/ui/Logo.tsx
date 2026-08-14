import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  variant?: 'default' | 'light' | 'dark';
}

export function LogoIcon({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
    >
      <defs>
        {/* Cap Top Gradient */}
        <linearGradient id="capTopGrad" x1="10" y1="10" x2="110" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00C6FF" />
          <stop offset="50%" stopColor="#0072FF" />
          <stop offset="100%" stopColor="#0045C7" />
        </linearGradient>

        {/* Cap Base Gradient */}
        <linearGradient id="capBaseGrad" x1="30" y1="40" x2="90" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#005BEA" />
          <stop offset="100%" stopColor="#002699" />
        </linearGradient>

        {/* Book Outline Gradient */}
        <linearGradient id="bookGrad" x1="0" y1="40" x2="140" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFC700" />
          <stop offset="50%" stopColor="#FF9900" />
          <stop offset="100%" stopColor="#FF8000" />
        </linearGradient>

        {/* Tassel Gold Gradient */}
        <linearGradient id="tasselGrad" x1="60" y1="30" x2="105" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE000" />
          <stop offset="100%" stopColor="#FF9100" />
        </linearGradient>

        <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0072FF" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* OPEN BOOK (Yellow Layered Lines) */}
      <g stroke="url(#bookGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Outer Book Page Outline */}
        <path d="M 70 102 C 42 86 18 96 6 102 V 64 C 18 58 42 48 70 64 C 98 48 122 58 134 64 V 102 C 122 96 98 86 70 102 Z" strokeWidth="4.5" fill="#FFFDF0" />
        
        {/* Inner Book Page Spreads */}
        <path d="M 70 95 C 44 81 22 89 12 94 V 68 C 22 63 44 55 70 68 C 96 55 118 63 128 68 V 94 C 118 89 96 81 70 95 Z" strokeWidth="3" />
        <path d="M 70 88 C 46 76 26 83 17 87 V 71 C 26 67 46 60 70 71 C 94 60 114 67 123 71 V 87 C 114 83 94 76 70 88 Z" strokeWidth="2.5" opacity="0.85" />
        
        {/* Spine */}
        <line x1="70" y1="64" x2="70" y2="104" strokeWidth="4" />
      </g>

      {/* GRADUATION CAP */}
      <g filter="url(#softGlow)">
        {/* Skull Cap Base */}
        <path
          d="M 36 46 V 64 C 36 74 104 74 104 64 V 46 Z"
          fill="url(#capBaseGrad)"
        />

        {/* Diamond Mortarboard Top */}
        <path
          d="M 70 8 L 132 34 L 70 58 L 8 34 Z"
          fill="url(#capTopGrad)"
          stroke="#00D2FF"
          strokeWidth="1.5"
        />

        {/* Cap Top Inner Edge Highlight */}
        <path
          d="M 70 13 L 124 34 L 70 54 L 16 34 Z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Center Button */}
        <circle cx="70" cy="33" r="3.5" fill="#FFC700" stroke="#E6A100" strokeWidth="1" />

        {/* Tassel String */}
        <path
          d="M 70 33 Q 92 36 102 54 L 104 84"
          fill="none"
          stroke="url(#tasselGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        
        {/* Tassel Ring/Band */}
        <rect x="100.5" y="74" width="7" height="3" rx="1" fill="#D97706" />

        {/* Tassel Fringe / Brush */}
        <path
          d="M 101 77 L 97 96 M 104 77 L 104 98 M 107 77 L 111 96"
          stroke="url(#tasselGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function Logo({
  className,
  showTagline = true,
  size = 'md',
  href = '/',
  variant = 'default',
}: LogoProps) {
  const sizeClasses = {
    sm: { icon: 'h-8 w-8', title: 'text-lg', tag: 'text-[9px]' },
    md: { icon: 'h-10 sm:h-12 w-10 sm:w-12', title: 'text-xl sm:text-2xl lg:text-3xl', tag: 'text-[11px] sm:text-xs tracking-tight font-extrabold' },
    lg: { icon: 'h-14 sm:h-16 w-14 sm:w-16', title: 'text-3xl sm:text-4xl', tag: 'text-sm sm:text-base font-extrabold' },
    xl: { icon: 'h-20 w-20', title: 'text-5xl', tag: 'text-lg font-extrabold' },
  }[size];

  const content = (
    <div className={cn('inline-flex items-center gap-2.5 sm:gap-3 group select-none', className)}>
      <LogoIcon className={sizeClasses.icon} />
      <div className="flex flex-col leading-none justify-center">
        <div className={cn('font-black tracking-tight flex items-center', sizeClasses.title)}>
          <span className="bg-gradient-to-r from-[#0052FF] via-[#0066FF] to-[#0088FF] bg-clip-text text-transparent drop-shadow-xs">
            Exam
          </span>
          <span className="bg-gradient-to-r from-[#FF9500] via-[#FFAA00] to-[#FFC700] bg-clip-text text-transparent">
            Ready
          </span>
        </div>
        {showTagline && (
          <span
            className={cn(
              'mt-1 font-extrabold tracking-tight transition-colors',
              variant === 'light'
                ? 'text-white/90'
                : variant === 'dark'
                ? 'text-slate-900'
                : 'text-[#0B192C] dark:text-slate-200',
              sizeClasses.tag
            )}
          >
            Prepare Smart. Score Better.
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
