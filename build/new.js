const express = require('express');
const Feed = require('feed').Feed; // Use the 'feed' library for RSS feed generation
const app = express();
// Sample JSON data
const articleData = {
    "id": "sport/2023/oct/15/england-humbled-by-afghanistan-in-historic-cricket-world-cup-shock",
    "type": "article",
    "sectionId": "sport",
    "sectionName": "Sport",
    "webPublicationDate": "2023-10-15T16:37:15Z",
    "webTitle": "England humbled by Afghanistan in historic Cricket World Cup shock",
    "webUrl": "https://www.theguardian.com/sport/2023/oct/15/england-humbled-by-afghanistan-in-historic-cricket-world-cup-shock",
    "apiUrl": "https://content.guardianapis.com/sport/2023/oct/15/england-humbled-by-afghanistan-in-historic-cricket-world-cup-shock",
    "isHosted": false,
    "pillarId": "pillar/sport",
    "pillarName": "Sport"
};
// Define a route that generates and serves the RSS feed
app.get('/rss-feed', (req, res) => {
    const feed = new Feed({
        title: 'Your Feed Title',
        description: 'Description of your feed',
        id: 'http://your-website.com',
        link: 'http://your-website.com',
        language: 'en',
    });
    // Extract data from the JSON and add it to the feed
    feed.addItem({
        title: articleData.webTitle,
        link: articleData.webUrl,
        description: articleData.webTitle,
        date: new Date(articleData.webPublicationDate),
    });
    // Set the response content type to XML
    res.set('Content-Type', 'text/xml');
    // Send the generated RSS feed
    res.send(feed.rss2());
});
// Start the Express.js server
const port = 3000; // You can change the port as needed
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=new.js.map