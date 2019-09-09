const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const Parser = require("rss-parser");

const parser = new Parser();
const app = express();
app.use(cors());

const MEDIUM_URL = "https://www.medium.com/feed";
let searchHistory = [];

app.get("/medium/:feed_name", async (req, res) => {
  const {
    params: { feed_name: feedName = "" }
  } = req;
  try {
    const { items = [] } = await parser.parseURL(`${MEDIUM_URL}/${feedName}`);
    if (!searchHistory.includes(feedName)) {
      searchHistory.unshift(feedName);
    }
    res.json({ items, searchHistory: searchHistory.slice(0, 5) });
  } catch (e) {
    res.sendStatus(404);
  }
});

app.get("/search_history", (_, res) => res.json({ searchHistory }));

app.listen(3001);
