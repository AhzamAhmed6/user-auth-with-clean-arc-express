import express from "express";
import dotenv from "dotenv";

import userController from "./controllers/index.js";
import makeCallback from "./express-callback/index.js";

dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(express.json());
app.use((_, res, next) => {
  res.set("Tk", "!");
  next();
});

// Routes
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
