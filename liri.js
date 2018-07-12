require("dotenv").config();

var keys = require('./keys');
// console.log(keys);

var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
console.log(process.argv[3]);
var command = process.argv[2];
var query = process.argv[3];
if (command === 'spotify-this-song') {

spotify.search({ type: 'track', query: query}, function(err, data) {
    if (err) {
        return console.log('Error occurred: ' + err);
    }
    console.log(data.tracks.items[0].album.artists[0].name);
    console.log(data.tracks.items[0].album.name);
    console.log(data.tracks.items[0].name);
    console.log(data.tracks.items[0].external_urls.spotify);
 

});
}