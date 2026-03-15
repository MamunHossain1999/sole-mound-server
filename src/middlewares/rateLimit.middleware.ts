import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 মিনিট
  max: 100, // 1 IP 100 request per window
  message: "Too many requests from this IP, try again later",
});

export default limiter;