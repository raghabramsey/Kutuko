const express = require("express");
import axios from "axios";
const app = express();
const Feed = require("feed").Feed;

app.get("/feed/:section", async (req, res) => {
  interface CacheItem {
    feed: string;
    timestamp: number;
  }
  const cache: { [section: string]: CacheItem } = {};
  let section = req.params.section;
  if (cache[section] && Date.now() - cache[section].timestamp < 600000) {
    const cachedFeed: string = cache[section].feed;
    // Return the cached feed
    res.set("Content-Type", "text/xml");
    res.send(cachedFeed);
  } else {
    try {
      const response = await axios.get(
        "https://content.guardianapis.com/search?",
        {
          params: {
            "order-by": "newest",
            "page-size": 1,
            q: section,
            "api-key": "test",
          },
        }
      );

      const feed = new Feed({
        language: "en",
      });
      let articleData = response.data.response.results[0];
      feed.addItem({
        title: articleData.webTitle,
        link: articleData.webUrl,
        description: articleData.webTitle,
        date: new Date(articleData.webPublicationDate),
      });

      // Set the response content type to XML
      res.set("Content-Type", "text/xml");

      // Send the generated RSS feed
      res.send(feed.rss2());

      // Convert the response to RSS or any desired format if necessary
      // res.send(response.data.response.results[0]);
    } catch (error) {
      res.status(500).send("Error fetching data");
    }
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
