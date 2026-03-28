# BeatHub Backend

A MongoDB/Mongoose schema design for a music streaming app.

## How to Run

Before seeding the database, make sure you have Node.js installed and a MongoDB instance available locally or through a cloud connection string.

1. Install dependencies:
   `npm i`
2. Create a `.env` file and add the MongoDB connection string required by the project.
3. Run the seed script:
   `node scripts/seed.js`

## Troubleshooting

- If the seed script fails to connect, verify that your MongoDB server is running and that the value in `.env` is correct.
- If you see missing package errors, run `npm i` again from the project root.
- If environment variables are not being picked up, confirm the `.env` file is in the root of the project and uses the expected variable names.
