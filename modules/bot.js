const instagramAPI = require('instagram-web-api');
const chalk = require('chalk');
const clui = require('clui');

exports.startCount = function (client, userId) {
    client.getFollowers({
        userId: userId
    }).then((response) => {
        let usernames = [];
        client.getFollowers({
            userId: userId,
            first: response.count
        }).then((response) => {
            for (let z = 0; z < response.data.length; z++) {
                usernames.push(response.data[i].username);
            }
        });
        console.log(usernames);
    });
}