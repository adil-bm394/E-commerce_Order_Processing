const { body, validationResult } = require("express-validator");

const orderValidationRules = [
  body("product")
    .notEmpty()
    .withMessage("Product name is required.")
    .isString()
    .withMessage("Product name must be a string.")
    .isLength({ min: 3 })
    .withMessage("Product name must be at least 3 characters long."),

  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number."),

  body("quantity")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be a positive integer."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { orderValidationRules };
