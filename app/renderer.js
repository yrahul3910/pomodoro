const $ = require("jquery");
const remote = require("electron").remote;
const window = remote.getCurrentWindow();

$("#close").click(() => {
    window.close();
});
