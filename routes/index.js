var express = require('express');
var router = express.Router();

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next();}
//   return next();
// }

// /* GET home page. */
// router.get('/', ensureAuthenticated, function(req, res) {
//   res.render('index', { title: 'Deepak' });
//   console.log("user object: %j", req);
// });

module.exports = router;
