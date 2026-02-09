import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSolarPanel, FaLeaf, FaChartLine, FaBolt, FaCloud, FaCog } from 'react-icons/fa';

function LandingPage() {
    const [scrollY, setScrollY] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={styles.pageContainer}>
            {/* Animated Background Grid */}
            <div style={styles.backgroundGrid}>
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            ...styles.gridLine,
                            animationDelay: `${i * 0.1}s`
                        }}
                    />
                ))}
            </div>

            {/* Navigation */}
            <nav style={styles.nav}>
                <div style={styles.navContainer}>
                    <div style={styles.logo}>
                        <FaBolt style={styles.logoIcon} />
                        <span style={styles.logoText}>GreenGrid</span>
                    </div>
                    <div style={styles.navLinks}>
                        <a href="#features" style={styles.navLink}>Features</a>
                        <a href="#how" style={styles.navLink}>How It Works</a>
                        <a href="#stats" style={styles.navLink}>Impact</a>
                        <Link to="/login" style={styles.navLoginBtn}>Login</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header style={{
                ...styles.hero,
                transform: `translateY(${scrollY * 0.5}px)`,
                opacity: Math.max(0, 1 - scrollY / 600)
            }}>
                <div style={{
                    ...styles.heroContent,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 1s ease-out'
                }}>
                    <div style={styles.heroLabel}>
                        <FaLeaf style={styles.heroLabelIcon} />
                        <span>SMART ENERGY ECOSYSTEM</span>
                    </div>

                    <h1 style={{
                        ...styles.heroTitle,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 1s ease-out 0.2s'
                    }}>
                        Power Your Future<br />
                        <span style={styles.heroTitleAccent}>With Intelligence</span>
                    </h1>

                    <p style={{
                        ...styles.heroSubtitle,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 1s ease-out 0.4s'
                    }}>
                        Advanced green energy management that learns, adapts, and optimizes<br />
                        your power consumption in real-time
                    </p>

                    <div style={{
                        ...styles.heroCTA,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 1s ease-out 0.6s'
                    }}>
                        <Link to="/register" style={styles.primaryButton}>
                            Start Free Trial
                            <span style={styles.buttonArrow}>→</span>
                        </Link>
                        <Link to="/login" style={styles.secondaryButton}>
                            Watch Demo
                        </Link>
                    </div>

                    {/* Stats Preview */}
                    <div style={styles.statsPreview}>
                        <div style={styles.statItem}>
                            <div style={styles.statNumber}>98%</div>
                            <div style={styles.statLabel}>Uptime</div>
                        </div>
                        <div style={styles.statDivider} />
                        <div style={styles.statItem}>
                            <div style={styles.statNumber}>2.5k+</div>
                            <div style={styles.statLabel}>Active Users</div>
                        </div>
                        <div style={styles.statDivider} />
                        <div style={styles.statItem}>
                            <div style={styles.statNumber}>45%</div>
                            <div style={styles.statLabel}>Avg. Savings</div>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div style={styles.floatingElement1}>
                    <FaSolarPanel style={styles.floatingIcon} />
                </div>
                <div style={styles.floatingElement2}>
                    <FaCloud style={styles.floatingIcon} />
                </div>
            </header>

            {/* Features Section */}
            <section id="features" style={styles.featuresSection}>
                <div style={styles.sectionContainer}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Built for Tomorrow</h2>
                        <p style={styles.sectionSubtitle}>
                            Cutting-edge technology meets sustainable innovation
                        </p>
                    </div>

                    <div style={styles.featuresGrid}>
                        {[
                            {
                                icon: <FaSolarPanel />,
                                title: 'Unified Device Hub',
                                description: 'Connect solar panels, inverters, batteries, and smart meters in a single ecosystem with seamless integration.',
                                color: '#10b981'
                            },
                            {
                                icon: <FaChartLine />,
                                title: 'AI-Powered Analytics',
                                description: 'Real-time insights with predictive modeling and machine learning that optimize your energy patterns.',
                                color: '#3b82f6'
                            },
                            {
                                icon: <FaLeaf />,
                                title: 'Carbon Intelligence',
                                description: 'Track, reduce, and offset your carbon footprint with actionable environmental impact metrics.',
                                color: '#8b5cf6'
                            },
                            {
                                icon: <FaCog />,
                                title: 'Automated Optimization',
                                description: 'Set it and forget it. Our AI continuously adjusts settings to maximize efficiency and minimize costs.',
                                color: '#f59e0b'
                            },
                            {
                                icon: <FaBolt />,
                                title: 'Grid Integration',
                                description: 'Sell excess energy back to the grid and monitor bi-directional power flow with dynamic pricing.',
                                color: '#ef4444'
                            },
                            {
                                icon: <FaCloud />,
                                title: 'Weather Forecasting',
                                description: 'Anticipate energy generation with hyper-local weather data and solar irradiance predictions.',
                                color: '#06b6d4'
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                style={{
                                    ...styles.featureCard,
                                    animationDelay: `${index * 0.1}s`
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                                }}
                            >
                                <div style={{
                                    ...styles.featureIconWrapper,
                                    background: `linear-gradient(135deg, ${feature.color}15, ${feature.color}30)`
                                }}>
                                    <div style={{...styles.featureIcon, color: feature.color}}>
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 style={styles.featureTitle}>{feature.title}</h3>
                                <p style={styles.featureDescription}>{feature.description}</p>
                                <div style={{...styles.featureAccent, background: feature.color}} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how" style={styles.howSection}>
                <div style={styles.sectionContainer}>
                    <h2 style={styles.sectionTitle}>Simple Setup, Powerful Results</h2>

                    <div style={styles.stepsContainer}>
                        {[
                            { step: '01', title: 'Connect Devices', desc: 'Link your solar panels and smart meters' },
                            { step: '02', title: 'AI Learning', desc: 'Our system analyzes your energy patterns' },
                            { step: '03', title: 'Optimize & Save', desc: 'Watch your savings grow automatically' }
                        ].map((item, i) => (
                            <div key={i} style={styles.stepCard}>
                                <div style={styles.stepNumber}>{item.step}</div>
                                <div style={styles.stepContent}>
                                    <h4 style={styles.stepTitle}>{item.title}</h4>
                                    <p style={styles.stepDesc}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={styles.ctaSection}>
                <div style={styles.ctaContent}>
                    <h2 style={styles.ctaTitle}>Ready to Transform Your Energy?</h2>
                    <p style={styles.ctaSubtitle}>Join thousands of smart energy users worldwide</p>
                    <Link to="/register" style={styles.ctaButton}>
                        Get Started for Free
                        <span style={styles.buttonArrow}>→</span>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <div style={styles.footerContent}>
                    <div style={styles.footerBrand}>
                        <div style={styles.footerLogo}>
                            <FaBolt style={styles.footerLogoIcon} />
                            <span style={styles.footerLogoText}>GreenGrid</span>
                        </div>
                        <p style={styles.footerTagline}>Intelligent energy for a sustainable future</p>
                    </div>

                    <div style={styles.footerLinks}>
                        <div style={styles.footerColumn}>
                            <h4 style={styles.footerColumnTitle}>Product</h4>
                            <a href="#" style={styles.footerLink}>Features</a>
                            <a href="#" style={styles.footerLink}>Pricing</a>
                            <a href="#" style={styles.footerLink}>Demo</a>
                        </div>
                        <div style={styles.footerColumn}>
                            <h4 style={styles.footerColumnTitle}>Company</h4>
                            <a href="#" style={styles.footerLink}>About</a>
                            <a href="#" style={styles.footerLink}>Blog</a>
                            <a href="#" style={styles.footerLink}>Careers</a>
                        </div>
                        <div style={styles.footerColumn}>
                            <h4 style={styles.footerColumnTitle}>Support</h4>
                            <a href="#" style={styles.footerLink}>Help Center</a>
                            <a href="#" style={styles.footerLink}>Contact</a>
                            <a href="#" style={styles.footerLink}>Privacy</a>
                        </div>
                    </div>
                </div>

                <div style={styles.footerBottom}>
                    <p style={styles.copyright}>© 2026 GreenGrid Technologies. All rights reserved.</p>
                </div>
            </footer>

            <style>{keyframesCSS}</style>
        </div>
    );
}

const styles = {
    pageContainer: {
        position: 'relative',
        background: '#ffffff',
        overflow: 'hidden',
        fontFamily: "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },

    backgroundGrid: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, #f0fdf4 0%, #ffffff 100%)',
        zIndex: -1,
        display: 'grid',
        gridTemplateColumns: 'repeat(20, 1fr)',
        gap: '1px',
        opacity: 0.4
    },

    gridLine: {
        background: 'linear-gradient(180deg, transparent 0%, #10b98120 50%, transparent 100%)',
        animation: 'pulse 3s ease-in-out infinite',
        height: '100%'
    },

    // Navigation
    nav: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(16, 185, 129, 0.1)',
        zIndex: 1000,
        padding: '1rem 0'
    },

    navContainer: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#065f46'
    },

    logoIcon: {
        color: '#10b981',
        fontSize: '1.75rem'
    },

    logoText: {
        background: 'linear-gradient(135deg, #065f46, #10b981)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },

    navLinks: {
        display: 'flex',
        alignItems: 'center',
        gap: '2.5rem'
    },

    navLink: {
        color: '#374151',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: '500',
        transition: 'color 0.3s',
        position: 'relative'
    },

    navLoginBtn: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white',
        padding: '0.625rem 1.5rem',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: '600',
        transition: 'all 0.3s',
        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
    },

    // Hero Section
    hero: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingTop: '80px'
    },

    heroContent: {
        textAlign: 'center',
        maxWidth: '900px',
        padding: '0 2rem',
        zIndex: 1
    },

    heroLabel: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'linear-gradient(135deg, #10b98115, #10b98130)',
        border: '1px solid #10b98140',
        padding: '0.5rem 1.25rem',
        borderRadius: '50px',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#065f46',
        letterSpacing: '0.1em',
        marginBottom: '2rem',
        textTransform: 'uppercase'
    },

    heroLabelIcon: {
        color: '#10b981',
        fontSize: '0.875rem'
    },

    heroTitle: {
        fontSize: 'clamp(2.5rem, 7vw, 5rem)',
        fontWeight: '800',
        lineHeight: '1.1',
        marginBottom: '1.5rem',
        color: '#0f172a',
        letterSpacing: '-0.02em'
    },

    heroTitleAccent: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        display: 'inline-block'
    },

    heroSubtitle: {
        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
        color: '#64748b',
        lineHeight: '1.7',
        marginBottom: '3rem',
        fontWeight: '400'
    },

    heroCTA: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '4rem'
    },

    primaryButton: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white',
        padding: '1rem 2.5rem',
        borderRadius: '12px',
        textDecoration: 'none',
        fontSize: '1.05rem',
        fontWeight: '600',
        transition: 'all 0.3s',
        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        border: 'none'
    },

    secondaryButton: {
        background: 'white',
        color: '#065f46',
        padding: '1rem 2.5rem',
        borderRadius: '12px',
        textDecoration: 'none',
        fontSize: '1.05rem',
        fontWeight: '600',
        transition: 'all 0.3s',
        border: '2px solid #10b981',
        display: 'inline-flex',
        alignItems: 'center'
    },

    buttonArrow: {
        fontSize: '1.25rem',
        transition: 'transform 0.3s'
    },

    statsPreview: {
        display: 'flex',
        justifyContent: 'center',
        gap: '3rem',
        marginTop: '3rem',
        flexWrap: 'wrap'
    },

    statItem: {
        textAlign: 'center'
    },

    statNumber: {
        fontSize: '2.5rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #065f46, #10b981)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },

    statLabel: {
        fontSize: '0.875rem',
        color: '#64748b',
        fontWeight: '500',
        marginTop: '0.25rem'
    },

    statDivider: {
        width: '1px',
        background: 'linear-gradient(180deg, transparent, #10b98130, transparent)',
        height: '60px'
    },

    floatingElement1: {
        position: 'absolute',
        top: '20%',
        right: '10%',
        animation: 'float 6s ease-in-out infinite',
        opacity: 0.15
    },

    floatingElement2: {
        position: 'absolute',
        bottom: '30%',
        left: '8%',
        animation: 'float 8s ease-in-out infinite',
        animationDelay: '1s',
        opacity: 0.12
    },

    floatingIcon: {
        fontSize: '8rem',
        color: '#10b981'
    },

    // Features Section
    featuresSection: {
        padding: '8rem 0',
        background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
        position: 'relative'
    },

    sectionContainer: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem'
    },

    sectionHeader: {
        textAlign: 'center',
        marginBottom: '5rem'
    },

    sectionTitle: {
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: '1rem',
        letterSpacing: '-0.02em'
    },

    sectionSubtitle: {
        fontSize: '1.25rem',
        color: '#64748b',
        fontWeight: '400'
    },

    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem'
    },

    featureCard: {
        background: 'white',
        padding: '2.5rem',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeInUp 0.8s ease-out forwards',
        opacity: 0,
        border: '1px solid rgba(16, 185, 129, 0.1)'
    },

    featureIconWrapper: {
        width: '80px',
        height: '80px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem'
    },

    featureIcon: {
        fontSize: '2rem'
    },

    featureTitle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '1rem'
    },

    featureDescription: {
        color: '#64748b',
        lineHeight: '1.7',
        fontSize: '1rem'
    },

    featureAccent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '4px',
        borderRadius: '0 0 20px 20px'
    },

    // How It Works Section
    howSection: {
        padding: '8rem 0',
        background: 'white'
    },

    stepsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem',
        marginTop: '4rem'
    },

    stepCard: {
        textAlign: 'center',
        position: 'relative'
    },

    stepNumber: {
        fontSize: '5rem',
        fontWeight: '900',
        background: 'linear-gradient(135deg, #10b98120, #10b98140)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '1rem'
    },

    stepContent: {
        marginTop: '1rem'
    },

    stepTitle: {
        fontSize: '1.75rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '0.75rem'
    },

    stepDesc: {
        color: '#64748b',
        fontSize: '1.1rem',
        lineHeight: '1.6'
    },

    // CTA Section
    ctaSection: {
        padding: '8rem 2rem',
        background: 'linear-gradient(135deg, #065f46, #10b981)',
        position: 'relative',
        overflow: 'hidden'
    },

    ctaContent: {
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
    },

    ctaTitle: {
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: '800',
        color: 'white',
        marginBottom: '1rem',
        letterSpacing: '-0.02em'
    },

    ctaSubtitle: {
        fontSize: '1.25rem',
        color: 'rgba(255,255,255,0.9)',
        marginBottom: '3rem'
    },

    ctaButton: {
        background: 'white',
        color: '#065f46',
        padding: '1.25rem 3rem',
        borderRadius: '12px',
        textDecoration: 'none',
        fontSize: '1.125rem',
        fontWeight: '700',
        transition: 'all 0.3s',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
    },

    // Footer
    footer: {
        background: '#0f172a',
        color: 'white',
        padding: '4rem 0 2rem'
    },

    footerContent: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem',
        marginBottom: '3rem'
    },

    footerBrand: {
        gridColumn: 'span 1'
    },

    footerLogo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '1.5rem',
        fontWeight: '700',
        marginBottom: '1rem'
    },

    footerLogoIcon: {
        color: '#10b981',
        fontSize: '1.75rem'
    },

    footerLogoText: {
        color: 'white'
    },

    footerTagline: {
        color: '#94a3b8',
        fontSize: '0.95rem'
    },

    footerLinks: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem',
        gridColumn: 'span 2'
    },

    footerColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    },

    footerColumnTitle: {
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '0.5rem',
        color: 'white'
    },

    footerLink: {
        color: '#94a3b8',
        textDecoration: 'none',
        fontSize: '0.9rem',
        transition: 'color 0.3s'
    },

    footerBottom: {
        borderTop: '1px solid rgba(148, 163, 184, 0.2)',
        paddingTop: '2rem',
        textAlign: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem 2rem 0'
    },

    copyright: {
        color: '#64748b',
        fontSize: '0.9rem',
        margin: 0
    }
};

const keyframesCSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

@keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
}

@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

a:hover .buttonArrow {
    transform: translateX(5px);
}

.navLink:hover::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #10b981, #059669);
    border-radius: 2px;
}

.primaryButton:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(16, 185, 129, 0.5);
}

.secondaryButton:hover {
    background: #f0fdf4;
}

.navLoginBtn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.footerLink:hover {
    color: #10b981;
}

.ctaButton:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.3);
}

@media (max-width: 768px) {
    .navLinks {
        gap: 1rem;
    }
    
    .navLink {
        display: none;
    }
    
    .featuresGrid {
        grid-template-columns: 1fr;
    }
    
    .footerLinks {
        grid-template-columns: 1fr;
        grid-column: span 1;
    }
    
    .statsPreview {
        gap: 1.5rem;
    }
}
`;

export default LandingPage;