"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const axios_1 = require("axios");
const app = express();
const Feed = require('feed').Feed;
app.get('/feed/:section', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cache = {};
    let section = req.params.section;
    if (cache[section] && Date.now() - cache[section].timestamp < 600000) {
        const cachedFeed = cache[section].feed;
        // Return the cached feed
        res.set('Content-Type', 'text/xml');
        res.send(cachedFeed);
    }
    else {
        try {
            const response = yield axios_1.default.get('https://content.guardianapis.com/search?', {
                params: {
                    'order-by': 'newest',
                    'page-size': 1,
                    'q': section,
                    'api-key': 'test',
                }
            });
            const feed = new Feed({
                language: 'en',
            });
            let articleData = response.data.response.results[0];
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
            // Convert the response to RSS or any desired format if necessary
            // res.send(response.data.response.results[0]);
        }
        catch (error) {
            res.status(500).send('Error fetching data');
        }
    }
}));
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map