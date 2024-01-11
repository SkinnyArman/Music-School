const express = require("express");
// require("./src/db/mongoose");
const mongoose = require("mongoose");
const teacherRouter = require("./src/routers/teacher");
const studentRouter = require("./src/routers/student");
const branchRouter = require("./src/routers/branch");
const categoryRouter = require("./src/routers/category");

mongoose.connect(
  "mongodb+srv://arman:0JAbDhvWpn3yKmYl@cluster0.vc022us.mongodb.net",
  {
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("Connected to MongoDB");
});



const app = express();
app.use(express.json());

app.use(teacherRouter);
app.use(branchRouter)
app.use(studentRouter)
app.use(categoryRouter)

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
