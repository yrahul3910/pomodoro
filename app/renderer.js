const $ = require("jquery");
const remote = require("electron").remote;
const window = remote.getCurrentWindow();

$("#close").click(() => {
    window.close();
});

$(document).ready(() => {
    var time, intervalID, running = false, session = true;
    function tick() {
        time -= 1000;
        var minutes = Math.trunc(time / 60000);
        var seconds = (time % 60000) / 1000;
        var str = ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
        $("#timeLeft").html(str);
        if (time === 2000) {
            // Play audio
            var wav = "https://notificationsounds.com/message-tones/demonstrative-516/download/mp3";
            var audio = new Audio(wav);
            audio.play();
        } else if (time === 0) {		
            // change modes
            if (session) {
                session = false;
                $("#status").html("Break!");
                $(".timer").css("border-color", "red");
                $(".timer:hover").css("background-color", "red");
                time = $("#break").val() * 60000;
            } else {
                $("#status").html("Session");
                $(".timer").css("border-color", "lightgreen");
                $(".timer:hover").css("background-color", "lightgreen");
                session = true;
                time = Number.parseInt($("#session").val()) * 60000;
            }
        }
    }

    $(".timer").click(function() {
        if (time === undefined) { // first time
            $("#session").prop("disabled", true);
            $("#break").prop("disabled", true);
            running = true;
            session = true;
            time = $("#session").val() * 60 * 1000;
            //time = 5000;
            intervalID = setInterval(tick, 1000);
        } else if (running) {
            running = false;
            if (session) {
                $("#session").prop("disabled", false);
                $("#break").prop("disabled", true);
            } else {
                $("#session").prop("disabled", true);
                $("#break").prop("disabled", false);
            }
            clearInterval(intervalID);
        } else {
            $("#session").prop("disabled", true);
            $("#break").prop("disabled", true);
            running = true;
            intervalID = setInterval(tick, 1000);
        }
    });
    $("#session").on("change", function() {
        if (session === false) return;
        // Reset everything
        clearInterval(intervalID);
        running = false;
        time = undefined;
        $("#timeLeft").html($("#session").val());
    });
    $("#break").on("change", function() {
        if (session === true) return;
        // Reset everything
        clearInterval(intervalID);
        running = false;
        time = undefined;
        $("#timeLeft").html($("#break").val());
    });
});
