module.exports=function(app){

    let users=require('../controllers/users.controller.js')
    const express = require('express');
    const cors = require('cors');//Adds the Access-Control-Allow-Origin header to the response.
    app.use(cors());
    //express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: app.use(express.json());
    //need to parse our incoming requests by using the express.json() , express.urlencoded() middleware functions
    app.use(express.json());//must add to read body
    app.use(express.urlencoded());

    app.get('/api/quiz/results/:userId',users.getUserQA);
    app.get('/api/quiz/:username/get-question',users.getQuestionByUserName);
    app.post('/api/quiz/:username/create',users.createNewUser);
    app.put('/api/quiz/:username/update', users.updateUserAnswer);
    app.post('/api/quiz/:username/answer', users.updateFriendAnswerForUser);
    app.get('/api/quiz/:username/get-questions', users.getQuestionsByUser); 
    app.get('/api/quiz/results/:userId/summary', users.getSummaryById);
   
     
}