import { FirebaseAuthError } from "firebase-admin/auth";
import AccessDenied from "../system/errors/AccesDenie.mjs";
import BadRequest from "../system/errors/BadRequest.mjs";
import Forbiden from "../system/errors/Forbiden.mjs";
import ObjectNotFound from "../system/errors/ObjectNotFound.mjs";
import Unauthorized from "../system/errors/Unauthorized.mjs";

export default function errorHandler(error, _req, res, _next) {
  if (error instanceof ObjectNotFound) return res.error(404, error.message);

  if (error instanceof BadRequest) return res.error(400, error.message);

  if (error instanceof Unauthorized) return res.error(401, error.message);

  if (error instanceof AccessDenied) return res.error(403, error.message);

  if (error instanceof Forbiden) return res.error(403, error.message);
  
  if (error instanceof FirebaseAuthError) return res.error(401, error.message);

  console.log(error.message);

  return res.error(500);
}
