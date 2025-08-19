export default async function cronCheckSecret(req, res, next) {
  try {
    if (req.headers["x-cron-secret"] !== process.env.CRON_SECRET) {
      return res.error(
        401,
        `Unauthorized access attempt to cron endpoint:', ${req.ip}`,
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}
