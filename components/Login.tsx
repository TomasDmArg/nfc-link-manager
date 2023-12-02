'use client';
import React, {useEffect, useState} from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface LoginProps {
    setUser: React.Dispatch<React.SetStateAction<null | User>>;
}

export default function Login({setUser}: Readonly<LoginProps>) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if(user) setUser(user);
        }

        getUser();
    }, [setUser])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        supabase.auth.signInWithPassword({ email, password }).then((response) => response.data?.user && setUser(response.data.user))
    }

    return (
        <React.Fragment>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-5xl text-emerald-200 font-bold text-center">Link manager</h1>
                <p className="mt-4 text-emerald-200 text-center text-xl">Sign in to your account</p>
            </div>
            <div className="flex flex-col items-center justify-center">
                <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit}>
                <input
                    className="mt-4 px-4 py-2 border-2 text-emerald-400 placeholder-emerald-600 bg-emerald-950 border-emerald-900 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="mt-4 px-4 py-2 border-2 text-emerald-400 placeholder-emerald-600 bg-emerald-950 border-emerald-900 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="mt-6 w-full py-3 bg-emerald-400 text-emerald-950 font-bold rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    type="submit"
                >
                    Sign in
                </button>
                </form>
            </div>
        </React.Fragment>
    )
}