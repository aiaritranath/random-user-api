// api/index.js
// Private Random User API
// Creator: Aritra Nath | Instagram: @its_aritra_nath

"use strict";

const crypto = require("crypto");

/* ===== CREATOR MUST BE FIRST ===== */
const CREATOR = {
  name: "Aritra Nath",
  instagram: "@its_aritra_nath",
  instagramUrl: "https://instagram.com/its_aritra_nath",
  project: "Private Random User API"
};

/* ===================== DATA POOLS ===================== */

const MALE_FIRST = ["James","Liam","Noah","Oliver","Elijah","William","Henry","Lucas","Benjamin","Theodore","Mateo","Jack","Alexander","Daniel","Michael","Mason","Sebastian","Ethan","Logan","Owen","Samuel","Jacob","Asher","Aiden","John","Joseph","Wyatt","David","Leo","Luke","Julian","Hudson","Grayson","Matthew","Ezra","Gabriel","Carter","Isaac","Jayden","Luca","Anthony","Dylan","Lincoln","Thomas","Maverick","Elias","Josiah","Charles","Caleb","Christopher","Arjun","Rohan","Aditya","Vikram","Karan","Rahul","Aarav","Ishaan"];
const FEMALE_FIRST = ["Olivia","Emma","Charlotte","Amelia","Sophia","Isabella","Ava","Mia","Evelyn","Luna","Harper","Camila","Sofia","Scarlett","Elizabeth","Eleanor","Emily","Chloe","Mila","Violet","Penelope","Gianna","Aria","Abigail","Ella","Avery","Hazel","Nora","Layla","Lily","Aurora","Nova","Ellie","Madison","Grace","Isla","Willow","Zoe","Riley","Stella","Eliana","Ivy","Victoria","Emilia","Lucy","Everly","Lainey","Kinsley","Naomi","Delilah","Priya","Ananya","Aditi","Riya","Sneha","Neha","Kavya","Aisha"];
const LAST = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores","Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter","Roberts","Sharma","Patel","Kumar","Singh","Reddy","Nair","Iyer","Gupta","Mehta","Shah"];

