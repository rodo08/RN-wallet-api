import ratelimit from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
  try {
    //userID, ipAddress, etc
    const key = `rate-limit-ip-${req.ip}`;
    const { success } = await ratelimit.limit(key);

    if (!success) {
      return res
        .status(429)
        .json({ message: "Too many requests, try again later" });
    }

    next();
  } catch {
    console.log("Rate limit error", error);
    next(error);
  }
};

export default ratelimiter;
