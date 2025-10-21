import React from "react";

const StatsSection = () => {
  const stats = [
    {
      value: '45M+',
      label: 'Customer Calls',
      description: 'Proven voice AI performance across real, high-volume phone operations.',
    },
    {
      value: '4M+',
      label: 'Hours Saved',
      description: 'Less time on manual calls. More time for growth, sales, and support.',
    },
    {
      value: '+35%',
      label: 'Answered Calls',
      description: 'Voice agents respond instantly — no hold music, no missed opportunities.',
    },
    {
      value: '99.9%',
      label: 'Uptime',
      description: 'AI voice agents your business can rely on, every minute of every day.',
    },
  ];

  return (
    <section className="flex justify-center p-10 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-md text-center
                       transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            style={{ minHeight: '240px' }} // Ensure consistent card height
          >
            <h2 className="text-5xl font-bold text-primary-600 mb-3">
              {stat.value}
            </h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {stat.label}
            </h3>
            <p className="text-gray-600 text-base leading-relaxed">
              {stat.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;