const COUNTRIES = [
  { name:"United States", code:"US", states:["California","Texas","Florida","New York","Illinois","Pennsylvania","Ohio","Georgia","Michigan","Arizona"], cities:["Los Angeles","Houston","Miami","New York","Chicago","Philadelphia","Columbus","Atlanta","Detroit","Phoenix"], streets:["Maple","Oak","Pine","Cedar","Elm","Washington","Lake","Hill","Sunset","Riverside"], suffixes:["St","Ave","Blvd","Dr","Ln","Rd"], postcode:()=>pad(randInt(10000,99999),5), phone:()=>`(${randInt(200,999)}) ${randInt(200,999)}-${pad(randInt(0,9999),4)}`, tz:["America/New_York","America/Chicago","America/Denver","America/Los_Angeles"], tzOffset:["-5:00","-6:00","-7:00","-8:00"] },
  { name:"United Kingdom", code:"GB", states:["England","Scotland","Wales","Northern Ireland"], cities:["London","Manchester","Birmingham","Leeds","Glasgow","Liverpool","Bristol","Edinburgh","Cardiff","Belfast"], streets:["High","Church","Station","Victoria","King","Queen","Mill","Park","Green","Albion"], suffixes:["Street","Road","Avenue","Lane","Close","Way"], postcode:()=>`${pick(["EC","WC","N","E","SE","SW","W","NW"])}${randInt(1,20)} ${randInt(1,9)}${letter()}${letter()}`, phone:()=>`0${randInt(1000,9999)} ${randInt(100000,999999)}`, tz:["Europe/London"], tzOffset:["+0:00"] },
  { name:"Canada", code:"CA", states:["Ontario","Quebec","British Columbia","Alberta","Manitoba","Saskatchewan","Nova Scotia"], cities:["Toronto","Vancouver","Montreal","Calgary","Ottawa","Edmonton","Winnipeg","Halifax"], streets:["Maple","Bay","King","Queen","Yonge","Bloor","Dundas","Robson","Portage","Granville"], suffixes:["St","Ave","Blvd","Dr","Rd","Way"], postcode:()=>`${letter()}${randInt(0,9)}${letter()} ${randInt(0,9)}${letter()}${randInt(0,9)}`.toUpperCase(), phone:()=>`(${randInt(200,999)}) ${randInt(200,999)}-${pad(randInt(0,9999),4)}`, tz:["America/Toronto","America/Vancouver","America/Edmonton","America/Winnipeg"], tzOffset:["-5:00","-8:00","-7:00","-6:00"] },
  { name:"Australia", code:"AU", states:["New South Wales","Victoria","Queensland","Western Australia","South Australia","Tasmania"], cities:["Sydney","Melbourne","Brisbane","Perth","Adelaide","Hobart","Canberra","Darwin"], streets:["George","Collins","Bourke","Elizabeth","Queen","King","Flinders","Swanston"], suffixes:["Street","Road","Avenue","Parade","Drive","Court"], postcode:()=>pad(randInt(200,9999),4), phone:()=>`0${randInt(2,8)} ${randInt(1000,9999)} ${randInt(1000,9999)}`, tz:["Australia/Sydney","Australia/Melbourne","Australia/Brisbane","Australia/Perth"], tzOffset:["+10:00","+10:00","+10:00","+8:00"] },
  { name:"India", code:"IN", states:["Maharashtra","Karnataka","Tamil Nadu","Delhi","West Bengal","Gujarat","Rajasthan","Kerala","Punjab","Uttar Pradesh"], cities:["Mumbai","Bengaluru","Chennai","New Delhi","Kolkata","Ahmedabad","Jaipur","Kochi","Amritsar","Lucknow"], streets:["MG","Nehru","Gandhi","Rajaji","Anna","Linking","Park","Marine","Brigade","Residency"], suffixes:["Road","Street","Marg","Lane","Cross","Avenue"], postcode:()=>pad(randInt(110001,855999),6), phone:()=>`+91 ${randInt(60000,99999)} ${randInt(10000,99999)}`, tz:["Asia/Kolkata"], tzOffset:["+5:30"] },
  { name:"Germany", code:"DE", states:["Bavaria","Berlin","Hamburg","Saxony","Hesse","North Rhine-Westphalia","Baden-Württemberg"], cities:["Berlin","Munich","Hamburg","Cologne","Frankfurt","Stuttgart","Düsseldorf","Leipzig"], streets:["Haupt","Bahnhof","Schul","Garten","Berg","Wald","Ring","Kirch"], suffixes:["straße","weg","platz","gasse","allee"], postcode:()=>pad(randInt(10000,99999),5), phone:()=>`0${randInt(100,999)} ${randInt(1000000,9999999)}`, tz:["Europe/Berlin"], tzOffset:["+1:00"] },
  { name:"France", code:"FR", states:["Île-de-France","Provence-Alpes-Côte d'Azur","Occitanie","Nouvelle-Aquitaine","Brittany"], cities:["Paris","Marseille","Lyon","Toulouse","Nice","Nantes","Bordeaux","Lille"], streets:["Rue de la","Avenue","Boulevard","Place","Rue du","Chemin"], suffixes:["Paix","République","Victoire","Gare","Liberté","Église"], postcode:()=>pad(randInt(10000,95999),5), phone:()=>`0${randInt(1,9)} ${randInt(10,99)} ${randInt(10,99)} ${randInt(10,99)} ${randInt(10,99)}`, tz:["Europe/Paris"], tzOffset:["+1:00"] },
  { name:"Denmark", code:"DK", states:["Nordjylland","Midtjylland","Syddanmark","Hovedstaden","Sjælland"], cities:["Copenhagen","Aarhus","Odense","Aalborg","Esbjerg","Randers","Kolding","Roskilde"], streets:["Gammel","Nørre","Vester","Øster","Store","Lille","Kirke"], suffixes:["vej","gade","allé","plads","boulevard"], postcode:()=>pad(randInt(1000,9990),4), phone:()=>String(randInt(10000000,99999999)), tz:["Europe/Copenhagen"], tzOffset:["+1:00"] },
  { name:"Ukraine", code:"UA", states:["Volinska","Kyivska","Lvivska","Odeska","Kharkivska","Dnipropetrovska"], cities:["Kyiv","Lviv","Odesa","Kharkiv","Dnipro","Liman","Vinnytsia","Poltava"], streets:["Volodimira","Shevchenka","Franka","Hrushevskoho","Soborna","Nezalezhnosti"], suffixes:["Street","Avenue","Boulevard","Lane"], postcode:()=>pad(randInt(10000,99999),5), phone:()=>`(0${randInt(10,99)}) ${randInt(100,999)}-${randInt(1000,9999)}`, tz:["Europe/Kiev"], tzOffset:["+2:00"] },
  { name:"Brazil", code:"BR", states:["São Paulo","Rio de Janeiro","Bahia","Minas Gerais","Paraná","Pernambuco"], cities:["São Paulo","Rio de Janeiro","Salvador","Belo Horizonte","Curitiba","Recife","Fortaleza"], streets:["Rua","Avenida","Praça","Alameda","Travessa"], suffixes:["das Flores","Central","Brasil","Paulista","Atlântica","da Praia"], postcode:()=>`${pad(randInt(10000,99999),5)}-${pad(randInt(100,999),3)}`, phone:()=>`(${randInt(11,99)}) 9${randInt(1000,9999)}-${randInt(1000,9999)}`, tz:["America/Sao_Paulo","America/Bahia","America/Fortaleza"], tzOffset:["-3:00","-3:00","-3:00"] }
];

