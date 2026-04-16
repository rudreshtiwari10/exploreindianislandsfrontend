import { useEffect, useState } from 'react';
import {
  FaSun, FaCloudSun, FaCloud, FaCloudRain, FaCloudShowersHeavy,
  FaBolt, FaSnowflake, FaSmog, FaWind, FaTint, FaTemperatureHigh, FaSpinner,
} from 'react-icons/fa';

// WMO weather interpretation — https://open-meteo.com/en/docs
const codeMeta = (code) => {
  if (code === 0) return { label: 'Clear sky', icon: <FaSun />, gradient: 'from-amber-400 via-orange-400 to-rose-500', tint: 'rgba(251,191,36,0.35)' };
  if ([1].includes(code)) return { label: 'Mainly clear', icon: <FaSun />, gradient: 'from-amber-400 via-orange-400 to-rose-500', tint: 'rgba(251,191,36,0.3)' };
  if ([2].includes(code)) return { label: 'Partly cloudy', icon: <FaCloudSun />, gradient: 'from-sky-400 via-blue-400 to-indigo-500', tint: 'rgba(96,165,250,0.35)' };
  if ([3].includes(code)) return { label: 'Overcast', icon: <FaCloud />, gradient: 'from-slate-400 via-slate-500 to-slate-700', tint: 'rgba(148,163,184,0.35)' };
  if ([45, 48].includes(code)) return { label: 'Foggy', icon: <FaSmog />, gradient: 'from-slate-300 via-slate-400 to-slate-600', tint: 'rgba(148,163,184,0.35)' };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Drizzle', icon: <FaCloudRain />, gradient: 'from-sky-500 via-blue-500 to-indigo-600', tint: 'rgba(59,130,246,0.35)' };
  if ([61, 63, 80, 81].includes(code)) return { label: 'Rain showers', icon: <FaCloudRain />, gradient: 'from-sky-600 via-blue-600 to-indigo-700', tint: 'rgba(59,130,246,0.4)' };
  if ([65, 82].includes(code)) return { label: 'Heavy rain', icon: <FaCloudShowersHeavy />, gradient: 'from-blue-700 via-indigo-700 to-slate-800', tint: 'rgba(30,64,175,0.45)' };
  if ([66, 67].includes(code)) return { label: 'Freezing rain', icon: <FaCloudShowersHeavy />, gradient: 'from-cyan-500 via-blue-600 to-indigo-700', tint: 'rgba(14,165,233,0.4)' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: 'Snow', icon: <FaSnowflake />, gradient: 'from-slate-200 via-sky-300 to-blue-400', tint: 'rgba(186,230,253,0.5)' };
  if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm', icon: <FaBolt />, gradient: 'from-purple-700 via-indigo-800 to-slate-900', tint: 'rgba(126,34,206,0.45)' };
  return { label: 'Unknown', icon: <FaCloud />, gradient: 'from-slate-400 to-slate-600', tint: 'rgba(148,163,184,0.35)' };
};

const dayLabel = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { weekday: 'short' });
};

const WeatherCard = ({ lat, lng, islandName }) => {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (lat == null || lng == null) return;
    setData(null);
    setErr(null);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Weather API error')))
      .then(json => setData(json))
      .catch(e => setErr(e.message));
  }, [lat, lng]);

  if (lat == null || lng == null) return null;

  if (err) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-500 text-sm">
        Weather temporarily unavailable for {islandName}.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 p-6 flex items-center gap-3 text-slate-500">
        <FaSpinner className="animate-spin" /> Fetching live weather for {islandName}...
      </div>
    );
  }

  const c = data.current;
  const meta = codeMeta(c.weather_code);
  const daily = data.daily;

  return (
    <div className={`relative overflow-hidden rounded-3xl text-white shadow-xl bg-gradient-to-br ${meta.gradient}`}>
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${meta.tint} 0%, transparent 70%)` }} />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${meta.tint} 0%, transparent 70%)` }} />

      <div className="relative p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-white/70 uppercase">Live Weather</p>
            <h3 className="text-2xl md:text-3xl font-light mt-1">{islandName}</h3>
          </div>
          <div className="text-5xl md:text-6xl text-white/90 drop-shadow-lg">
            {meta.icon}
          </div>
        </div>

        {/* Current temp */}
        <div className="mt-6 flex items-end gap-3">
          <span className="text-6xl md:text-7xl font-light leading-none">
            {Math.round(c.temperature_2m)}°
          </span>
          <div className="pb-2">
            <p className="text-lg md:text-xl font-medium">{meta.label}</p>
            <p className="text-sm text-white/70">Feels like {Math.round(c.apparent_temperature)}°C</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 p-4">
            <div className="flex items-center gap-2 text-xs text-white/70 uppercase tracking-wider">
              <FaTint /> Humidity
            </div>
            <p className="text-xl font-semibold mt-1">{c.relative_humidity_2m}%</p>
          </div>
          <div className="rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 p-4">
            <div className="flex items-center gap-2 text-xs text-white/70 uppercase tracking-wider">
              <FaWind /> Wind
            </div>
            <p className="text-xl font-semibold mt-1">{Math.round(c.wind_speed_10m)} <span className="text-xs font-normal">km/h</span></p>
          </div>
          <div className="rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 p-4">
            <div className="flex items-center gap-2 text-xs text-white/70 uppercase tracking-wider">
              <FaTemperatureHigh /> Today
            </div>
            <p className="text-xl font-semibold mt-1">
              {Math.round(daily.temperature_2m_max[0])}° <span className="text-white/60">/ {Math.round(daily.temperature_2m_min[0])}°</span>
            </p>
          </div>
        </div>

        {/* 5-day strip */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <p className="text-xs font-semibold tracking-[0.2em] text-white/70 uppercase mb-3">5-Day Forecast</p>
          <div className="grid grid-cols-5 gap-2">
            {daily.time.slice(0, 5).map((iso, i) => {
              const dmeta = codeMeta(daily.weather_code[i]);
              return (
                <div key={iso} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3 text-center">
                  <p className="text-xs text-white/70 font-medium">{i === 0 ? 'Today' : dayLabel(iso)}</p>
                  <div className="text-2xl my-2 flex justify-center text-white/90">{dmeta.icon}</div>
                  <p className="text-sm font-semibold">{Math.round(daily.temperature_2m_max[i])}°</p>
                  <p className="text-xs text-white/60">{Math.round(daily.temperature_2m_min[i])}°</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
