import { useNavigate } from 'react-router-dom';
import { EmptyState, TopBar } from '@/components/ui';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="page fade-in">
      <TopBar title="Page not found" back={false} />
      <EmptyState
        icon="search"
        title="Nothing here"
        text="That address does not match any screen in Oma Suomi."
        action={
          <button className="btn btn--primary" onClick={() => navigate('/')}>
            Back to home
          </button>
        }
      />
    </div>
  );
}
