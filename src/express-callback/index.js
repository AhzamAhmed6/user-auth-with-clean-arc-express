import logger from "../logger/index.js";

export default function makeExpressCallback(controller) {
  return async (req, res) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      method: req.method,
      path: req.path,
      headers: {
        "Content-Type": req.get("Content-Type"),
        Authorization: req.get("Authorization"),
      },
    };
    // for the routes that called authUser middeware
    if (req.user != undefined) {
      httpRequest.user = req.user;
    }
    if (req.valid != undefined) {
      httpRequest.valid = req.valid;
    }
    try {
      const httpResponse = await controller(httpRequest);
      const headers = httpResponse.headers || {};
      Object.entries(headers).forEach(([key, value]) => {
        res.set(key, value);
      });
      res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (error) {
      logger.error(`Error: ${error}`);
      res.status(500).json({ error: "An unknown error occurred." });
    }
  };
}
