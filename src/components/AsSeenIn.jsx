import React from 'react';
import { Newspaper, Award, Users } from 'lucide-react';

const AsSeenIn = () => {
  const publications = [
    { name: 'TechCrunch', icon: Newspaper },
    { name: 'The Guardian', icon: Award },
    { name: 'Forbes Travel', icon: Users },
    { name: 'Wired', icon: Newspaper },
  ];

  return (
    <section className="py-12 bg-white border-y border-neutral-200">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-2">
            As Seen In
          </h3>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {publications.map((publication, index) => {
            const Icon = publication.icon;
            return (
              <div key={index} className="flex items-center gap-2 text-neutral-600 grayscale hover:grayscale-0 transition-all duration-300 hover:text-primary-600">
                <Icon className="w-6 h-6" />
                <span className="text-lg font-bold">{publication.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AsSeenIn;