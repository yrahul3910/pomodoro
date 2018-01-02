const $ = require("jquery");
const os = require("os");
const fs = require("fs");
const id3 = require("id3js");

// from https://codepen.io/influxweb/pen/LpoXba
function getAverageRGB(imgEl) {
    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement("canvas"),
        context = canvas.getContext && canvas.getContext("2d"),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        /* security error, img on diff domain */
        return defaultRGB;
    }

    length = data.data.length;

    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);

    return rgb;
}

$(document).ready(() => {
    let img = document.createElement("img");
    img.src = "./back.jpg";
    let average = getAverageRGB(img);
    $("#player").css("background", `rgb(${average.r}, ${average.g}, ${average.b})`);

    let home = os.homedir();
    let musicDir = home + "\\Music";

    fs.readdir(musicDir, (err, files) => {
        files = files.filter((val) => {
            return val.endsWith(".mp3");
        });

        files.forEach((file) => {
            id3({file: `${musicDir}\\${file}`, type: id3.OPEN_LOCAL}, (err, tags) => {
                if (err) throw err;

                let {title, album, artist, year} = tags;
                let genre = tags.v2.genre || tags.v1.genre;

                let html = `<li class="song-item">\
                                <p>${title || file}</p>\
                                <p>${artist || "Unknown Artist"}</p>\
                                <p>${album || "Unknown Album"}</p>\
                                <p>${year || ""}</p>\
                                <p>${genre || "Unknown Genre"}</p>\
                            </li>`;
                $("#songs").append(html);
            });
        });
    });
});
