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
    email: String,
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
    roomId: String,
    title: String,
    description: String,
    estimate: Number
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

var User = mongoose.model('Users', userSchema),
    Room = mongoose.model('Room', roomSchema),
    UserStory = mongoose.model('UserStory', userStorySchema);

//------------------------------------------------------------------

function errorResponse(res, code, message, trace) {
    return res.status(code).json({message: message, trace: trace});
}

var app = express(),
    cookieParser = require('cookie-parser'),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    socket;

io.on('connection', function (socket) {
    socket.on('join', function (data) {
        socket.join(data.roomId);
    });
});

function update(roomId) {
    var data = {};
    UserStory.find({roomId: roomId})
        .exec(function (err, stories) {
            if (err) return errorResponse(res, 500, 'Error stories fetching', err);
            data.stories = stories;
            User.find({roomId: roomId})
                .exec(function (err, users) {
                    if (err) return errorResponse(res, 500, 'Error users fetching', err);
                    data.users = users;
                    io.to(roomId).emit('update', data);
                })
        })
};

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(cookieParser());

app.post('/rooms', function (req, res) {
    var now = new Date();
    new Room({title: req.body.title, creationDate: now})
        .save(function (err, room) {
            if (err) return errorResponse(res, 500, 'Room creation', err);
            Role.findOne({title: 'Admin'})
                .exec(function (err, adminRole) {
                    if (err) return errorResponse(res, 404, 'Admin role not found', err);
                    new User({name: req.body.owner, creationDate: now,
                              roomId: room.id, roleId: adminRole.id, email: req.body.email
                             })
                        .save(function (err, user) {
                            if (err) return errorResponse(res, 500, 'User creation', err);
                            return res.json({room: room, user: user});
                        });
                });
        });
});

app.get('/rooms/:roomId', function (req, res) {
    var roomId = req.params.roomId;
    Room.findOne({_id: roomId})
        .exec(function (err, room) {
            if (err) return errorResponse(res, 404, 'Room does not exist or expired');
            User.find({roomId: roomId})
                .exec(function (err, users) {
                    Role.find({})
                        .exec(function (err, roles) {
                            UserStory.find({roomId: roomId})
                                .exec(function (err, stories) {
                                    return res.json({room: room, users: users, roles: roles, stories: stories});
                                });
                        });
                });
        });
});

app.all('/stories/:storyId?*', function (req, res) {
    var storyId = req.params.storyId,
        storyData = {
            roomId: req.body.roomId,
            title: req.body.title,
            description: req.body.description,
            estimate: req.body.estimate
        };

    if (storyId) {
        UserStory.findOne({_id: storyId})
            .exec(function (err, story) {
                if (err) return errorResponse(res, 404, 'UserStory does not exist or expired');
                switch (req.method) {
                    case 'DELETE': UserStory.deleteOne({_id: storyId})
                        .exec(function (err, result) {
                            if (err) return errorResponse(res, 404, 'Unable to delete user story');
                            return res.json(result);
                        });
                        break;
                    case 'POST': UserStory.updateOne(
                            {_id: storyId},
                            {
                                $set: storyData,
                                $currentDate: {'lastModified': true }
                            }
                        ).exec(function (err, result) {
                            return res.json(result);
                        });
                        break;
                    case 'GET': return res.json(story);
                }
            });
    } else if (req.method === 'POST') {
        console.log(JSON.stringify(storyData), req.body);
        new UserStory(storyData)
            .save(function (err) {
                if (err) return errorResponse(res, 500, 'Unable to create user story');
                update(req.body.roomId);
                return res.json({});
            });
    } else {
        return errorResponse(res, 500, 'Internal server error');
    }
});

server.listen(serverPort);
console.log('http server will be listening on port %d', serverPort);
console.log('CTRL+C to exit');
