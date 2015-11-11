var _ = require('lodash');
var http = require('http');
var mongoose = require('mongoose');

var uriString =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/it-poker';

var serverPort = process.env.PORT || 5000;

mongoose.connect(uriString, function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + uriString + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + uriString);
    }
});

// Scemas definitions
var userSchema = new mongoose.Schema({
    name: String,
    creationDate: Date,
    roomId: String,
    roleId: String
});

var roomSchema = new mongoose.Schema({
    title: String,
    creationDate: Date
});

var roleSchema = new mongoose.Schema({
    title: String,
    seesAll: {type: Boolean, default: false},
    mustVote: {type: Boolean, default: true}
});

var userStorySchema = new mongoose.Schema({
    title: String,
    finalEstimate: Number
});

var voteSchema = new mongoose.Schema({
    roomId: String,
    userId: String,
    userStoryId: String,
    vote: Number
});

// Models definitions
var Role = mongoose.model('Roles', roleSchema);
Role.find({}).exec(function (err, result) {
    if (err || result.length !== 4) {
        Role.remove({}).exec(function (err, result) {
            if (!err) {
                [
                    ['Admin', true, true],
                    ['Observer', true, false],
                    ['Voter', false, true]
                ].forEach(function (roleData) {
                    new Role({title: roleData[0], seesAll: roleData[1], mustVote: roleData[2]})
                        .save(function (err) {
                            if (err) console.error('Error saving role "' + roleData[0] + '"');
                        });
                });
            }
        });
    }
});

var User = mongoose.model('Users', userSchema);

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
}).listen(serverPort);

console.log('http server will be listening on port %d', serverPort);
console.log('CTRL+C to exit');
