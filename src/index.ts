import dotenv from "dotenv";
import http from "http";
import createExpressApp from "./services/express.service";
import sequelizeService from "./services/sequelize.service"; // Adjusted to match your service structure
import apiRouter from "./routes/authRoute"; // Import your routes here

dotenv.config();

// Initialize the Express app
const app = createExpressApp();

app.use("/api", apiRouter); // Mount the router to /api

// Initialize and sync Sequelize
sequelizeService.init()
    .then(async () => {
        if (sequelizeService.connection) {
            await sequelizeService.connection.authenticate(); // Ensure the connection is established
            console.log("Database connected successfully");
        } else {
            console.error("Database connection is not initialized.");
        }
    })
    .catch((error: Error) => console.error("Error connecting to the database:", error));

// Create and start the HTTP server
const port = process.env.SERVER_PORT || 3000; // Get the port from the environment variables
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
