class BadRequest extends Error {
   constructor(message) {
      super(message || "Bad request");
   }
}

export default BadRequest;
