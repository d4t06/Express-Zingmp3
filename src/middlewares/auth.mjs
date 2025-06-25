import Unauthorized from "../system/errors/Unauthorized.mjs";
import { getAuth } from "firebase-admin/auth";

export default async function authMiddleWare(req, _res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) throw new Unauthorized();

    const token = auth.split(" ")[1];
    const decode = await getAuth().verifyIdToken(token);
    req.user = decode;

    next();
  } catch (error) {
    next(error);
  }
}
