import axios from 'axios';

const instance = 
    axios.create({ baseURL: 'http://localhost:3030'});

//get results per userId
async function createUser(username) {
    return (await instance.post(`/api/quiz/${username}/create`));
}
async function updateUser(username) {
    return (await instance.put(`/api/quiz/${username}/update`));
}
async function getUserQuestion(username,questionId) {
    return (await instance.get(`/api/quiz/${username}/get-question?question=${questionId}`)).data;
}
async function updateUserAnswer(username, userData) {
    return (await instance.put(`/api/quiz/${username}/update`, userData));
}
async function updateFriendAnswerForUser(username, userData) {
    return (await instance.post(`/api/quiz/${username}/answer`, userData));
}
async function getSummaryByUser(userId, userData)
{
    return (await instance.get(`/api/quiz/results/${userId}/summary`, userData));
}

export default {
    createUser,
    updateUser,
    getUserQuestion,
    updateUserAnswer,
    updateFriendAnswerForUser,
    getSummaryByUser
};