/* ----------------------------- HANDLER ----------------------------- */

// Normalise a query value: trim, lowercase, strip quotes
function norm(v) {
  if (Array.isArray(v)) v = v[0];       // ?gender=male&gender=female → take first
  if (typeof v !== "string") return undefined;
  return v.trim().toLowerCase().replace(/^["']|["']$/g, "");
}

module.exports = async (req, res) => {
  // ---- CORS ----
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key, authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method Not Allowed",
      message: "Only GET requests are supported.",
      creator: CREATOR
    });
  }

  // ---- API KEY ----
  const validKey = process.env.API_KEY;
  const providedKey =
    req.headers["x-api-key"] ||
    (req.headers["authorization"] || "").replace("Bearer ", "") ||
    req.query.api_key;

  if (!validKey) {
    return res.status(500).json({
      error: "Server Misconfigured",
      message: "API_KEY environment variable is not set on the server.",
      creator: CREATOR
    });
  }

  if (!providedKey || providedKey !== validKey) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or missing API key. Send it via 'x-api-key' header or '?api_key=' query parameter.",
      creator: CREATOR
    });
  }

  /* ---------------------------------------------------------------
     PARAM PARSING
     Supported:
       ?api_key=KEY            (required)
       &gender=male|female     (optional)  aliases: ?g=  ?sex=
       &nat=US|IN|DK|...       (optional)  aliases: ?country=  ?nationality=
       &results=1..50          (optional)  aliases: ?count=  ?limit=
       &seed=anything          (optional, echoed back)
       &noinfo=true            (optional, hides info block)
  --------------------------------------------------------------- */

  // --- gender ---
  const rawGender = norm(req.query.gender ?? req.query.g ?? req.query.sex);
  let gender;
  if (rawGender === undefined || rawGender === "" || rawGender === "all" || rawGender === "any") {
    gender = undefined; // random
  } else if (rawGender === "male" || rawGender === "m" || rawGender === "man" || rawGender === "boy") {
    gender = "male";
  } else if (rawGender === "female" || rawGender === "f" || rawGender === "woman" || rawGender === "girl") {
    gender = "female";
  } else {
    return res.status(400).json({
      error: "Bad Request",
      message: `Invalid gender "${rawGender}". Allowed values: "male", "female" (or omit for random).`,
      creator: CREATOR
    });
  }

  // --- nationality ---
  const rawNat = norm(req.query.nat ?? req.query.country ?? req.query.nationality);
  const validNats = ["US","GB","CA","AU","IN","DE","FR","DK","UA","BR"];
  let nat;
  if (rawNat === undefined || rawNat === "") {
    nat = undefined;
  } else if (validNats.includes(rawNat.toUpperCase())) {
    nat = rawNat.toUpperCase();
  } else {
    return res.status(400).json({
      error: "Bad Request",
      message: `Invalid nationality "${rawNat}". Allowed: ${validNats.join(", ")}.`,
      creator: CREATOR
    });
  }

  // --- results ---
  const rawResults = parseInt(req.query.results ?? req.query.count ?? req.query.limit, 10);
  const results = Math.min(Math.max(Number.isFinite(rawResults) ? rawResults : 1, 1), 50);

  // --- misc ---
  const seed = norm(req.query.seed) || crypto.randomBytes(8).toString("hex");
  const noInfo = norm(req.query.noinfo) === "true";

  // ---- GENERATE ----
  const users = Array.from({ length: results }, () => generateUser({ gender, nat }));

  const payload = {
    results: users,
    creator: CREATOR
  };

  if (!noInfo) {
    payload.info = {
      seed,
      results: users.length,
      page: 1,
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      filters: {
        gender: gender || "random",
        nat: nat || "random"
      },
      creator: CREATOR
    };
  }

  return res.status(200).json(payload);
};
