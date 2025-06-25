class Forbiden extends Error {
   constructor(message) {
      super(
         message ||
            "Forbiden"
      );
   }
}

export default Forbiden;
