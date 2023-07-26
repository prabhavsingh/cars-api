import app from "./app.mjs";
import { connectToMongoDB } from "./db.mjs";

//connecting to mongodb database
connectToMongoDB();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
