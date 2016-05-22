var responseObject = require('../models/response_object');

module.exports.createResponse = function (req, res) {	
  var response = new responseObject(req.body);
  var successMessage = "";
    responseObject.find({id:response.id},function(err,results){
    if(results.length>0) {                                   // if a record already exists, update the record.
      var update = {
        interested: response.interested,
         questions: response.questions,
                id: response.id
      };
     responseObject.update({id:response.id},update,function(err,result){
     console.log("update result: " + JSON.stringify(result) + " Response id:" + response.id + " update object:" + JSON.stringify(update));
     if(!err){
        successMessage = "Great! We will let Nakul know about your response."
     } else {
        res.render('error', {error: err});
     }
     result.successMessage = successMessage
     res.json(result|err);
     });
    }
    else{                                             // if no records of user exists, insert a new one.
      response.save(function(err,result){
        console.log("create result: " + result);
        if(!err){
          successMessage = "Yay! We have successfully updated your response."
        } else {
          res.render('error', {error: err});
        }
        res.render('index', {response: result, user: req.user});
      })
    }
  });
}

module.exports.fetch_response = function(req, res) {
  console.log("user id while fetching from db:" + req.user.id);
  res.render('index', { response: {}, user:req.user });
}
  

