import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast'; 
import SEO from '../components/SEO.jsx';
import Lenis from 'lenis';
import DigitalUniverse from "../components/DigitalUniverse.jsx";

function MiniProjects() {
    // --------------------------------------------------------
    // PREMIUM SMOOTH SCROLLING (LENIS)
    // --------------------------------------------------------
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false, 
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    // --------------------------------------------------------
    // MICRO-PROJECT 1: KeyCode Finder Logic (Mobile & Safe Supported)
    // --------------------------------------------------------
    const [keyInfo, setKeyInfo] = useState({ key: 'Press Any Key', code: '-', keyCode: '-' });
    const mobileInputRef = useRef(null);
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            const isFunctionKey = e.key.startsWith('F') && e.key.length > 1; 
            const isModifierCombo = e.ctrlKey || e.metaKey || e.altKey; 
            const isSystemKey = e.key === 'Tab' || e.key === 'Escape';

            if (!isFunctionKey && !isModifierCombo && !isSystemKey && e.target !== mobileInputRef.current) {
                e.preventDefault();
            }

            setKeyInfo({
                key: e.key === ' ' ? 'Space' : e.key,
                code: e.code || 'N/A',
                keyCode: e.keyCode || e.which
            });
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleMobileInput = (e) => {
        const val = e.target.value;
        if (val) {
            const char = val.slice(-1);
            setKeyInfo({
                key: char === ' ' ? 'Space' : char,
                code: `Key${char.toUpperCase()}`, 
                keyCode: char.charCodeAt(0)
            });
            e.target.value = ''; 
        }
    };

    // --------------------------------------------------------
    // MICRO-PROJECT 2: Color Palette Generator Logic
    // --------------------------------------------------------
    const [palette, setPalette] = useState(['#a3e635', '#171717', '#ffffff', '#262626']);
    const [copiedColor, setCopiedColor] = useState(null);

    const generatePalette = () => {
        const newPalette = Array.from({ length: 4 }, () => 
            '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
        );
        setPalette(newPalette);
    };

    const copyToClipboard = (color) => {
        navigator.clipboard.writeText(color);
        setCopiedColor(color);
        toast.success(`Copied ${color.toUpperCase()}`, {
            style: { background: '#171717', color: '#fff', border: '1px solid #262626' },
            iconTheme: { primary: color, secondary: '#000' }
        });
        setTimeout(() => setCopiedColor(null), 1500);
    };

    // --------------------------------------------------------
    // MICRO-PROJECT 3: Speed Clicker Game Logic
    // --------------------------------------------------------
    const [clicks, setClicks] = useState(0);
    const [timeLeft, setTimeLeft] = useState(5);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [canRestart, setCanRestart] = useState(false);

    useEffect(() => {
        let timer;
        if (isPlaying && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && isPlaying) {
            setIsPlaying(false);
            setGameEnded(true);
            setCanRestart(false);
            setTimeout(() => setCanRestart(true), 2000);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, timeLeft]);

    const handleGameClick = () => {
        if (!isPlaying && !gameEnded) {
            setIsPlaying(true);
            setClicks(1);
        } else if (isPlaying) {
            setClicks(prev => prev + 1);
        } else if (gameEnded) {
            if (!canRestart) return; 
            setClicks(0);
            setTimeLeft(5);
            setGameEnded(false);
            setIsPlaying(false);
            setCanRestart(false);
        }
    };

    // --------------------------------------------------------
    // SMART POPUP NOTIFICATION
    // --------------------------------------------------------
    const [isNotified, setIsNotified] = useState(false);

    const handleNotifyClick = () => {
        if (isNotified) return; 
        
        setIsNotified(true);
        toast.success("You're on the list! I'll notify you when new projects drop.", {
            style: {
                borderRadius: '18px',
                background: '#141414',
                color: '#fff',
                border: '1px solid rgba(163, 230, 53, 0.2)',
            },
        });
    };

    return (
        <div className="min-h-screen relative w-full overflow-x-clip text-white pt-32 pb-24 select-none poppins-regular">
            
            {/* Global CSS Override for Lenis */}
            <style>{`
                html.lenis { height: auto; }
                .lenis.lenis-smooth { scroll-behavior: auto !important; }
                .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
                .lenis.lenis-stopped { overflow: hidden; }
                .lenis.lenis-scrolling iframe { pointer-events: none; }
            `}</style>

            {/* --- DIGITAL UNIVERSE BACKGROUND --- */}
            <div className="fixed inset-0 z-[-2] pointer-events-none w-full h-full">
                <DigitalUniverse />
            </div>

            {/* Contrast Protection Layers */}
            <div className="fixed inset-0 bg-[#050505]/60 pointer-events-none z-[-1]" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_100%)] opacity-80 pointer-events-none z-[-1]" />

            <SEO 
              title="Mini Projects & Micro Apps" 
              description="Explore my interactive React mini-projects, including a Key Event Tracker, Hex Palette Generator, and a CPS testing tool." 
              url="/mini-projects" 
            />
            
            {/* Ambient Lighting Overlay */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-lime-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
                
                {/* Elegant Header */}
                <div className="text-center mb-20">
                    <span className="inline-block text-lime-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">Interactive Playground</span>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Micro Apps</h1>
                    <p className="text-neutral-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                        While I am building larger applications, play around with these self-contained React experiments built directly into this page.
                    </p>
                </div>
                
                {/* Interactive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 w-full">
                    
                    {/* APP 1: Keycode Finder */}
                    <div className="group bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl transition-all duration-500 hover:border-lime-400/20 hover:bg-white/[0.04] flex flex-col h-full shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                        <h4 className="text-xl font-semibold mb-3 text-white transition-colors group-hover:text-lime-400">Key Event Tracker</h4>
                        <p className="text-neutral-400 text-sm mb-6 font-light">Press any key to capture its event data. Tap the box below on mobile to open keyboard.</p>
                        
                        <div 
                            className="mt-auto bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[140px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] cursor-pointer relative overflow-hidden"
                            onClick={() => mobileInputRef.current?.focus()}
                        >
                            <input 
                                ref={mobileInputRef}
                                type="text"
                                className="absolute opacity-0 pointer-events-none w-0 h-0"
                                onChange={handleMobileInput}
                                autoCapitalize="none"
                            />

                            <span className="text-3xl font-bold text-lime-400 mb-2 truncate max-w-full drop-shadow-[0_0_8px_rgba(163,230,53,0.4)]">{keyInfo.key}</span>
                            <div className="flex gap-4 text-xs text-neutral-500 font-mono">
                                <span>code: <span className="text-white">{keyInfo.code}</span></span>
                                <span>which: <span className="text-white">{keyInfo.keyCode}</span></span>
                            </div>
                            
                            <span className="md:hidden absolute bottom-2 text-[10px] text-lime-400/40 uppercase tracking-widest font-semibold">
                                Tap here to type
                            </span>
                        </div>
                    </div>

                    {/* APP 2: Color Generator */}
                    <div className="group bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl transition-all duration-500 hover:border-lime-400/20 hover:bg-white/[0.04] flex flex-col h-full shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-xl font-semibold text-white transition-colors group-hover:text-lime-400">Palette Gen</h4>
                            <button onClick={generatePalette} className="p-2 bg-white/5 hover:bg-lime-400 hover:text-black rounded-xl transition-colors border border-white/5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            </button>
                        </div>
                        <p className="text-neutral-400 text-sm mb-6 font-light">Generate random hex colors. Click any color block to copy its code.</p>
                        
                        <div className="mt-auto grid grid-cols-4 gap-2 h-[140px]">
                            {palette.map((color, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => copyToClipboard(color)}
                                    className="relative rounded-xl cursor-pointer group/color transition-transform hover:scale-105 shadow-lg border border-white/10"
                                    style={{ backgroundColor: color }}
                                >
                                    <div className={`absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl transition-opacity backdrop-blur-sm ${copiedColor === color ? 'opacity-100' : 'opacity-0 group-hover/color:opacity-100'}`}>
                                        <span className="text-[10px] font-mono text-white tracking-wider font-bold drop-shadow-md">
                                            {copiedColor === color ? 'COPIED!' : color.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* APP 3: Speed Clicker */}
                    <div className="group bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl transition-all duration-500 hover:border-lime-400/20 hover:bg-white/[0.04] flex flex-col h-full shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-xl font-semibold text-white transition-colors group-hover:text-lime-400">CPS Test</h4>
                            <span className="text-sm font-mono bg-white/5 px-3 py-1 rounded-lg border border-white/5">{timeLeft}s</span>
                        </div>
                        <p className="text-neutral-400 text-sm mb-6 font-light">Test your clicking speed. How many clicks can you get in 5 seconds?</p>
                        
                        <div className="mt-auto">
                            <button 
                                onClick={handleGameClick}
                                className={`w-full h-[140px] rounded-2xl flex flex-col items-center justify-center border transition-all duration-150 select-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] ${
                                    gameEnded 
                                        ? canRestart ? 'bg-lime-400/10 border-lime-400/30 text-white cursor-pointer hover:bg-lime-400/20' : 'bg-black/50 border-white/5 text-white cursor-default backdrop-blur-md' 
                                        : isPlaying ? 'bg-white/5 border-white/10 active:scale-95 text-white' 
                                        : 'bg-lime-400 text-black border-lime-400 hover:bg-lime-500 hover:-translate-y-1 shadow-[0_0_20px_rgba(163,230,53,0.3)]'
                                }`}
                            >
                                {gameEnded ? (
                                    <>
                                        <span className="text-3xl font-bold text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.4)]">{clicks} Clicks</span>
                                        <span className="text-lg font-medium mt-1">{(clicks / 5).toFixed(1)} CPS</span>
                                        <span className={`text-xs text-neutral-400 mt-2 transition-opacity duration-500 ${canRestart ? 'opacity-100' : 'opacity-0'}`}>
                                            Click to try again
                                        </span>
                                    </>
                                ) : isPlaying ? (
                                    <span className="text-5xl font-black">{clicks}</span>
                                ) : (
                                    <span className="text-lg font-bold">Click to Start</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Coming Soon & Actions */}
                <div className="max-w-3xl mx-auto text-center space-y-12">
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                        <h3 className="text-xl font-bold mb-3 text-white">Full Projects Coming Soon</h3>
                        <p className="text-neutral-400 text-sm font-light mb-6 max-w-md mx-auto">
                            I am currently engineering larger full-stack applications. Subscribe to get notified when they drop.
                        </p>
                        
                        <button 
                            onClick={handleNotifyClick}
                            disabled={isNotified}
                            className={`px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 border ${
                                isNotified 
                                ? 'bg-lime-400/10 text-lime-400 border-lime-400/20 cursor-default' 
                                : 'bg-white/[0.05] text-white hover:bg-lime-400 hover:text-black border-white/10 hover:border-lime-400 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(163,230,53,0.3)]'
                            }`}
                        >
                            {isNotified ? 'Subscribed ✓' : 'Notify Me'}
                        </button>
                    </div>

                    <a href="https://github.com/Pad-coder?tab=repositories" target='_blank' rel="noreferrer" className="inline-block px-8 py-4 bg-lime-400 text-black font-semibold rounded-2xl hover:bg-lime-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(163,230,53,0.3)] transition-all duration-300">
                        View GitHub Repositories
                    </a>
                </div>
            </div>

            {/* Premium Floating Back Button */}
            <div className="fixed bottom-8 right-8 z-50">
                <Link to="/" className="flex items-center gap-2 px-5 py-3 bg-neutral-900/80 backdrop-blur-xl border border-white/10 text-white text-sm font-medium rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back Home
                </Link>
            </div>
        </div>
    )
}

export default MiniProjects;