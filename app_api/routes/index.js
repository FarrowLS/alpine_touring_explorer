var express = require('express'),
    router = express.Router(),
    ctrlMain = require('../controllers/main'),
    ctrlLocations = require('../controllers/locations'),
    ctrlComments = require('../controllers/comments');

/* TO BE REMOVED */
var homepageController = function (req, res) {
    res.render('index', { title: 'Express' });
};
/* GET home page. - TO BE REMOVED */
router.get('/', ctrlMain.index);

router.get('/locations', ctrlLocations.locationsList);
router.post('/locations', ctrlLocations.locationsCreate);
router.get('/locations/:locationid', ctrlLocations.locationsReadOne);
router.put('/locations/:locationid', ctrlLocations.locationsUpdateOne);
router.delete('/locations/:locationid', ctrlLocations.locationsDeleteOne);

router.post('/locations/:locationid/comments', ctrlComments.commentsCreate);
router.get('/locations/:locationid/comments/:commentid', ctrlComments.commentsReadOne);
router.put('/locations/:locationid/comments/:commentid', ctrlComments.commentsUpdateOne);
router.delete('/locations/:locationid/comments/:commentid', ctrlComments.commentsDeleteOne);

module.exports = router;