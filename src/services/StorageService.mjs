import ImageKit from "imagekit";

class StorageService {
	imagekit;

	constructor() {
		this.imagekit = new ImageKit({
			publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
			privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
			urlEndpoint: "https://ik.imagekit.io/rzqxwvwoc",
		});
	}

	async auth(_req, res, next) {
		try {
			const { token, expire, signature } =
				this.imagekit.getAuthenticationParameters();

			return res.success(200, {
				token,
				expire,
				signature,
				publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
			});
		} catch (error) {
			next(error);
		}
	}

	async delete(req, res, next) {
		try {
			await this.imagekit.deleteFile(req.params.fileId);
			return res.success(200, "Delete file ok");
		} catch (error) {
			next(error);
		}
	}
}

export default StorageService;
