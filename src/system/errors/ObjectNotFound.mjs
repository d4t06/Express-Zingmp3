
class ObjectNotFound extends Error {
   constructor(message) {
      super(message || "Object not found");
   }
}

export default ObjectNotFound;
