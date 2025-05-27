const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/fetch-place-image", async (req, res) => {
  const { imageUrl } = req.query;
  if (!imageUrl) {
    return res.status(400).send("Missing imageUrl param");
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return res.status(response.status).send("Failed to fetch image");
    }
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const dataUri = `data:${contentType};base64,${base64}`;

    res.send(dataUri);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend proxy listening on http://localhost:${PORT}`);
});
