import React, { useState, useEffect } from 'react';
import { FaWind, FaMapMarkerAlt, FaTint } from 'react-icons/fa';

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    const SIMULATION_MODE = false;
    const API_KEY = '19396910a79ddae19f6bac8067a48b03';
    const CITY = 'Colombo';

    useEffect(() => {
        const fetchWeather = async () => {
            if (SIMULATION_MODE) {
                setTimeout(() => {
                    setWeather({
                        name: 'Colombo',
                        main: { temp: 31, temp_max: 33, temp_min: 29, humidity: 78 },
                        weather: [{ description: 'scattered clouds', icon: '03d' }],
                        wind: { speed: 4.1 }
                    });
                    setLoading(false);
                }, 500);
                return;
            }
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}`
                );
                if (!response.ok) throw new Error("Failed to fetch");
                const data = await response.json();
                setWeather(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching weather:", error);
                setLoading(false);
            }
        };
        fetchWeather();
    }, []);

    if (loading) return (
        <div style={styles.skeleton}>
            <div style={styles.skeletonPulse} />
        </div>
    );

    if (!weather || !weather.main) return (
        <div style={styles.errorCard}>
            <span style={styles.errorText}>Weather unavailable</span>
        </div>
    );

    const iconUrl = `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    const description = weather.weather[0].description;

    return (
        <>
            <style>{`
                @keyframes ww-shimmer {
                    0% { background-position: -200px 0; }
                    100% { background-position: calc(200px + 100%) 0; }
                }
                .ww-card {
                    background: linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 60%, #3d7a55 100%);
                    border: 1px solid rgba(168,213,181,0.25);
                    border-radius: 14px;
                    padding: 14px 18px;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    box-shadow: 0 4px 20px rgba(26,58,42,0.22);
                    min-width: 240px;
                    position: relative;
                    overflow: hidden;
                }
                .ww-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.12) 0%, transparent 60%);
                    pointer-events: none;
                }
                .ww-left { flex: 1; position: relative; z-index: 1; }
                .ww-city {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: rgba(168,213,181,0.7);
                    margin-bottom: 6px;
                }
                .ww-temp-row {
                    display: flex;
                    align-items: baseline;
                    gap: 10px;
                }
                .ww-temp {
                    font-family: 'Playfair Display', serif;
                    font-size: 32px;
                    font-weight: 700;
                    color: #fdfaf5;
                    line-height: 1;
                    letter-spacing: -1px;
                }
                .ww-desc {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 12px;
                    font-weight: 300;
                    color: rgba(245,240,232,0.7);
                    text-transform: capitalize;
                    margin-top: 4px;
                }
                .ww-hl {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 11px;
                    color: rgba(168,213,181,0.65);
                    margin-top: 2px;
                    font-weight: 400;
                }
                .ww-right {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    position: relative;
                    z-index: 1;
                }
                .ww-icon {
                    width: 44px; height: 44px;
                    filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3));
                }
                .ww-stats {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                    align-items: center;
                }
                .ww-stat {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 10.5px;
                    color: rgba(168,213,181,0.7);
                    font-weight: 400;
                }
            `}</style>

            <div className="ww-card">
                <div className="ww-left">
                    <div className="ww-city">
                        <FaMapMarkerAlt size={9} />
                        {weather.name}
                    </div>
                    <div className="ww-temp-row">
                        <div className="ww-temp">{Math.round(weather.main.temp)}°</div>
                    </div>
                    <div className="ww-desc">{description}</div>
                    <div className="ww-hl">
                        H: {Math.round(weather.main.temp_max)}° · L: {Math.round(weather.main.temp_min)}°
                    </div>
                </div>
                <div className="ww-right">
                    <img src={iconUrl} alt="weather" className="ww-icon" />
                    <div className="ww-stats">
                        <div className="ww-stat"><FaWind size={9} />{weather.wind.speed} m/s</div>
                        <div className="ww-stat"><FaTint size={9} />{weather.main.humidity}%</div>
                    </div>
                </div>
            </div>
        </>
    );
};

const styles = {
    skeleton: {
        width: 240,
        height: 80,
        borderRadius: 14,
        overflow: 'hidden',
        background: 'rgba(168,213,181,0.1)',
        border: '1px solid rgba(168,213,181,0.2)',
    },
    skeletonPulse: {
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, rgba(168,213,181,0.05) 25%, rgba(168,213,181,0.15) 50%, rgba(168,213,181,0.05) 75%)',
        backgroundSize: '400px 100%',
        animation: 'ww-shimmer 1.4s ease infinite',
    },
    errorCard: {
        padding: '12px 18px',
        background: 'rgba(168,213,181,0.08)',
        border: '1px solid rgba(168,213,181,0.2)',
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
    },
    errorText: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        color: '#9ab5a5',
    }
};

export default WeatherWidget;