const instagramAPI = require('instagram-web-api');
const inquirer = require('inquirer');
const figlet = require('figlet');
const clear = require('clear');
const chalk = require('chalk');
const clui = require('clui');
const bot = require("./bot");

//Initialize params object
exports.params = {};

//Get options by user
function getInfoLogin() {
    const objectInfo = [{
            name: 'amount',
            type: 'number',
            message: 'Enter number of followers to use:',
            validate: function (value) {
                if (!isNaN(parseFloat(value)) && isFinite(value) && value > 3) {
                    return true;
                } else {
                    return 'Please enter a valid number.';
                }
            }
        }, {
            name: 'url',
            type: 'input',
            message: 'Enter post URL (profile needs to be public):',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter post URL.';
                }
            }
        },
        {
            name: 'username',
            type: 'input',
            message: 'Enter your instagram username:',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your instagram username.';
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
    return inquirer.prompt(objectInfo);
}

//Try to login and init app
exports.initialize = function () {
    getInfoLogin().then((objectInfo) => {
        //Set params
        exports.params = objectInfo;
        //Create client object
        const client = new instagramAPI({
            username: exports.params.username,
            password: exports.params.password
        });
        //Create and initialize spinner
        const spinner = new clui.Spinner('Authenticating you, please wait...');
        spinner.start();
        //Login
        client.login()
            .then((response) => {
                //Stop spinner
                spinner.stop();
                //Check the authentication
                if (response.authenticated) {
                    //Start count
                    bot.startCount(client, response.userId);
                } else {
                    //Recreate the header
                    clear();
                    console.log(
                        chalk.blue(
                            figlet.textSync('InstaRaffle', {
                                horizontalLayout: 'full'
                            })
                        )
                    );
                    //Rerun
                    console.log(
                        chalk.red("One of your credentials is wrong, try again.")
                    );
                    exports.initialize();
                }
            })
            .catch((err) => {
                //Houston we have a problem!
                spinner.stop();
                console.log(
                    chalk.red("Houston, we have a problem! Error code: " + err)
                );
                process.exit();
            });
    });
}