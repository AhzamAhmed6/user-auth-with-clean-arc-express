import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import { postUser } from "./controllers/index.js";
import makeCallback from "./express-callback/index.js";

dotenv.config();

const apiRoot = process.env.DM_API_ROOT;
const app = express();
app.use(bodyParser.json());

app.use((_, res, next) => {
	res.set({ Tk: "!" });
	next();
});

app.post(`${apiRoot}/user`, makeCallback(postUser));

// listen for requests
app.listen(8000, () => {
	console.log("Server is listening on port 8000");
});

export default app;
