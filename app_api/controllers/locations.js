var mongoose = require('mongoose'),
    Loc = mongoose.model('Location'),
    ctrlHelpers = require('./ctrlHelpers'),
    sendJSONresponse = ctrlHelpers.sendJSONresponse,
    locationsHelpers = require('./locationsHelpers'),
    theEarth = locationsHelpers.theEarth;

/* GET list of locations with information */
module.exports.locationsList = function (req, res) {

    var lng = parseFloat(req.query.lng),
        lat = parseFloat(req.query.lat),
        maxDistance = parseFloat(req.query.maxDistance) || parseFloat(10000000000.00);

    if (!(lng && lat) || !(lng || lat)) {
        // Set Worcester, MA as center of map - lng: -71.8405449, lat: 42.2757946
        lng = parseFloat(-71.8405449);
        lat = parseFloat(42.2757946);
    }

    var point = {
        type: 'Point',
        coordinates: [lng, lat]
    };

    var geoOptions = {
            spherical: true,
            maxDistance: theEarth.getRadsFromDistance(maxDistance),
            num: 10
        };

    Loc.geoNear(point, geoOptions, function (err, results, stats) {
        var locations = [];
        if (err) {
            console.log('Error building list of locations using geoNear: ', err);
            sendJSONresponse(res, 404, err);
        } else {
            results.forEach(function (result) {
                locations.push({
                    name: result.obj.name,
                    _id: result.obj._id,
                    address: result.obj.address,
                    terrain: result.obj.terrain,
                    distance: theEarth.getDistanceFromRads(result.dis),
                });
            });
            sendJSONresponse(res, 200, locations);
        }
    });
}


/* POST a new location */
module.exports.locationsCreate = function (req, res) {
    if (!req.body.name || 
        !req.body.address || 
        !req.body.terrain || 
        !req.body.base ||
        !req.body.highPoint ||
        !req.body.lng ||
        !req.body.lat) {
            sendJSONresponse(res, 404, {
            "message": "Not created, name, address, terrain, base, highPoint lng and lat are required"
        });  
    } else {
        Loc.create({
            name:req.body.name,
            address: req.body.address,
            terrain: req.body.terrain.split(','),
            elevation: [parseFloat(req.body.base), parseFloat(req.body.highPoint)],
            coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
        }, function (err, location) {
            if (err) {
                console.log('Error creating location: ', err);
                sendJSONresponse(res, 404, err);
            } else {
                sendJSONresponse(res, 201, location);
            }
        });   
    }
}

/* GET a single locations information */
module.exports.locationsReadOne = function (req, res) {
    if (req.params && req.params.locationid) {    
        Loc
            .findById(req.params.locationid)
            .exec(function (err, location) {
                if (!location) {
                    return sendJSONresponse(res, 404, 
                        {"message": "locationid not found"}
                    );
                } else if (err) {
                    console.log('Error reading location: ', err);
                    return sendJSONresponse(res, 404, err);
                }
                sendJSONresponse(res, 200, location);
            }); 
    } else {
        sendJSONresponse(res, 404, {
            "message": "Not found, locationid is required"
        });
    }
}

/* PUT (update) a single locations information */
module.exports.locationsUpdateOne = function (req, res) {
    if (!req.params.locationid) {
        return sendJSONresponse(res, 404, {
            "message": "Not found, locationid is required"
        });
    }
    Loc
        .findById(req.params.locationid)
        .select('-comments')
        .exec(
            function (err, location) {
                if (!location) {
                    return sendJSONresponse(res, 404, {
                        "message": "locationid was not found"
                    });
                } else if (err) {
                    console.log('Error finding location: ', err);
                    return sendJSONresponse(res, 400, err);
                }
                location.name = req.body.name;
                location.address = req.body.address;
                location.terrain = req.body.terrain.split(',');
                location.elevation = [parseFloat(req.body.base), parseFloat(req.body.highPoint)];
                location.coordinates = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
                location.save(function (err, location) {
                    if (err) {
                        console.log('Error updating location: ', err);
                        sendJSONresponse(res, 404, err);
                    } else {
                        sendJSONresponse(res, 200, location);
                    }
                });
            }
        );
}

/* DELETE a single locations information */
module.exports.locationsDeleteOne = function (req, res) {
    var locationid = req.params.locationid;

    if (locationid) {
        Loc
            .findByIdAndRemove(locationid)
            .exec(
                function (err, location) {
                    if (err) {
                        console.log('Error deleting location: ', err);
                        return sendJSONresponse(res, 404, err);
                    }
                    sendJSONresponse(res, 204, null);
                }
            );
    } else {
        sendJSONresponse(res, 404, {
            "message": "No locationid provided"
        });
    }
}