import React, { useState } from 'react';
import { BookOpen, Clock, Calendar, ChevronRight, X, Sparkles, MapPin } from 'lucide-react';

export default function TravelGuides() {
  const [activeArticle, setActiveArticle] = useState(null);

  const guides = [
    {
      id: 'monsoon-guide',
      title: 'Sri Lanka Weather & Monsoon Calendar: Month-by-Month Planning',
      category: 'Seasonal Advice',
      readTime: '6 min read',
      date: 'September© 2026',
      image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
      summary: 'Understanding Sri Lanka�s dual monsoon system is the secret to having sunshine year-round. Discover when to visit the southern beaches vs the cultural triangle.',
      content: `
### Understanding the Dual Monsoon Phenomenon
Because Sri Lanka is an equatorial island with a mountainous central massif, it enjoys two separate monsoon cycles. This means at any given month of the year, one side of the island is bathed in golden sunshine with calm ocean waters:

1. **South-West Monsoon (Yala)**: May to September. Affects the south-western coast (Negombo, Colombo, Galle, Bentota) and central highlands. During this time, the eastern and northern coasts (Trincomalee, Passikudah, Jaffna) and Cultural Triangle (Sigiriya, Anuradhapura) experience warm, dry sunny weather.
2. **North-East Monsoon (Maha)**: October to January. Affects the eastern, northern, and north-central regions. Meanwhile, Negombo, the southern beaches (Mirissa, Tangalle), and the west coast enter their peak sun season with flat seas ideal for whale watching and snorkeling.

### Best Months to Visit
- **December to April**: Peak season for Negombo, Galle, Mirissa, and Yala Safari.
- **May to September**: Superb for Sigiriya cultural explorations and scenic hiking in the central highlands when morning breezes keep temperatures pleasant.
      `
    },
    {
      id: 'cultural-triangle',
      title: 'Climbing Sigiriya & Exploring Ancient Polonnaruwa: Insider Guide',
      category: 'Cultural Heritage',
      readTime: '8 min read',
      date: 'August© 2026',
      image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
      summary: 'How to conquer the 1,200 steps of Sigiriya Lion Rock Fortress at dawn, navigate the ancient royal capital by bicycle, and adhere to sacred temple etiquette.',
      content: `
### Sigiriya Lion Rock Fortress at Dawn
The UNESCO citadel of King Kashyapa (5th century CE) rises 200 meters above the central jungle.
- **The Golden Rule**: Start the climb at 6:45 AM when the site gates open. You will avoid the tropical midday heat and witness the morning mist lifting over the ancient water gardens.
- **The Sigiriya Frescoes**: Halfway up, spiral metal stairways lead to sheltered rock pockets containing delicate 1,500-year-old painted celestial maidens. Photography with flash is strictly prohibited.
- **The Mirror Wall**: Coated with porcelain-smooth plaster, inscribed with verses penned by 8th-to-10th century pilgrims expressing awe at the paintings.

### Temple Dress Code & Etiquette
When entering Dambulla Cave Temple or Kandy Tooth Relic:
- Shoulders and knees must be fully covered for all visitors.
- Footwear and hats must be deposited at designated counters outside the sacred perimeter.
- Never pose with your back turned directly towards a Buddha statue for photographs.
      `
    },
    {
      id: 'yala-safari',
      title: 'Yala National Park Safari: Tracking Leopards & Elephants',
      category: 'Wildlife Expeditions',
      readTime: '7 min read',
      date: 'July© 2026',
      image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80',
      summary: 'Yala boasts one of the highest leopard population densities on Earth. Learn how our custom 4x4 cruisers and tracker naturalists position you for once-in-a-lifetime encounters.',
      content: `
### The Sri Lankan Leopard (Panthera pardus kotiya)
Unlike African leopards that often hide in trees to avoid lions and hyenas, the Sri Lankan leopard is the apex terrestrial predator on the island. In Yala Block 1, leopards confidently walk along dirt jeep tracks and lounge on colossal granite outcrops (boulder kopjes).

### Morning vs. Afternoon Game Drives
- **Morning Safari (5:45 AM � 9:30 AM)**: Crisp air and best light for wildlife photography. Animals are actively foraging before the mid-day heat.
- **Afternoon Safari (2:45 PM � 6:00 PM)**: As shadows lengthen, sloth bears emerge to feast on fallen Ceylon ebony fruits, while herds of elephants congregate at waterholes.

### Wildlife Etiquette
Our safari chauffeurs maintain safe distances, turn off vehicle engines near sensitive animal clusters, and never feed wild fauna. Binoculars and a telephoto lens (200mm�400mm) are highly recommended!
      `
    },
    {
      id: 'negombo-heritage',
      title: 'Negombo Beyond the Airport: Lagoons, Dutch Canals & Catamarans',
      category: 'Local Secrets',
      readTime: '5 min read',
      date: 'June© 2026',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      summary: 'Why you should spend at least two days in Negombo before heading inland. Sail on traditional Oruwa catamarans and feast on fresh lagoon mud crabs.',
      content: `
### The Historic Dutch Canal & Lagoon
Constructed by 17th-century Dutch colonists to transport cinnamon and spices to the port of Colombo, the 100km Hamilton Canal winds through the heart of Negombo and opens into an expansive 3,164-hectare brackish lagoon.
- **Mangrove Bird Sanctuary**: Glide silently on electric boat safaris to spot kingfishers, purple herons, and resident sea eagles.
- **Lellama Seafood Auction**: Visit Negombo's vibrant fish auction at dawn as traditional wooden boats dock with yellowfin tuna, jumbo tiger prawns, and mud crabs.
- **The Catamaran Tradition**: Negombo is one of the few places in Asia where outrigger sailing vessels (Oruwa) still harvest fish using traditional canvas square sails.
      `
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
          Traveler Insights
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display mt-2">
          Sri Lanka Travel Guides & Field Knowledge
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          Written by our licensed tour specialists in Negombo to help you navigate seasons, wildlife reserves, and cultural traditions.
        </p>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {guides.map((g) => (
          <div
            key={g.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col group cursor-pointer"
            onClick={() => setActiveArticle(g)}
          >
            <div className="h-60 overflow-hidden relative bg-slate-900">
              <img
                src={g.image}
                alt={g.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-slate-900">
                {g.category}
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {g.readTime}
                  </span>
                  <span>�</span>
                  <span>{g.date}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display group-hover:text-blue-600 transition-colors mb-3">
                  {g.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {g.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Full Article <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 relative">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              {activeArticle.category}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display mt-3 mb-2">
              {activeArticle.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-6">
              <span>{activeArticle.readTime}</span>
              <span>�</span>
              <span>{activeArticle.date}</span>
              <span>�</span>
              <span>GlobeTrek Travel Editorial</span>
            </div>

            <div className="h-64 rounded-2xl overflow-hidden mb-6">
              <img src={activeArticle.image} alt={activeArticle.title} className="w-full h-full object-cover" />
            </div>

            <div className="prose prose-sm prose-slate max-w-none space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {activeArticle.content.split('\n\n').map((para, i) => (
                <p key={i} className="whitespace-pre-line">{para.replace(/###/g, '')}</p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
