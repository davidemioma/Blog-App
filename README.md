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
