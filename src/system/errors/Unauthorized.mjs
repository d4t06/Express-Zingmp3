class Unauthorized extends Error {
    constructor(message) {
       super(
          message ||
             "Unauthorized"
       );
    }
 }
 
 export default Unauthorized;
 