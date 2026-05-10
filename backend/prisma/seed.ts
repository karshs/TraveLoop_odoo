import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌍 Seeding database with cities and activities...");

  // Clear existing data (optional)
  // await prisma.activity.deleteMany({});
  // await prisma.city.deleteMany({});

  // Create cities
  const cities = [
    {
      name: "Paris",
      country: "France",
      region: "Île-de-France",
      slug: "paris-france",
      popularity_score: 95,
      avg_cost_per_day: 120,
      latitude: 48.8566,
      longitude: 2.3522,
      description: "The City of Light, known for romance, art, and cuisine.",
    },
    {
      name: "Tokyo",
      country: "Japan",
      region: "Kanto",
      slug: "tokyo-japan",
      popularity_score: 92,
      avg_cost_per_day: 110,
      latitude: 35.6762,
      longitude: 139.6503,
      description: "A vibrant metropolis blending tradition and modernity.",
    },
    {
      name: "New York",
      country: "USA",
      region: "New York",
      slug: "newyork-usa",
      popularity_score: 90,
      avg_cost_per_day: 150,
      latitude: 40.7128,
      longitude: -74.006,
      description: "The city that never sleeps, full of energy and culture.",
    },
    {
      name: "Barcelona",
      country: "Spain",
      region: "Catalonia",
      slug: "barcelona-spain",
      popularity_score: 88,
      avg_cost_per_day: 90,
      latitude: 41.3874,
      longitude: 2.1686,
      description:
        "Gaudí's architectural masterpieces and Mediterranean charm.",
    },
    {
      name: "Sydney",
      country: "Australia",
      region: "New South Wales",
      slug: "sydney-australia",
      popularity_score: 85,
      avg_cost_per_day: 130,
      latitude: -33.8688,
      longitude: 151.2093,
      description: "Iconic Opera House and stunning beaches.",
    },
  ];

  const createdCities = await Promise.all(
    cities.map((city) =>
      prisma.city.upsert({
        where: { slug: city.slug },
        update: city,
        create: city,
      }),
    ),
  );

  console.log(`✅ Created ${createdCities.length} cities`);

  // Create activities for each city
  const activitiesData = [
    {
      citySlug: "paris-france",
      activities: [
        {
          name: "Eiffel Tower",
          description: "Visit the iconic symbol of Paris",
          category: "SIGHTSEEING",
          estimated_cost: 30,
          duration_hours: 2,
        },
        {
          name: "Louvre Museum",
          description: "World's largest art museum",
          category: "CULTURE",
          estimated_cost: 17,
          duration_hours: 3,
        },
        {
          name: "Seine River Cruise",
          description: "Romantic boat tour through Paris",
          category: "SIGHTSEEING",
          estimated_cost: 15,
          duration_hours: 2,
        },
        {
          name: "French Cooking Class",
          description: "Learn to cook authentic French cuisine",
          category: "FOOD_AND_DRINK",
          estimated_cost: 100,
          duration_hours: 3,
        },
      ],
    },
    {
      citySlug: "tokyo-japan",
      activities: [
        {
          name: "Senso-ji Temple",
          description: "Ancient Buddhist temple with traditional gate",
          category: "CULTURE",
          estimated_cost: 0,
          duration_hours: 1.5,
        },
        {
          name: "Shibuya Crossing",
          description: "Experience the world's busiest pedestrian crossing",
          category: "SIGHTSEEING",
          estimated_cost: 0,
          duration_hours: 1,
        },
        {
          name: "Sushi Dinner",
          description: "Authentic sushi experience",
          category: "FOOD_AND_DRINK",
          estimated_cost: 80,
          duration_hours: 2,
        },
        {
          name: "Mt. Fuji Day Trip",
          description: "Visit Japan's iconic mountain",
          category: "ADVENTURE",
          estimated_cost: 50,
          duration_hours: 8,
        },
      ],
    },
    {
      citySlug: "newyork-usa",
      activities: [
        {
          name: "Statue of Liberty",
          description: "Icon of freedom and democracy",
          category: "SIGHTSEEING",
          estimated_cost: 25,
          duration_hours: 3,
        },
        {
          name: "Central Park Walk",
          description: "Explore NYC's green lung",
          category: "NATURE",
          estimated_cost: 0,
          duration_hours: 2,
        },
        {
          name: "Broadway Show",
          description: "Catch a world-class theater production",
          category: "NIGHTLIFE",
          estimated_cost: 150,
          duration_hours: 3,
        },
        {
          name: "Times Square",
          description: "Experience the energy of the city",
          category: "SIGHTSEEING",
          estimated_cost: 0,
          duration_hours: 1,
        },
      ],
    },
  ];

  for (const { citySlug, activities } of activitiesData) {
    const city = createdCities.find((c) => c.slug === citySlug);
    if (city) {
      await Promise.all(
        activities.map(async (activity) => {
          const existing = await prisma.activity.findFirst({
            where: {
              city_id: city.id,
              name: activity.name,
            },
          });
          if (existing) {
            return prisma.activity.update({
              where: { id: existing.id },
              data: activity,
            });
          } else {
            return prisma.activity.create({
              data: {
                ...activity,
                city_id: city.id,
              },
            });
          }
        }),
      );
      console.log(
        `✅ Created ${activities.length} activities for ${city.name}`,
      );
    }
  }

  console.log("🌱 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
