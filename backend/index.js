// index.js
require("dotenv").config(); // ← load .env into process.env

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// Paths & files
const DATA_DIR = __dirname;
const STORES_FILE = path.join(DATA_DIR, "stores.json");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const STORE_ASSETS = path.join(DATA_DIR, "storeAssets");
const PRODUCT_IMAGES = path.join(DATA_DIR, "productImages");

// Ensure data files & directories exist
for (const file of [STORES_FILE, PRODUCTS_FILE]) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "[]", "utf8");
}
for (const dir of [STORE_ASSETS, PRODUCT_IMAGES]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

// Serve static assets
app.use("/storeAssets", express.static(STORE_ASSETS));
app.use("/productImages", express.static(PRODUCT_IMAGES));

// Multer config for store assets
const storeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, STORE_ASSETS),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});
const uploadStore = multer({ storage: storeStorage });

// Multer config for product images
const prodStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, PRODUCT_IMAGES),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});
const uploadProd = multer({ storage: prodStorage, limits: { files: 5 } });

// JSON read/write helpers
function readJSON(fp) {
  return JSON.parse(fs.readFileSync(fp, "utf8") || "[]");
}
function writeJSON(fp, data) {
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), "utf8");
}

// --- ADMIN: STORE MANAGEMENT ---

// 1. Create a store
//    multipart/form-data:
//      fields:    storeName, location, email, password, tp, status, description
//      uploads:  propic (1), backgroundImage (1)
app.post(
  "/createStore",
  uploadStore.fields([
    { name: "propic", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 },
  ]),
  (req, res) => {
    const stores = readJSON(STORES_FILE);
    const newId = `st_${String(stores.length + 1).padStart(3, "0")}`;
    const {
      storeName,
      location,
      email,
      password,
      tp,
      status = "active",
      description,
    } = req.body;

    const propic = req.files.propic?.[0]?.filename || "";
    const backgroundImage = req.files.backgroundImage?.[0]?.filename || "";

    const newStore = {
      storeId: newId,
      storeName,
      location,
      email,
      password,
      tp,
      status,
      description,
      propic,
      backgroundImage,
    };

    stores.push(newStore);
    writeJSON(STORES_FILE, stores);
    res.json({ success: true, store: newStore });
  }
);

// 2. View all stores
app.get("/viewStores", (req, res) => {
  res.json(readJSON(STORES_FILE));
});

// 3. Change store status
//    JSON body: { storeId, status }
app.post("/changeStatus", (req, res) => {
  const { storeId, status } = req.body;
  const stores = readJSON(STORES_FILE);
  const store = stores.find((s) => s.storeId === storeId);
  if (!store) return res.status(404).json({ error: "Store not found" });
  store.status = status;
  writeJSON(STORES_FILE, stores);
  res.json({ success: true, store });
});

// --- STORE-ADMIN: PRODUCT MANAGEMENT ---

// 4. Add a product
//    multipart/form-data:
//      fields:    storeId, productName, description, price, includes[]
//      uploads:  images (up to 5)
app.post("/addProduct", uploadProd.array("images", 5), (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const newId = `p_${String(products.length + 1).padStart(3, "0")}`;
  const { storeId, productName, description, price } = req.body;

  // Normalize includes to array
  let includes = [];
  if (req.body.includes) {
    includes = Array.isArray(req.body.includes)
      ? req.body.includes
      : [req.body.includes];
  }

  const images = req.files.map((f) => f.filename);

  const newProd = {
    productId: newId,
    storeId,
    productName,
    description,
    price: parseFloat(price),
    includes,
    images,
    status: "active",
  };

  products.push(newProd);
  writeJSON(PRODUCTS_FILE, products);
  res.json({ success: true, product: newProd });
});

// 5. View products for a store
app.get("/products/:storeId", (req, res) => {
  const all = readJSON(PRODUCTS_FILE);
  res.json(all.filter((p) => p.storeId === req.params.storeId));
});

// 6. View a single product
app.get("/product/:productId", (req, res) => {
  const prod = readJSON(PRODUCTS_FILE).find(
    (p) => p.productId === req.params.productId
  );
  if (!prod) return res.status(404).json({ error: "Product not found" });
  res.json(prod);
});

// --- CUSTOMER: ORDER & EMAIL ---

// 7. Place an order
//    JSON body: { productId, quantity, customerName, customerEmail }
app.post("/orderProduct", async (req, res) => {
  const { productId, quantity, customerName, customerEmail } = req.body;

  // Lookup product
  const products = readJSON(PRODUCTS_FILE);
  const product = products.find((p) => p.productId === productId);
  if (!product) return res.status(404).json({ error: "Product not found" });

  // Lookup store
  const stores = readJSON(STORES_FILE);
  const store = stores.find((s) => s.storeId === product.storeId);
  if (!store) return res.status(404).json({ error: "Store not found" });

  // Nodemailer setup using .env vars
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // Gmail on 587 uses STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOpts = {
    from: `"Order Bot" <${process.env.SMTP_USER}>`,
    to: store.email,
    subject: `New Order: ${product.productName}`,
    html: `
      <h3>You've got a new order!</h3>
      <p><strong>Product:</strong> ${product.productName}</p>
      <p><strong>Quantity:</strong> ${quantity}</p>
      <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
    `,
  };

  try {
    await transporter.sendMail(mailOpts);
    res.json({ success: true, message: "Order placed & email sent." });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// --- PUBLIC: LIST ALL PRODUCTS ---
// GET /viewProducts
app.get("/viewProducts", (req, res) => {
  try {
    const allProducts = readJSON(PRODUCTS_FILE);
    // if you only want active products, uncomment the next line:
    // const active = allProducts.filter(p => p.status === 'active');
    res.json(allProducts);
  } catch (err) {
    console.error("Error reading products:", err);
    res.status(500).json({ error: "Could not load products." });
  }
});

// --- START SERVER ---
const PORT = process.env.PORT || 3031;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
