import type { ReactElement } from 'react';

export type IconName =
  | 'home'
  | 'book'
  | 'cards'
  | 'target'
  | 'dots'
  | 'search'
  | 'settings'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-down'
  | 'flame'
  | 'check'
  | 'heart'
  | 'heart-filled'
  | 'speaker'
  | 'cart'
  | 'bus'
  | 'briefcase'
  | 'house'
  | 'home-city'
  | 'tree'
  | 'people'
  | 'building'
  | 'idea'
  | 'star'
  | 'phone'
  | 'calendar'
  | 'gift'
  | 'chat'
  | 'hand'
  | 'alert'
  | 'headphones'
  | 'file'
  | 'pencil'
  | 'x'
  | 'plus'
  | 'trash'
  | 'refresh'
  | 'shield'
  | 'download'
  | 'filter'
  | 'bookmark'
  | 'wifi-off'
  | 'loader';

const PATHS: Record<IconName, ReactElement> = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  book: (
    <>
      <path
        d="M4 4.8A2.8 2.8 0 0 1 6.8 2H20v15.4H6.8A2.8 2.8 0 0 0 4 20.2z"
        fill="none"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M4 20.2A2.8 2.8 0 0 1 6.8 17.4H20V22H6.8A2.8 2.8 0 0 1 4 20.2z" fill="none" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M8.5 6.5h7" strokeWidth="1.9" strokeLinecap="round" />
    </>
  ),
  cards: (
    <>
      <rect x="3" y="7" width="18" height="13.5" rx="2.5" fill="none" strokeWidth="1.9" />
      <path d="M6.5 4h11M7 11.5h7M7 15.5h4.5" strokeWidth="1.9" strokeLinecap="round" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" strokeWidth="2" />
      <circle cx="12" cy="12" r="1.3" />
    </>
  ),
  dots: (
    <>
      <circle cx="5" cy="12" r="1.9" />
      <circle cx="12" cy="12" r="1.9" />
      <circle cx="19" cy="12" r="1.9" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" fill="none" strokeWidth="2" />
      <path d="m16 16 4.5 4.5" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.1" fill="none" strokeWidth="1.9" />
      <path
        d="M19.1 14.5a1.5 1.5 0 0 0 .3 1.65l.05.06a1.8 1.8 0 1 1-2.55 2.55l-.06-.06a1.5 1.5 0 0 0-1.65-.3 1.5 1.5 0 0 0-.9 1.37v.17a1.8 1.8 0 1 1-3.6 0v-.09a1.5 1.5 0 0 0-.98-1.37 1.5 1.5 0 0 0-1.65.3l-.06.06a1.8 1.8 0 1 1-2.55-2.55l.06-.06a1.5 1.5 0 0 0 .3-1.65 1.5 1.5 0 0 0-1.37-.9h-.17a1.8 1.8 0 0 1 0-3.6h.09a1.5 1.5 0 0 0 1.37-.98 1.5 1.5 0 0 0-.3-1.65l-.06-.06a1.8 1.8 0 1 1 2.55-2.55l.06.06a1.5 1.5 0 0 0 1.65.3h.07a1.5 1.5 0 0 0 .9-1.37v-.17a1.8 1.8 0 1 1 3.6 0v.09a1.5 1.5 0 0 0 .9 1.37 1.5 1.5 0 0 0 1.65-.3l.06-.06a1.8 1.8 0 1 1 2.55 2.55l-.06.06a1.5 1.5 0 0 0-.3 1.65v.07a1.5 1.5 0 0 0 1.37.9h.17a1.8 1.8 0 0 1 0 3.6h-.09a1.5 1.5 0 0 0-1.37.9z"
        fill="none"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </>
  ),
  'chevron-right': <path d="m9 5 7 7-7 7" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  'chevron-left': <path d="m15 5-7 7 7 7" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  'chevron-down': <path d="m5 9 7 7 7-7" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  flame: <path d="M12 2s5 4.5 5 9a5 5 0 0 1-10 0c0-1.6.6-2.8 1.3-3.8.4 1 1 1.8 1.7 1.8.9 0 1.2-.8 1.2-2.2 0-1.8-.6-3.4-.6-3.4S12 2 12 2z" />,
  check: <path d="m4.5 12.5 5 5 10-11" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />,
  heart: (
    <path
      d="M12 20s-7.5-4.6-7.5-9.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8c0 5-7.5 9.6-7.5 9.6z"
      fill="none"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  'heart-filled': <path d="M12 20s-7.5-4.6-7.5-9.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8c0 5-7.5 9.6-7.5 9.6z" />,
  speaker: (
    <>
      <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" />
      <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" strokeWidth="1.9" strokeLinecap="round" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2.2l2.3 10.5h9.6L19 7H6.3" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="19" r="1.6" />
      <circle cx="17" cy="19" r="1.6" />
    </>
  ),
  bus: (
    <>
      <rect x="4" y="4" width="16" height="12" rx="2.5" fill="none" strokeWidth="2" />
      <path d="M4 10h16" strokeWidth="2" />
      <circle cx="8" cy="18.5" r="1.5" />
      <circle cx="16" cy="18.5" r="1.5" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="2.5" fill="none" strokeWidth="2" />
      <path d="M9 7.5V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5v2" fill="none" strokeWidth="2" />
    </>
  ),
  house: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" fill="none" strokeWidth="2" strokeLinejoin="round" />,
  'home-city': (
    <>
      <path d="M3 21V9l6-4 6 4v12" fill="none" strokeWidth="2" strokeLinejoin="round" />
      <path d="M15 21V12h6v9" fill="none" strokeWidth="2" strokeLinejoin="round" />
      <path d="M7 13h2M7 17h2M18 16h0" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  tree: (
    <>
      <path d="M12 3 6 12h3l-3 5h12l-3-5h3z" fill="none" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 17v4" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.2" fill="none" strokeWidth="2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" fill="none" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 5.5a3.2 3.2 0 0 1 0 5M17 14.6a5.5 5.5 0 0 1 3.5 5.4" fill="none" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  building: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1.5" fill="none" strokeWidth="2" />
      <path d="M9 7h2m3 0h2M9 11h2m3 0h2M9 15h2m3 0h2" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  idea: (
    <>
      <path d="M9 17h6M10 20h4" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9V15h7v-1.1A6 6 0 0 0 12 3z" fill="none" strokeWidth="2" strokeLinejoin="round" />
    </>
  ),
  star: <path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.3l6.1-.7z" />,
  phone: (
    <path
      d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z"
      fill="none"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" fill="none" strokeWidth="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  gift: (
    <>
      <rect x="3.5" y="9" width="17" height="11" rx="2" fill="none" strokeWidth="2" />
      <path d="M3.5 13h17M12 9v11" strokeWidth="2" />
      <path d="M12 9S10.5 4.5 8 5.2 9 9 12 9s4.5-3.1 2-3.8S12 9 12 9z" fill="none" strokeWidth="2" strokeLinejoin="round" />
    </>
  ),
  chat: (
    <path
      d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H9.5L4.5 20v-3.5A1.5 1.5 0 0 1 3 15V7a1.5 1.5 0 0 1 1-1.5z"
      fill="none"
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
  ),
  hand: (
    <path
      d="M8 11V5.5a1.5 1.5 0 0 1 3 0V11m0 0V4.5a1.5 1.5 0 0 1 3 0V11m0 0V6.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 7-6.5 7S5 18 5 14v-1.5a1.5 1.5 0 0 1 3 0"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" strokeWidth="2" />
      <path d="M12 7.5v5.5" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1.2" />
    </>
  ),
  headphones: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" fill="none" strokeWidth="2" strokeLinecap="round" />
      <rect x="2.5" y="13.5" width="4.5" height="7" rx="2" />
      <rect x="17" y="13.5" width="4.5" height="7" rx="2" />
    </>
  ),
  file: (
    <>
      <path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" fill="none" strokeWidth="2" strokeLinejoin="round" />
      <path d="M13.5 3v4.5H18M8.5 12h7M8.5 16h7" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  pencil: (
    <path
      d="M4 20h4L19 9a2.4 2.4 0 0 0-3.4-3.4L4.5 16.7z"
      fill="none"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  x: <path d="M6 6l12 12M18 6 6 18" strokeWidth="2.3" strokeLinecap="round" />,
  plus: <path d="M12 5v14M5 12h14" strokeWidth="2.3" strokeLinecap="round" />,
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V5h5v2M6.5 7l1 13h9l1-13" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  refresh: (
    <path
      d="M20 12a8 8 0 1 1-2.6-5.9M20 4v4h-4"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  shield: <path d="M12 3 5 6v6c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6z" fill="none" strokeWidth="2" strokeLinejoin="round" />,
  download: (
    <path
      d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  filter: <path d="M4 5h16l-6 7v7l-4-2v-5z" fill="none" strokeWidth="2" strokeLinejoin="round" />,
  bookmark: <path d="M6.5 3.5h11a1 1 0 0 1 1 1V21l-6.5-4-6.5 4V4.5a1 1 0 0 1 1-1z" fill="none" strokeWidth="2" strokeLinejoin="round" />,
  'wifi-off': (
    <>
      <path d="M3 4l18 18" strokeWidth="2" strokeLinecap="round" />
      <path d="M8.5 13.5a5 5 0 0 1 6 0M5 10a10 10 0 0 1 4-2.4M19 10a10 10 0 0 0-5-2.7" fill="none" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="18" r="1.4" />
    </>
  ),
  loader: (
    <path
      d="M12 3v4m0 10v4m9-9h-4M7 12H3m14.5-6.5-2.8 2.8M9.3 14.7l-2.8 2.8m11 0-2.8-2.8M9.3 9.3 6.5 6.5"
      strokeWidth="2"
      strokeLinecap="round"
    />
  ),
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  title?: string;
}

export function Icon({ name, size = 20, className, title }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  );
}
