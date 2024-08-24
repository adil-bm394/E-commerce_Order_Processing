const getOtpEmailTemplate = (email, otp) => {
  return `
    <div style="font-family: Arial, sans-serif; text-align: center;">
      <h2>Your OTP Code</h2>
      <p>Hello,</p>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>Please use this code to complete your verification. This code is valid for 5 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <br>
      <p>Thank you,</p>
      <p>Binmile</p>
    </div>
  `;
};

module.exports = getOtpEmailTemplate;
