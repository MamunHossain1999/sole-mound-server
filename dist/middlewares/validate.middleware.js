"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            const errorMessage = err.issues[0]?.message || "Validation Error";
            res.status(400).json({ message: errorMessage });
        }
        else {
            res.status(400).json({ message: "Validation Error" });
        }
    }
};
exports.validate = validate;
