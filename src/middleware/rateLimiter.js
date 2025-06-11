import ratelimit from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my rate limit");
    if (!success) {
      return res
        .status(429)
        .json({ error: "Rate limit exceeded. Please try again later." });
    }
    next();
  } catch (error) {
    console.log("Rate limiter error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default ratelimiter;
