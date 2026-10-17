import { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { AppProvider } from '@/hooks/useApp';
import { Home } from '@/pages/Home';
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
        </div>
      </HashRouter>
    </AppProvider>
  );
}
