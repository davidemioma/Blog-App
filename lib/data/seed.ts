import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Random images from Unsplash for thumbnails
export const randomImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
];

// Default random image
export const defaultRandomImage =
  "https://images.unsplash.com/photo-e-21bda4d32df4?w=800&h=600&fit=crop";

// Function to pick a random image
export function getRandomImage(): string {
  const randomIndex = Math.floor(Math.random() * randomImages.length);

  return randomImages[randomIndex];
}

// Sample post data
const posts = [
  {
    title: "The Future of Web Development: What's Next?",
    content:
      "Web development is constantly evolving. From the rise of AI-powered tools to the increasing importance of performance and accessibility, developers need to stay ahead of the curve. This post explores the latest trends and what we can expect in the coming years.",
  },
  {
    title: "Getting Started with TypeScript: A Beginner's Guide",
    content:
      "TypeScript has become an essential tool for modern web development. Learn the basics, understand why it's important, and discover how to integrate it into your existing JavaScript projects.",
  },
  {
    title: "Building Scalable APIs with Node.js and Express",
    content:
      "Creating robust and scalable APIs is crucial for any modern application. This guide covers best practices, error handling, authentication, and performance optimization techniques.",
  },
  {
    title: "React Hooks: A Deep Dive into State Management",
    content:
      "React Hooks have revolutionized how we manage state and side effects in functional components. Learn about useState, useEffect, useContext, and custom hooks with practical examples.",
  },
  {
    title: "Database Design Principles for Modern Applications",
    content:
      "Good database design is the foundation of any successful application. This post covers normalization, indexing strategies, and how to design for scalability and performance.",
  },
  {
    title: "CSS Grid vs Flexbox: When to Use Each",
    content:
      "Both CSS Grid and Flexbox are powerful layout tools, but they serve different purposes. Learn when to use each one and how to combine them for complex layouts.",
  },
  {
    title: "Testing Strategies for Full-Stack Applications",
    content:
      "Comprehensive testing is essential for maintaining code quality. Explore unit testing, integration testing, and end-to-end testing strategies for modern web applications.",
  },
  {
    title: "Performance Optimization Techniques for Web Apps",
    content:
      "Speed matters in web applications. Discover techniques for optimizing loading times, reducing bundle sizes, and improving user experience through better performance.",
  },
  {
    title: "Security Best Practices for Web Developers",
    content:
      "Security should be a top priority for every developer. Learn about common vulnerabilities, authentication best practices, and how to protect your applications from attacks.",
  },
  {
    title: "Deploying Applications with Docker and Kubernetes",
    content:
      "Containerization and orchestration are essential skills for modern developers. Learn how to containerize your applications and deploy them using Docker and Kubernetes.",
  },
  {
    title: "GraphQL vs REST: Choosing the Right API Architecture",
    content:
      "Both GraphQL and REST have their strengths. Understand the differences, use cases, and how to choose the right approach for your project requirements.",
  },
  {
    title: "State Management in React: Redux vs Context API",
    content:
      "Managing state in React applications can be challenging. Compare Redux and Context API, and learn when to use each approach for optimal state management.",
  },
  {
    title: "Building Progressive Web Apps (PWAs)",
    content:
      "Progressive Web Apps combine the best of web and mobile applications. Learn how to build PWAs that work offline, provide native-like experiences, and improve user engagement.",
  },
  {
    title: "Microservices Architecture: Benefits and Challenges",
    content:
      "Microservices offer scalability and flexibility but come with their own challenges. Explore the benefits, trade-offs, and implementation strategies for microservices architecture.",
  },
  {
    title: "Machine Learning Integration in Web Applications",
    content:
      "AI and ML are transforming web applications. Learn how to integrate machine learning models into your web apps and provide intelligent features to your users.",
  },
  {
    title: "Serverless Computing: The Future of Backend Development",
    content:
      "Serverless computing is changing how we build and deploy applications. Discover the benefits, use cases, and best practices for serverless architecture.",
  },
  {
    title: "Mobile-First Design: Creating Responsive Web Experiences",
    content:
      "With mobile usage surpassing desktop, mobile-first design is more important than ever. Learn how to create responsive designs that work beautifully on all devices.",
  },
  {
    title: "Continuous Integration and Deployment (CI/CD)",
    content:
      "Automating your development workflow is crucial for modern teams. Learn how to set up CI/CD pipelines that improve code quality and deployment efficiency.",
  },
  {
    title: "Web Accessibility: Building Inclusive Applications",
    content:
      "Accessibility is not just a legal requirement—it's the right thing to do. Learn how to build web applications that are accessible to users with disabilities.",
  },
  {
    title: "Real-time Communication with WebSockets",
    content:
      "Real-time features are becoming standard in modern web applications. Learn how to implement WebSockets for chat applications, live updates, and interactive features.",
  },
];

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create a default user for seeding
  const defaultUser = await prisma.user.upsert({
    where: { clerkId: "seed_user" },
    update: {},
    create: {
      clerkId: "seed_user",
      email: "seed@example.com",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      username: "seed_user",
    },
  });

  console.log("✅ Default user created for seeding:", defaultUser.username);

  // Create posts with thumbnails
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const imageUrl = getRandomImage();
    const imageKey = `post-${i + 1}-thumbnail`;

    // Create the post
    const createdPost = await prisma.post.create({
      data: {
        userId: defaultUser.id,
        title: post.title,
        content: post.content,
      },
    });

    // Create the thumbnail
    await prisma.thumbnail.create({
      data: {
        postId: createdPost.id,
        key: imageKey,
        url: imageUrl,
      },
    });

    console.log(`✅ Created post: ${post.title}`);
  }

  console.log("🎉 Database seeding completed successfully!");
  console.log(`📊 Created ${posts.length} posts with thumbnails`);
  console.log(`👤 Default user: ${defaultUser.username}`);
  console.log(`🖼️  Default random image: ${defaultRandomImage}`);
}

// Run the main function when this file is executed directly
if (require.main === module) {
  main()
    .catch((e) => {
      console.error("❌ Error in main function:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
