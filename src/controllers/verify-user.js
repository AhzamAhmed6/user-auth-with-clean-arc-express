export default function verifyUser(httpRequest) {
  const headers = {
    "Content-Type": "application/json",
  };
  const valid = !!httpRequest.user;
  return {
    headers,
    statusCode: 200,
    body: { valid },
  };
}
