import express from "express";
import cors from "cors";
import "./connect.js";
import UserModel from "./models/User.js";
import PlaceModel from "./models/Place.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import download from "image-downloader";
import path from "path";
import multer from "multer";
import fs from 'fs'

const __dirname = path.resolve();
const app = express();
const saltRounds = bcrypt.genSaltSync(10);
const jwtSecret = "shhhhhh";

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: "http://127.0.0.1:5173",
  })
);

app.get("/test", (req, res) => {
  console.log("ohk");
  res.json("test ok");
});
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await UserModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, saltRounds),
    });

    res.json({ user });
  } catch (e) {
    res.status(422).json(e);
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    const passCorrect = bcrypt.compareSync(password, user.password);
    if (passCorrect) {
      jwt.sign(
        { email: user.email, id: user._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(user);
        }
      );
    } else {
      res.status(422).json("Pass is not correct");
    }
  } else {
    res.json("Not found");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, cookieData) => {
      if (err) throw err;
      const { name, email, _id } = await UserModel.findById(cookieData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await download.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

const photoMidl = multer({ dest: 'uploads/' });
app.post('/upload', photoMidl.array('photos', 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split('.')
    const extension = parts[parts.length - 1]
    const newPath = path + '.' + extension
    fs.renameSync(path, newPath)
    uploadedFiles.push(newPath.replace('uploads/', ''))
  }
  res.json(uploadedFiles)
})

app.post('/places', (req, res) => {
  const { token } = req.cookies
  const {
    title, address, existingPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests
  } = req.body
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await PlaceModel.create({
      owner: userData.id,
      title, address, photos: existingPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests,
    })
    res.json(placeDoc)
  })
})

app.get('/places', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await PlaceModel.find({ owner: id }))
  })
})

app.get('/places/:id', async (req, res) => {
  const { id } = req.params
  res.json(await PlaceModel.findById(id))
})

app.put('/places', async (req, res) => {

  const { token } = req.cookies
  const {
    id, title, address, existingPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests,
  } = req.body

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if(err) throw err;
    const placeDoc = await PlaceModel.findById(id);

    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, photos: existingPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests,
      })
      await placeDoc.save()
      res.json('ok')
    }
  })
})

app.listen(7002);
