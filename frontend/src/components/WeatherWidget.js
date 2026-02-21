import React, { useState, useEffect } from 'react';
import { FaWind, FaMapMarkerAlt, FaTint } from 'react-icons/fa';

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ SET THIS TO TRUE TO FORCE IT TO WORK IMMEDIATELY
    const SIMULATION_MODE = false;

    const API_KEY = '19396910a79ddae19f6bac8067a48b03'; // Replace this later for the real viva!
    const CITY = 'Colombo';

    useEffect(() => {
        const fetchWeather = async () => {
            if (SIMULATION_MODE) {
                // 🟢 Fake data for immediate screenshot satisfaction
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

    if (loading) return <div className="text-muted small">Loading...</div>;

    // Fallback if real fetch fails and simulation is off
    if (!weather || !weather.main) return (
        <div className="card shadow-sm border-0 text-white" style={{ background: '#6c757d' }}>
            <div className="card-body p-3 text-center">
                <small>Weather API Key Missing</small>
            </div>
        </div>
    );

    // Dynamic icon URL (or fallback for simulation)
    const iconUrl = `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`;

    return (
        <div className="card shadow-sm border-0 text-white"
             style={{ background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)' }}>
            <div className="card-body p-3 d-flex align-items-center justify-content-between">
                <div>
                    <h6 className="mb-0 fw-bold text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
                        <FaMapMarkerAlt className="me-2" size={12}/>
                        {weather.name}
                    </h6>
                    <div className="d-flex align-items-center mt-2">
                        <h2 className="mb-0 fw-bold display-6">{Math.round(weather.main.temp)}°</h2>
                        <div className="ms-3 lh-1" style={{ fontSize: '0.9rem' }}>
                            <div className="text-capitalize opacity-75">{weather.weather[0].description}</div>
                            <div className="fw-bold mt-1 opacity-100">
                                H: {Math.round(weather.main.temp_max)}° L: {Math.round(weather.main.temp_min)}°
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <img src={iconUrl} alt="Weather" style={{ width: '50px', height: '50px', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))' }} />
                    <div className="small opacity-90 mt-0" style={{ fontSize: '0.8rem' }}>
                        <span className="me-2"><FaWind className="me-1"/>{weather.wind.speed}m/s</span>
                        <span><FaTint className="me-1"/>{weather.main.humidity}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;