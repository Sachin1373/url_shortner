import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import databaseconnect from "./src/db/databaseconnect.js";
import Auth from "./src/routes/Auth.js"
import Link from "./src/routes/Links.js"


dotenv.config({
    path:'./.env'
});


const app = express()
const PORT = process.env.PORT || 5000;

databaseconnect()

const corsOptions = {
    origin: ['https://url-shortner-three-sigma.vercel.app','http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],          
    credentials: true,                                 
  };

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.get("/api/v1", (req, res) => {
    res.send("Welcome to the URL SHORTNER backend API!");
});

app.use("/api/v1/auth",Auth)
app.use("/api/v1/link",Link)


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});