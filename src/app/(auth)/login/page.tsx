'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

// === Matrix Rain Canvas Component ===
const MatrixRain = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const setup = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const characters = katakana + latin + nums;
        const fontSize = 16;
        const columns = Math.floor(window.innerWidth / fontSize);
        const rainDrops = Array.from({ length: columns }).map(() => 1);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 16, 0.05)'; // Fading effect with dark blue
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#33A1FF'; // Vibrant blue for characters
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < rainDrops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        };

        const animate = () => {
            draw();
            animationFrameId = window.requestAnimationFrame(animate);
        };

        const handleResize = () => {
            setup();
        };

        setup();
        animate();
        window.addEventListener('resize', handleResize);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                background: '#000010', // Dark midnight blue background
            }}
        />
    );
};

// === Main Login Page Component ===
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null); // Reset error state on new submission

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            console.error('Supabase login error:', signInError.message);
            setError(signInError.message);
            return;
        }

        router.push('/characters');
        router.refresh();
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-transparent text-white overflow-hidden">
            <MatrixRain />
            <div className="w-full max-w-sm mx-4 p-6 sm:p-8 space-y-6 bg-black/40 backdrop-blur-md rounded-xl shadow-lg z-10 border border-blue-500/50">
                <div className="text-center">
                    <p className="text-lg text-gray-200">Welcome to:</p>
                    <h1 className="text-4xl font-bold text-white mt-1">The Rebirth : H22</h1>
                    <p className="text-gray-300 mt-2">Enter your credentials to access your account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-200">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-gray-900/60 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-200">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-gray-900/60 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Your Password"
                            required
                        />
                    </div>
                    
                    {error && (
                        <div className="p-3 text-center text-sm text-white bg-red-800/50 border border-red-700 rounded-md">
                           {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 px-4 text-white bg-blue-600 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
} 