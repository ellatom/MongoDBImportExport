//save to file
const fs = require('fs');
let usersPath = '../userQA.json';
let friendsPath = '../friends.json';
let qaBankPath = '../qaBank.json';
//save to mongoDB
const mongoose = require('mongoose');

const express = require('express')

mongoose.connect('mongodb://127.0.0.1:27017/users', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const Users = require('./users.js');
const QABank = require('./qabank.js');
const Friends = require('./friends.js');

function findUserById(req, users) {
    let user =
        users.find(item => req.params.userId === item.userId.toString());
    return user;
}

function findFriendById(req, friends) {
    let friend =
        friends.find(item => req.params.userId === item.userId.toString());
    return friend;
}

function findUserByName(req, users) {

    let user =
        users.find(item => req.params.username === item.userName);//find returns undefined in case not found
    return user;
}

function findUserByNameForSummary(friend, friends) {

    let friend_ =
        friends.find(item => friend === item.friendName);//find returns undefined in case not found
    return friend_;
}

function findFriendByName(friend, friends) {

    console.log(friend);
    let friend_ =
        friends.find(item => friend === item.friend.friendName);//find returns undefined in case not found
    return friend_;
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
        if (err) {
            console.error(err);
            return res.status(500).send('Something internally failed, see logs for details');
        }

        let user = findUserById(req, users);

        res.setHeader('Content-Type', 'application/json');
        res.send(user);
    });
});

//get http://localhost:3030/quiz/results/1/summary
//works http://localhost:3000/qacards/scoreboard/MNM8
exports.getSummaryByName = (async (req, res) => {//readfile default buffer


    let friend = await Friends.findOne({ friendName: req.params.friend });
    let friendUserName = friend.userName;
    let user = await Users.findOne({ userName: friendUserName });


    let rightAnswers = 0;

    for (let i = 0; i < friend.questionAnswer.length; i++) {
        rightAnswers +=
            user.questionAnswer[i] === friend.questionAnswer[i];
    }

    res.setHeader('Content-Type', 'application/json');
    res.json(`{ "${user.userName}": "${rightAnswers}/${user.questionAnswer.length}" }`);

    //getSummaryByNameToFile(req,res);
});

function getSummaryByNameToFile(req, res) {
    readJsonFile(usersPath, users => {
        readJsonFile(friendsPath, friends => {


            let friend = findFriendByName(req.params.friend, friends);
            let user1 = findUserByNameForSummary(friend, friends);

            let user = user1.userName;

            let rightAnswers = 0;

            for (let i = 0; i < user.questionAnswer.length; i++) {
                rightAnswers +=
                    user.questionAnswer[i] === friend.questionAnswer[i];
            }

            res.setHeader('Content-Type', 'application/json');
            res.send(`{ "${user.userName}": "${rightAnswers}/${user.questionAnswer.length}" }`);

        });
    });
}

//postman post:http://localhost:3030/quiz/shlomi/create
//Note:to run this again with shlomi he should be removed from userQA
//ok
exports.createNewUser = (async (req, res) => {

    try {
        let user = await Users.findOne({ userName: req.params.username });

        if (user)
            return res.status(409).send('User already exist');

        user = {
            "userName": req.params.username,
            "location": "Jerusalem",
            "questionAnswer": []
        };
        const users = new Users(user);

        users.save().then(() => {
            res.status(201).send(users);
            console.log("added document")
        }).catch((e) => {
            res.status(500).send(e)
        })
    }
    catch (e) {
        res.status(500).send(e);
    }

    // saveToFileCreateUser(req,res); --if except DB save to file is required
});

