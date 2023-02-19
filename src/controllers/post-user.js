export default function makePostUser({ addUser }) {
	return async function postUser(httpRequest) {
		try {
			const userInfo = httpRequest.body;
			const posted = await addUser(userInfo);
			return {
				headers: {
					"Content-Type": "application/json",
					"Last-Modified": new Date(posted.modifiedOn).toUTCString(),
				},
				statusCode: 201,
				body: { posted },
			};
		} catch (e) {
			// TODO: Error logging
			console.log("🚀 ~ file: post-user.js:15 ~ postUser ~ e", e);

			return {
				headers: {
					"Content-Type": "application/json",
				},
				statusCode: 400,
				body: {
					error: e.message,
				},
			};
		}
	};
}
