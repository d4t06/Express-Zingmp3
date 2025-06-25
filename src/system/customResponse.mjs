export default function customResponse (app) {
	// Extend the Express response prototype
	app.response.success = function (code, data, message = "Success") {
		this.status(code).json({
			status: "success",
			message: message,
			data: data,
			time: Date.now(),
		});
	};

	app.response.error = function (statusCode, message = "Error") {
		this.status(statusCode).json({
			status: "error",
			message: message,
			time: Date.now(),
		});
	};
}
