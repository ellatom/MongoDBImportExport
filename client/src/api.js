import axios from 'axios';

const instance = 
    axios.create({ baseURL: 'http://localhost:3030'});

//get results per userId
async function createUser(username) {
    return (await instance.post(`/quiz/${username}/create`));
}

export default {
    createUser
};
