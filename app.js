const header = require("./modules/header");
const login = require("./modules/login");

start();

function start() {
    header.Create();
    login.tryLogin();
}