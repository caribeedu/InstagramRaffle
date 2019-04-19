const config = require('./config');
const chalk = require('chalk');
const clui = require('clui');

//Create spinner object
const spinner = new clui.Spinner('Loading users and comments...');
//Create end_cursor string for pagination
let endCursor = undefined;
//Create bool to init spinner
let firstTime = true;
//Create usernames array
let usernames = [];
//Create bool to verify pages
let nextPageExists = true;
//Users already useds
let usersCount = 0;

exports.startCount = function (client, userId) {
    //Init the spinner
    if (firstTime)
        spinner.start();
    //Clean the array
    usernames = [];
    //Call to see followers
    client.getFollowers({
        userId: userId,
        first: 50,
        after: endCursor
    }).then((response) => {
        //Sum users
        usersCount += response.data.length;
        //See number of users you have
        if (config.params.amount > response.count) {
            config.params.amount = response.count;
        }
        //Sets nextPageExists
        nextPageExists = response.page_info.has_next_page;
        //Set's the new end_cursor
        endCursor = response.page_info.end_cursor;
        //Set's app to finish after this cycle
        if (config.params.amount >= usersCount)
            nextPageExists = false;
        //Get the users and add @ them
        for (let i = 0; i < response.data.length; i++) {
            response.data[i].username = " @" + response.data[i].username;
            usernames.push(response.data[i].username);
        }
        letsComment(client, usernames, userId);
    });
}

function letsComment(client, usernames, userId) {
    //Create comments, 3 users per comment
    let comments = [];
    for (let i = 0; i < usernames.length; i += 3) {
        comments.push(usernames[i] + usernames[i + 1] + usernames[i + 2]);
    }
    //Get the short code by url
    let shortcode = /p\/(.*?)\/$/.exec(config.params.url)[1];
    //Get media id by shotcode
    client.getMediaByShortcode({
        shortcode: shortcode
    }).then((response) => {
        for (let i = 0; i < comments.length; i++) {
            //Create a random time to post
            let randomTime = Math.floor(Math.random() * (35000 - 20000) + 20000);
            setTimeout(() => {
                client.addComment({
                    mediaId: response.id,
                    text: comments[i]
                }).then(() => {
                    //Async function requires this validation
                    nextPageExists = false;
                    if (comments.length == (i + 1) && !nextPageExists) {
                        //That's all folks!
                        spinner.stop();
                        console.log(chalk.green("\nGo to see the post :)"));
                    } else if (comments.length == (i + 1) && nextPageExists) {
                        //Restart's cycle
                        exports.startCount(client, userId);
                    }
                }).catch(() => {
                    //Exception handler
                    console.log(chalk.red("\nTake it easy, my friend, you do not want to be banned, right?"));
                    process.exit();
                });
            }, randomTime);
        }
    });
}