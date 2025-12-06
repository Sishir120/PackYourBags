import { getDestinationImage } from './destinationImages.js';

export const mockBlogs = [
    {
        id: 1,
        slug: 'pokhara-nepal',
        title: 'Pokhara Travel Guide: Serenity and Adventure in the Himalayas',
        excerpt: 'Discover the magic of Pokhara, Nepal. From the tranquil Phewa Lake to the adrenaline of paragliding, explore the best of this Himalayan gem.',
        content: `
# Serenity and Adventure in Pokhara, Nepal

Pokhara is a metropolitan city in Nepal, serving as the capital of Gandaki Province. It is the country's largest metropolitan city in terms of area and second-largest in terms of population. But beyond the statistics, Pokhara is a feeling—a blend of calm waters and towering peaks.

## Why Visit Pokhara?

Known as the "Jewel of the Himalayas," Pokhara offers a perfect blend of natural beauty, adventure activities, and cultural experiences. Whether you are a thrill-seeker or looking for a peaceful retreat, this city has something for everyone.

### Top Things to Do

1.  **Boating on Phewa Lake**: Rent a colorful wooden boat (doonga) and paddle out to the Tal Barahi Temple located on an island in the middle of the lake. The reflection of Mount Machhapuchhre on the water is a sight to behold.
2.  **Paragliding**: Experience world-class paragliding from Sarangkot. Soar with the eagles and get a bird's-eye view of the valley and the Annapurna range.
3.  **Sunrise at Sarangkot**: Wake up early and hike or drive to Sarangkot for a breathtaking sunrise. Watch as the sun paints the snow-capped peaks in hues of gold and pink.
4.  **World Peace Pagoda**: Hike up to this stunning white stupa for panoramic views of the city, the lake, and the mountains. It's a place of peace and spiritual reflection.

## Best Time to Visit

The best time to visit Pokhara is from **September to November** (Autumn) and **March to May** (Spring). During these months, the weather is pleasant, and the visibility is excellent for mountain views.

## Local Cuisine

Don't leave without trying:
*   **Dal Bhat**: The staple Nepali meal of lentil soup, rice, and curry.
*   **Momos**: Steamed or fried dumplings filled with meat or vegetables.
*   **Thukpa**: A hearty noodle soup perfect for cooler evenings.

Pokhara is not just a destination; it's an experience that stays with you long after you leave.
    `,
        featured_image: getDestinationImage('pokhara-nepal'),
        category: 'Adventure',
        tags: ['Nepal', 'Himalayas', 'Adventure', 'Nature'],
        author: {
            name: 'Aarav Sharma',
            avatar: 'https://i.pravatar.cc/150?u=aarav'
        },
        published_at: '2023-11-15T09:00:00Z',
        views: 1250,
        featured: true,
        destination: {
            name: 'Pokhara',
            images: [getDestinationImage('pokhara-nepal')]
        }
    },
    {
        id: 2,
        slug: 'kathmandu-nepal',
        title: 'Kathmandu: A Journey Through History and Culture',
        excerpt: 'Explore the vibrant capital of Nepal. Dive into the chaos, colors, and ancient heritage of Kathmandu, a city of temples and legends.',
        content: `
# The Heart of Nepal: Kathmandu

Kathmandu, the capital of Nepal, is a city where ancient traditions are zealously guarded while at the same time embracing modern technology. It is a sensory overload in the best possible way—incense wafting from shrines, the sound of temple bells, and the bustle of markets.

## Cultural Heritage

The city is home to seven UNESCO World Heritage Sites, making it a living museum.

### Must-Visit Landmarks

*   **Swayambhunath Stupa (Monkey Temple)**: Perched atop a hill, this ancient stupa offers commanding views of the valley. Watch out for the playful monkeys!
*   **Boudhanath Stupa**: One of the largest spherical stupas in the world and a center of Tibetan Buddhism in Nepal. The atmosphere here is incredibly peaceful.
*   **Pashupatinath Temple**: A sacred Hindu temple complex on the banks of the Bagmati River. It is a place of deep spiritual significance.
*   **Durbar Squares**: Explore the royal palaces and courtyards of Kathmandu, Patan, and Bhaktapur, each showcasing exquisite Newari architecture.

## Shopping in Thamel

Thamel is the tourist hub of Kathmandu. Here you can find everything from trekking gear and pashmina shawls to singing bowls and traditional handicrafts. It's a maze of narrow streets filled with shops, restaurants, and bars.

## Travel Tips

*   **Respect Local Customs**: Dress modestly when visiting temples. Always walk clockwise around stupas.
*   **Try the Street Food**: But be cautious! Stick to cooked foods and reputable stalls.
*   **Traffic**: Be prepared for heavy traffic and dust. Carrying a face mask is recommended.

Kathmandu is a city that demands your attention and rewards your curiosity with unforgettable memories.
    `,
        featured_image: getDestinationImage('kathmandu-nepal'),
        category: 'Culture',
        tags: ['Nepal', 'History', 'Culture', 'Temples'],
        author: {
            name: 'Sita Rai',
            avatar: 'https://i.pravatar.cc/150?u=sita'
        },
        published_at: '2023-10-28T14:30:00Z',
        views: 980,
        featured: true,
        destination: {
            name: 'Kathmandu',
            images: [getDestinationImage('kathmandu-nepal')]
        }
    },
    {
        id: 3,
        slug: 'chitwan-national-park-nepal',
        title: 'Into the Wild: Safari Guide to Chitwan National Park',
        excerpt: 'Encounter rhinos, tigers, and elephants in the lush jungles of Nepal. A complete guide to wildlife safaris in Chitwan.',
        content: `
# A Wildlife Haven: Chitwan National Park

Chitwan National Park is the first national park in Nepal and a UNESCO World Heritage Site. Located in the subtropical lowlands of south-central Nepal, it stands in stark contrast to the towering Himalayas, offering a dense jungle teeming with wildlife.

## Wildlife Encounters

Chitwan is one of the best places in Asia for wildlife viewing.

*   **One-Horned Rhinoceros**: The park is famous for its successful conservation of the greater one-horned rhino. You are almost guaranteed to spot one on a safari.
*   **Bengal Tigers**: While elusive, Chitwan has a healthy population of Royal Bengal Tigers.
*   **Bird Watching**: With over 540 species of birds, it's a paradise for birdwatchers. Look out for the giant hornbill and the paradise flycatcher.

## Activities

1.  **Jeep Safari**: Cover more ground and go deeper into the jungle to increase your chances of spotting big game.
2.  **Canoe Ride**: Float down the Rapti River to spot crocodiles (Marsh Muggers and Gharials) basking on the banks.
3.  **Jungle Walk**: For the adventurous, a guided walk offers an intimate experience with the flora and fauna.
4.  **Tharu Cultural Show**: In the evenings, enjoy traditional dances performed by the local Tharu community.

## Best Time to Visit

**October to March** is the best time for pleasant weather. However, **April and May**, though hot, are excellent for wildlife spotting as animals gather at waterholes.

Chitwan offers a wild escape into nature, perfect for animal lovers and adventure enthusiasts.
    `,
        featured_image: getDestinationImage('chitwan-national-park-nepal'),
        category: 'Wildlife',
        tags: ['Nepal', 'Safari', 'Wildlife', 'Nature'],
        author: {
            name: 'Raj Thapa',
            avatar: 'https://i.pravatar.cc/150?u=raj'
        },
        published_at: '2023-12-05T11:15:00Z',
        views: 3400,
        featured: false,
        destination: {
            name: 'Chitwan National Park',
            images: [getDestinationImage('chitwan-national-park-nepal')]
        }
    },
    {
        id: 4,
        slug: 'bali-indonesia',
        title: 'Bali Bliss: Temples, Rice Terraces, and Tropical Paradise',
        excerpt: 'Experience the Island of the Gods. From the spiritual calm of Ubud to the vibrant beaches of Seminyak, discover the best of Bali.',
        content: `
# The Island of the Gods: Bali

Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches, and coral reefs. It is a destination that captivates the soul with its rich culture, stunning landscapes, and warm hospitality.

## Must-See Attractions

*   **Ubud**: The cultural heart of Bali. Visit the Sacred Monkey Forest Sanctuary and wander through the Tegalalang Rice Terraces.
*   **Uluwatu Temple**: Perched on a steep cliff 70 meters above the sea, this temple offers dramatic sunset views and nightly Kecak fire dance performances.
*   **Seminyak & Kuta**: For those seeking nightlife, shopping, and surfing, these beach towns are the place to be.
*   **Nusa Penida**: Take a day trip to this neighboring island for the Instagram-famous Kelingking Beach.

## Balinese Culture

Bali is unique in Indonesia for its predominantly Hindu population. You will see daily offerings (Canang sari) on the streets and witness colorful ceremonies.

### Food to Try

*   **Nasi Goreng**: Indonesian fried rice, a comfort food staple.
*   **Babi Guling**: Spit-roasted pig, a famous Balinese dish.
*   **Satay**: Grilled meat skewers served with peanut sauce.

## Digital Nomad Hub

Bali, especially Canggu and Ubud, has become a global hub for digital nomads, offering excellent co-working spaces, cafes, and a vibrant community.

Whether you seek spiritual healing, outdoor adventure, or just relaxation by the pool, Bali delivers in abundance.
    `,
        featured_image: getDestinationImage('bali-indonesia'),
        category: 'Island',
        tags: ['Indonesia', 'Bali', 'Beach', 'Culture'],
        author: {
            name: 'Maya Indah',
            avatar: 'https://i.pravatar.cc/150?u=maya'
        },
        published_at: '2024-01-12T16:20:00Z',
        views: 2100,
        featured: true,
        destination: {
            name: 'Bali',
            images: [getDestinationImage('bali-indonesia')]
        }
    },
    {
        id: 5,
        slug: 'kyoto-japan',
        title: 'Kyoto: Walking Through Old Japan',
        excerpt: 'Step back in time in Japan\'s cultural capital. Explore geisha districts, zen gardens, and thousands of vermilion torii gates.',
        content: `
# The Cultural Capital of Japan: Kyoto

Kyoto, once the capital of Japan, is a city on the island of Honshu. It's famous for its numerous classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines, and traditional wooden houses.

## Iconic Sights

*   **Fushimi Inari Shrine**: Famous for its thousands of vermilion torii gates, which straddle a network of trails behind its main buildings.
*   **Kinkaku-ji (Golden Pavilion)**: A Zen temple whose top two floors are completely covered in gold leaf.
*   **Arashiyama Bamboo Grove**: A mesmerizing path through towering bamboo stalks. It's like walking into another world.
*   **Gion District**: The most famous geisha district in Kyoto. Spotting a geiko or maiko (apprentice geisha) here is a highlight for many.

## The Art of Tea

Kyoto is the birthplace of the Japanese tea ceremony. Visit a traditional tea house to experience matcha (powdered green tea) served with wagashi (traditional sweets).

## Seasonal Beauty

*   **Spring (Sakura)**: Cherry blossoms turn the city pink in late March and early April.
*   **Autumn (Koyo)**: The maple leaves turn vibrant red and orange in November, creating stunning scenery at temples.

Kyoto is the soul of Japan, preserving the beauty and grace of a bygone era.
    `,
        featured_image: getDestinationImage('kyoto-japan'),
        category: 'History',
        tags: ['Japan', 'Kyoto', 'History', 'Temples'],
        author: {
            name: 'Kenji Tanaka',
            avatar: 'https://i.pravatar.cc/150?u=kenji'
        },
        published_at: '2023-08-22T10:00:00Z',
        views: 1500,
        featured: false,
        destination: {
            name: 'Kyoto',
            images: [getDestinationImage('kyoto-japan')]
        }
    },
    {
        id: 6,
        slug: 'hanoi-vietnam',
        title: 'Hanoi: A Timeless Charm in Southeast Asia',
        excerpt: 'Dive into the bustling streets of Hanoi. Experience the fusion of French colonial architecture, ancient temples, and world-famous street food.',
        content: `
# The Charming Capital of Vietnam: Hanoi

Hanoi, the capital of Vietnam, is known for its centuries-old architecture and a rich culture with Southeast Asian, Chinese, and French influences. At its heart is the chaotic Old Quarter, where the narrow streets are roughly arranged by trade.

## Exploring the Old Quarter

The **Old Quarter** is the soul of the city. Each street was historically dedicated to a specific trade (silver, silk, shoes, etc.). Today, it's a vibrant mix of history, commerce, and tourism.

### Highlights

*   **Hoan Kiem Lake**: The centerpiece of Hanoi. Visit the Ngoc Son Temple on an island in the lake.
*   **Train Street**: A narrow residential street where a train passes inches from the houses. (Note: Check current access regulations as they change).
*   **Temple of Literature**: A rare example of well-preserved traditional Vietnamese architecture and the site of Vietnam's first university.

## A Culinary Paradise

Hanoi is arguably the food capital of Vietnam.
*   **Pho**: Noodle soup with beef or chicken.
*   **Bun Cha**: Grilled pork with noodles, famously eaten by Obama and Anthony Bourdain.
*   **Egg Coffee (Ca Phe Trung)**: A unique Hanoian specialty made with egg yolk, sugar, condensed milk, and robusta coffee.

Hanoi is a city of contrasts—ancient yet modern, chaotic yet peaceful—offering a travel experience like no other.
    `,
        featured_image: getDestinationImage('hanoi-vietnam'),
        category: 'Food & Culture',
        tags: ['Vietnam', 'Food', 'City', 'History'],
        author: {
            name: 'Linh Nguyen',
            avatar: 'https://i.pravatar.cc/150?u=linh'
        },
        published_at: '2023-09-10T08:45:00Z',
        views: 1800,
        featured: false,
        destination: {
            name: 'Hanoi',
            images: [getDestinationImage('hanoi-vietnam')]
        }
    },
    {
        id: 7,
        slug: 'porto-portugal',
        title: 'Porto: Wine, Bridges, and Azulejos',
        excerpt: 'Explore Portugal\'s second city. Taste world-famous Port wine, cross the iconic Dom Luís I Bridge, and get lost in the Ribeira district.',
        content: `
# The Coastal Gem of Portugal: Porto

Porto is a coastal city in northwest Portugal known for its stately bridges and port wine production. In the medieval Ribeira (riverside) district, narrow cobbled streets wind past merchants’ houses and cafes.

## Architectural Marvels

*   **Dom Luís I Bridge**: An iconic double-deck metal arch bridge that spans the River Douro. Walk across the top deck for stunning views.
*   **São Bento Railway Station**: Famous for its 20,000 azulejo tiles depicting scenes from Portuguese history.
*   **Livraria Lello**: One of the most beautiful bookstores in the world, said to have inspired J.K. Rowling.

## Port Wine

No visit to Porto is complete without crossing the river to **Vila Nova de Gaia**, where the historic port wine cellars are located. Take a tour and enjoy a tasting of this sweet, fortified wine.

## The Francesinha

Hungry? Try the **Francesinha**, a sandwich from Porto. It's made with bread, wet-cured ham, linguiça, fresh sausage like chipolata, steak or roast meat, and covered with melted cheese and a hot thick tomato and beer sauce.

Porto is colorful, charismatic, and full of flavor—a perfect European city break.
    `,
        featured_image: getDestinationImage('porto-portugal'),
        category: 'City Break',
        tags: ['Portugal', 'Europe', 'Wine', 'Architecture'],
        author: {
            name: 'João Silva',
            avatar: 'https://i.pravatar.cc/150?u=joao'
        },
        published_at: '2023-07-15T12:00:00Z',
        views: 1600,
        featured: false,
        destination: {
            name: 'Porto',
            images: [getDestinationImage('porto-portugal')]
        }
    },
    {
        id: 8,
        slug: 'reykjavik-iceland',
        title: 'Reykjavik: Gateway to Fire and Ice',
        excerpt: 'Start your Icelandic adventure in Reykjavik. Discover geothermal wonders, northern lights, and a vibrant Nordic culture.',
        content: `
# The Gateway to Iceland's Wonders: Reykjavik

Reykjavik, on the coast of Iceland, is the country's capital and largest city. It is the world's northernmost capital of a sovereign state. Despite its small size, it punches above its weight in culture, nightlife, and design.

## City Highlights

*   **Hallgrímskirkja**: This striking concrete church is visible from almost anywhere in the city. Take the elevator to the top for a panoramic view of the colorful rooftops.
*   **Harpa Concert Hall**: A masterpiece of modern architecture with a glass facade inspired by the basalt landscapes of Iceland.
*   **Sun Voyager**: A beautiful sculpture by the sea, resembling a Viking ship.

## Day Trips from Reykjavik

Reykjavik is the perfect base for exploring Iceland's nature.
*   **The Golden Circle**: A popular route covering Thingvellir National Park, the Geysir Geothermal Area, and Gullfoss waterfall.
*   **Blue Lagoon**: Relax in the milky blue, mineral-rich geothermal waters.
*   **Northern Lights**: In winter, take a tour to hunt for the Aurora Borealis away from the city lights.

## Nordic Cuisine

Icelandic food is unique. Be adventurous and try fermented shark (hákarl) or stick to delicious fresh seafood and the famous Icelandic hot dog (pylsur).

Reykjavik is cool, quirky, and the perfect starting point for the adventure of a lifetime.
    `,
        featured_image: getDestinationImage('reykjavik-iceland'),
        category: 'Nature',
        tags: ['Iceland', 'Nature', 'Northern Lights', 'Adventure'],
        author: {
            name: 'Elara Frost',
            avatar: 'https://i.pravatar.cc/150?u=elara'
        },
        published_at: '2023-11-01T10:00:00Z',
        views: 2200,
        featured: true,
        destination: {
            name: 'Reykjavik',
            images: [getDestinationImage('reykjavik-iceland')]
        }
    },
    {
        id: 9,
        slug: 'dubrovnik-croatia',
        title: 'Dubrovnik: The Pearl of the Adriatic',
        excerpt: 'Walk the walls of King\'s Landing. Discover the medieval charm, crystal clear waters, and history of Dubrovnik.',
        content: `
# The Pearl of the Adriatic: Dubrovnik

Dubrovnik is a city in southern Croatia fronting the Adriatic Sea. It's known for its distinctive Old Town, encircled with massive stone walls completed in the 16th century.

## Walk the Walls

The number one activity in Dubrovnik is walking the **City Walls**. The 2km walk offers stunning views of the terracotta rooftops, the shimmering Adriatic Sea, and the forts that protected the city for centuries.

## Game of Thrones

Fans of the show will recognize Dubrovnik as **King's Landing**. You can visit the Red Keep (Lovrijenac Fort), the Walk of Shame stairs (Jesuit Stairs), and many other filming locations.

## Island Hopping

Take a short ferry ride to **Lokrum Island**, a nature reserve with peacocks, botanical gardens, and a "Dead Sea" swimming hole. Or take a boat tour to the Elafiti Islands for pristine beaches.

## Sunset Drinks

For the best sunset, head to the **Buža Bars**—cliffside bars located on the rocks outside the city walls. Enjoy a cold drink while watching the sun dip below the horizon.

Dubrovnik is a stunning blend of history and Mediterranean beauty that captures the heart of every visitor.
    `,
        featured_image: getDestinationImage('dubrovnik-croatia'),
        category: 'History',
        tags: ['Croatia', 'Europe', 'Beach', 'History'],
        author: {
            name: 'Marko Horvat',
            avatar: 'https://i.pravatar.cc/150?u=marko'
        },
        published_at: '2023-06-20T14:00:00Z',
        views: 2500,
        featured: true,
        destination: {
            name: 'Dubrovnik',
            images: [getDestinationImage('dubrovnik-croatia')]
        }
    },
    {
        id: 10,
        slug: 'prague-czech-republic',
        title: 'Prague: A Fairytale in the Heart of Europe',
        excerpt: 'Wander the cobblestone streets of the City of a Hundred Spires. Discover Gothic architecture, historic bridges, and the best beer in the world.',
        content: `
# The City of a Hundred Spires: Prague

Prague, capital city of the Czech Republic, is bisected by the Vltava River. It is often described as a fairytale city due to its stunning architecture, winding streets, and romantic atmosphere.

## Historic Landmarks

*   **Charles Bridge**: A medieval stone arch bridge lined with statues of Catholic saints. Visit at dawn to avoid the crowds and see the bridge in a magical light.
*   **Prague Castle**: The largest ancient castle in the world. It dominates the skyline and offers incredible views of the city.
*   **Old Town Square**: The heart of the city, featuring the famous **Astronomical Clock**, which puts on a show every hour.

## Beer Culture

The Czech Republic has the highest beer consumption per capita in the world. In Prague, beer is cheaper than water in some places! Visit a traditional pub and try a Pilsner Urquell.

## The Vltava River

Take a river cruise to see the city from a different perspective. In the evening, the illuminated castle and bridges reflecting on the water create a breathtaking scene.

Prague is a city of magic, history, and beauty that feels like stepping into a storybook.
    `,
        featured_image: getDestinationImage('prague-czech-republic'),
        category: 'City Break',
        tags: ['Czech Republic', 'Europe', 'History', 'Architecture'],
        author: {
            name: 'Elena Petrova',
            avatar: 'https://i.pravatar.cc/150?u=elena'
        },
        published_at: '2023-09-05T11:00:00Z',
        views: 2000,
        featured: false,
        destination: {
            name: 'Prague',
            images: [getDestinationImage('prague-czech-republic')]
        }
    },
    {
        id: 11,
        slug: 'great-wall-china',
        title: 'Walking the Dragon: A Guide to the Great Wall',
        excerpt: 'Steps, steep climbs, and history etched in stone. A hiking guide to the Great Wall of China\'s best sections.',
        content: `
# The Dragon's Backbone: Great Wall of China

The Great Wall of China is one of the most impressive architectural feats in history. Stretching over 13,000 miles, it winds through mountains, deserts, and plains.

## Choosing Your Section

*   **Mutianyu**: The best balance of restored beauty and fewer crowds. The toboggan ride down is a highlight!
*   **Badaling**: The most famous and accessible, but extremely crowded.
*   **Jinshanling**: For hikers and photographers wanting a more rugged experience.

## The Hike

Walking the wall is a workout! Be prepared for steep steps and uneven surfaces. The views of the wall snaking over the ridges are worth every drop of sweat.

## Best Time to Visit

Spring (April-May) for blossoms and Autumn (September-October) for colorful foliage are the most comfortable times to hike.
    `,
        featured_image: getDestinationImage('great-wall-china'),
        category: 'Adventure',
        tags: ['China', 'History', 'Hiking', 'Wonders'],
        author: {
            name: 'Wei Chen',
            avatar: 'https://i.pravatar.cc/150?u=wei'
        },
        published_at: '2024-03-15T09:00:00Z',
        views: 1100,
        featured: true,
        destination: {
            name: 'Great Wall of China',
            images: [getDestinationImage('great-wall-china')]
        }
    },
    {
        id: 12,
        slug: 'paris-france',
        title: 'Paris for First-Timers: Beyond the Eiffel Tower',
        excerpt: 'Discover the magic of the City of Light. From hidden cafes to world-class art, here is how to fall in love with Paris.',
        content: `
# The City of Light: Paris

Paris is a dream destination for many, offering romance, history, and world-class culture. But there is more to it than just the Eiffel Tower.

## Secret Spots

*   **Musée de l'Orangerie**: Often overlooked for the Louvre, this museum houses Monet's giant Water Lilies.
*   **Rue Crémieux**: A charming cobbled street lined with colorful houses.
*   **Canal Saint-Martin**: Where locals go for a picnic away from the Seine crowds.

## Cafe Culture

Sitting at a cafe terrace is a Parisian sport. Order a *café crème*, people-watch, and take your time. No one rushes here.

## Foodie Delights

Don't leave without trying a fresh *croissant* from a local *boulangerie* and a *macaron* from Ladurée or Pierre Hermé.
    `,
        featured_image: getDestinationImage('paris-france'),
        category: 'City Break',
        tags: ['France', 'Paris', 'Food', 'Art'],
        author: {
            name: 'Amélie Dubois',
            avatar: 'https://i.pravatar.cc/150?u=amelie'
        },
        published_at: '2024-03-18T14:30:00Z',
        views: 3500,
        featured: true,
        destination: {
            name: 'Paris',
            images: [getDestinationImage('paris-france')]
        }
    },
    {
        id: 13,
        slug: 'santorini-greece',
        title: 'Santorini: Sunsets and Blue Domes',
        excerpt: 'The ultimate guide to the jewel of the Aegean. Where to stay, what to eat, and where to catch that famous sunset.',
        content: `
# The Jewel of the Aegean: Santorini

Santorini is the supermodel of the Greek islands. Its whitewashed, cubiform houses clinging to cliffs are instantly recognizable.

## Oia vs Fira

*   **Oia**: Famous for *that* sunset and luxury hotels. It's quieter but more expensive.
*   **Fira**: The capital, bustling with shops, bars, and nightlife.

## The Volcano

Take a boat tour to the active volcano in the center of the caldera. You can hike to the crater and swim in the hot springs (wear a dark swimsuit, the sulfur stains!).

## Wine Tasting

Santorini's volcanic soil produces unique wines. Visit a local winery like Santo Wines for a tasting with a view.
    `,
        featured_image: getDestinationImage('santorini-greece'),
        category: 'Island',
        tags: ['Greece', 'Santorini', 'Beach', 'Luxury'],
        author: {
            name: 'Nikos Pappas',
            avatar: 'https://i.pravatar.cc/150?u=nikos'
        },
        published_at: '2024-03-20T11:15:00Z',
        views: 2800,
        featured: true,
        destination: {
            name: 'Santorini',
            images: [getDestinationImage('santorini-greece')]
        }
    },
    {
        id: 14,
        slug: 'machu-picchu-peru',
        title: 'Machu Picchu: Hiking the Inca Trail',
        excerpt: 'A journey to the Lost City of the Incas. What to pack, how to train, and the moment you see the ruins through the Sun Gate.',
        content: `
# The Lost City of the Incas: Machu Picchu

Machu Picchu is an Incan citadel set high in the Andes Mountains in Peru. It’s one of the most mysterious and beautiful places on Earth.

## Getting There

You can take the train to Aguas Calientes for a comfortable trip, or hike the 4-day **Inca Trail** for a truly immersive experience. arriving through the Sun Gate at sunrise is unforgettable.

## Altitude Tips

Cusco sits at 3,400m (11,150ft). Take it easy for the first day, drink plenty of water and coca tea to avoid altitude sickness.

## Llamas!

Yes, there are resident llamas at the ruins. They are friendly and make for great photo companions, but don't get too close!
    `,
        featured_image: getDestinationImage('machu-picchu-peru'),
        category: 'Adventure',
        tags: ['Peru', 'Hiking', 'History', 'Bucket List'],
        author: {
            name: 'Sofia Flores',
            avatar: 'https://i.pravatar.cc/150?u=sofia'
        },
        published_at: '2024-03-22T10:00:00Z',
        views: 3100,
        featured: true,
        destination: {
            name: 'Machu Picchu',
            images: [getDestinationImage('machu-picchu-peru')]
        }
    },
    {
        id: 15,
        slug: 'grand-canyon-usa',
        title: 'Grand Canyon: A Natural Wonder',
        excerpt: 'Standing on the edge of the world. Tips for visiting the South Rim, hiking trails, and avoiding the crowds.',
        content: `
# Nature's Masterpiece: Grand Canyon

The Grand Canyon in Arizona is a natural formation distinguished by layered bands of red rock. It is vast, silent, and incredibly beautiful.

## South Rim vs North Rim

*   **South Rim**: Open year-round, most iconic views, more facilities.
*   **North Rim**: Closed in winter, quieter, higher elevation.

## Hiking Bright Angel Trail

It's tempting to hike down, but remember: going down is optional, coming up is mandatory! Start early, carry lots of water, and know your limits.

## Sunset Points

Mather Point is popular, but Hopi Point or Yavapai Point offer equally stunning views with slightly fewer crowds.
    `,
        featured_image: getDestinationImage('grand-canyon-usa'),
        category: 'Nature',
        tags: ['USA', 'Nature', 'Hiking', 'National Park'],
        author: {
            name: 'Jack Miller',
            avatar: 'https://i.pravatar.cc/150?u=jack'
        },
        published_at: '2024-03-25T16:20:00Z',
        views: 2400,
        featured: true,
        destination: {
            name: 'Grand Canyon',
            images: [getDestinationImage('grand-canyon-usa')]
        }
    },
    {
        id: 16,
        slug: 'banff-canada',
        title: 'Banff: Rocky Mountain High',
        excerpt: 'Turquoise lakes, snowy peaks, and grizzly bears. Explore the wilderness of Banff National Park.',
        content: `
# The Crown Jewel of the Rockies: Banff

Banff National Park is Canada's oldest national park. It's a land of glaciers, icefields, and dense coniferous forests.

## Lake Louise & Moraine Lake

These are the most photographed lakes in the world for a reason. The turquoise color comes from rock flour carried into the lake by meltwater. Arrive before 6 AM or take a shuttle!

## Wildlife Spotting

Keep your eyes peeled (and your distance!) for elk, bighorn sheep, and bears. Dawn and dusk are the best times for viewing.

## Hot Springs

After a day of hiking or skiing, soak in the Banff Upper Hot Springs. The water is naturally heated and mineral-rich.
    `,
        featured_image: getDestinationImage('banff-canada'),
        category: 'Nature',
        tags: ['Canada', 'Mountains', 'Wildlife', 'Lake'],
        author: {
            name: 'Liam Smith',
            avatar: 'https://i.pravatar.cc/150?u=liam'
        },
        published_at: '2024-03-28T09:45:00Z',
        views: 2900,
        featured: true,
        destination: {
            name: 'Banff',
            images: [getDestinationImage('banff-canada')]
        }
    },
    {
        id: 17,
        slug: 'taj-mahal-india',
        title: 'Taj Mahal: A Monument to Love',
        excerpt: 'The story behind the marble masterpiece. Visitor tips for the Taj Mahal and Agra Fort.',
        content: `
# The Crown of Palaces: Taj Mahal

The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in Agra. It's a symbol of eternal love.

## The Best Views

*   **Inside**: The symmetry and intricate inlays are breathtaking.
*   **Mehtab Bagh**: A garden across the river offering a stunning sunset view of the Taj without the crowds.

## Agra Fort

Don't skip the nearby Agra Fort. It's a massive red sandstone fortress where Shah Jahan was imprisoned by his son, with a view of his creation.

## Local Crafts

Agra is famous for marble inlay work (Pietra Dura). You can see artisans working with the same techniques used to build the Taj.
    `,
        featured_image: getDestinationImage('taj-mahal-india'),
        category: 'Culture',
        tags: ['India', 'History', 'Culture', 'Wonders'],
        author: {
            name: 'Rohan Gupta',
            avatar: 'https://i.pravatar.cc/150?u=rohan'
        },
        published_at: '2024-04-01T12:00:00Z',
        views: 4100,
        featured: true,
        destination: {
            name: 'Taj Mahal',
            images: [getDestinationImage('taj-mahal-india')]
        }
    },
    {
        id: 18,
        slug: 'petra-jordan',
        title: 'Petra: Secrets of the Rose City',
        excerpt: 'Walking through the Siq to discover the Treasury. A guide to exploring Jordan\'s ancient archaeological wonder.',
        content: `
# The Rose City: Petra

Petra is an ancient city carved into pink sandstone cliffs. It was the capital of the Nabatean Kingdom and a major trading hub.

## The Siq

The entrance to Petra is a mile-long narrow gorge called the Siq. Walking through towering cliffs that block out the sky builds anticipation until...

## The Treasury (Al-Khazneh)

...you turn a corner and there it is. The most famous facade in Petra. Go early (6 AM) to have it to yourself.

## The Monastery (Ad Deir)

It's a hike (800 steps!), but the Monastery is larger and less crowded than the Treasury. The views from the top are spectacular.
    `,
        featured_image: getDestinationImage('petra-jordan'),
        category: 'History',
        tags: ['Jordan', 'History', 'Desert', 'Wonders'],
        author: {
            name: 'Layla Al-Fayed',
            avatar: 'https://i.pravatar.cc/150?u=layla'
        },
        published_at: '2024-04-05T08:30:00Z',
        views: 2600,
        featured: true,
        destination: {
            name: 'Petra',
            images: [getDestinationImage('petra-jordan')]
        }
    },
    {
        id: 19,
        slug: 'great-barrier-reef-australia',
        title: 'Diving Deep: The Great Barrier Reef',
        excerpt: 'Exploring the world\'s largest living structure. A guide to snorkeling, diving, and protecting this natural wonder.',
        content: `
# The Underwater Wonderland: Great Barrier Reef

The Great Barrier Reef is a place of staggering beauty and biodiversity.

## Ways to Explore

*   **Snorkeling**: Accessible to everyone. Floating above the coral gardens is magical.
*   **Scuba Diving**: For a closer look. Intro dives are available for beginners.
*   **Scenic Flights**: The only way to appreciate the scale of the reef (and see Heart Reef!).

## Protecting the Reef

"Look but don't touch" is the golden rule. Use reef-safe sunscreen and be mindful of your fin kicks to avoid damaging delicate coral.
    `,
        featured_image: getDestinationImage('great-barrier-reef-australia'),
        category: 'Nature',
        tags: ['Australia', 'Ocean', 'Diving', 'Wonders'],
        author: {
            name: 'Emma Coral',
            avatar: 'https://i.pravatar.cc/150?u=emma'
        },
        published_at: '2024-04-10T09:00:00Z',
        views: 1900,
        featured: true,
        destination: {
            name: 'Great Barrier Reef',
            images: [getDestinationImage('great-barrier-reef-australia')]
        }
    },
    {
        id: 20,
        slug: 'eiffel-tower-france',
        title: 'Secrets of the Eiffel Tower',
        excerpt: 'More than just a view. Discovering the history, hidden apartments, and best photo spots of the Iron Lady.',
        content: `
# The Iron Lady: Eiffel Tower

It was meant to be temporary, but today it is the symbol of France.

## Gustave's Secret Apartment

Did you know Gustave Eiffel built himself a small apartment at the top of the tower? It remains there today, complete with wax figures of Gustave and Thomas Edison.

## Best Photo Spots

Skip the base. Head to **Trocadéro** for the classic shot, or **Rue de l'Université** for a cobblestone street view.

## Dining with a View

Le Jules Verne on the second floor offers Michelin-starred dining. Book months in advance for the ultimate romantic dinner.
    `,
        featured_image: getDestinationImage('eiffel-tower-france'),
        category: 'City Break',
        tags: ['Paris', 'France', 'Landmarks', 'History'],
        author: {
            name: 'Jean-Pierre',
            avatar: 'https://i.pravatar.cc/150?u=jp'
        },
        published_at: '2024-04-12T18:00:00Z',
        views: 5200,
        featured: true,
        destination: {
            name: 'Eiffel Tower',
            images: [getDestinationImage('eiffel-tower-france')]
        }
    }
];
