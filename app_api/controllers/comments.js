var mongoose = require('mongoose'),
    Loc = mongoose.model('Location'),
    ctrlHelpers = require('./ctrlHelpers'),
    sendJSONresponse = ctrlHelpers.sendJSONresponse,
    locationsHelpers = require('./locationsHelpers');

var _createCommentNow = function (req, res, location) {
    if (!location) {
        sendJSONresponse(res, 404, {
            "message": "Not found, locationid required"
        });
    } else {
        location.comments.push({
            author: req.body.author,
            commentText: req.body.commentText
        });
        location.save(function (err, location) {
            var currentComment;
            if (err) {
                console.log('Error creating comment: ', err);
                sendJSONresponse(res, 404, err);
            } else {
                currentComment = location.comments[location.comments.length - 1];
                sendJSONresponse(res, 201, currentComment);
            }
        });
    }
};

/* POST a new comment */
module.exports.commentsCreate = function (req, res) {
    if (req.params.locationid) {
        Loc
            .findById(req.params.locationid)
            .select('comments')
            .exec(
                function (err, location) {
                    if (err) {
                        console.log('Error creating comment: ', err);
                        sendJSONresponse(res, 400, err);
                    } else {
                        _createCommentNow(req, res, location);
                    }
                }
            );
    } else {
        sendJSONresponse(res, 404, {
            "message": "Not found, locationid required"
        });
    }
}

/* GET a single comment */
module.exports.commentsReadOne = function (req, res) {
    if (req.params && req.params.locationid && req.params.commentid) {
        Loc
            .findById(req.params.locationid)
            .select('name comments')
            .exec(function (err, location) {
                var response, comment;
                if (!location) {
                    return sendJSONresponse(res, 404, 
                        {"message": "locationid not found"}
                    );
                } else if (err) {
                    console.log('Error reading comment: ', err);
                    return sendJSONresponse(res, 404, err);
                }
                if (location.comments && location.comments.length > 0) {
                    comment = location.comments.id(req.params.commentid);
                    if (!comment) {
                        sendJSONresponse(res, 404, {
                            "message": "commentid not found"
                        });
                    } else {
                        response = {
                            location: {
                                name: location.name,
                                id: req.params.locationid
                            },
                            comment: comment
                        };
                        sendJSONresponse(res, 200, response);
                    }
                } else {
                    sendJSONresponse(res, 400, {"message": "No comments found"});
                }
            }); 
    } else {
        sendJSONresponse(res, 404, {
            "message": "Not found, locationid required"
        });
    }
}

/* PUT a new comment */
module.exports.commentsUpdateOne = function (req, res) {
    if (!req.params.locationid || !req.params.commentid) {
        return sendJSONresponse(res, 404, {
            "message": "Not found, both locationid and commentid are required"
        });
    }
    Loc
        .findById(req.params.locationid)
        .select('comments')
        .exec(function (err, location) {
            if (err) {
                console.log('Error finding comment: ', err);
                return sendJSONresponse(res, 400, err);
            } else if (!location) {
                return sendJSONresponse(res, 404, {
                    "message": "location not found"
                });
            } 
            if (location.comments && location.comments.length > 0) {
                var currentComment = location.comments.id(req.params.commentid);
                if (!currentComment) {
                    sendJSONresponse(res, 404, {
                        "message": "No comment found"
                    });
                } else {
                    currentComment.author = req.body.author;
                    currentComment.commentText = req.body.commentText;
                    location.save(function (err, location) {
                        if (err) {
                            console.log('Error updating comment: ', err);
                            sendJSONresponse(res, 400, err);
                        } else {
                            sendJSONresponse(res, 200, currentComment);
                        }
                    });
                }

            } else {
                sendJSONresponse(res, 404, {
                    "message": "No comment to update"
                });
            }
        });
}

/* DELETE a single comment */
module.exports.commentsDeleteOne = function (req, res) {
    if (!req.params.locationid || !req.params.commentid) {
        return sendJSONresponse(res, 404, {
            "message": "Not found, locationid and reviewid are both required"
        });
    }

    Loc
        .findById(req.params.locationid)
        .select('comments')
        .exec(function (err, location) {
            if (!location) {
                return sendJSONresponse(res, 404, {
                    "message": "locationid not found"
                });
            }
            if (err) {
                console.log('Error deleting comment: ', err);
                return sendJSONresponse(res, 400, err);
            }

            if (location.comments && location.comments.length > 0) {
                if (!location.comments.id(req.params.commentid)) {
                    sendJSONresponse(res, 404, {
                      "message": "reviewid not found"
                    });
                } else {
                    location.comments.id(req.params.commentid).remove();
                    location.save(function (err) {
                        if (err) {
                            console.log('Error deleting comment: ', err);
                            return sendJSONresponse(res, 400, err);
                        } else {
                            sendJSONresponse(res, 204, null);
                        }
                    });
                }
            } else {
                sendJSONresponse(res, 404, {
                    "message": "No comment to delete"
                });
            }
        });
}