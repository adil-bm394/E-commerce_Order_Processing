const express = require("express");
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./src/config/dbConnection");
const serverConfig = require("./src/config/serverConfig");


const app = express();
app.use(cors());

//Mongodb Connection
connectDB();

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());


//Routes
app.use("/api/v1", require("./src/routes/orderRoutes"));



const PORT = serverConfig.PORT || 3000;
app.listen(PORT, async() => {
  console.log(`Order Processing is running on Port ${PORT}`.bgCyan.white);
 
});
