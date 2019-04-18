const instagramAPI = require('instagram-web-api');
const inquirer = require('inquirer');
const header = require("./header");
const chalk = require('chalk');
const clui = require('clui');
const bot = require("./bot");

function getInfoLogin() {
    const loginObject = [{
            name: 'username',
            type: 'input',
            message: 'Enter your e-mail address:',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your e-mail address.';
                }
            }
        },
        {
            name: 'password',
            type: 'password',
            message: 'Enter your password:',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your password.';
                }
            }
        }
    ];
    return inquirer.prompt(loginObject);
}

exports.tryLogin = function () {
    getInfoLogin().then((loginInfo) => {
        const client = new instagramAPI({
            username: loginInfo.username,
            password: loginInfo.password
        });

        const load = new clui.Spinner('Authenticating you, please wait...');
        load.start();

        client.login()
            .then((response) => {
                load.stop();
                if (response.authenticated) {
                    bot.startCount(client, response.userId);
                } else {
                    header.Create();
                    console.log(
                        chalk.red("One of your credentials is wrong, try again.")
                    );
                    exports.tryLogin();
                }
            })
            .catch((err) => {
                load.stop();
                console.log(
                    chalk.red("Houston, we have a problem! Error code: " + err)
                );
                process.exit();
            });
    });
}