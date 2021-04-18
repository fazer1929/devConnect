const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

const connectDB = require("./config/db");
connectDB();

// Middlewares
app.use(express.json());

app.get("/", (req, res) => {
	return res.send("<h1>Hello World</h1>");
});

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
