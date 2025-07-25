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
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const STORE_ASSETS = path.join(DATA_DIR, "storeAssets");
const PRODUCT_IMAGES = path.join(DATA_DIR, "productImages");

// Ensure data files & directories exist
for (const file of [STORES_FILE, PRODUCTS_FILE, ORDERS_FILE]) {
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

// 3.5. Update store details
//    JSON body: { storeId, storeName, location, email, tp, description }
app.post("/updateStore", (req, res) => {
  const { storeId, storeName, location, email, tp, description } = req.body;
  const stores = readJSON(STORES_FILE);
  const store = stores.find((s) => s.storeId === storeId);
  if (!store) return res.status(404).json({ error: "Store not found" });
  
  // Update store details
  store.storeName = storeName || store.storeName;
  store.location = location || store.location;
  store.email = email || store.email;
  store.tp = tp || store.tp;
  store.description = description || store.description;
  
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
//    JSON body: { productId, quantity, customerName, customerEmail, customerPhone, customerAddress, storeEmail, productName, storeName, totalAmount }
app.post("/orderProduct", async (req, res) => {
  const { 
    productId, 
    quantity, 
    customerName, 
    customerEmail, 
    customerPhone, 
    customerAddress,
    storeEmail,
    productName,
    storeName,
    totalAmount
  } = req.body;

  // Lookup product
  const products = readJSON(PRODUCTS_FILE);
  const product = products.find((p) => p.productId === productId);
  if (!product) return res.status(404).json({ error: "Product not found" });

  // Lookup store
  const stores = readJSON(STORES_FILE);
  const store = stores.find((s) => s.storeId === product.storeId);
  if (!store) return res.status(404).json({ error: "Store not found" });

  // Create order object
  const orderId = `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const order = {
    orderId,
    productId,
    storeId: product.storeId,
    productName: product.productName,
    storeName: store.storeName,
    quantity: parseInt(quantity),
    totalAmount: parseFloat(totalAmount),
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    orderDate: new Date().toISOString(),
    status: 'pending', // pending, confirmed, shipped, delivered, cancelled
    storeEmail: store.email
  };

  // Save order to JSON file
  const orders = readJSON(ORDERS_FILE);
  orders.push(order);
  writeJSON(ORDERS_FILE, orders);

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
    from: `"GiftStore Order" <${process.env.SMTP_USER}>`,
    to: store.email,
    subject: `New Order: ${product.productName} - Rs. ${totalAmount}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6f42c1; border-bottom: 2px solid #6f42c1; padding-bottom: 10px;">
          🎉 New Order Received!
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Product:</strong> ${product.productName}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>Total Amount:</strong> Rs. ${totalAmount}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Phone:</strong> ${customerPhone}</p>
          <p><strong>Address:</strong> ${customerAddress}</p>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Next Steps</h3>
          <p>Please contact the customer to confirm the order and arrange delivery/pickup.</p>
          <p>You can reach them at: <a href="mailto:${customerEmail}">${customerEmail}</a> or call: ${customerPhone}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 14px;">
            This order was placed through GiftStore platform.<br>
            Store: ${store.storeName}
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOpts);
    res.json({ success: true, message: "Order placed & email sent to store.", orderId });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// --- STORE ADMIN: ORDER MANAGEMENT ---

// 8. Get orders for a specific store
// GET /storeOrders/:storeId
app.get("/storeOrders/:storeId", (req, res) => {
  try {
    const { storeId } = req.params;
    const orders = readJSON(ORDERS_FILE);
    const storeOrders = orders.filter(order => order.storeId === storeId);
    
    // Sort by order date (newest first)
    storeOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    
    res.json(storeOrders);
  } catch (err) {
    console.error("Error reading orders:", err);
    res.status(500).json({ error: "Could not load orders." });
  }
});

// 9. Update order status
// PUT /updateOrderStatus
// JSON body: { orderId, status }
app.put("/updateOrderStatus", (req, res) => {
  try {
    const { orderId, status } = req.body;
    const orders = readJSON(ORDERS_FILE);
    
    const orderIndex = orders.findIndex(order => order.orderId === orderId);
    if (orderIndex === -1) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    
    writeJSON(ORDERS_FILE, orders);
    res.json({ success: true, message: "Order status updated successfully" });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: "Could not update order status." });
  }
});

// 10. Get all orders (for admin dashboard)
// GET /allOrders
app.get("/allOrders", (req, res) => {
  try {
    const orders = readJSON(ORDERS_FILE);
    // Sort by order date (newest first)
    orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    res.json(orders);
  } catch (err) {
    console.error("Error reading orders:", err);
    res.status(500).json({ error: "Could not load orders." });
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

// --- STORE MANAGEMENT: UPDATE PRODUCT STATUS ---
// POST /updateProductStatus
// JSON body: { productId, status }
app.post("/updateProductStatus", (req, res) => {
  const { productId, status } = req.body;
  
  if (!productId || !status) {
    return res.status(400).json({ error: "Product ID and status are required" });
  }

  try {
    const products = readJSON(PRODUCTS_FILE);
    const productIndex = products.findIndex(p => p.productId === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update product status
    products[productIndex].status = status;
    writeJSON(PRODUCTS_FILE, products);
    
    res.json({ success: true, message: "Product status updated successfully" });
  } catch (err) {
    console.error("Error updating product status:", err);
    res.status(500).json({ error: "Failed to update product status" });
  }
});

// --- STORE MANAGEMENT: DELETE PRODUCT ---
// POST /deleteProduct
// JSON body: { productId }
app.post("/deleteProduct", (req, res) => {
  const { productId } = req.body;
  
  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    const products = readJSON(PRODUCTS_FILE);
    const filteredProducts = products.filter(p => p.productId !== productId);
    
    if (filteredProducts.length === products.length) {
      return res.status(404).json({ error: "Product not found" });
    }

    writeJSON(PRODUCTS_FILE, filteredProducts);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// --- STORE MANAGEMENT: UPDATE PRODUCT ---
// POST /updateProduct
// FormData: { productId, productName, description, price, status, includes[], images[] }
app.post("/updateProduct", uploadProd.array('images', 5), (req, res) => {
  const { productId, productName, description, price, status } = req.body;
  const includes = Array.isArray(req.body.includes) ? req.body.includes : [req.body.includes];
  
  if (!productId || !productName || !description || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const products = readJSON(PRODUCTS_FILE);
    const productIndex = products.findIndex(p => p.productId === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update product data
    products[productIndex] = {
      ...products[productIndex],
      productName,
      description,
      price: Number(price),
      status: status || 'live',
      includes: includes.filter(inc => inc.trim())
    };

    // Handle new images if provided
    if (req.files && req.files.length > 0) {
      const imageNames = req.files.map(file => file.filename);
      products[productIndex].images = imageNames;
    }

    writeJSON(PRODUCTS_FILE, products);
    res.json({ success: true, message: "Product updated successfully" });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// --- STORE REQUEST: SEND EMAIL ---
// POST /storeRequest
// FormData: { storeName, ownerName, email, phone, tp, location, password, status, businessType, description, website, socialMedia, yearsInBusiness, products, targetAudience, reasonToJoin, propic, backgroundImage }
app.post("/storeRequest", uploadStore.fields([
  { name: "propic", maxCount: 1 },
  { name: "backgroundImage", maxCount: 1 },
]), async (req, res) => {
  const {
    storeName,
    ownerName,
    email,
    phone,
    tp,
    location,
    businessType,
    description,
    website,
    socialMedia,
    yearsInBusiness,
    products,
    targetAudience,
    reasonToJoin
  } = req.body;

  if (!storeName || !ownerName || !email || !phone || !tp || !location || !businessType || !description || !reasonToJoin) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Handle file uploads
  const propic = req.files.propic?.[0]?.filename || "";
  const backgroundImage = req.files.backgroundImage?.[0]?.filename || "";

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
    from: `"GiftStore Store Request" <${process.env.SMTP_USER}>`,
    to: "ds.perera.1997@gmail.com",
    subject: `Store Request - ${storeName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">
          🏪 New Store Request
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Store Information</h3>
          <p><strong>Store Name:</strong> ${storeName}</p>
          <p><strong>Owner Name:</strong> ${ownerName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
          <p><strong>Telephone:</strong> <a href="tel:${tp}">${tp}</a></p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Business Type:</strong> ${businessType}</p>
        </div>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Business Details</h3>
          <p><strong>Description:</strong> ${description}</p>
          ${website ? `<p><strong>Website:</strong> <a href="${website}" target="_blank">${website}</a></p>` : ''}
          ${socialMedia ? `<p><strong>Social Media:</strong> ${socialMedia}</p>` : ''}
          ${yearsInBusiness ? `<p><strong>Years in Business:</strong> ${yearsInBusiness}</p>` : ''}
          ${products ? `<p><strong>Products/Services:</strong> ${products}</p>` : ''}
          ${targetAudience ? `<p><strong>Target Audience:</strong> ${targetAudience}</p>` : ''}
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Reason to Join</h3>
          <p>${reasonToJoin}</p>
        </div>
        
        ${propic || backgroundImage ? `
        <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Uploaded Images</h3>
          ${propic ? `<p><strong>Profile Picture:</strong> ${propic}</p>` : ''}
          ${backgroundImage ? `<p><strong>Background Image:</strong> ${backgroundImage}</p>` : ''}
        </div>
        ` : ''}
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 14px;">
            This store request was submitted through GiftStore platform.<br>
            Submitted on: ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOpts);
    res.json({ success: true, message: "Store request sent successfully. We will contact you soon." });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ error: "Failed to send store request email" });
  }
});

// --- STORE SETTINGS: UPDATE STORE ---
// POST /updateStore/:storeId
// FormData: { storeName, location, tp, description, propic, backgroundImage, emailNotifications, orderNotifications, marketingNotifications }
app.post("/updateStore/:storeId", uploadStore.fields([
  { name: "propic", maxCount: 1 },
  { name: "backgroundImage", maxCount: 1 },
]), async (req, res) => {
  const { storeId } = req.params;
  const {
    storeName,
    location,
    tp,
    description,
    emailNotifications,
    orderNotifications,
    marketingNotifications
  } = req.body;

  if (!storeName || !location || !tp) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const stores = readJSON(STORES_FILE);
    const storeIndex = stores.findIndex(s => s.storeId === storeId);
    
    if (storeIndex === -1) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Handle file uploads
    const propic = req.files.propic?.[0]?.filename || stores[storeIndex].propic;
    const backgroundImage = req.files.backgroundImage?.[0]?.filename || stores[storeIndex].backgroundImage;

    // Update store data
    stores[storeIndex] = {
      ...stores[storeIndex],
      storeName,
      location,
      tp,
      description: description || '',
      propic,
      backgroundImage,
      emailNotifications: emailNotifications === 'true',
      orderNotifications: orderNotifications === 'true',
      marketingNotifications: marketingNotifications === 'true'
    };

    writeJSON(STORES_FILE, stores);
    res.json({ success: true, message: "Store updated successfully" });
  } catch (err) {
    console.error("Error updating store:", err);
    res.status(500).json({ error: "Failed to update store" });
  }
});

// --- STORE SETTINGS: UPDATE PASSWORD ---
// POST /updateStorePassword/:storeId
// JSON body: { currentPassword, newPassword }
app.post("/updateStorePassword/:storeId", async (req, res) => {
  const { storeId } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current password and new password are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters long" });
  }

  try {
    const stores = readJSON(STORES_FILE);
    const storeIndex = stores.findIndex(s => s.storeId === storeId);
    
    if (storeIndex === -1) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Verify current password
    if (stores[storeIndex].password !== currentPassword) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Update password
    stores[storeIndex].password = newPassword;
    writeJSON(STORES_FILE, stores);
    
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ error: "Failed to update password" });
  }
});

// --- START SERVER ---
const PORT = process.env.PORT || 3031;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
