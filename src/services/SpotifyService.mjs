class SpotifyService {
	getToken = async (req, res, next) => {
		try {
			const authString = new Buffer.from(
				process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET,
			).toString("base64");

			const response = await fetch("https://accounts.spotify.com/api/token", {
				method: "POST",
				body: "grant_type=client_credentials",
				// body: { grant_type: "client_credentials" },
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Basic ${authString}`,
				},
			});

			const data = await response.json();

			res.success(200, data);
		} catch (error) {
			next(error);
		}
	};
}

export default new SpotifyService();
