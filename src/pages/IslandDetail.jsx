import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { islandsAPI } from '../api/islands';
import ImageGallery from '../components/ImageGallery';
import FeatureCard from '../components/FeatureCard';
import {
  FaSpinner,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaLeaf,
  FaHotel,
  FaUtensils,
  FaLandmark,
  FaHiking,
  FaUmbrellaBeach,
  FaExternalLinkAlt,
  FaShieldAlt,
  FaUsers,
} from 'react-icons/fa';

const IslandDetail = () => {
  const { id } = useParams();
  const [island, setIsland] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIsland = async () => {
      try {
        setLoading(true);
        const response = await islandsAPI.getIslandById(id);
        setIsland(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load island details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIsland();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center pt-32">
        <FaSpinner className="animate-spin text-ocean-600 text-5xl" />
      </div>
    );
  }

  if (error || !island) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center pt-32">
        <p className="text-red-600 text-2xl mb-4">{error || 'Island not found'}</p>
        <Link to="/islands" className="btn-primary">
          Back to Islands
        </Link>
      </div>
    );
  }

  const features = [
    {
      icon: <FaHotel />,
      title: 'Hotels',
      description: 'Find the best accommodations',
      link: `/island/${id}/hotels`,
      color: 'ocean',
    },
    {
      icon: <FaUtensils />,
      title: 'Restaurants',
      description: 'Discover local cuisine',
      link: `/island/${id}/restaurants`,
      color: 'sand',
    },
    {
      icon: <FaLandmark />,
      title: 'Temples',
      description: 'Explore spiritual sites',
      link: `/island/${id}/temples`,
      color: 'purple',
    },
    {
      icon: <FaHiking />,
      title: 'Things to Do',
      description: 'Activities and adventures',
      link: `/island/${id}/activities`,
      color: 'green',
    },
    {
      icon: <FaUmbrellaBeach />,
      title: 'Beaches',
      description: 'Pristine coastal areas',
      link: `/island/${id}/beaches`,
      color: 'ocean',
    },
    {
      icon: <FaUtensils />,
      title: 'Cuisines',
      description: 'Local food specialties',
      link: `/island/${id}/cuisines`,
      color: 'red',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/islands"
          className="inline-flex items-center gap-2 text-ocean-600 hover:text-ocean-700 mb-6 font-medium"
        >
          ← Back to Islands
        </Link>

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {island.name}
              </h1>
              {island.nativeName && (
                <p className="text-xl text-gray-500 italic mb-4">{island.nativeName}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <FaMapMarkerAlt className="text-ocean-600" />
                  <span className="font-medium">{island.location?.group}</span>
                </div>

                {island.location?.area && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-medium">Area: {island.location.area}</span>
                  </div>
                )}
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {island.status?.isInhabited && (
                  <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <FaUsers /> Inhabited
                  </span>
                )}
                {island.status?.isProtectedArea && (
                  <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    <FaShieldAlt /> Protected Area
                  </span>
                )}
                {island.status?.permitRequired !== 'None' && (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    Permit Required: {island.status.permitRequired}
                  </span>
                )}
              </div>
            </div>

            {/* Best Time to Visit */}
            {island.bestTimeToVisit && (
              <div className="bg-sand-50 rounded-lg p-4 border-2 border-sand-200">
                <div className="flex items-center gap-2 text-sand-700 mb-2">
                  <FaCalendarAlt />
                  <h3 className="font-semibold">Best Time to Visit</h3>
                </div>
                <p className="text-sm text-gray-700">
                  {island.bestTimeToVisit.startMonth} - {island.bestTimeToVisit.endMonth}
                </p>
                {island.bestTimeToVisit.peakSeason && (
                  <p className="text-xs text-gray-600 mt-1">
                    Peak: {island.bestTimeToVisit.peakSeason}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Vibe Tags */}
          {island.vibeTags && island.vibeTags.length > 0 && (
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                {island.vibeTags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 bg-ocean-50 text-ocean-700 px-3 py-2 rounded-full text-sm font-medium"
                  >
                    <FaLeaf size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Photo Gallery */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Photo Gallery</h2>
          <ImageGallery images={island.images || []} />
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About {island.name}</h2>

          {island.description?.summary && (
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {island.description.summary}
            </p>
          )}

          {island.description?.history && (
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">History</h3>
              <p className="text-gray-700 leading-relaxed">{island.description.history}</p>
            </div>
          )}

          {island.description?.floraAndFauna && island.description.floraAndFauna.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Flora & Fauna</h3>
              <ul className="list-disc list-inside space-y-2">
                {island.description.floraAndFauna.map((item, index) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Culinary Highlights */}
        {island.culinaryHighlights && island.culinaryHighlights.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Culinary Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {island.culinaryHighlights.map((dish, index) => (
                <div key={index} className="border-l-4 border-sand-500 pl-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{dish.dishName}</h3>
                  <p className="text-gray-700">{dish.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feature Cards */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Explore More</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* External Links */}
        {(island.externalLinks?.wikiUrl || island.externalLinks?.govtPortal) && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">External Resources</h2>
            <div className="flex flex-wrap gap-4">
              {island.externalLinks.wikiUrl && (
                <a
                  href={island.externalLinks.wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-ocean-600 hover:text-ocean-700 font-medium"
                >
                  <FaExternalLinkAlt />
                  Wikipedia
                </a>
              )}
              {island.externalLinks.govtPortal && (
                <a
                  href={island.externalLinks.govtPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-ocean-600 hover:text-ocean-700 font-medium"
                >
                  <FaExternalLinkAlt />
                  Government Portal
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IslandDetail;
