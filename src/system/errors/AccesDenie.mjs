class AccessDenied extends Error {
   constructor(message) {
      super(
         message ||
            "Insufficient privilege or the access token provided is expired, revoked"
      );
   }
}

export default AccessDenied;
