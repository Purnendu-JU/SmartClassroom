const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.MONGO_URL;
async function main() {
  await mongoose.connect(mongoURI);
  console.log("Connected to Mongo");
}
main();
const app = express();
const port = process.env.PORT;
app.use(cors());
app.use("/files", express.static("files"));
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auth', require('./routes/class'));
app.use('/api/auth', require('./routes/join'));
app.use('/api/auth', require('./routes/announcement'));
app.use('/api/auth', require('./routes/community'));
app.use('/api/auth', require('./routes/updateprofile'));
app.use('/api/auth', require('./routes/attendance'));
app.use('/api/auth', require('./routes/assignment'));
app.use('/api/auth', require('./routes/getrole'));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
