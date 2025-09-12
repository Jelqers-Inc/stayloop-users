import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const express = require("express");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/users", (req, res) => {
  res.json([{ msg: "Hola desde usuarios" }]);
});

app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
