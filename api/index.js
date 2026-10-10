// api/index.js
// Private Random User API
// Creator: Aritra Nath | Instagram: @its_aritra_nath

const crypto = require("crypto");

const CREATOR = {
  name: "Aritra Nath",
  instagram: "@its_aritra_nath",
  instagramUrl: "https://instagram.com/its_aritra_nath",
  project: "Private Random User API"
};

/* ----------------------------- DATA POOLS ----------------------------- */

const MALE_FIRST = [
  "James","Liam","Noah","Oliver","Elijah","William","Henry","Lucas","Benjamin","Theodore",
  "Mateo","Jack","Alexander","Daniel","Michael","Mason","Sebastian","Ethan","Logan","Owen",
  "Samuel","Jacob","Asher","Aiden","John","Joseph","Wyatt","David","Leo","Luke",
  "Julian","Hudson","Grayson","Matthew","Ezra","Gabriel","Carter","Isaac","Jayden","Luca",
  "Anthony","Dylan","Lincoln","Thomas","Maverick","Elias","Josiah","Charles","Caleb","Christopher",
  "Arjun","Rohan","Aditya","Vikram","Karan","Rahul","Aarav","Ishaan"
];

const FEMALE_FIRST = [
  "Olivia","Emma","Charlotte","Amelia","Sophia","Isabella","Ava","Mia","Evelyn","Luna",
  "Harper","Camila","Sofia","Scarlett","Elizabeth","Eleanor","Emily","Chloe","Mila","Violet",
  "Penelope","Gianna","Aria","Abigail","Ella","Avery","Hazel","Nora","Layla","Lily",
  "Aurora","Nova","Ellie","Madison","Grace","Isla","Willow","Zoe","Riley","Stella",
  "Eliana","Ivy","Victoria","Emilia","Lucy","Everly","Lainey","Kinsley","Naomi","Delilah",
  "Priya","Ananya","Aditi","Riya","Sneha","Neha","Kavya","Aisha"
];

const LAST = [
  "Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez",
  "Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin",
  "Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson",
  "Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores",
  "Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter","Roberts",
  "Sharma","Patel","Kumar","Singh","Reddy","Nair","Iyer","Gupta","Mehta","Shah"
];

