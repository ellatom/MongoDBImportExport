const express = require('express')
const app = express();
const port = 3030;
const fs = require('fs');
const cors = require('cors');

app.use(cors());
//nodemon start src/app.js

function findUserById(req,users)
{
    let user =
            users.find(item => req.params.userId === item.userId.toString());
    return user;
}

function findFriendById(req,friends)
{   
    let friend =
        friends.find(item => req.params.userId === item.userId.toString());
    return friend;
}

function findUserByName(req,users)
{
    
    let user =
        users.find(item => req.params.username === item.userName);//find returns undefined in case not found
    return user;
}
//Get Questions and Answers Data
//get http://localhost:3030/quiz/results/1
//ok
app.get('/quiz/results/:userId', function (req, res) {//readfile default buffer
    readJsonFile('userQA.json', users => {

        let user=findUserById(req,users);

        res.setHeader('Content-Type', 'application/json');
        res.send(user);
    });
});

//get http://localhost:3030/quiz/results/1/summary
app.get('/quiz/results/:userId/summary', function (req, res) {//readfile default buffer
    readJsonFile('userQA.json', users => {
        readJsonFile('friends.json', friends => {

            let user =findUserById(req,users);
            let friend= findFriendById(req,friends);

            let rightAnswers = 0;

            for (let i = 0; i < user.questionAnswer.length; i++) {
                rightAnswers +=
                    user.questionAnswer[i] === friend.questionAnswer[i];
            }

            res.setHeader('Content-Type', 'application/json');
            res.send(`{ "summary": "${rightAnswers}/${user.questionAnswer.length}" }`);

        });
    });
});

//postman post:http://localhost:3030/quiz/shlomi/create
//Note:to run this again with shlomi he should be removed from userQA
//ok
app.post('/quiz/:username/create', function (req, res) {
    readJsonFile('userQA.json', users => {

        let user =findUserByName(req,users);

        if (user !== undefined)
            return res.status(409).send('User already exist');

        user = {
            "userId": Math.floor(Math.random() * Math.floor(10000000)) + users.length,
            "userName": req.params.username,
            "Location": "",
            "questionAnswer": []
        };

        users.push(user);

        writeJsonFile('userQA.json', users, () => {
            res.end();
        });
    });
});

//express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: app.use(express.json());
//need to parse our incoming requests by using the express.json() , express.urlencoded() middleware functions
app.use(express.json());//must add to read body
app.use(express.urlencoded());
//body- make sure the right user id appear
// body:{
//     "userId": 9203895,
//     "userName":"shlomi",
//     "location": "Jerusalem",
//     "questionAnswer": [2,3,4,1,3]

// }
//ok
app.put('/quiz/:username/update', function (req, res) {
    readJsonFile('userQA.json', users => {
        console.log(req)

        let foundIndex =
            users.findIndex(item => req.params.username === item.userName);//findIndex returns-1 in case not found

        if (foundIndex === -1)
            return res.status(404).send('User not exist');

        user = {
            "userId": req.body.userId,
            "userName": req.body.userName,
            "location": req.body.location,
            "questionAnswer": req.body.questionAnswer
        };
        users[foundIndex] = req.body;
        console.log(users)
        writeJsonFile('userQA.json', users, () => {
            res.end();
        });
    });
});

//postman post:http://localhost:3030/quiz/shlomi/tova/2
//body
// {
//     "friendName":"tova",
//     "questionId": 4,
//     "answerId": 1
// }
app.post('/quiz/:username/answer', function (req, res) {
    readJsonFile('userQA.json', users => {

        let user =findUserByName(req,users);

        if (user === undefined)
            return res.status(404).send('Friend try to insert answers for not exist user');

        readJsonFile('friends.json', friends => {

            let friend =
                friends.find(item => req.params.username === item.userName && req.body.friendName === item.friendName);

            if (!friend) {
                friend = {
                    "userId": user.userId,
                    "userName": req.params.username,
                    "friendId": Math.floor(Math.random() * Math.floor(10000000)) + friends.length,
                    "friendName": req.body.friendName,
                    "questionAnswer": [null, null, null, null, null]
                };

                friends.push(friend);
            }

            let questionId = parseInt(req.body.questionId);
            let answerId = parseInt(req.body.answerId);

            friend.questionAnswer[questionId] = answerId;

            writeJsonFile('friends.json', friends, () => {
                let actualUserAnswer =
                    user.questionAnswer[questionId];

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(actualUserAnswer));
                res.end();
            });
        });
    });
});

//postman get:http://localhost:3030/quiz/Ella/get-questions
//ok
app.get('/quiz/:username/get-questions', function (req, res) {
    readJsonFile('userQA.json', users => {

        let user =
            users.find(item => req.params.username === item.userName.toString());

        if (user === undefined)
            return res.status(404).send('User not exist');

        readJsonFile('qaBank.json', questions => {

            let questionsValues = []
            questions.forEach(element => {
                questionsValues.push(element.question)
            });
            res.setHeader('Content-Type', 'application/json');
            res.send(questionsValues);
        })
    });
});

//postman get:http://localhost:3030/quiz/Ella/get-question/question=1
//ok
app.get('/quiz/:username/get-question', function (req, res) {
    readJsonFile('userQA.json', users => {

        let user =
            users.find(item => req.params.username === item.userName.toString());

        if (user === undefined)
            return res.status(404).send('User not exist');


        readJsonFile('qaBank.json', questions => {
            let url = req.url;//return array

            let idQuery = url.split("?")[1];//question=1
            let idKey = idQuery.split("=")[0];//question
            let idValue = idQuery.split("=")[1];//1

            question = questions.find(question => idValue === question.id.toString());

            if (question === undefined) return res.status(404).send('Question not exist');

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(question.question));
        })
    });
});



function readJsonFile(filename, callback) {
    if(!fs.existsSync(__dirname + '/' + filename))//returns true or false
                return res.status(404).send('File not found');
    fs.readFile(__dirname + '/' + filename, (err, data) => {
        console.log(data);
        if (err) {
            console.error(err);

            // if (err.code === 'ENOENT')
            //     return res.status(404).send('File not found');

            return res.status(500).send('Something internally failed, see logs for details');
        }

        const json = JSON.parse(data);

        callback(json);
    });
}

function writeJsonFile(filename, data, callback) {
    fs.rename(__dirname + '/' + filename, `${__dirname}/${filename}_old`, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Something internally failed, see logs for details');
        }

        let json = JSON.stringify(data, null, 2);

        fs.writeFile(__dirname + '/' + filename, json, (err, data) => {
            console.log(json)
            if (err) {
                console.error(err);
                return res.status(500).send('Something internally failed, see logs for details');
            }

            callback();
        });
    });
}

app.listen(port, ()=>
{
    console.log(`Server started on port ${port}`);
});