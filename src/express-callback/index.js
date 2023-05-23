import logger from "../logger/index.js";

function makeExpressCallback({
  createHttpRequest,
  sendHttpResponse,
  handleException,
}) {
  return function expressCallback(controller) {
    return async (req, res) => {
      try {
        const httpRequest = createHttpRequest(req);
        const httpResponse = await controller(httpRequest);
        sendHttpResponse(res, httpResponse);
      } catch (error) {
        handleException(res, error);
      }
    };
  };
}
function createHttpRequest(req) {
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
  if (req.user != undefined) {
    httpRequest.user = req.user;
  }
  return httpRequest;
}

function sendHttpResponse(res, httpResponse) {
  const headers = httpResponse.headers || {};
  Object.entries(headers).forEach(([key, value]) => {
    res.set(key, value);
  });
  res.status(httpResponse.statusCode).json(httpResponse.body);
}

function handleException(res, error) {
  logger.error(`Error: ${error}`);
  res.status(500).json({ error: "An unknown error occurred." });
}

const expressCallback = makeExpressCallback({
  createHttpRequest,
  sendHttpResponse,
  handleException,
});

export default expressCallback;
