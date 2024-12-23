const express = require(`express`);
const bodyParser = require(`body-parser`);
const dotenv = require(`dotenv`);
const morgan = require(`morgan`);
const cors = require(`cors`);
const cookieParser = require(`cookie-parser`);

dotenv.config();

const connectMongodb = require(`./init/mongodb`);

const app = express();
connectMongodb();

app.use(cookieParser());

app.use(express.json({ limit: `500mb` }));
app.use(bodyParser.urlencoded({ limit: `500mb`, extended: true }));

app.use(morgan(`dev`));

module.exports = app;
