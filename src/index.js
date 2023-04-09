// Import modules
import express from "express";
import { config } from "dotenv";

// Import controllers
import userController from "./controllers/index.js";
import makeCallback from "./express-callback/index.js";

// Load environment variables
config();

// Create the app
const app = express();

// Add middleware
app.use(express.json());
app.use((_, res, next) => {
  res.set("Tk", "!");
  next();
});

// Define routes
const apiRoot = process.env.DM_API_ROOT;
app.post(`${apiRoot}/user`, makeCallback(userController.postUser));
app.post(`${apiRoot}/login`, makeCallback(userController.loginUser));

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Export the app
export default app;
