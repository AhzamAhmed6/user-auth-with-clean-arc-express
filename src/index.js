// Import modules
import { config } from "dotenv";
import express from "express";
import logger from "./logger/index.js";

// Import middlewares
import authUser from "./middleware/index.js";

// Import controllers
import userController from "./controllers/index.js";
import makeCallback from "./express-callback/index.js";

// Load environment variables
config();

// Create the app
const app = express();

// Add middleware
app.use(express.json());

const setTkHeader = (req, res, next) => {
  res.set("Tk", "!");
  next();
};
app.use(setTkHeader);

const apiRoot = process.env.DM_API_ROOT;

// Define routes
app.post(`${apiRoot}/user`, makeCallback(userController.postUser));
app.post(`${apiRoot}/login`, makeCallback(userController.loginUser));
app.delete(
  `${apiRoot}/delete`,
  authUser,
  makeCallback(userController.deleteUser)
);
app.get(`${apiRoot}/verify`, authUser, makeCallback(userController.verifyUser));
app.get(
  `${apiRoot}/issuetoken`,
  authUser,
  makeCallback(userController.issueToken)
);
app.patch(
  `${apiRoot}/changepassword`,
  authUser,
  makeCallback(userController.patchPassword)
);
app.patch(
  `${apiRoot}/changename`,
  authUser,
  makeCallback(userController.patchUserName)
);

// Start the server
const PORT = process.env.PORT || 8000;

app
  .listen(PORT, () => {
    logger.info(`Server is listening on port ${PORT}`);
  })
  .on("error", (err) => {
    logger.error(
      `An error was encountered during server startup.\n\t\t${err.stack}`
    );
  });

// Export the app
export default app;
