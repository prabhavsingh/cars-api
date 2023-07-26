import express from "express";

const app = express();
app.use(express.json());

app.get("/users", (req, res) => {
  res.send("hello from server");
});

export default app;
