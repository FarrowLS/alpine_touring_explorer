var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    author: {
        type: String,
        // required: true
    },
    commentText: {
        type: String,
        // required: true
    },
    createdOn: {
        type: Date,
        "default": Date.now
    }
});

var locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    coordinates: {
        type: [Number], // Store coordinate numbers in longitude, latitude order.
        index: '2dsphere'
    },
    elevation: {
        type: [Number], // Store elevation numbers in base, highest point order.
        required: true
    },
    terrain: {
        type: [Number], // Terrain array example: 1 for easy trails, 2 for intermediate, 3 for difficult, etc. (0 is for cross-country)
        required: true
    },
    notes: {
        type: String
    },
    comments: [commentSchema]
});

mongoose.model('Location', locationSchema);