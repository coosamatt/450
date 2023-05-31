import app from "./src/app.js";
import config from "./config.js";

const port = config.PORT;


app.listen(port, () => {
  console.log(`The server is up and running on port ${port}`);
});
