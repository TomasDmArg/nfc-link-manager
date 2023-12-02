'use client';
import Dashboard from '@/components/Dashboard';
import Login from '@/components/Login';
import { User } from '@supabase/supabase-js';
import { useState } from 'react';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {user ? <Dashboard user={user} setUser={setUser} /> : <Login setUser={setUser} />}
    </main>
  )
}
