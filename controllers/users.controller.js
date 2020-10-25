const fs = require('fs');

let usersPath = '../userQA.json';
let friendsPath = '../friends.json';
let qaBankPath ='../qaBank.json';

function findUserById(req, users) {
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

function readJsonFile(filename, callback) {

    fs.readFile(__dirname + '/' + filename, (err, data) => {
        if (err) {
            callback(null, err);
            return;
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

//get http://localhost:3030/quiz/results/1
exports.getUserQA = (function (req, res) {
    readJsonFile(usersPath, (users, err) => {

        if (err)
        {
            console.error(err);
            return res.status(500).send('Something internally failed, see logs for details');
        }

        let user = findUserById(req, users);

        res.setHeader('Content-Type', 'application/json');
        res.send(user);
    });
});

//get http://localhost:3030/quiz/results/1/summary
exports.getSummaryById=(function (req, res) {//readfile default buffer
    debugger;
    readJsonFile(usersPath, users => {
        readJsonFile(friendsPath, friends => {

            let user =findUserByName(req,users);
            let friend= findFriendById(req,friends);

            let rightAnswers = 0;

            for (let i = 0; i < user.questionAnswer.length; i++) {
                rightAnswers +=
                    user.questionAnswer[i] === friend.questionAnswer[i];
            }

            res.setHeader('Content-Type', 'application/json');
            res.send(`{ "${user.userName}": "${rightAnswers}/${user.questionAnswer.length}" }`);

        });
    });
});

//postman post:http://localhost:3030/quiz/shlomi/create
//Note:to run this again with shlomi he should be removed from userQA
//ok
exports.createNewUser=(function (req, res) {
    readJsonFile(usersPath, users => {

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

        writeJsonFile(usersPath, users, () => {
            res.end();
        });
    });
});


//body- make sure the right user id appear
// body:{
//     "userId": 9203895,
//     "userName":"shlomi",
//     "location": "Jerusalem",
//     "questionAnswer": [2,3,4,1,3]

// }
//ok
exports.updateUserAnswer = (function (req, res) {
    readJsonFile(usersPath, users => {
        console.log(req)
        let foundIndex =
            users.findIndex(item => req.params.username === item.userName);//findIndex returns-1 in case not found

        if (foundIndex === -1)
            return res.status(404).send('User not exist');
        console.log( users[foundIndex].userId);
        user = {
            "userId": users[foundIndex].userId,
            "userName": req.params.username ,
            "location": req.body.location,
            "questionAnswer": req.body.questionAnswer
        };
        users[foundIndex] = user;
        console.log(users)
        writeJsonFile('../userQA.json', users, () => {
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
exports.updateFriendAnswerForUser = (function (req, res) {
    readJsonFile(usersPath, users => {
        
        let user =findUserByName(req,users);

        if (user === undefined)
            return res.status(404).send('Friend try to insert answers for not exist user');

        readJsonFile(friendsPath, friends => {

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
          
            console.log(req.body.questionId+"_question id");
            console.log(req.body.questionAnswer+"_answer id");

            let questionId = parseInt(req.body.questionId);
            let answerId = parseInt(req.body.questionAnswer);
            
            friend.questionAnswer[questionId-1] = answerId;

            writeJsonFile(friendsPath, friends, () => {
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
exports.getQuestionsByUser=(function (req, res) {
    readJsonFile(usersPath, users => {

        let user =
            users.find(item => req.params.username === item.userName.toString());

        if (user === undefined)
            return res.status(404).send('User not exist');

        readJsonFile(qaBankPath, questions => {

            let questionsValues = []
            questions.forEach(element => {
                questionsValues.push(element)
            });
            res.setHeader('Content-Type', 'application/json');
            res.send(questionsValues);
        })
    });
});

//postman get:http://localhost:3030/quiz/Ella/get-question/question=1
exports.getQuestionByUserName=(function (req, res) {
    readJsonFile(usersPath, users => {

        let user =
            users.find(item => req.params.username === item.userName.toString());

        if (user === undefined)
            return res.status(404).send('User not exist');


        readJsonFile(qaBankPath, questions => {
            let url = req.url;//return array

            let idQuery = url.split("?")[1];//question=1
            let idKey = idQuery.split("=")[0];//question
            let idValue = idQuery.split("=")[1];//1

            question = questions.find(question => idValue === question.id.toString());

            if (question === undefined) return res.status(404).send('Question not exist');

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(question));
        })
    });
});
