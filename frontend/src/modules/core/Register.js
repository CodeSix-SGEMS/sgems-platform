import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [focused, setFocused] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // ✅ Confirm password validation
        if (formData.password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }
        if (formData.password.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
            return;
        }
        setPasswordError('');
        setIsLoading(true);

        // Default role is USER for self-registration
        const payload = { ...formData, role: 'USER' };

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Registration Successful! Please Login.");
                navigate('/login');
            } else {
                alert("Registration Failed. Email might be taken.");
            }
        } catch (error) {
            alert("Server Error");
        } finally {
            setIsLoading(false);
        }
    };

    // Derive match state for live feedback
    const passwordsMatch = confirmPassword.length > 0 && formData.password === confirmPassword;
    const passwordsMismatch = confirmPassword.length > 0 && formData.password !== confirmPassword;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                :root {
                    --forest: #1a3a2a;
                    --moss: #2d5a3d;
                    --sage: #5a8a6a;
                    --mint: #a8d5b5;
                    --cream: #f5f0e8;
                    --warm-white: #fdfaf5;
                    --bark: #8b6f4e;
                    --gold: #c9a84c;
                    --shadow: rgba(26,58,42,0.15);
                }

                .gg-root {
                    min-height: 100vh;
                    display: flex;
                    background: var(--warm-white);
                    font-family: 'DM Sans', sans-serif;
                    position: relative;
                    overflow: hidden;
                }

                .gg-bg-blob {
                    position: fixed;
                    border-radius: 50%;
                    filter: blur(80px);
                    pointer-events: none;
                    z-index: 0;
                }
                .gg-bg-blob-1 {
                    width: 600px; height: 600px;
                    background: radial-gradient(circle, rgba(168,213,181,0.35) 0%, transparent 70%);
                    top: -200px; right: -150px;
                    animation: floatBlob1 12s ease-in-out infinite;
                }
                .gg-bg-blob-2 {
                    width: 450px; height: 450px;
                    background: radial-gradient(circle, rgba(90,138,106,0.2) 0%, transparent 70%);
                    bottom: -100px; left: -120px;
                    animation: floatBlob2 15s ease-in-out infinite;
                }
                .gg-bg-blob-3 {
                    width: 250px; height: 250px;
                    background: radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%);
                    top: 40%; left: 10%;
                    animation: floatBlob1 18s ease-in-out infinite reverse;
                }

                @keyframes floatBlob1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(-30px, 20px) scale(1.05); }
                    66% { transform: translate(20px, -25px) scale(0.97); }
                }
                @keyframes floatBlob2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(25px, -30px) scale(1.08); }
                }

                .gg-left {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 60px 80px;
                    position: relative;
                    z-index: 1;
                }

                .gg-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 80px;
                }

                .gg-logo-mark {
                    width: 42px; height: 42px;
                    background: linear-gradient(135deg, var(--forest), var(--moss));
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 4px 16px var(--shadow);
                    position: relative;
                    overflow: hidden;
                }
                .gg-logo-mark::before {
                    content: '';
                    position: absolute;
                    width: 28px; height: 28px;
                    border: 2.5px solid var(--mint);
                    border-radius: 50%;
                    top: 7px; left: 7px;
                }
                .gg-logo-mark::after {
                    content: '';
                    position: absolute;
                    width: 0; height: 0;
                    border-left: 7px solid transparent;
                    border-right: 7px solid transparent;
                    border-bottom: 11px solid var(--gold);
                    top: 13px; left: 14px;
                }

                .gg-brand-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 22px;
                    font-weight: 700;
                    color: var(--forest);
                    letter-spacing: -0.3px;
                }

                .gg-hero-text { max-width: 420px; }

                .gg-hero-eyebrow {
                    font-size: 11px;
                    font-weight: 500;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    color: var(--sage);
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .gg-hero-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 24px; height: 2px;
                    background: var(--gold);
                    border-radius: 2px;
                }

                .gg-hero-h1 {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(36px, 4vw, 52px);
                    font-weight: 700;
                    line-height: 1.12;
                    color: var(--forest);
                    margin-bottom: 24px;
                    letter-spacing: -1px;
                }
                .gg-hero-h1 em { font-style: italic; color: var(--moss); }

                .gg-hero-sub {
                    font-size: 16px;
                    font-weight: 300;
                    line-height: 1.7;
                    color: #4a6356;
                    max-width: 360px;
                    margin-bottom: 48px;
                }

                .gg-features { display: flex; flex-direction: column; gap: 16px; }

                .gg-feature {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    font-size: 14px;
                    color: #4a6356;
                }
                .gg-feature-dot {
                    width: 8px; height: 8px;
                    border-radius: 50%;
                    background: var(--gold);
                    flex-shrink: 0;
                }

                /* Right panel */
                .gg-right {
                    width: 520px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                    position: relative;
                    z-index: 1;
                }

                .gg-card {
                    width: 100%;
                    max-width: 420px;
                    background: rgba(255,255,255,0.82);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(168,213,181,0.4);
                    border-radius: 24px;
                    padding: 48px 44px;
                    box-shadow: 0 24px 64px rgba(26,58,42,0.12), 0 4px 16px rgba(26,58,42,0.06);
                    animation: cardEntrance 0.7s cubic-bezier(.22,1,.36,1) both;
                }

                @keyframes cardEntrance {
                    from { opacity: 0; transform: translateY(28px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .gg-card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 28px;
                    font-weight: 700;
                    color: var(--forest);
                    margin-bottom: 6px;
                    letter-spacing: -0.5px;
                }

                .gg-card-sub {
                    font-size: 14px;
                    color: #7a9688;
                    font-weight: 300;
                    margin-bottom: 32px;
                }

                .gg-form { display: flex; flex-direction: column; }

                .gg-field {
                    margin-bottom: 18px;
                    position: relative;
                    animation: fieldIn 0.5s cubic-bezier(.22,1,.36,1) both;
                }
                .gg-field:nth-child(1) { animation-delay: 0.1s; }
                .gg-field:nth-child(2) { animation-delay: 0.16s; }
                .gg-field:nth-child(3) { animation-delay: 0.22s; }
                .gg-field:nth-child(4) { animation-delay: 0.28s; }

                @keyframes fieldIn {
                    from { opacity: 0; transform: translateX(-14px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                .gg-label {
                    display: block;
                    font-size: 11.5px;
                    font-weight: 500;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    color: var(--moss);
                    margin-bottom: 8px;
                    transition: color 0.2s;
                }
                .gg-field.is-focused .gg-label { color: var(--forest); }

                .gg-input-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .gg-input {
                    width: 100%;
                    padding: 14px 16px 14px 44px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 15px;
                    font-weight: 400;
                    color: var(--forest);
                    background: rgba(245,240,232,0.6);
                    border: 1.5px solid rgba(90,138,106,0.25);
                    border-radius: 12px;
                    outline: none;
                    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
                    -webkit-appearance: none;
                }
                .gg-input::placeholder { color: #b0c4b8; font-weight: 300; }
                .gg-input:focus {
                    border-color: var(--moss);
                    background: rgba(255,255,255,0.9);
                    box-shadow: 0 0 0 4px rgba(90,138,106,0.12);
                }
                .gg-input:hover:not(:focus) { border-color: rgba(90,138,106,0.45); }

                /* Match / mismatch border colors */
                .gg-input.match {
                    border-color: var(--moss);
                    background: rgba(255,255,255,0.9);
                }
                .gg-input.mismatch {
                    border-color: #b94040;
                    background: rgba(255,255,255,0.9);
                    box-shadow: 0 0 0 4px rgba(185,64,64,0.08);
                }

                .gg-input-icon {
                    position: absolute;
                    left: 14px;
                    color: #8ab09a;
                    display: flex;
                    align-items: center;
                    pointer-events: none;
                    transition: color 0.25s;
                }
                .gg-field.is-focused .gg-input-icon { color: var(--moss); }

                /* Match indicator icon on right side */
                .gg-input-match-icon {
                    position: absolute;
                    right: 14px;
                    display: flex;
                    align-items: center;
                    font-size: 13px;
                    pointer-events: none;
                }

                .gg-eye-btn {
                    position: absolute;
                    right: 14px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #8ab09a;
                    display: flex;
                    align-items: center;
                    padding: 0;
                    transition: color 0.2s;
                }
                .gg-eye-btn:hover { color: var(--moss); }

                /* Password error message */
                .gg-pw-error {
                    font-size: 12px;
                    color: #b94040;
                    margin-top: 6px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    animation: fieldIn 0.3s ease both;
                }

                .gg-submit {
                    margin-top: 6px;
                    width: 100%;
                    padding: 15px 24px;
                    background: linear-gradient(135deg, var(--forest) 0%, var(--moss) 100%);
                    color: var(--cream);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 15px;
                    font-weight: 500;
                    letter-spacing: 0.3px;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 6px 24px rgba(26,58,42,0.28);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    animation: fieldIn 0.5s 0.34s cubic-bezier(.22,1,.36,1) both;
                }
                .gg-submit::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
                }
                .gg-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 32px rgba(26,58,42,0.35);
                }
                .gg-submit:active:not(:disabled) { transform: translateY(0); }
                .gg-submit:disabled { opacity: 0.7; cursor: not-allowed; }

                .gg-spinner {
                    width: 16px; height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .gg-divider {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 24px 0 0;
                    animation: fieldIn 0.5s 0.4s cubic-bezier(.22,1,.36,1) both;
                }
                .gg-divider-line { flex: 1; height: 1px; background: rgba(90,138,106,0.18); }
                .gg-divider-text { font-size: 12px; color: #9ab5a5; }

                .gg-login-link {
                    text-align: center;
                    font-size: 14px;
                    color: #7a9688;
                    font-weight: 300;
                    margin-top: 16px;
                    animation: fieldIn 0.5s 0.46s cubic-bezier(.22,1,.36,1) both;
                }
                .gg-login-link a {
                    color: var(--moss);
                    font-weight: 500;
                    text-decoration: none;
                    position: relative;
                }
                .gg-login-link a::after {
                    content: '';
                    position: absolute;
                    bottom: -1px; left: 0; right: 0;
                    height: 1.5px;
                    background: var(--gold);
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.25s;
                }
                .gg-login-link a:hover::after { transform: scaleX(1); }

                .gg-trust-badges {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 24px;
                    animation: fieldIn 0.5s 0.52s cubic-bezier(.22,1,.36,1) both;
                }
                .gg-badge {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 11px;
                    color: #9ab5a5;
                }

                .gg-leaf {
                    position: fixed;
                    pointer-events: none;
                    opacity: 0.07;
                    z-index: 0;
                }

                @media (max-width: 900px) {
                    .gg-left { display: none; }
                    .gg-right { width: 100%; padding: 24px; }
                }
            `}</style>

            <div className="gg-root">
                <div className="gg-bg-blob gg-bg-blob-1" />
                <div className="gg-bg-blob gg-bg-blob-2" />
                <div className="gg-bg-blob gg-bg-blob-3" />

                <svg className="gg-leaf" style={{ top: '5%', left: '35%', width: 300 }} viewBox="0 0 200 200" fill="none">
                    <path d="M100 10 C140 10 180 50 180 100 C180 150 140 190 100 190 C60 190 20 150 20 100 C20 50 60 10 100 10 Z" fill="#1a3a2a"/>
                    <path d="M100 10 L100 190" stroke="#1a3a2a" strokeWidth="3"/>
                </svg>

                {/* Left hero panel */}
                <div className="gg-left">
                    <div className="gg-brand">
                        <div className="gg-logo-mark" />
                        <span className="gg-brand-name">GreenGrid</span>
                    </div>
                    <div className="gg-hero-text">
                        <p className="gg-hero-eyebrow">Sustainable Energy Platform</p>
                        <h1 className="gg-hero-h1">Power the <em>future</em>, starting today.</h1>
                        <p className="gg-hero-sub">
                            Join thousands of users managing renewable energy, tracking carbon footprints, and building a greener grid — together.
                        </p>
                        <div className="gg-features">
                            {["Real-time energy monitoring dashboard", "Carbon offset tracking & reporting", "Community-driven sustainability goals", "Certified green energy partnerships"].map(f => (
                                <div className="gg-feature" key={f}>
                                    <span className="gg-feature-dot" />
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right form panel */}
                <div className="gg-right">
                    <div className="gg-card">
                        <h2 className="gg-card-title">Create your account</h2>
                        <p className="gg-card-sub">Begin your sustainable journey</p>

                        <form className="gg-form" onSubmit={handleRegister}>

                            {/* Full Name */}
                            <div className={`gg-field${focused === 'fullName' ? ' is-focused' : ''}`}>
                                <label className="gg-label">Full Name</label>
                                <div className="gg-input-wrap">
                                    <span className="gg-input-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                            <circle cx="12" cy="7" r="4"/>
                                        </svg>
                                    </span>
                                    <input type="text" className="gg-input" placeholder="Jane Doe"
                                           onFocus={() => setFocused('fullName')} onBlur={() => setFocused('')}
                                           onChange={e => setFormData({...formData, fullName: e.target.value})} required />
                                </div>
                            </div>

                            {/* Email */}
                            <div className={`gg-field${focused === 'email' ? ' is-focused' : ''}`}>
                                <label className="gg-label">Email Address</label>
                                <div className="gg-input-wrap">
                                    <span className="gg-input-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                            <polyline points="22,6 12,13 2,6"/>
                                        </svg>
                                    </span>
                                    <input type="email" className="gg-input" placeholder="jane@example.com"
                                           onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                                           onChange={e => setFormData({...formData, email: e.target.value})} required />
                                </div>
                            </div>

                            {/* Password */}
                            <div className={`gg-field${focused === 'password' ? ' is-focused' : ''}`}>
                                <label className="gg-label">Password</label>
                                <div className="gg-input-wrap">
                                    <span className="gg-input-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                        </svg>
                                    </span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="gg-input"
                                        placeholder="Create a strong password"
                                        onFocus={() => setFocused('password')}
                                        onBlur={() => setFocused('')}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                        required
                                    />
                                    <button type="button" className="gg-eye-btn"
                                            onClick={() => setShowPassword(v => !v)} tabIndex={-1}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                        {showPassword ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* ✅ Confirm Password */}
                            <div className={`gg-field${focused === 'confirm' ? ' is-focused' : ''}`}>
                                <label className="gg-label">Confirm Password</label>
                                <div className="gg-input-wrap">
                                    <span className="gg-input-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                        </svg>
                                    </span>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className={`gg-input${passwordsMatch ? ' match' : ''}${passwordsMismatch ? ' mismatch' : ''}`}
                                        placeholder="Re-enter your password"
                                        onFocus={() => setFocused('confirm')}
                                        onBlur={() => setFocused('')}
                                        value={confirmPassword}
                                        onChange={e => {
                                            setConfirmPassword(e.target.value);
                                            setPasswordError('');
                                        }}
                                        required
                                        style={{ paddingRight: '72px' }}
                                    />
                                    {/* Show/hide toggle */}
                                    <button type="button" className="gg-eye-btn"
                                            style={{ right: '36px' }}
                                            onClick={() => setShowConfirmPassword(v => !v)} tabIndex={-1}>
                                        {showConfirmPassword ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        )}
                                    </button>
                                    {/* Live match indicator */}
                                    {passwordsMatch && (
                                        <span className="gg-input-match-icon" style={{ color: '#2d5a3d' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"/>
                                            </svg>
                                        </span>
                                    )}
                                    {passwordsMismatch && (
                                        <span className="gg-input-match-icon" style={{ color: '#b94040' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                            </svg>
                                        </span>
                                    )}
                                </div>
                                {/* Error message */}
                                {passwordError && (
                                    <div className="gg-pw-error">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                        {passwordError}
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="gg-submit" disabled={isLoading}>
                                {isLoading ? (
                                    <><span className="gg-spinner" /> Creating your account…</>
                                ) : (
                                    <>
                                        Create Account
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="gg-divider">
                            <div className="gg-divider-line" />
                            <span className="gg-divider-text">already a member?</span>
                            <div className="gg-divider-line" />
                        </div>

                        <p className="gg-login-link">
                            <Link to="/login">Sign in to your account →</Link>
                        </p>

                        <div className="gg-trust-badges">
                            <span className="gg-badge">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                SSL Secured
                            </span>
                            <span className="gg-badge">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                                Free forever
                            </span>
                            <span className="gg-badge">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                                No credit card
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;