function saveToFileCreateUser(req, res) {
    readJsonFile(usersPath, users => {

        let user = findUserByName(req, users);

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
}

//body- make sure the right user id appear
// body:{
//     "userId": 9203895,
//     "userName":"shlomi",
//     "location": "Jerusalem",
//     "questionAnswer": [2,3,4,1,3]

// }
///api/quiz/:username/update
exports.updateUserAnswer = (async (req, res) => {

    let foundIndex =
        Users.find({ userName: req.params.username });//findIndex returns-1 in case not found

    if (!foundIndex)
        return res.status(404).send('User not exist');

    const updates = Object.keys(req.body)
    const allowedUpdates = ['location', 'questionAnswer', 'userName'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        let userData = {

            "userName": req.params.username,
            "location": req.body.location,
            "questionAnswer": req.body.questionAnswer
        };
        const user = await Users.findOneAndUpdate(
            { userName: req.params.username }, userData, { new: true, runValidators: true, useFindAndModify: false });

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }

    //updateUserAnswerToFile(req,res);
});

function updateUserAnswerToFile(req, res) {
    readJsonFile(usersPath, users => {

        console.log(req)
        let foundIndex =
            users.findIndex(item => req.params.username === item.userName);//findIndex returns-1 in case not found

        if (foundIndex === -1)
            return res.status(404).send('User not exist');
        console.log(users[foundIndex].userId);
        user = {
            "userId": users[foundIndex].userId,
            "userName": req.params.username,
            "location": req.body.location,
            "questionAnswer": req.body.questionAnswer
        };
        users[foundIndex] = user;
        console.log(users)
        writeJsonFile('../userQA.json', users, () => {
            res.end();
        });
    });
}

//postman post:http://localhost:3030/quiz/shlomi/tova/2
//body
// {
//     "friendName":"tova",
//     "questionId": 4,
//     "answerId": 1
// }
///api/quiz/:username/answer
exports.updateFriendAnswerForUser = (async (req, res) => {

    try {
        // debugger;
        let user = await Users.findOne({ userName: req.params.username });

        if (!user)
            return res.status(404).send('Friend try to insert answers for not exist user');

        // const friendCollection = new Friends({});
        // let y= Friends.find({});
        let friendUserFound =
            await Friends.findOne({ userName: req.params.username, friendName: req.body.friendName });

        if (!friendUserFound) {
            let newfriend = {
                "userId": user._id,
                "userName": req.params.username,
                "friendName": req.body.friendName,
                "questionAnswer": []
            };

            const friend = new Friends(newfriend);

            await friend.save();
        }


        let questionId = parseInt(req.body.questionId);
        let answerId = parseInt(req.body.questionAnswer);

        //friend.questionAnswer[questionId - 1] = answerId;

        //Model.findOneAndUpdate({query},{["answer.${element index}.content:new_data"]},{new:true},(err,docs)=>{})

        // let asd = "questionAnswer.${" + (questionId - 1) + "}";
        // const user111 = await Friends.findOneAndUpdate(
        //     { userName: req.params.username, friendName: req.body.friendName },
        //     { "$set": {asd: answerId } },
        //     { new: true, runValidators: true, useFindAndModify: false });

        await Friends.findOneAndUpdate(
            { userName: req.params.username, friendName: req.body.friendName },
            {
                $push: {
                    questionAnswer: {
                        $each: [answerId],
                        $position: questionId - 1
                    }
                }
            },
            // { "$push": {asd: answerId } },
            { runValidators: true, useFindAndModify: false });
        res.end();
    }
    catch (e) {
        res.status(500).send(e);
    }

    //updatefriendAnswerForUserToFile(req,res);
});

function updatefriendAnswerForUserToFile(req, res) {
    readJsonFile(usersPath, users => {

        let user = findUserByName(req, users);

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

            console.log(req.body.questionId + "_question id");
            console.log(req.body.questionAnswer + "_answer id");

            let questionId = parseInt(req.body.questionId);
            let answerId = parseInt(req.body.questionAnswer);

            friend.questionAnswer[questionId - 1] = answerId;

            writeJsonFile(friendsPath, friends, () => {
                let actualUserAnswer =
                    user.questionAnswer[questionId];

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(actualUserAnswer));
                res.end();
            });
        });
    });
}

//postman get:http://localhost:3030/quiz/Ella/get-questions
//ok
exports.getQuestionsByUser = (function (req, res) {
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
exports.getQuestionByUserName = (async (req, res) => {

    // configuration of Banks done manually
    try {
        const user = await Users.findOne({ userName: req.params.username });

        if (!user)
            return res.status(404).send();

        let question = await QABank.findOne({ id: Number(req.query.question) });

        if (!question)
            return res.status(404).send('Question not exist');


        res.setHeader('Content-Type', 'application/json');
        res.json(question);
    } catch (e) {
        res.status(500).send()
    }

    //getQuestionPerUserFromfile(req,res)


    // });
});

function getQuestionPerUserFromfile(req, res) {
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
}