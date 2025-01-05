const express = require(`express`);
const bodyParser = require(`body-parser`);
const dotenv = require(`dotenv`);
const morgan = require(`morgan`);
const cors = require(`cors`);
const cookieParser = require(`cookie-parser`);

dotenv.config();

/*
    taena mo dapat dito ka magiimport kase nag error yang buwakanang inang
    mongoose.connect must be a string nayan
*/

// sarap plang mairapan ni mæm

const connectMongodb = require(`./init/mongodb`);
const { graphqlHTTP } = require(`express-graphql`);
const schema = require(`./graphql/schema`);

const app = express();
connectMongodb();

app.use(cookieParser());

app.use(express.json({ limit: `500mb` }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: `500mb`, extended: true }));

app.use(morgan(`dev`));

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
    customFormatErrorFn: (err) => {
      console.error("GraphQL Error:", err);
      return {
        message: err.message,
        locations: err.locations,
        path: err.path,
      };
    },
  })
);


module.exports = app;