const COUNTRIES = [
  {
    name: "United States", code: "US",
    states: ["California","Texas","Florida","New York","Illinois","Pennsylvania","Ohio","Georgia","Michigan","Arizona"],
    cities: ["Los Angeles","Houston","Miami","New York","Chicago","Philadelphia","Columbus","Atlanta","Detroit","Phoenix"],
    streets: ["Maple","Oak","Pine","Cedar","Elm","Washington","Lake","Hill","Sunset","Riverside"],
    suffixes: ["St","Ave","Blvd","Dr","Ln","Rd","Ct","Pl"],
    postcode: () => pad(randInt(10000, 99999), 5),
    phone: () => `(${randInt(200, 999)}) ${randInt(200, 999)}-${pad(randInt(0, 9999), 4)}`,
    tz: ["America/New_York","America/Chicago","America/Denver","America/Los_Angeles"],
    tzOffset: ["-5:00","-6:00","-7:00","-8:00"]
  },
  {
    name: "United Kingdom", code: "GB",
    states: ["England","Scotland","Wales","Northern Ireland"],
    cities: ["London","Manchester","Birmingham","Leeds","Glasgow","Liverpool","Bristol","Edinburgh","Cardiff","Belfast"],
    streets: ["High","Church","Station","Victoria","King","Queen","Mill","Park","Green","Albion"],
    suffixes: ["Street","Road","Avenue","Lane","Close","Way","Drive","Court"],
    postcode: () => `${pick(["EC","WC","N","E","SE","SW","W","NW"])}${randInt(1, 20)} ${randInt(1, 9)}${letter()}${letter()}`,
    phone: () => `0${randInt(1000, 9999)} ${randInt(100000, 999999)}`,
    tz: ["Europe/London"], tzOffset: ["+0:00"]
  },
  {
    name: "Canada", code: "CA",
    states: ["Ontario","Quebec","British Columbia","Alberta","Manitoba","Saskatchewan","Nova Scotia"],
    cities: ["Toronto","Vancouver","Montreal","Calgary","Ottawa","Edmonton","Winnipeg","Halifax"],
    streets: ["Maple","Bay","King","Queen","Yonge","Bloor","Dundas","Robson","Portage","Granville"],
    suffixes: ["St","Ave","Blvd","Dr","Rd","Way"],
    postcode: () => `${letter()}${randInt(0, 9)}${letter()} ${randInt(0, 9)}${letter()}${randInt(0, 9)}`.toUpperCase(),
    phone: () => `(${randInt(200, 999)}) ${randInt(200, 999)}-${pad(randInt(0, 9999), 4)}`,
    tz: ["America/Toronto","America/Vancouver","America/Edmonton","America/Winnipeg"],
    tzOffset: ["-5:00","-8:00","-7:00","-6:00"]
  },
  {
    name: "Australia", code: "AU",
    states: ["New South Wales","Victoria","Queensland","Western Australia","South Australia","Tasmania"],
    cities: ["Sydney","Melbourne","Brisbane","Perth","Adelaide","Hobart","Canberra","Darwin"],
    streets: ["George","Collins","Bourke","Elizabeth","Queen","King","Flinders","Swanston"],
    suffixes: ["Street","Road","Avenue","Parade","Drive","Court"],
    postcode: () => pad(randInt(200, 9999), 4),
    phone: () => `0${randInt(2, 8)} ${randInt(1000, 9999)} ${randInt(1000, 9999)}`,
    tz: ["Australia/Sydney","Australia/Melbourne","Australia/Brisbane","Australia/Perth"],
    tzOffset: ["+10:00","+10:00","+10:00","+8:00"]
  },
  {
    name: "India", code: "IN",
    states: ["Maharashtra","Karnataka","Tamil Nadu","Delhi","West Bengal","Gujarat","Rajasthan","Kerala","Punjab","Uttar Pradesh"],
    cities: ["Mumbai","Bengaluru","Chennai","New Delhi","Kolkata","Ahmedabad","Jaipur","Kochi","Amritsar","Lucknow"],
    streets: ["MG","Nehru","Gandhi","Rajaji","Anna","Linking","Park","Marine","Brigade","Residency"],
    suffixes: ["Road","Street","Marg","Lane","Cross","Avenue"],
    postcode: () => pad(randInt(110001, 855999), 6),
    phone: () => `+91 ${randInt(60000, 99999)} ${randInt(10000, 99999)}`,
    tz: ["Asia/Kolkata"], tzOffset: ["+5:30"]
  },
  {
    name: "Germany", code: "DE",
    states: ["Bavaria","Berlin","Hamburg","Saxony","Hesse","North Rhine-Westphalia","Baden-Württemberg"],
    cities: ["Berlin","Munich","Hamburg","Cologne","Frankfurt","Stuttgart","Düsseldorf","Leipzig"],
    streets: ["Haupt","Bahnhof","Schul","Garten","Berg","Wald","Ring","Kirch"],
    suffixes: ["straße","weg","platz","gasse","allee"],
    postcode: () => pad(randInt(10000, 99999), 5),
    phone: () => `0${randInt(100, 999)} ${randInt(1000000, 9999999)}`,
    tz: ["Europe/Berlin"], tzOffset: ["+1:00"]
  },
  {
    name: "France", code: "FR",
    states: ["Île-de-France","Provence-Alpes-Côte d'Azur","Occitanie","Nouvelle-Aquitaine","Brittany"],
    cities: ["Paris","Marseille","Lyon","Toulouse","Nice","Nantes","Bordeaux","Lille"],
    streets: ["Rue de la","Avenue","Boulevard","Place","Rue du","Chemin"],
    suffixes: ["Paix","République","Victoire","Gare","Liberté","Église"],
    postcode: () => pad(randInt(10000, 95999), 5),
    phone: () => `0${randInt(1, 9)} ${randInt(10, 99)} ${randInt(10, 99)} ${randInt(10, 99)} ${randInt(10, 99)}`,
    tz: ["Europe/Paris"], tzOffset: ["+1:00"]
  },
  {
    name: "Denmark", code: "DK",
    states: ["Nordjylland","Midtjylland","Syddanmark","Hovedstaden","Sjælland"],
    cities: ["Copenhagen","Aarhus","Odense","Aalborg","Esbjerg","Randers","Kolding","Roskilde"],
    streets: ["Gammel","Nørre","Vester","Øster","Store","Lille","Kirke"],
    suffixes: ["vej","gade","allé","plads","boulevard"],
    postcode: () => pad(randInt(1000, 9990), 4),
    phone: () => String(randInt(10000000, 99999999)),
    tz: ["Europe/Copenhagen"], tzOffset: ["+1:00"]
  },
  {
    name: "Ukraine", code: "UA",
    states: ["Volinska","Kyivska","Lvivska","Odeska","Kharkivska","Dnipropetrovska"],
    cities: ["Kyiv","Lviv","Odesa","Kharkiv","Dnipro","Liman","Vinnytsia","Poltava"],
    streets: ["Volodimira","Shevchenka","Franka","Hrushevskoho","Soborna","Nezalezhnosti"],
    suffixes: ["Street","Avenue","Boulevard","Lane"],
    postcode: () => pad(randInt(10000, 99999), 5),
    phone: () => `(0${randInt(10, 99)}) ${randInt(100, 999)}-${randInt(1000, 9999)}`,
    tz: ["Europe/Kiev"], tzOffset: ["+2:00"]
  },
  {
    name: "Brazil", code: "BR",
    states: ["São Paulo","Rio de Janeiro","Bahia","Minas Gerais","Paraná","Pernambuco"],
    cities: ["São Paulo","Rio de Janeiro","Salvador","Belo Horizonte","Curitiba","Recife","Fortaleza"],
    streets: ["Rua","Avenida","Praça","Alameda","Travessa"],
    suffixes: ["das Flores","Central","Brasil","Paulista","Atlântica","da Praia"],
    postcode: () => `${pad(randInt(10000, 99999), 5)}-${pad(randInt(100, 999), 3)}`,
    phone: () => `(${randInt(11, 99)}) 9${randInt(1000, 9999)}-${randInt(1000, 9999)}`,
    tz: ["America/Sao_Paulo","America/Bahia","America/Fortaleza"],
    tzOffset: ["-3:00","-3:00","-3:00"]
  }
];

