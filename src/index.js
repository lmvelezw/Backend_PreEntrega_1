const express = require("express");
const ProductRouter = require("./router/product.routes.js");
const CartRouter = require("./router/cart.routes.js");
const messagesRouter = require("./router/messages.routes.js");
const { engine } = require("express-handlebars");
const path = require("path");
const { Server } = require("socket.io");
const { default: mongoose } = require("mongoose");
const { messagesModel } = require("./models/messages.model.js");
const multer = require("multer");


const app = express();
const PORT = 8080;

mongoose.connect(
  "mongodb+srv://velezwiesner:8FxbISA9qJksWzmM@cluster0.bn5gi6q.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp"
).then(()=> {
  console.log('Connected to MongoDB');
}).catch((error) => {
  throw Error(`Error connecting to database ${error}`);
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));
app.use("/", express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
  let message = await messagesModel.find()
  
  res.render("home", {
    title: "Home"
  });
});

app.post("/api/messages", async (req, res) => {
  const { user, message } = req.body;

  try {
    const newMessage = await messagesModel.create({user: user, message: message });

    res.send({ result: 'success', payload: newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalName = file.originalName;
    const ext = path.extname(originalName);
    cb(null, `${timestamp} ${originalName}`);
  }
});


const upload = multer({ dest: 'uploads/' })

app.post("/uploads", upload.single("archivo"), (req, res) => {
  res.json({ message: "Archivo subido exitosamente" });
});

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});


app.use("/api/products", ProductRouter);
app.use("/api/cart", CartRouter);
app.use("/api/messages", messagesRouter);