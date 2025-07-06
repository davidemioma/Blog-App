## Project Setup & Run Instructions

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd <your-project-folder>
   ```

2. **Install dependencies (using Bun):**

   ```bash
   bun install
   ```

3. **Set up environment variables:**

   - Copy `.env.example` to `.env` and fill in the required values.
   - For reference, see the `.env.example` file.

   **External Services Setup:**

   - **Postgres:**
     - [Set up Postgres with pgAdmin](https://www.pgadmin.org/download/)
     - [Set up a free Postgres database with Neon](https://neon.tech/)
   - **Clerk (Authentication):**
     - [Set up Clerk account and application](https://clerk.com/docs/get-started)
   - **Amazon S3 & CloudFront (for CDN):**
     - [Set up an S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)
     - [Set up an IAM user for S3 access](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html)
     - [Set up CloudFront for S3 CDN](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.html)

4. **Set up the database:**

   - Generate Prisma types and client:
     ```bash
     bun run db:generate
     ```
   - Run migrations:
     ```bash
     bun run db:migrate
     bun run db:push
     ```
   - (Optional) Open Prisma Studio:
     ```bash
     bun run db:studio
     ```

5. **Seed the database (optional):**

   ```bash
   bun run db:seed
   ```

6. **Run the development server:**

   ```bash
   bun run dev
   ```

7. **Open the app:**
   - Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Technology Choices and Rationale

- **Next.js**: Chosen for its excellent SEO support, full-stack capabilities, and built-in features like server-side rendering and API routes. Next.js enables rapid development of scalable, production-ready applications. Server Actions are utilized for efficient data mutations and fetching.

- **TanStack Query**: Used for managing server state, caching, and synchronizing data between the client and server. It simplifies data fetching and provides a robust solution for handling API queries and mutations, especially in combination with Next.js server actions.

- **Tailwind CSS**: Provides a utility-first approach to styling, enabling rapid UI development with consistent design and minimal custom CSS. It enhances productivity and maintainability of styles.

- **shadcn/ui**: Offers a set of accessible, customizable, and beautifully designed UI components that integrate seamlessly with Tailwind CSS, speeding up the development of consistent user interfaces.

- **Mantine**: Used as an additional UI library, particularly for its powerful and flexible components. Mantine's Rich Text Editor is leveraged for content creation, providing a modern and user-friendly editing experience.

- **Clerk**: Selected for authentication due to its simplicity, scalability, and developer-friendly APIs. Clerk provides secure, out-of-the-box authentication and user management, including social login and multi-factor authentication, reducing the overhead of building custom auth solutions.

- **AWS S3 & CloudFront**: Used for file storage and CDN delivery. S3 offers reliable, scalable, and cost-effective object storage, while CloudFront ensures fast and secure content delivery globally. Together, they provide a robust solution for handling user uploads and serving static assets efficiently. IAM users are configured for secure programmatic access.

- **Postgres**: Chosen as the primary database for its reliability, scalability, and support for advanced data types and queries. Postgres is well-suited for modern web applications requiring strong consistency and complex querying.

- **Prisma**: Used as the ORM for type-safe database access, schema migrations, and easy integration with TypeScript. Prisma streamlines database operations, improves developer productivity, and ensures data integrity.

## AI Tools Used and How They Helped

- **Cursor IDE (AI-Powered):**
  - Leveraged Cursor's AI capabilities to accelerate development, improve code quality, and enhance productivity. The AI assistant provided intelligent code suggestions, automated repetitive tasks, and assisted in code reviews, making the development process more efficient.
  - Cursor's AI features were particularly helpful for quickly generating boilerplate code, refactoring, and identifying potential issues early in the development cycle.
  - While AI tools significantly boost efficiency, it is essential to carefully review and test any AI-generated code to ensure correctness, maintainability, and to prevent the introduction of bugs or security vulnerabilities.
  - Overall, integrating AI into the workflow proved invaluable for both speed and quality, but always with a human-in-the-loop approach for validation and oversight.

## Assumptions Made During Development

- **Authentication:**

  - Assumed that all users will authenticate via Clerk, and that Clerk will handle user management, session security, and social login integrations. No custom authentication logic was implemented outside of Clerk's provided features.

- **Storage:**

  - Assumed that all file uploads and static assets will be stored in AWS S3, with proper IAM permissions configured for secure access. No local or alternative storage solutions were considered.

- **CDN:**

  - Assumed that CloudFront will be used as the CDN for serving static assets and user uploads from S3, ensuring fast and reliable content delivery globally.

- **Deployment Environment:**

  - Assumed the application will be deployed in a modern cloud environment (e.g., Vercel, AWS, or similar) with support for environment variables, serverless functions, and scalable infrastructure. Local development is expected to closely mirror the production environment.

- **Third-Party Services:**
  - Assumed that all required third-party services (Clerk, AWS S3, CloudFront, Postgres/Neon) are available, properly configured, and accessible from both development and production environments. Service credentials and API keys are managed securely via environment variables.

## Areas for Improvement Given More Time

- **Comprehensive Testing:**

  - Increase test coverage with more unit, integration, and end-to-end tests to ensure reliability and catch regressions early.

- **Robust CI/CD:**

  - Implement a more advanced continuous integration and deployment pipeline for automated testing, linting, and seamless deployments to production.

- **Advanced Features:**

  - Add more user-facing features and enhancements to improve the overall experience and functionality of the application.

- **Accessibility:**

  - Improve accessibility (a11y) across the application to ensure it is usable by everyone, including those with disabilities, by following best practices and conducting accessibility audits.

- **Scalability & Architecture:**

  - As the application grows, consider migrating to a separate backend or adopting a microservices architecture to improve scalability, maintainability, and performance.

- **Caching Strategies:**

  - Implement more advanced caching solutions, such as Redis, to optimize performance and reduce database load.

- **UI/UX Enhancements:**
  - Continuously refine the user interface and user experience, leveraging user feedback and modern design trends to make the application more intuitive and visually appealing.
