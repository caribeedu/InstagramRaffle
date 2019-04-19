const config = require("./lib/config");
const figlet = require('figlet');
const clear = require('clear');
const chalk = require('chalk');

//Start
init();

function init() {
    //Create header
    clear();
    console.log(
        chalk.blue(
            figlet.textSync('iCommenter', {
                horizontalLayout: 'full'
            })
        )
    );
    //Start the app
    config.initialize();
}