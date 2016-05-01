var express = require('express'),
    router = express.Router(),
    ctrlMain = require('../controllers/main');

/* Main page */
router.get('/', ctrlMain.angularApp);

module.exports = router;