/* ===================== HELPERS ===================== */

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pad(n, len) { return String(n).padStart(len, "0"); }
function letter() { return String.fromCharCode(65 + Math.floor(Math.random() * 26)); }
function slug(str) {
  return String(str).toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}
function norm(v) {
  if (Array.isArray(v)) v = v[0];
  if (typeof v !== "string") return undefined;
  return v.trim().toLowerCase().replace(/^["']|["']$/g, "");
}
function safeUUID() {
  try { return crypto.randomUUID(); }
  catch (e) { return crypto.randomBytes(16).toString("hex"); }
}

/* ===================== GENERATOR ===================== */

function generateUser(opts) {
  opts = opts || {};
  const g = (opts.gender === "male" || opts.gender === "female") ? opts.gender : pick(["male", "female"]);

  let country;
  if (opts.nat) {
    country = COUNTRIES.find(function (c) { return c.code === String(opts.nat).toUpperCase(); }) || pick(COUNTRIES);
  } else {
    country = pick(COUNTRIES);
  }

  const firstName = g === "male" ? pick(MALE_FIRST) : pick(FEMALE_FIRST);
  const lastName  = pick(LAST);
  const title     = g === "male" ? pick(["Mr","Mr","Mr","Dr"]) : pick(["Ms","Mrs","Miss","Dr"]);

  const streetNumber = randInt(1, 9999);
  const streetName   = pick(country.streets) + " " + pick(country.suffixes);
  const tzIndex      = randInt(0, country.tz.length - 1);

  const username = pick(["tiny","happy","silver","blue","swift","wild","quiet","bright","cool","lucky"]) +
                   pick(["wolf","tiger","eagle","panda","fox","lion","bear","hawk","shark","owl"]) +
                   randInt(100, 999);
  const password = pick(["triangle","magenta","sunset","orange","silver","forest","purple","diamond","rocket","phoenix","shadow","guitar","planet","coffee","wizard","storm"]);
  const email    = slug(firstName) + "." + slug(lastName) + "@example.com";
  const portraitIdx = randInt(0, 99);
  const portraitGender = g === "male" ? "men" : "women";

  const age = randInt(18, 80);
  const dobDate = new Date();
  dobDate.setFullYear(dobDate.getFullYear() - age);
  dobDate.setMonth(randInt(0, 11));
  dobDate.setDate(randInt(1, 28));

  const regAge = randInt(1, 15);
  const regDate = new Date();
  regDate.setFullYear(regDate.getFullYear() - regAge);
  regDate.setMonth(randInt(0, 11));
  regDate.setDate(randInt(1, 28));

  let idName = "";
  let idValue = null;
  if (country.code === "US") {
    idName = "SSN";
    idValue = pad(randInt(100,999),3) + "-" + pad(randInt(10,99),2) + "-" + pad(randInt(1000,9999),4);
  } else if (country.code === "IN") {
    idName = "Aadhaar";
    idValue = pad(randInt(1000,9999),4) + " " + pad(randInt(1000,9999),4) + " " + pad(randInt(1000,9999),4);
  } else if (country.code === "DK") {
    idName = "CPR";
    idValue = pad(randInt(1,31),2) + pad(randInt(1,12),2) + pad(randInt(0,99),2) + "-" + pad(randInt(1000,9999),4);
  }

  return {
    gender: g,
    name: { title: title, first: firstName, last: lastName },
    location: {
      street: { number: streetNumber, name: streetName },
      city: pick(country.cities),
      state: pick(country.states),
      country: country.name,
      postcode: country.postcode(),
      coordinates: {
        latitude: (Math.random() * 180 - 90).toFixed(4),
        longitude: (Math.random() * 360 - 180).toFixed(4)
      },
      timezone: { offset: country.tzOffset[tzIndex], description: country.tz[tzIndex] }
    },
    email: email,
    login: {
      uuid: safeUUID(),
      username: username,
      password: password,
      salt: crypto.randomBytes(4).toString("hex"),
      md5:    crypto.createHash("md5").update(password + username).digest("hex"),
      sha1:   crypto.createHash("sha1").update(password + username).digest("hex"),
      sha256: crypto.createHash("sha256").update(password + username).digest("hex")
    },
    dob: { date: dobDate.toISOString(), age: age },
    registered: { date: regDate.toISOString(), age: regAge },
    phone: country.phone(),
    cell: country.phone(),
    id: { name: idName, value: idValue },
    picture: {
      large:     "https://randomuser.me/api/portraits/" + portraitGender + "/" + portraitIdx + ".jpg",
      medium:    "https://randomuser.me/api/portraits/med/" + portraitGender + "/" + portraitIdx + ".jpg",
      thumbnail: "https://randomuser.me/api/portraits/thumb/" + portraitGender + "/" + portraitIdx + ".jpg"
    },
    nat: country.code
  };
}

/* ===================== HANDLER ===================== */

async function handleRequest(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key, authorization");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "OPTIONS") { res.statusCode = 200; return res.end(); }

  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: "Method Not Allowed", creator: CREATOR }));
  }

  // Health check — no API key required
  if ((req.url || "").indexOf("/health") !== -1) {
    res.statusCode = 200;
    return res.end(JSON.stringify({
      status: "ok",
      time: new Date().toISOString(),
      node: process.version,
      envLoaded: Boolean(process.env.API_KEY),
      creator: CREATOR
    }));
  }

  // --- API KEY ---
  const validKey = process.env.API_KEY;
  const headerKey = req.headers["x-api-key"] || (req.headers["authorization"] || "").replace("Bearer ", "");
  const providedKey = headerKey || (req.query && req.query.api_key);

  if (!validKey) {
    res.statusCode = 500;
    return res.end(JSON.stringify({
      error: "Server Misconfigured",
      message: "API_KEY env var not set on Vercel. Add it in Settings → Environment Variables, then Redeploy.",
      creator: CREATOR
    }));
  }

  if (!providedKey || providedKey !== validKey) {
    res.statusCode = 401;
    return res.end(JSON.stringify({
      error: "Unauthorized",
      message: "Invalid or missing API key.",
      creator: CREATOR
    }));
  }

  // --- PARAMS ---
  const q = req.query || {};

  const rawGender = norm(q.gender != null ? q.gender : (q.g != null ? q.g : q.sex));
  let gender;
  if (rawGender === undefined || rawGender === "" || rawGender === "all" || rawGender === "any") {
    gender = undefined;
  } else if (rawGender === "male" || rawGender === "m" || rawGender === "man" || rawGender === "boy") {
    gender = "male";
  } else if (rawGender === "female" || rawGender === "f" || rawGender === "woman" || rawGender === "girl") {
    gender = "female";
  } else {
    res.statusCode = 400;
    return res.end(JSON.stringify({
      error: "Bad Request",
      message: 'Invalid gender "' + rawGender + '". Use "male" or "female".',
      creator: CREATOR
    }));
  }

  const rawNat = norm(q.nat != null ? q.nat : (q.country != null ? q.country : q.nationality));
  const validNats = ["US","GB","CA","AU","IN","DE","FR","DK","UA","BR"];
  let nat;
  if (rawNat === undefined || rawNat === "") {
    nat = undefined;
  } else if (validNats.indexOf(rawNat.toUpperCase()) !== -1) {
    nat = rawNat.toUpperCase();
  } else {
    res.statusCode = 400;
    return res.end(JSON.stringify({
      error: "Bad Request",
      message: 'Invalid nationality "' + rawNat + '". Allowed: ' + validNats.join(", "),
      creator: CREATOR
    }));
  }

  const parsedResults = parseInt(q.results != null ? q.results : (q.count != null ? q.count : q.limit), 10);
  const results = Math.min(Math.max(Number.isFinite(parsedResults) ? parsedResults : 1, 1), 50);
  const seed = norm(q.seed) || crypto.randomBytes(8).toString("hex");
  const noInfo = norm(q.noinfo) === "true";

  const users = [];
  for (let i = 0; i < results; i++) users.push(generateUser({ gender: gender, nat: nat }));

  const payload = { results: users, creator: CREATOR };
  if (!noInfo) {
    payload.info = {
      seed: seed,
      results: users.length,
      page: 1,
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      filters: { gender: gender || "random", nat: nat || "random" },
      creator: CREATOR
    };
  }

  res.statusCode = 200;
  return res.end(JSON.stringify(payload));
}

module.exports = async (req, res) => {
  try {
    return await handleRequest(req, res);
  } catch (err) {
    console.error("HANDLER CRASH:", err && err.stack ? err.stack : err);
    try {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({
        error: "Internal Server Error",
        message: err && err.message ? err.message : String(err),
        creator: CREATOR
      }));
    } catch (e) {
      res.statusCode = 500;
      res.end('{"error":"fatal"}');
    }
  }
};
