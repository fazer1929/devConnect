const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
	return res.send("<h1>Hello World</h1>");
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
