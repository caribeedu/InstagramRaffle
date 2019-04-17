const instagramAPI = require('instagram-web-api');
const chalk = require('chalk');
const clui = require('clui');

exports.startCount = function (client, userId) {
    client.getFollowers({
            userId: userId
        })
        .then((response) => {
            let usernames = [];
            for (let i = 0; i < response.data.length; i++) {
                usernames[i] = response.data[i].username;
            }
            console.log(usernames);
        });
}