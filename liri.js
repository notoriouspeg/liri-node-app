require("dotenv").config();

var keys = require('./keys');

var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var command = process.argv[2];
// console.log(process.argv);

var query = "";
var params = {
    screen_name: 'pjmick1',
    count: 20
}
var request = require('request');
var fs = require('fs');

for (var i = 3; i < process.argv.length; i++){
query = query + process.argv[i]+ " ";
// console.log(query);
}

switch (command) {
    case 'my-tweets':
        myTweets();
        break;
    case 'spotify-this-song':
        spotifyThis(query);
        break;
    case 'movie-this':
        omdbThis(query);
        break;
    case 'do-what-it-says':
        random();
        break;
}


function myTweets() {
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error && response.statusCode == 200) {
            fs.appendFile('terminal.log', ('=============== LOG ENTRY BEGIN ===============\r\n' + Date() + '\r\n \r\nTERMINAL COMMANDS:\r\n$: ' + process.argv + '\r\n \r\nDATA OUTPUT:\r\n'), function(err) {
                if (err) throw err;
            });
            console.log(' ');
            console.log('Last 20 Tweets:')
            for (i = 0; i < tweets.length; i++) {
                var number = i + 1;
                console.log(' ');
                console.log([i + 1] + '. ' + tweets[i].text);
                console.log('Created on: ' + tweets[i].created_at);
                console.log(' ');
                fs.appendFile('terminal.log', (number + '. Tweet: ' + tweets[i].text + '\r\nCreated at: ' + tweets[i].created_at + ' \r\n'), function(err) {
                    if (err) throw err;
                });
            }
            fs.appendFile('terminal.log', ('=============== LOG ENTRY END ===============\r\n \r\n'), function(err) {
                if (err) throw err;
            });
        }
    });
}
function spotifyThis(value) {
    if (value == null) {
        value = 'The Sign';
    }

spotify.search({ type: 'track', query: value }, function(err, data) {


    if (err) {
        return console.log('Error occurred: ' + err);
    }
    console.log(data.tracks.items[0].album.artists[0].name);
    console.log(data.tracks.items[0].name);
    console.log(data.tracks.items[0].external_urls.spotify);
    console.log(data.tracks.items[0].album.name);

});

}
function omdbThis(value) {
    if (value == null) {
        value = 'Mr. Nobody';
    }
    request('http://www.omdbapi.com/?t=' + value + '&y=&plot=short&apikey=trilogy' + '&tomatoes=true&r=json', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            jsonBody = JSON.parse(body);
            console.log(' ');
            console.log('Title: ' + jsonBody.Title);
            console.log('Year: ' + jsonBody.Year);
            console.log('IMDb Rating: ' + jsonBody.imdbRating);
            console.log('Country: ' + jsonBody.Country);
            console.log('Language: ' + jsonBody.Language);
            console.log('Plot: ' + jsonBody.Plot);
            console.log('Actors: ' + jsonBody.Actors);
            console.log('Rotten Tomatoes Rating: ' + jsonBody.tomatoRating);
            console.log('Rotten Tomatoes URL: ' + jsonBody.tomatoURL);
            console.log(' ');
            fs.appendFile('log.txt', ('=============== LOG ENTRY BEGIN ===============\r\n' + Date() + '\r\n \r\nTERMINAL COMMANDS: ' + process.argv + '\r\nDATA OUTPUT:\r\n' + 'Title: ' + jsonBody.Title + '\r\nYear: ' + jsonBody.Year + '\r\nIMDb Rating: ' + jsonBody.imdbRating + '\r\nCountry: ' + jsonBody.Country + '\r\nLanguage: ' + jsonBody.Language + '\r\nPlot: ' + jsonBody.Plot + '\r\nActors: ' + jsonBody.Actors + '\r\nRotten Tomatoes Rating: ' + jsonBody.tomatoRating + '\r\nRotten Tomatoes URL: ' + jsonBody.tomatoURL + '\r\n =============== LOG ENTRY END ===============\r\n \r\n'), function(err) {
                if (err) throw err;
            });
        }
    });
}
function random() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            console.log(error);
        } else {
            var dataArr = data.split(',');
            // console.log(dataArr);
            if (dataArr[0] === 'spotify-this-song') {
                spotifyThis(dataArr[1]);
            }
            else if (dataArr[0] === 'movie-this') {
                omdbThis(dataArr[1]);
            }
        }
    });
}