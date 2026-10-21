import { useEffect, type ReactNode } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { AppProvider, useApp } from '@/hooks/useApp';
import { WhatsNew, useWhatsNew } from '@/components/WhatsNew';
import { Home } from '@/pages/Home';
import { Welcome } from '@/pages/Welcome';
import { GrammarList } from '@/pages/GrammarList';
import { GrammarLessonPage } from '@/pages/GrammarLesson';
import { Vocabulary } from '@/pages/Vocabulary';
import { WordDetail } from '@/pages/WordDetail';
import { PhraseSituation, PhrasesList } from '@/pages/Phrases';
import { SituationPlay, SituationsList } from '@/pages/Situations';
import {
  GrammarPractice,
  MixedPractice,
  PracticeHub,
  ReviewSession,
  WeakTopics,
  WordPractice,
} from '@/pages/Practice';
import { Mistakes } from '@/pages/Mistakes';
import { Listening } from '@/pages/Listening';
import { ReadingList, ReadingText } from '@/pages/Reading';
import { Search } from '@/pages/Search';
import { Settings } from '@/pages/Settings';
import { Favourites, More } from '@/pages/More';
import { DataAudit } from '@/pages/DataAudit';
import { NotFound } from '@/pages/NotFound';

/** Returns to the top of the page whenever the route changes. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/**
 * Nothing opens until the app knows who is using it. The name lives in this
 * browser, so this gate costs one screen on the first run and never appears
 * again on that device.
 */
function Gate({ children }: { children: ReactNode }) {
  const { profile, setProfileName } = useApp();
  if (!profile) return <Welcome onDone={setProfileName} />;
  return <>{children}</>;
}

/**
 * Tells a returning learner what changed since they last opened the app.
 *
 * Mounted OUTSIDE the gate on purpose. Someone who has not given a name yet
 * has nothing to catch up on, and this has to be running while they are on
 * the name screen in order to record that - otherwise they would be handed
 * the whole changelog the moment they finished signing up. The hook renders
 * nothing until there is a profile.
 */
function UpdateNotice() {
  const { profile } = useApp();
  const { releases, dismiss } = useWhatsNew(Boolean(profile));
  if (!releases) return null;
  return <WhatsNew releases={releases} onClose={dismiss} />;
}

export default function App() {
  return (
    <AppProvider>
      {/*
        HashRouter is deliberate: the built app is meant to be dropped onto any
        static host (or opened from the file system) without server rewrite
        rules, and hash routes survive a hard refresh on a deep link.
      */}
      <HashRouter>
        <ScrollToTop />
        <div className="app-shell">
          <Gate>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/grammar" element={<GrammarList />} />
            <Route path="/grammar/:id" element={<GrammarLessonPage />} />

            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/vocabulary/:id" element={<WordDetail />} />

            <Route path="/phrases" element={<PhrasesList />} />
            <Route path="/phrases/:id" element={<PhraseSituation />} />

            <Route path="/situations" element={<SituationsList />} />
            <Route path="/situations/:id" element={<SituationPlay />} />

            <Route path="/practice" element={<PracticeHub />} />
            <Route path="/practice/review" element={<ReviewSession />} />
            <Route path="/practice/mixed" element={<MixedPractice />} />
            <Route path="/practice/weak" element={<WeakTopics />} />
            <Route path="/practice/grammar/:id" element={<GrammarPractice />} />
            <Route path="/practice/word/:id" element={<WordPractice />} />

            <Route path="/listening" element={<Listening />} />
            <Route path="/reading" element={<ReadingList />} />
            <Route path="/reading/:id" element={<ReadingText />} />

            <Route path="/mistakes" element={<Mistakes />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/search" element={<Search />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/data-audit" element={<DataAudit />} />
            <Route path="/more" element={<More />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
          </Gate>
          <UpdateNotice />
        </div>
      </HashRouter>
    </AppProvider>
  );
}
