const getNotificationTemplate = (name, product) => {
  return `
    <div style="font-family: Arial, sans-serif; text-align: center;">
      <h2>Your Ordered Product: ${product}</h2>
      <p>Hello, ${name}</p>
      <p>Your order has been successfully processed.</p>
      <br>
      <p>Thank you,</p>
      <p>${name}</p>
    </div>
  `;
};

module.exports = getNotificationTemplate;
