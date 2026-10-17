import { useNavigate } from 'react-router-dom';
import { Icon, type IconName } from '@/components/Icon';
import { TopBar } from '@/components/ui';
import { useApp } from '@/hooks/useApp';
import { WORDS } from '@/data/words';
import { BRAND, COPYRIGHT } from '@/data/brand';

const LINKS: { to: string; title: string; sub: string; icon: IconName; colour: string }[] = [
  {
    to: '/situations',
    title: 'Situations',
    sub: 'Role-play a conversation, choose what to say',
    icon: 'chat',
    colour: 'var(--c-phrases)',
  },
  {
    to: '/phrases',
    title: 'Useful Phrases',
    sub: 'Organised by real-life situation',
    icon: 'hand',
    colour: '#0ea5e9',
  },
  {
    to: '/listening',
    title: 'Listening Practice',
    sub: 'Hear it, then write it',
    icon: 'headphones',
    colour: 'var(--c-listening)',
  },
  {
    to: '/reading',
    title: 'Reading Practice',
    sub: 'Messages, letters and notices',
    icon: 'file',
    colour: 'var(--c-reading)',
  },
  {
    to: '/mistakes',
    title: 'My Mistakes',
    sub: 'Corrections and personal words',
    icon: 'pencil',
    colour: 'var(--c-mistakes)',
  },
  {
    to: '/favourites',
    title: 'Favourites',
    sub: 'Words you saved with the heart',
    icon: 'heart',
    colour: '#ef4756',
  },
  {
    to: '/search',
    title: 'Search',
    sub: 'Everything at once',
    icon: 'search',
    colour: 'var(--c-vocab)',
  },
  {
    to: '/data-audit',
    title: 'Data audit & sources',
    sub: 'What is verified and what is not',
    icon: 'shield',
    colour: '#6366f1',
  },
  {
    to: '/settings',
    title: 'Settings',
    sub: 'Goal, languages, speech, backup',
    icon: 'settings',
    colour: '#64748b',
  },
];

export function More() {
  const navigate = useNavigate();
  const { favourites, mistakes } = useApp();

  return (
    <div className="page fade-in">
      <TopBar title="More" subtitle="Everything else" back={false} />
      <div className="rows">
        {LINKS.map((l) => (
          <button key={l.to} className="rowcard" onClick={() => navigate(l.to)}>
            <span className="rowcard__num" style={{ background: l.colour }}>
              <Icon name={l.icon} size={15} />
            </span>
            <span className="rowcard__body">
              <span className="rowcard__title">{l.title}</span>
              <span className="rowcard__sub">{l.sub}</span>
            </span>
            {l.to === '/favourites' && favourites.size > 0 && (
              <span className="badge">{favourites.size}</span>
            )}
            {l.to === '/mistakes' && mistakes.filter((m) => !m.resolved).length > 0 && (
              <span className="badge">{mistakes.filter((m) => !m.resolved).length}</span>
            )}
            <Icon name="chevron-right" size={17} className="rowcard__chev" />
          </button>
        ))}
      </div>

      <p className="tiny dim center" style={{ marginTop: 26, lineHeight: 1.7 }}>
        Oma Suomi · {WORDS.length} words · works offline · no account needed
        <span style={{ display: 'block', marginTop: 6 }}>
          <b style={{ color: 'var(--gold)' }}>{BRAND}</b>
        </span>
        <span style={{ display: 'block' }}>{COPYRIGHT}</span>
      </p>
    </div>
  );
}

export function Favourites() {
  const navigate = useNavigate();
  const { favourites, settings } = useApp();
  const words = WORDS.filter((w) => favourites.has(w.id));

  return (
    <div className="page fade-in">
      <TopBar title="Favourites" subtitle={`${words.length} saved`} />
      {words.length === 0 ? (
        <div className="empty">
          <div className="empty__icon">
            <Icon name="heart" size={26} />
          </div>
          <p className="empty__title">No favourites yet</p>
          <p className="empty__text">
            Tap the heart on any word to keep it here for quick access.
          </p>
          <button
            className="btn btn--primary"
            style={{ marginTop: 16 }}
            onClick={() => navigate('/vocabulary')}
          >
            Browse vocabulary
          </button>
        </div>
      ) : (
        <div className="stack" style={{ gap: 8 }}>
          {words.map((w) => (
            <button
              key={w.id}
              className="wcard row"
              style={{ gap: 10, width: '100%', textAlign: 'left' }}
              onClick={() => navigate(`/vocabulary/${w.id}`)}
            >
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="wcard__fi">{w.fi}</span>
                <span className="wcard__gloss" style={{ display: 'block' }}>
                  {w.en}
                  {settings.showTagalog && (
                    <>
                      {'  ·  '}
                      <b>{w.tl}</b>
                    </>
                  )}
                </span>
              </span>
              <span className="badge badge--level">{w.level}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
