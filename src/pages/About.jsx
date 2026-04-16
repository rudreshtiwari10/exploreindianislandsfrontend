import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSearch, FaCamera, FaRobot, FaMapMarkedAlt, FaUtensils, FaShieldAlt,
  FaFileDownload, FaCompass, FaHeart, FaQuoteLeft, FaLinkedinIn, FaGithub, FaTwitter, FaUser,
} from 'react-icons/fa';

const team = [
  {
    name: 'Rudresh Tiwari',
    role: 'Co-Creator',
    bio: 'Contributed across design, development and content for Explore Indian Islands. Passionate about making travel information accessible to everyone.',
    image: '/team/rudresh.jpg',
    socials: { linkedin: 'https://www.linkedin.com/in/rudresh-tiwari-99bb57297/', github: 'https://github.com/rudreshtiwari10', twitter: '#' },
  },
  {
    name: 'Ritesh Kumar Mishra',
    role: 'Co-Creator',
    bio: 'Worked on building, refining and shaping Explore Indian Islands end-to-end. Believes good products are built by collaboration, not specialization.',
    image: '/team/ritesh.jpeg',
    socials: { linkedin: 'https://www.linkedin.com/in/ritesh-kumar-mishra-a7b8b3249/', github: 'https://github.com/Ritesh-mishraa', twitter: '#' },
  },
  {
    name: 'Disha Gupta',
    role: 'Co-Creator',
    bio: 'Helped bring Explore Indian Islands to life through hands-on contributions to its design, features and overall user experience.',
    image: '/team/disha.jpg',
    socials: { linkedin: 'https://www.linkedin.com/in/disha-gupta-70314a24b/', github: '#', twitter: '#' },
  },
  {
    name: 'Jaya Gupta',
    role: 'Co-Creator',
    bio: 'Played a key role in building Explore Indian Islands from the ground up, contributing to its vision, structure and execution.',
    image: '/team/jaya.jpeg',
    socials: { linkedin: 'https://www.linkedin.com/in/jaya-gupta-054265370/', github: '#', twitter: '#' },
  },
];

const features = [
  {
    icon: <FaSearch />,
    title: 'Discover 1000+ Islands',
    text: 'From the well-known Andamans and Lakshadweep to hidden river islands and untouched coral atolls — search any island and dive into rich, accurate information.',
  },
  {
    icon: <FaCamera />,
    title: 'Live Community Gallery',
    text: 'Travelers share photos from their visits, tagged to specific islands. Every post enriches that island\'s public gallery for the next explorer.',
  },
  {
    icon: <FaRobot />,
    title: 'AI Trip Planner',
    text: 'A smart assistant that designs your entire journey — transport, stay, food, activities, day-by-day itinerary and a full budget — uniquely curated for you.',
  },
  {
    icon: <FaCompass />,
    title: 'Explore Together',
    text: 'Follow other travelers, like and comment on their moments, and build your own travel story across India\'s archipelagos.',
  },
];

const plannerFeatures = [
  { icon: <FaMapMarkedAlt />, label: 'Day-by-day itinerary' },
  { icon: <FaUtensils />, label: 'Local cuisine to try' },
  { icon: <FaCompass />, label: 'Top attractions & hidden gems' },
  { icon: <FaShieldAlt />, label: 'Safety tips & emergency contacts' },
  { icon: <FaFileDownload />, label: 'Downloadable PDF for offline use' },
];

