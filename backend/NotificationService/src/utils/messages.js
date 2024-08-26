const messages = {
  INVALID_TOKEN: "Invalid Token",

};

module.exports = messages;




function getSubject(product) {
  return `Order Confirmation: ${product} - Your Order has been Processed!`;
}

module.exports = getSubject;
