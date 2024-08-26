const getNotificationTemplate = (name, product) => {
  return `
    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333;">Your Order Confirmation</h2>
        <p style="color: #555;">Hello <strong>${name}</strong>,</p>
        <p style="color: #555;">Thank you for your order! We're pleased to inform you that your order for <strong>${product}</strong> has been successfully processed.</p>
        <br>
        <p style="color: #555;">Thank you for shopping with us,</p>
        <p style="color: #333; font-weight: bold;">The ShopSphere Team</p>
      </div>
    </div>
  `;
};

module.exports = getNotificationTemplate;