const TeamCard = ({ member: m }) => {
  const [imgOk, setImgOk] = useState(!!m.image);
  return (
    <div className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="relative aspect-[4/5] bg-gradient-to-br from-emerald-100 via-teal-50 to-blue-100 overflow-hidden">
        {imgOk ? (
          <img
            src={m.image}
            alt={m.name}
            className="w-full h-full object-cover"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-white/60 backdrop-blur-sm border border-white shadow-inner flex items-center justify-center text-emerald-600">
              <FaUser className="text-3xl" />
            </div>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      <div className="px-6 pb-6 pt-5 text-center">
        <h3 className="text-lg font-semibold text-slate-800">{m.name}</h3>
        <p className="text-xs font-medium tracking-wider text-emerald-700 uppercase mt-1">{m.role}</p>
        <p className="text-sm text-slate-500 font-light leading-relaxed mt-3">{m.bio}</p>

        <div className="flex items-center justify-center gap-2 mt-5">
          {[
            { icon: <FaLinkedinIn />, href: m.socials.linkedin },
            { icon: <FaGithub />, href: m.socials.github },
            { icon: <FaTwitter />, href: m.socials.twitter },
          ].map((s, k) => (
            <a
              key={k}
              href={s.href}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-500 flex items-center justify-center text-xs transition"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-24 px-4">
        {/* Background Layer */}
        <div
          className="absolute inset-0 z-0"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0d3b2e 50%, #1a1a3e 100%)' }}
        />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full z-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] rounded-full z-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)' }} />

        {/* Content Layer */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold tracking-[0.3em] text-emerald-300 uppercase mb-4 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20">
            About Us
          </span>
          <h1 className="text-5xl md:text-7xl font-light text-white tracking-tight leading-tight">
            Explore <span className="font-semibold italic bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent">Indian</span> Islands
          </h1>
          <p className="text-lg md:text-xl text-white/70 font-light max-w-3xl mx-auto mt-6 leading-relaxed">
            A digital home for one of India's most beautiful — and least talked about — treasures: its islands.
          </p>
          <div className="mt-10 max-w-2xl mx-auto">
            <FaQuoteLeft className="text-emerald-400/60 text-2xl mx-auto mb-4" />
            <p className="text-xl md:text-2xl text-white/85 italic font-light leading-snug">
              "Explore Indian Islands"
            </p>
            <p className="text-sm text-white/50 mt-3 tracking-wider uppercase">
              Government of India's call to celebrate island tourism
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold tracking-[0.3em] text-emerald-700 uppercase">Our Mission</span>
          <h2 className="text-4xl md:text-5xl font-light text-slate-800 mt-3 mb-6">
            Putting India's islands <span className="font-semibold">on the map</span>
          </h2>
          <p className="text-lg text-slate-600 font-light leading-relaxed">
            Inspired by the Government of India's <span className="font-semibold text-emerald-700">"Explore Indian Islands"</span> initiative —
            a national call to boost and promote island tourism — we built this platform to make every Indian island, big or small,
            discoverable to travelers across the world.
          </p>
          <p className="text-lg text-slate-600 font-light leading-relaxed mt-5">
            India has more than <span className="font-semibold text-slate-800">1300 islands</span> spread across the Bay of Bengal,
            the Arabian Sea, and the great river deltas. Most travelers know only a handful. We're changing that — one island at a time.
          </p>
        </div>
      </section>

      {/* What you can do */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-[0.3em] text-emerald-700 uppercase">What You Can Do</span>
            <h2 className="text-4xl md:text-5xl font-light text-slate-800 mt-3">
              Everything you need to <span className="font-semibold">plan & explore</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xl flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-600 font-light leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Planner spotlight */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-900 via-emerald-950 to-blue-950 text-white relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold tracking-[0.3em] text-emerald-300 uppercase">Powered by AI</span>
              <h2 className="text-4xl md:text-5xl font-light mt-3 leading-tight">
                Your entire trip, <br />
                <span className="font-semibold italic bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent">
                  planned in seconds
                </span>
              </h2>
              <p className="text-white/70 font-light leading-relaxed mt-6 text-lg">
                Tell our AI where you want to go, when, and what kind of trip you want — and it will design every single detail
                for you, uniquely curated to your style and budget.
              </p>
              <p className="text-white/60 font-light leading-relaxed mt-4">
                From the moment you leave home to the moment you return, the planner takes care of transport, accommodation,
                stays, activities, food recommendations, and a day-by-day itinerary. It even shares safety tips, things to
                watch out for, and emergency contacts for that location — and you can download it as a PDF to carry through your trip.
              </p>
              <Link
                to="/plan-trip"
                className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-900 font-semibold shadow-xl shadow-emerald-500/30 hover:scale-105 transition"
              >
                <FaRobot /> Try the Planner
              </Link>
            </div>

            <div className="space-y-3">
              {plannerFeatures.map((p, i) => (
                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-emerald-400/30 transition">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                    {p.icon}
                  </div>
                  <p className="text-white/90 font-medium">{p.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-[0.3em] text-emerald-700 uppercase">Our Team</span>
            <h2 className="text-4xl md:text-5xl font-light text-slate-800 mt-3">
              Meet the people <span className="font-semibold">behind it</span>
            </h2>
            <p className="text-slate-500 font-light mt-4 max-w-xl mx-auto">
              Explore Indian Islands is built and maintained by a team of four co-creators who contribute equally to the project.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {team.map((m, i) => (
              <TeamCard key={i} member={m} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-emerald-50 via-white to-blue-50 rounded-3xl border border-emerald-100 p-12 md:p-16 shadow-sm">
          <FaHeart className="text-3xl text-rose-500 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-light text-slate-800">
            Start exploring <span className="font-semibold">today</span>
          </h2>
          <p className="text-slate-500 font-light mt-4 max-w-xl mx-auto">
            Pick an island, plan your trip, share your story. India's archipelagos are waiting.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/islands"
              className="px-7 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:scale-105 transition"
            >
              Browse Islands
            </Link>
            <Link
              to="/plan-trip"
              className="px-7 py-3 rounded-full bg-white text-slate-800 font-semibold border border-slate-200 hover:border-slate-400 hover:scale-105 transition"
            >
              Plan a Trip
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
