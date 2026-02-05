import { Link } from 'react-router-dom';

const FeatureCard = ({ icon, title, description, link, color = 'ocean' }) => {
  const colorClasses = {
    ocean: 'bg-ocean-50 text-ocean-700 border-ocean-200 hover:border-ocean-400',
    sand: 'bg-sand-50 text-sand-700 border-sand-200 hover:border-sand-400',
    green: 'bg-green-50 text-green-700 border-green-200 hover:border-green-400',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400',
    red: 'bg-red-50 text-red-700 border-red-200 hover:border-red-400',
  };

  const CardContent = () => (
    <div className={`border-2 rounded-xl p-6 transition-all duration-300 h-full ${colorClasses[color]}`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  );

  if (link) {
    return (
      <Link to={link} className="block h-full">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default FeatureCard;