/* ----------------------------- HELPERS ----------------------------- */

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pad(n, len) {
  return String(n).padStart(len, "0");
}
function letter() {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}
function slug(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/* ----------------------------- GENERATOR ----------------------------- */

function generateUser({ gender, nat } = {}) {
  const g = gender === "male" || gender === "female" ? gender : pick(["male", "female"]);

  let country;
  if (nat) {
    country = COUNTRIES.find((c) => c.code === nat.toUpperCase()) || pick(COUNTRIES);
  } else {
    country = pick(COUNTRIES);
  }

  const firstName = g === "male" ? pick(MALE_FIRST) : pick(FEMALE_FIRST);
  const lastName  = pick(LAST);

  const title =
    g === "male"
      ? pick(["Mr", "Mr", "Mr", "Dr"])
      : pick(["Ms", "Mrs", "Miss", "Dr"]);

  const streetNumber = randInt(1, 9999);
  const streetName =
    country.code === "FR"
      ? `${pick(country.streets)} ${pick(country.suffixes)}`
      : `${pick(country.streets)} ${pick(country.suffixes)}`;

  const tzIndex = randInt(0, country.tz.length - 1);

  const username = `${pick(["tiny","happy","silver","blue","swift","wild","quiet","bright","cool","lucky"])}${pick(["wolf","tiger","eagle","panda","fox","lion","bear","hawk","shark","owl"])}${randInt(100, 999)}`;

  const password = pick([
    "triangle","magenta","sunset","orange","silver","forest","purple","diamond",
    "rocket","phoenix","shadow","guitar","planet","coffee","wizard","storm"
  ]);

  const email = `${slug(firstName)}.${slug(lastName)}@example.com`;
  const portraitIdx = randInt(0, 99);
  const portraitGender = g === "male" ? "men" : "women";

  return {
    gender: g,
    name: { title, first: firstName, last: lastName },
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
      timezone: {
        offset: country.tzOffset[tzIndex],
        description: country.tz[tzIndex]
      }
    },
    email,
    login: {
      uuid: crypto.randomUUID(),
      username,
      password,
      salt: crypto.randomBytes(4).toString("hex"),
      md5: crypto.createHash("md5").update(password + username).digest("hex"),
      sha1: crypto.createHash("sha1").update(password + username).digest("hex"),
      sha256: crypto.createHash("sha256").update(password + username).digest("hex")
    },
    dob: (() => {
      const age = randInt(18, 80);
      const date = new Date();
      date.setFullYear(date.getFullYear() - age);
      date.setMonth(randInt(0, 11));
      date.setDate(randInt(1, 28));
      return { date: date.toISOString(), age };
    })(),
    registered: (() => {
      const age = randInt(1, 15);
      const date = new Date();
      date.setFullYear(date.getFullYear() - age);
      date.setMonth(randInt(0, 11));
      date.setDate(randInt(1, 28));
      return { date: date.toISOString(), age };
    })(),
    phone: country.phone(),
    cell: country.phone(),
    id: {
      name: country.code === "US" ? "SSN" : country.code === "IN" ? "Aadhaar" : country.code === "DK" ? "CPR" : "",
      value: country.code === "US"
        ? `${pad(randInt(100, 999), 3)}-${pad(randInt(10, 99), 2)}-${pad(randInt(1000, 9999), 4)}`
        : country.code === "IN"
        ? `${pad(randInt(1000, 9999), 4)} ${pad(randInt(1000, 9999), 4)} ${pad(randInt(1000, 9999), 4)}`
        : null
    },
    picture: {
      large: `https://randomuser.me/api/portraits/${portraitGender}/${portraitIdx}.jpg`,
      medium: `https://randomuser.me/api/portraits/med/${portraitGender}/${portraitIdx}.jpg`,
      thumbnail: `https://randomuser.me/api/portraits/thumb/${portraitGender}/${portraitIdx}.jpg`
    },
    nat: country.code
  };
}

/* ----------------------------- HANDLER ----------------------------- */

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method Not Allowed",
      message: "Only GET requests are supported.",
      creator: CREATOR
    });
  }

  // ---- API KEY CHECK ----
  const validKey = process.env.API_KEY;
  const providedKey =
    req.headers["x-api-key"] ||
    req.headers["authorization"]?.replace("Bearer ", "") ||
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

  // ---- PARAMS ----
  const results = Math.min(Math.max(parseInt(req.query.results) || 1, 1), 50);
  const gender = req.query.gender;
  const nat = req.query.nat;

  const seed = req.query.seed || crypto.randomBytes(8).toString("hex");

  const users = Array.from({ length: results }, () => generateUser({ gender, nat }));

  return res.status(200).json({
    results: users,
    info: {
      seed,
      results: users.length,
      page: 1,
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      creator: CREATOR
    },
    creator: CREATOR
  });
};