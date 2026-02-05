import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50/30 pt-40 pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24 animate-fade-in-up">
          <span className="text-sm font-medium tracking-widest text-slate-600 uppercase mb-4 block">Get in Touch</span>
          <h1 className="text-5xl md:text-6xl font-light text-slate-800 mb-6 tracking-tight">
            Contact <span className="font-semibold">Us</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            Have questions? We'd love to hear from you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {[
            { icon: <FaEnvelope />, title: 'Email', detail: 'hello@exploreislands.com', color: 'slate' },
            { icon: <FaPhone />, title: 'Phone', detail: '+91 98765 43210', color: 'slate' },
            { icon: <FaMapMarkerAlt />, title: 'Location', detail: 'Mumbai, India', color: 'slate' }
          ].map((item, index) => (
            <div
              key={item.title}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="relative p-10 text-center group transition-all duration-500 animate-fade-in-up overflow-hidden bg-white/70 backdrop-blur-sm rounded-3xl border border-white/80 hover:shadow-2xl hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center group-hover:from-slate-700 group-hover:to-slate-900 transition-all duration-500 shadow-lg">
                  <div className="text-3xl text-slate-700 group-hover:text-white transition-colors duration-500">
                    {item.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-xl mb-3 text-slate-800">{item.title}</h3>
                <p className="text-slate-600 font-light text-lg">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-12 md:p-16 animate-fade-in-up-delayed border border-white/80">
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-slate-50"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-slate-50"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-slate-50"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows="6"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-slate-50 resize-none"
                placeholder="Tell us more about your query..."
              ></textarea>
            </div>

            <button type="submit" className="w-full btn-primary flex items-center justify-center gap-3 group">
              Send Message
              <FaPaperPlane className="text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
