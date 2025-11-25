import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "Paris, France",
      rating: 5,
      text: "Our trip to Paris was absolutely amazing! We stayed in a charming boutique hotel in the heart of the city, explored the Louvre and ate delicious croissants at local cafes. PackYourBags made our travel experience seamless and stress-free.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      trip: "Romantic Getaway in Paris"
    },
    {
      id: 2,
      name: "Michael Thompson",
      location: "Tokyo, Japan",
      rating: 5,
      text: "Our family trip to Tokyo was unforgettable! We visited the bustling Tsukiji Fish Market, experienced a traditional tea ceremony, and stayed in a beautiful ryokan with a view of Mount Fuji. PackYourBags helped us plan every detail flawlessly.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      trip: "Family Adventure in Tokyo"
    },
    {
      id: 3,
      name: "Emily Roberts",
      location: "Cape Town, South Africa",
      rating: 5,
      text: "Our safari trip in Cape Town was a dream come true! We saw the Big Five up close, enjoyed a sunset cruise in Table Bay, and tasted delicious South African wines in Stellenbosch. PackYourBags provided exceptional service from start to finish.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
      trip: "Safari Adventure in Cape Town"
    }
  ];

  return (
    <section className="py-24 bg-neutral-50 relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white border border-neutral-200 px-6 py-2 rounded-full shadow-sm mb-8">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-neutral-900 uppercase tracking-widest">
              Testimonials
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-6">
            Travelers Love <span className="text-primary-600">PackYourBags</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto font-medium">
            Join thousands of happy travelers who discovered their perfect destinations with our AI-powered platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-xl border border-neutral-200 group"
            >
              <div className="flex items-center mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-primary-100 ml-auto group-hover:text-primary-200 transition-colors" />
              </div>

              <p className="text-neutral-700 mb-8 italic leading-relaxed text-lg">
                "{testimonial.text}"
              </p>

              <div className="flex items-center pt-6 border-t border-neutral-100">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-white shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-neutral-900">{testimonial.name}</h4>
                  <p className="text-sm text-neutral-500">{testimonial.location}</p>
                  <p className="text-xs text-primary-600 font-bold mt-1 uppercase tracking-wide">{testimonial.trip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex flex-col md:flex-row items-center gap-8 md:gap-16 bg-white rounded-3xl px-12 py-8 shadow-xl border border-neutral-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-neutral-900 mb-1">4.9/5</div>
              <div className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Average Rating</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-neutral-200"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-neutral-900 mb-1">15k+</div>
              <div className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Happy Travelers</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-neutral-200"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-neutral-900 mb-1">98%</div>
              <div className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Recommend Us</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
