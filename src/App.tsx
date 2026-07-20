import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Memuat...</div>;
  }

  return (
    <div className="font-sans">
      {!session ? <Login /> : <Dashboard session={session} />}
    </div>
  );
}

export default App;
