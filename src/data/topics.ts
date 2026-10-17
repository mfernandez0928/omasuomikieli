import type { Situation, Topic } from '@/types';

export const TOPICS: Topic[] = [
  { id: 'arki', titleFi: 'Arki', titleEn: 'Everyday life', icon: 'home-city', color: '#3b82f6' },
  { id: 'ostokset', titleFi: 'Ostokset', titleEn: 'Shopping', icon: 'cart', color: '#f59e0b' },
  {
    id: 'liikkuminen',
    titleFi: 'Liikkuminen',
    titleEn: 'Transportation',
    icon: 'bus',
    color: '#22c55e',
  },
  { id: 'terveys', titleFi: 'Terveys', titleEn: 'Health', icon: 'heart', color: '#ef4444' },
  { id: 'tyo', titleFi: 'Työ', titleEn: 'Work', icon: 'briefcase', color: '#a855f7' },
  { id: 'koulu', titleFi: 'Koulu', titleEn: 'School', icon: 'book', color: '#06b6d4' },
  { id: 'koti', titleFi: 'Koti', titleEn: 'Home', icon: 'house', color: '#f97316' },
  { id: 'luonto', titleFi: 'Luonto', titleEn: 'Nature', icon: 'tree', color: '#10b981' },
  {
    id: 'sosiaaliset',
    titleFi: 'Sosiaaliset tilanteet',
    titleEn: 'Social situations',
    icon: 'people',
    color: '#ec4899',
  },
  {
    id: 'palvelut',
    titleFi: 'Julkiset palvelut',
    titleEn: 'Public services',
    icon: 'building',
    color: '#6366f1',
  },
  {
    id: 'abstraktit',
    titleFi: 'Abstraktit sanat',
    titleEn: 'Abstract words',
    icon: 'idea',
    color: '#eab308',
  },
  { id: 'perus', titleFi: 'Perussanat', titleEn: 'Core words', icon: 'star', color: '#94a3b8' },
];

export const TOPIC_BY_ID = new Map(TOPICS.map((t) => [t.id, t]));

export const SITUATIONS: Situation[] = [
  {
    id: 'koulu',
    title: 'School & teachers',
    titleFi: 'Koulu ja opettajat',
    description: 'Asking the teacher, missing a class, homework.',
    icon: 'book',
  },
  {
    id: 'tyo',
    title: 'Work & colleagues',
    titleFi: 'Työ ja työkaverit',
    description: 'Shifts, sick leave, asking a colleague for help.',
    icon: 'briefcase',
  },
  {
    id: 'laakari',
    title: 'Doctor & pharmacy',
    titleFi: 'Lääkäri ja apteekki',
    description: 'Describing symptoms, prescriptions, appointments.',
    icon: 'heart',
  },
  {
    id: 'palvelut',
    title: 'Public services',
    titleFi: 'Julkiset palvelut',
    description: 'Kela, TE-toimisto, DVV, maistraatti.',
    icon: 'building',
  },
  {
    id: 'kauppa',
    title: 'Shopping',
    titleFi: 'Kaupassa',
    description: 'Finding items, prices, returns, loyalty cards.',
    icon: 'cart',
  },
  {
    id: 'liikenne',
    title: 'Transportation',
    titleFi: 'Liikenne',
    description: 'Buses, trains, tickets, delays.',
    icon: 'bus',
  },
  {
    id: 'puhelin',
    title: 'Phone calls',
    titleFi: 'Puhelimessa',
    description: 'Starting and ending a call, asking to repeat.',
    icon: 'phone',
  },
  {
    id: 'ajanvaraus',
    title: 'Appointments',
    titleFi: 'Ajanvaraus',
    description: 'Booking, moving and cancelling a time.',
    icon: 'calendar',
  },
  {
    id: 'kutsut',
    title: 'Invitations & celebrations',
    titleFi: 'Kutsut ja juhlat',
    description: 'Inviting, accepting, declining politely.',
    icon: 'gift',
  },
  {
    id: 'viestit',
    title: 'Text messages',
    titleFi: 'Tekstiviestit',
    description: 'Short written messages, the way people really write them.',
    icon: 'chat',
  },
  {
    id: 'apu',
    title: 'Asking for help',
    titleFi: 'Avun pyytäminen',
    description: 'Getting help politely in any situation.',
    icon: 'hand',
  },
  {
    id: 'ongelma',
    title: 'Explaining a problem',
    titleFi: 'Ongelman selittäminen',
    description: 'Saying what went wrong and what you need.',
    icon: 'alert',
  },
  {
    id: 'mielipide',
    title: 'Giving an opinion',
    titleFi: 'Mielipiteen ilmaiseminen',
    description: 'Agreeing, disagreeing, softening your opinion.',
    icon: 'idea',
  },
  {
    id: 'anteeksi',
    title: 'Apologising & clarifying',
    titleFi: 'Anteeksipyyntö ja väärinkäsitykset',
    description: 'Apologising and fixing a misunderstanding.',
    icon: 'people',
  },
  {
    id: 'pyynnot',
    title: 'Asking someone to do something',
    titleFi: 'Pyynnöt: tee se minulle',
    description: 'Short requests addressed to one person, and the case each one puts you in.',
    icon: 'hand',
  },
];

export const SITUATION_BY_ID = new Map(SITUATIONS.map((s) => [s.id, s]));
