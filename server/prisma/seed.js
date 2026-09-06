const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding GlobeTrek Adventures database...');

  // 1. Clear existing data in reverse order of dependencies
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.query.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.packageAccommodationOption.deleteMany();
  await prisma.packageTransportOption.deleteMany();
  await prisma.accommodation.deleteMany();
  await prisma.transportation.deleteMany();
  await prisma.package.deleteMany();
  await prisma.user.deleteMany();

  // 2. Hash passwords
  const customerPassword = await bcrypt.hash('Customer123!', 10);
  const staffPassword = await bcrypt.hash('Staff123!', 10);
  const adminPassword = await bcrypt.hash('Admin123!', 10);

  // 3. Create Seed Users
  const customer = await prisma.user.create({
    data: {
      full_name: 'Amara Perera',
      email: 'customer@globetrek.com',
      password_hash: customerPassword,
      role: 'customer',
      phone: '+94 77 123 4567',
      is_active: true
    }
  });

  const staff = await prisma.user.create({
    data: {
      full_name: 'Dinesh Silva',
      email: 'staff@globetrek.com',
      password_hash: staffPassword,
      role: 'staff',
      phone: '+94 71 987 6543',
      is_active: true
    }
  });

  const admin = await prisma.user.create({
    data: {
      full_name: 'Kavinda Fernando',
      email: 'admin@globetrek.com',
      password_hash: adminPassword,
      role: 'admin',
      phone: '+94 76 555 1212',
      is_active: true
    }
  });

  console.log('Created Users: Customer, Staff, Admin');

  // 4. Create Accommodations
  const accommodationsData = [
    {
      name: 'Jetwing Blue Negombo',
      type: 'Resort',
      location: 'Negombo Beach, Western Province',
      price_per_night_lkr: 38000,
      rating: 4.8
    },
    {
      name: 'Aliya Resort & Spa',
      type: 'Eco-Resort',
      location: 'Audangawa, Sigiriya',
      price_per_night_lkr: 42000,
      rating: 4.9
    },
    {
      name: 'Grand Hotel Nuwara Eliya',
      type: 'Heritage Hotel',
      location: 'Grand Hotel Rd, Nuwara Eliya',
      price_per_night_lkr: 35000,
      rating: 4.7
    },
    {
      name: '98 Acres Resort & Spa',
      type: 'Luxury Chalet',
      location: 'Greenland Estate, Ella',
      price_per_night_lkr: 48000,
      rating: 4.9
    },
    {
      name: 'Cinnamon Wild Yala',
      type: 'Safari Lodge',
      location: 'Kirinda, Yala National Park',
      price_per_night_lkr: 45000,
      rating: 4.8
    },
    {
      name: 'The Fortress Resort & Spa',
      type: 'Boutique Resort',
      location: 'Koggala, Galle Coast',
      price_per_night_lkr: 52000,
      rating: 4.9
    },
    {
      name: "Earl's Regency Kandy",
      type: 'Hillside Hotel',
      location: 'Tennekumbura, Kandy',
      price_per_night_lkr: 32000,
      rating: 4.6
    },
    {
      name: 'Triple O Six Mirissa',
      type: 'Beachside Villa',
      location: 'Bandaramulla, Mirissa',
      price_per_night_lkr: 28000,
      rating: 4.5
    }
  ];

  const createdAccommodations = [];
  for (const acc of accommodationsData) {
    const created = await prisma.accommodation.create({ data: acc });
    createdAccommodations.push(created);
  }
  console.log(`Created ${createdAccommodations.length} Accommodations`);

  // 5. Create Transportation
  const transportData = [
    {
      type: 'Private Luxury AC Van',
      provider_name: 'GlobeTrek Executive Fleet',
      route_description: 'Island-wide private chauffeur transfer (Toyota HiAce / KDH with Wi-Fi & refreshments)',
      price_lkr: 25000
    },
    {
      type: 'Chauffeur-Driven AC Sedan',
      provider_name: 'GlobeTrek City Express',
      route_description: 'Comfortable 4-seater touring sedan for couples and solo adventurers',
      price_lkr: 18000
    },
    {
      type: '4x4 Open-Top Safari Jeep',
      provider_name: 'Ruhuna Wildlife Outfitters',
      route_description: 'Specially modified off-road safari cruiser with elevated tracker seats for Yala',
      price_lkr: 30000
    },
    {
      type: 'Hill Country Scenic Observation Train',
      provider_name: 'Sri Lanka Railways (Reserved 1st Class)',
      route_description: 'Scenic railway pass between Kandy, Nanu Oya, and Ella through mountain tunnels and tea plantations',
      price_lkr: 8500
    },
    {
      type: 'Executive Coastal Coach',
      provider_name: 'Southern Express Transit',
      route_description: 'High-speed coastal expressway luxury coach connecting Colombo/Negombo to Galle & Matara',
      price_lkr: 35000
    },
    {
      type: 'Airport VIP Welcome Transfer',
      provider_name: 'GlobeTrek Airport Desk',
      route_description: 'Direct Bandaranaike International Airport (BIA) Meet & Greet to Negombo hotels',
      price_lkr: 7000
    }
  ];

  const createdTransports = [];
  for (const tr of transportData) {
    const created = await prisma.transportation.create({ data: tr });
    createdTransports.push(created);
  }
  console.log(`Created ${createdTransports.length} Transport options`);

  // 6. Tour Packages (9 Real Sri Lankan Packages)
  const packagesData = [
    {
      title: 'Sigiriya & Cultural Triangle Heritage Explorer',
      slug: 'sigiriya-cultural-triangle-heritage-explorer',
      destination: 'Sigiriya & Polonnaruwa',
      description: 'Journey into Sri Lanka’s ancient golden age. Scale the UNESCO World Heritage Sigiriya Rock Fortress at sunrise, cycle through the ruined palaces of Polonnaruwa, marvel at the gilded cave shrines of Dambulla, and experience authentic village hospitality with a catamaran ride on an ancient reservoir.',
      itinerary_summary: 'Day 1: Negombo to Dambulla Rock Cave Temples & Habarana sunset | Day 2: Sunrise climb of Sigiriya Lion Rock Citadel & traditional Hiriwadunna village safari | Day 3: Royal Kingdom of Polonnaruwa exploration by bicycle | Day 4: Minneriya National Park Wild Elephant Gathering & evening return to Negombo.',
      duration_days: 4,
      base_price_lkr: 145000,
      category: 'Cultural',
      cover_image_url: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
      ]),
      is_published: true,
      created_by: staff.id,
      accIndex: 1, // Aliya Resort
      transIndex: 0 // Private Luxury Van
    },
    {
      title: 'Ella Scenic Highlands & Nine Arches Trek',
      slug: 'ella-scenic-highlands-nine-arches-trek',
      destination: 'Ella, Badulla',
      description: 'Immerse yourself in Sri Lanka’s misty central highlands. Board the world-famous blue train as it winds through emerald tea carpets, stand before the iconic colonial Nine Arches Bridge as the steam train passes, conquer Little Adam’s Peak for panoramic ridge views, and cool off beneath Ravana Waterfall.',
      itinerary_summary: 'Day 1: Scenic Highland railway ride to Ella & cozy chalet check-in | Day 2: Early morning hike to Little Adam’s Peak & Demodara Nine Arches Bridge photo vantage point | Day 3: Ravana Falls cascade, Flying Ravana Zipline adventure, and artisanal tea factory cupping session.',
      duration_days: 3,
      base_price_lkr: 115000,
      category: 'Scenic',
      cover_image_url: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1566296517004-220e93298893?auto=format&fit=crop&w=800&q=80'
      ]),
      is_published: true,
      created_by: staff.id,
      accIndex: 3, // 98 Acres
      transIndex: 3 // Scenic Train
    },
    {
      title: 'Yala National Park Leopard Safari & Wilderness',
      slug: 'yala-national-park-leopard-safari-wilderness',
      destination: 'Yala, Southern Province',
      description: 'Track the majestic Sri Lankan leopard (Panthera pardus kotiya) across the scrublands and rocky outcrops of Yala Block 1. Accompanied by our expert naturalists in a custom 4x4 cruiser, encounter Asian elephants, sloth bears, spotted deer, marsh crocodiles, and rare resident birds.',
      itinerary_summary: 'Day 1: Coastal drive via Hambantota to luxury safari campsite & twilight lake walk | Day 2: Dual game drives: Dawn leopard tracking expedition and sunset safari around waterholes | Day 3: Morning birdwatching drive at Bundala Wetlands & scenic return via southern coast.',
      duration_days: 3,
      base_price_lkr: 135000,
      category: 'Wildlife',
      cover_image_url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1551009175-8a68da93d5f9?auto=format&fit=crop&w=800&q=80'
      ]),
      is_published: true,
      created_by: admin.id,
      accIndex: 4, // Cinnamon Wild Yala
      transIndex: 2 // 4x4 Safari Cruiser
    },
    {
      title: 'Galle Fort Colonial Charm & Southern Coastline',
      slug: 'galle-fort-colonial-charm-southern-coastline',
      destination: 'Galle & Unawatuna',
      description: 'Step into centuries of living maritime history inside the fortified cobblestone streets of UNESCO-listed Galle Fort. Marvel at Dutch colonial architecture, watch cliff divers leap from the bastions, visit Kosgoda sea turtle sanctuaries, and relax along the turquoise crescent of Unawatuna beach.',
      itinerary_summary: 'Day 1: Southern expressway journey to Galle Fort, heritage walking tour & sunset cocktails atop the ramparts | Day 2: Traditional stilt fishermen encounters at Koggala, boat safari along Madu Ganga mangrove river | Day 3: Sea turtle conservation project & artisanal gem boutique tour.',
      duration_days: 3,
      base_price_lkr: 98000,
      category: 'Beach',
      cover_image_url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
      ]),
      is_published: true,
      created_by: staff.id,
      accIndex: 5, // The Fortress Resort
      transIndex: 4 // Coastal Coach
    },
    {
      title: 'Kandy Sacred City & Knuckles Mountain Trek',
      slug: 'kandy-sacred-city-knuckles-mountain-trek',
      destination: 'Kandy & Knuckles Range',
      description: 'Discover the cultural heartbeat of the island in the royal mountain capital of Kandy. Participate in the reverent Thevava ceremony at the Temple of the Sacred Tooth Relic, wander through 4,000 plant species in Peradeniya Royal Botanical Gardens, and hike into the UNESCO Knuckles Mountain Range cloud forests.',
      itinerary_summary: 'Day 1: Negombo to Kandy via Pinnawala Elephant Sanctuary & evening Sacred Tooth Temple ceremony | Day 2: Royal Botanical Gardens & vibrant Kandyan fire-walking cultural dance show | Day 3: Guided full-day trekking in misty Knuckles Range with natural river pool baths | Day 4: Spice garden aromas & return.',
      duration_days: 4,
      base_price_lkr: 128000,
      category: 'Cultural',
      cover_image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80'
      ]),
      is_published: true,
      created_by: staff.id,
      accIndex: 6, // Earls Regency
      transIndex: 0 // Luxury Van
    },
    {
      title: 'Mirissa Blue Whale Watching & Surf Escape',
      slug: 'mirissa-blue-whale-watching-surf-escape',
      destination: 'Mirissa & Weligama',
      description: 'Encounter the largest creatures ever to inhabit planet Earth in the deep maritime trenches off Mirissa. Cruise on luxury catamarans alongside blue whales, sperm whales, and leaping spinner dolphins, then catch gentle rolling waves on the sandbars of Weligama Bay.',
      itinerary_summary: 'Day 1: Coastal drive to Mirissa, check-in to boutique villa & sunset at Coconut Tree Hill | Day 2: Sunrise offshore whale watching cruise & afternoon beginner surf lesson with certified ISA instructors | Day 3: Secret Beach hideaway day, seafood BBQ dinner under starlight.',
      duration_days: 3,
      base_price_lkr: 110000,
      category: 'Beach',
      cover_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
      ]),
      is_published: true,
      created_by: staff.id,
      accIndex: 7, // Triple O Six
      transIndex: 1 // AC Sedan
    },
    {
      title: 'Nuwara Eliya "Little England" Highland Odyssey',
      slug: 'nuwara-eliya-little-england-highland-odyssey',
      destination: 'Nuwara Eliya & Horton Plains',
      description: 'Breathe in crisp mountain air at 1,868 meters elevation in Sri Lanka’s premier hill resort. Stay at a grand Victorian colonial hotel, stand atop the dizzying 1,000-meter drop of World’s End precipice at Horton Plains, and pick two leaves and a bud alongside master tea pluckers.',
      itinerary_summary: 'Day 1: Scenic mountain climb past Ramboda waterfalls to Nuwara Eliya; classic high tea at the Grand Hotel | Day 2: Dawn expedition to Horton Plains National Park & Baker’s Falls; Pedro tea estate guided factory tour | Day 3: Gregory Lake swan boat ride, Victoria Park blossoms, and highland descent.',
      duration_days: 3,
      base_price_lkr: 120000,
      category: 'Scenic',
      cover_image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'
      ]),
      is_published: true,
      created_by: admin.id,
      accIndex: 2, // Grand Hotel
      transIndex: 0 // Luxury Van
    },
    {
      title: 'Negombo Lagoon Discovery & Heritage Gateway',
      slug: 'negombo-lagoon-discovery-heritage-gateway',
      destination: 'Negombo, Western Province',
      description: 'GlobeTrek’s signature hometown tour! Uncover the vibrant maritime life of Negombo. Glide through tranquil mangroves of the Dutch Canal, observe traditional Oruwa outrigger catamarans bringing in the day’s fresh catch, sample authentic Negombo lagoon mud crabs, and visit historic 17th-century churches.',
      itinerary_summary: 'Day 1: Private morning boat cruise on Negombo Lagoon with mangrove birdwatching; Lellama seafood market experience and St. Mary’s Church | Day 2: Hands-on sailing on a traditional outrigger catamaran with local fishermen & farewell lagoon crab banquet.',
      duration_days: 2,
      base_price_lkr: 65000,
      category: 'Cultural',
      cover_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80'
      ]),
      is_published: true,
      created_by: staff.id,
      accIndex: 0, // Jetwing Blue
      transIndex: 5 // Airport VIP
    },
    {
      title: 'Sinharaja Virgin Rainforest Biodiversity Expedition',
      slug: 'sinharaja-virgin-rainforest-biodiversity-expedition',
      destination: 'Sinharaja Forest Reserve',
      description: 'Venture into Sri Lanka’s last viable area of primary tropical rainforest. Recognized as a UNESCO World Heritage site and Biosphere Reserve, Sinharaja harbors over 60% of Sri Lanka’s endemic trees and rare endemic wildlife, including the Sri Lanka Blue Magpie and Purple-faced Langur.',
      itinerary_summary: 'Day 1: Expedition departure into Sinharaja perimeter; canopy exploration and natural forest cascade dip | Day 2: Sunrise bird wave tracking with senior wildlife naturalist, medicinal plant discovery, and return transfer.',
      duration_days: 2,
      base_price_lkr: 85000,
      category: 'Adventure',
      cover_image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
      ]),
      is_published: true,
      created_by: staff.id,
      accIndex: 4, // Cinnamon Wild
      transIndex: 0 // Luxury Van
    }
  ];

  for (const pkgData of packagesData) {
    const { accIndex, transIndex, ...data } = pkgData;
    const pkg = await prisma.package.create({ data });

    // Link default and optional accommodations
    await prisma.packageAccommodationOption.create({
      data: {
        package_id: pkg.id,
        accommodation_id: createdAccommodations[accIndex].id,
        is_default: true
      }
    });

    // Also link a secondary accommodation option
    const secondaryAccIndex = (accIndex + 1) % createdAccommodations.length;
    await prisma.packageAccommodationOption.create({
      data: {
        package_id: pkg.id,
        accommodation_id: createdAccommodations[secondaryAccIndex].id,
        is_default: false
      }
    });

    // Link default and optional transports
    await prisma.packageTransportOption.create({
      data: {
        package_id: pkg.id,
        transportation_id: createdTransports[transIndex].id,
        is_default: true
      }
    });

    const secondaryTransIndex = (transIndex + 1) % createdTransports.length;
    await prisma.packageTransportOption.create({
      data: {
        package_id: pkg.id,
        transportation_id: createdTransports[secondaryTransIndex].id,
        is_default: false
      }
    });
  }

  console.log(`Created ${packagesData.length} Sri Lankan Tour Packages with options`);

  // 7. Create Sample Initial Booking for Demo Customer
  const firstPackage = await prisma.package.findFirst({ where: { slug: 'sigiriya-cultural-triangle-heritage-explorer' } });
  const demoBooking = await prisma.booking.create({
    data: {
      user_id: customer.id,
      package_id: firstPackage.id,
      travel_date: '2026-10-15',
      num_travellers: 2,
      selected_accommodation_id: createdAccommodations[1].id,
      selected_transport_id: createdTransports[0].id,
      customizations: JSON.stringify({ extra_nights: 1, dietary: 'Vegetarian meals preferred' }),
      subtotal_lkr: 332000,
      total_price_lkr: 332000,
      status: 'confirmed',
      payment_status: 'paid',
      coordination_notes: 'Hotel room upgraded to Deluxe Pool View at Aliya Resort. Driver assigned: Mr. Ranjith (+94 77 444 3322).',
      handled_by_staff_id: staff.id
    }
  });

  // Create corresponding simulated payment
  await prisma.payment.create({
    data: {
      booking_id: demoBooking.id,
      amount_lkr: 332000,
      method: 'simulated',
      status: 'success',
      transaction_ref: 'GT-TXN-884920'
    }
  });

  // Second pending booking
  const secondPackage = await prisma.package.findFirst({ where: { slug: 'ella-scenic-highlands-nine-arches-trek' } });
  await prisma.booking.create({
    data: {
      user_id: customer.id,
      package_id: secondPackage.id,
      travel_date: '2026-11-20',
      num_travellers: 2,
      selected_accommodation_id: createdAccommodations[3].id,
      selected_transport_id: createdTransports[3].id,
      customizations: JSON.stringify({ extra_nights: 0 }),
      subtotal_lkr: 230000,
      total_price_lkr: 230000,
      status: 'pending',
      payment_status: 'paid',
      coordination_notes: 'Waiting for reserved 1st class train seat issuance confirmation from Sri Lanka Railways.',
      handled_by_staff_id: staff.id
    }
  });

  // 8. Create Sample Customer Queries
  await prisma.query.create({
    data: {
      user_id: customer.id,
      booking_id: demoBooking.id,
      category: 'customization_request',
      subject: 'Inquiring about sunrise hot air balloon flight over Sigiriya',
      message: 'Hello GlobeTrek team, is it possible to add a sunrise hot air balloon flight over Sigiriya rock on Day 2 of our tour?',
      status: 'resolved',
      assigned_staff_id: staff.id,
      staff_response: 'Dear Amara, yes! We have partnered with Sri Lanka Ballooning in Kandalama. The flight departs at 5:45 AM. We can arrange this for an additional 75,000 LKR for two persons. Our chauffeur will handle direct transfers.',
      resolved_at: new Date()
    }
  });

  await prisma.query.create({
    data: {
      user_id: customer.id,
      booking_id: null,
      category: 'general_inquiry',
      subject: 'Best season for whale watching in Mirissa',
      message: 'Hi, we are planning our holiday in December. Will the ocean conditions be suitable for whale watching in Mirissa during late December?',
      status: 'open',
      assigned_staff_id: null
    }
  });

  // 9. Create Notifications for Customer
  await prisma.notification.create({
    data: {
      user_id: customer.id,
      message: 'Your booking for Sigiriya Heritage Explorer (GT-TXN-884920) has been officially confirmed by staff member Dinesh Silva!',
      is_read: false
    }
  });

  await prisma.notification.create({
    data: {
      user_id: customer.id,
      message: 'Staff member Dinesh Silva has responded to your inquiry regarding Hot Air Ballooning in Sigiriya.',
      is_read: true
    }
  });

  // 10. Initial Audit Logs
  await prisma.auditLog.create({
    data: {
      actor_user_id: admin.id,
      action: 'SYSTEM_INITIALIZATION',
      target_type: 'SYSTEM',
      target_id: null
    }
  });

  await prisma.auditLog.create({
    data: {
      actor_user_id: staff.id,
      action: 'BOOKING_CONFIRMED',
      target_type: 'BOOKING',
      target_id: demoBooking.id
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
