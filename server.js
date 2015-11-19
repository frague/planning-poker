var _ = require('lodash'),
    express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');
    uriString = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/it-poker',
    serverPort = process.env.PORT || 5000;

mongoose.connect(uriString, function (err, res) {
    if (err) {
        console.error('Error connecting to: ' + uriString + '. ' + err);
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
var Room = mongoose.model('Room', roomSchema);

//------------------------------------------------------------------

function errorResponse(res, code, message, trace) {
    return res.status(code).json({message: message, trace: trace});
}

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log('Client connected');
    socket.emit('an event', { some: 'data' });

    socket.on('pinging', function (index) {
        console.log('Pinged', index);
    });
});

app.use(express.static('dist'));
app.use(bodyParser.json());

app.post('/room', function (req, res) {
    var now = new Date();
    new Room({title: req.body.title, creationDate: now})
        .save(function (err, room) {
            if (err) return errorResponse(res, 500, 'Room creation', err);
            Role.findOne({title: 'Admin'})
                .exec(function (err, adminRole) {
                    if (err) return errorResponse(res, 404, 'Admin role not found', err);
                    new User({name: req.body.owner, creationDate: now, roomId: room.id, roleId: adminRole.id})
                        .save(function (err, user) {
                            if (err) return errorResponse(res, 500, 'User creation', err);
                            return res.json({room: room, user: user});
                        });
                });
        });
});

app.get('/room/:roomId', function (req, res) {
    Room.findOne({_id: req.params.roomId})
        .exec(function (err, room) {
            if (err) return errorResponse(res, 404, 'Room does not exist or expired');
            return res.json(room);
        })
});

server.listen(serverPort);
console.log('http server will be listening on port %d', serverPort);
console.log('CTRL+C to exit');
