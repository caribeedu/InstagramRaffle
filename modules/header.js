const figlet = require('figlet');
const chalk = require('chalk');
const clear = require('clear');

exports.Create = function () {
    clear();

    console.log(
        chalk.blue(
            figlet.textSync('iCommenter', {
                horizontalLayout: 'full'
            })
        )
    );
}