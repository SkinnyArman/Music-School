const express = require("express");
require("./db/mongoose");
const teacherRouter = require("./routers/task");

const app = express();
app.use(express.json());

app.use(teacherRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
