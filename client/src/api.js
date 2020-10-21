import axios from 'axios';

const instance = 
    axios.create({ baseURL: 'https://dashboard.heroku.com/apps/ellaimportexport'});

//get results per userId
async function createUser(username) {
    return (await instance.post(`/quiz/${username}/create`));
}
async function updateUser(username) {
    return (await instance.put(`/quiz/${username}/update`));
}

export default {
    createUser,
    updateUser
};