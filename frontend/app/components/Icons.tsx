// Shared SVG icon components — Kloe Care
// All icons use stroke="currentColor" to inherit parent color

type IconProps = { size?: number; className?: string; filled?: boolean }
const d = (size = 20, cls = '') => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className: cls })

export const IconHeart     = ({ size = 20, filled }: IconProps) => <svg {...d(size)}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={filled ? 'currentColor' : 'none'}/></svg>
export const IconPaw       = ({ size = 20 }: IconProps) => <svg {...d(size)}><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="8" r="2"/><circle cx="7" cy="15" r="2"/><path d="M14.4 17.3c.7 1.2.3 2.8-1 3.5-.8.5-1.8.5-2.7.1l-.6-.3a3 3 0 0 0-2.3 0l-.6.3c-1.3.6-2.8 0-3.4-1.3-.5-.9-.4-2 .2-2.7l2.3-3c.4-.6 1-.9 1.6-.9h4.3c.6 0 1.2.3 1.6.9z" fill="currentColor" stroke="none"/></svg>
export const IconStethoscope = ({ size = 20 }: IconProps) => <svg {...d(size)}><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2" fill="currentColor"/></svg>
export const IconSyringe   = ({ size = 20 }: IconProps) => <svg {...d(size)}><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/></svg>
export const IconPill      = ({ size = 20 }: IconProps) => <svg {...d(size)}><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7z"/><path d="m8.5 8.5 7 7"/></svg>
export const IconDrumstick = ({ size = 20 }: IconProps) => <svg {...d(size)}><path d="M15.5 2.5c1.5 1.5 1.5 4 0 5.5l-1.8 1.8 1.4 1.4a2 2 0 0 1 0 2.8l-6.3 6.3a2 2 0 0 1-2.8 0l-2.3-2.3a2 2 0 0 1 0-2.8l6.3-6.3a2 2 0 0 1 2.8 0l1.4 1.4 1.8-1.8c-1.5-1.5-1.5-4 0-5.5z"/><circle cx="6" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>
export const IconBowl      = ({ size = 20 }: IconProps) => <svg {...d(size)}><path d="M12 2C6.5 2 2 6 2 11h20c0-5-4.5-9-10-9z"/><path d="M2 11c0 5.5 4.5 10 10 10s10-4.5 10-10"/><path d="M6 14c.5 3 2.8 5 6 5s5.5-2 6-5"/></svg>
export const IconStar      = ({ size = 20, filled }: IconProps) => <svg {...d(size)}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={filled ? 'currentColor' : 'none'}/></svg>
export const IconSparkles  = ({ size = 20 }: IconProps) => <svg {...d(size)}><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" fill="currentColor" stroke="none"/><path d="M20 3v4M22 5h-4M4 17v2M5 18H3" strokeWidth="2.5"/></svg>
export const IconLightning = ({ size = 20, filled }: IconProps) => <svg {...d(size)}><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={filled ? 'currentColor' : 'none'}/></svg>
export const IconPerson    = ({ size = 20 }: IconProps) => <svg {...d(size)}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
export const IconHome      = ({ size = 20, filled }: IconProps) => <svg {...d(size)}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" fill={filled ? 'currentColor' : 'none'}/></svg>
export const IconClock     = ({ size = 20 }: IconProps) => <svg {...d(size)}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
export const IconLock      = ({ size = 20 }: IconProps) => <svg {...d(size)}><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
export const IconCheck     = ({ size = 20 }: IconProps) => <svg {...d(size)}><polyline points="20 6 9 17 4 12"/></svg>
export const IconX         = ({ size = 20 }: IconProps) => <svg {...d(size)}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
export const IconScale     = ({ size = 20 }: IconProps) => <svg {...d(size)}><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
export const IconCalendar  = ({ size = 20 }: IconProps) => <svg {...d(size)}><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
export const IconClipboard = ({ size = 20 }: IconProps) => <svg {...d(size)}><rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
export const IconMale      = ({ size = 20 }: IconProps) => <svg {...d(size)}><circle cx="10" cy="14" r="5"/><path d="M19 5l-5.4 5.4M19 5h-5M19 5v5"/></svg>
export const IconFemale    = ({ size = 20 }: IconProps) => <svg {...d(size)}><circle cx="12" cy="8" r="5"/><line x1="12" x2="12" y1="13" y2="21"/><line x1="9" x2="15" y1="18" y2="18"/></svg>
export const IconDog       = ({ size = 20 }: IconProps) => <svg {...d(size)}><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 2.261.546.151 1.061.38 1.397.654C7.938 13.319 8 13.636 8 14v0c0 .263.2.5.431.5H10"/><path d="M13.19 8H14a2 2 0 0 1 2 2v.153a2 2 0 0 0 .837 1.631l1.4 1.04A2 2 0 0 1 19 14.5v0a2 2 0 0 1-2 2H14.5"/><path d="M9 12c.5 0 1-.3 1-.7v-3.6c0-.4-.5-.7-1-.7s-1 .3-1 .7v3.6c0 .4.5.7 1 .7z"/><path d="M3 18h18"/></svg>
export const IconCat       = ({ size = 20 }: IconProps) => <svg {...d(size)}><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5z"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75z"/></svg>
export const IconBird      = ({ size = 20 }: IconProps) => <svg {...d(size)}><path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75v3.25"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/></svg>
export const IconFish      = ({ size = 20 }: IconProps) => <svg {...d(size)}><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6z"/><path d="M18 12v.5"/><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/><path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 3.54-.07 7.27 1.22 9.16C4.22 15.6 5.5 14 7 13.33"/><path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4"/></svg>
export const IconRabbit    = ({ size = 20 }: IconProps) => <svg {...d(size)}><path d="M20 8.25c0-2.76-2.24-5-5-5-.43 0-.84.06-1.23.17C13.4 2.56 12.7 2 12 2c-.7 0-1.4.56-1.77 1.42C9.84 3.31 9.43 3.25 9 3.25c-2.76 0-5 2.24-5 5 0 1.89 1.05 3.53 2.6 4.4-.19.4-.35.84-.46 1.3C5.6 15.74 5 17.76 5 20h14c0-2.24-.6-4.26-1.14-6.05-.11-.46-.27-.9-.46-1.3C18.95 11.78 20 10.14 20 8.25z"/></svg>
export const IconThermometer = ({ size = 20 }: IconProps) => <svg {...d(size)}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>
export const IconWarning   = ({ size = 20 }: IconProps) => <svg {...d(size)}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
export const IconChart     = ({ size = 20 }: IconProps) => <svg {...d(size)}><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
export const IconLogout    = ({ size = 20 }: IconProps) => <svg {...d(size)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
export const IconPhone     = ({ size = 20 }: IconProps) => <svg {...d(size)}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 15a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.94 4h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 11a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
export const IconEdit      = ({ size = 20 }: IconProps) => <svg {...d(size)}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
export const IconTrash     = ({ size = 20 }: IconProps) => <svg {...d(size)}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
export const IconPlus      = ({ size = 20 }: IconProps) => <svg {...d(size)}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
export const IconChevronDown = ({ size = 18 }: IconProps) => <svg {...d(size)}><polyline points="6 9 12 15 18 9"/></svg>
export const IconChevronRight = ({ size = 16 }: IconProps) => <svg {...d(size)}><polyline points="9 18 15 12 9 6"/></svg>

// Species icon map for pet registration
export const SPECIES_ICONS: Record<string, JSX.Element> = {
  Perro:  <IconDog  size={26} />,
  Gato:   <IconCat  size={26} />,
  Conejo: <IconRabbit size={26} />,
  Ave:    <IconBird size={26} />,
  Reptil: <IconPaw  size={26} />,
  Pez:    <IconFish size={26} />,
  Otro:   <IconPaw  size={26} />,
}
