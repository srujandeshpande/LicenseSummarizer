const express = require("express");
const { default: fetch } = require("node-fetch");
const app = express();
const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");
const React = require("react");
var ReactDOMServer = require("react-dom/server");

async function makeImg(licenses, res) {
    const width = 1200;
    const height = 650;

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    context.fillStyle = "#000";
    context.fillRect(0, 0, width, height);

    context.font = "bold 30pt Menlo";
    context.textAlign = "left";
    context.textBaseline = "top";

    var w = 180;

    var total = 0;
    var count = 0;
    var l = [];

    for (const key in licenses) {
        l.push([licenses[key], key]);
    }

    function compare(a, b) {
        if (parseInt(a[0]) > parseInt(b[0])) {
            return -1;
        } else {
            return 1;
        }
    }
    l.sort(compare);
    count = l.length;
    for (var i = 0; i < l.length; i++) {
        total += l[i][0];
    }

    var colors = ["#581845", "#900C3F", "#C70039", "#FF5733", "#FFC300"];
    var cstart = 60;
    for (var i = 0; i < l.length; i++) {
        context.fillStyle = "#fff";
        context.fillText(`${l[i][1]} - ${l[i][0]}`, 150, w);
        context.fillStyle = colors[i];
        context.fillRect(60, w - 10, 60, 60);
        // Total length = 1080
        // Start at 60
        var len = (1080 * l[i][0]) / total;
        // gap from left, top gap, total length, width of line
        context.fillRect(cstart, 60, len, 60);
        cstart += len;
        w += 90;
    }

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync("./public/test.png", buffer);
    res.sendFile(path.join(__dirname, "/public/test.png"));
    return;
}

function makeSvg(licenses) {
    const textSpace = 50;
    const cardHeight = 90 + textSpace * Object.keys(licenses).length;
    const cardWidth = 495;
    const barheight = 10;
    const barY = 40;
    const barXStart = 50;
    const barWidth = cardWidth - 2 * barXStart;
    const barColors = ["#581845", "#900C3F", "#C70039", "#FF5733", "#FFC300"];
    const textStartX = barXStart;
    const textStartY = barY + 40;
    const licenseList = [];
    var total = 0;

    for (const key in licenses) {
        const licenseDetails = {
            name: key,
            count: parseInt(licenses[key]),
            percentage: 0,
            barStartX: 0,
            width: 0,
            textStartY: 0,
        };
        total += licenseDetails.count;
        licenseList.push(licenseDetails);
    }

    function compare(a, b) {
        if (a.count > b.count) {
            return -1;
        } else {
            return 1;
        }
    }

    licenseList.sort(compare);
    var prevXLoc = barXStart;
    var prevTextStartY = textStartY;

    for (const licenseIndex in licenseList) {
        const perc = licenseList[licenseIndex].count / total;
        const width = parseFloat((barWidth * perc).toFixed(2));
        licenseList[licenseIndex].percentage = parseFloat(perc.toFixed(2));
        licenseList[licenseIndex].barStartX = prevXLoc;
        licenseList[licenseIndex].width = width;
        licenseList[licenseIndex].textStartY = prevTextStartY;
        prevTextStartY += textSpace;
        prevXLoc += width;
    }

    function createMask(licenseItem, key) {
        return /*#__PURE__*/ React.createElement("rect", {
            key: key,
            xmlns: "http://www.w3.org/2000/svg",
            mask: "url(#rect-mask)",
            x: licenseItem.barStartX,
            y: barY,
            width: licenseItem.width,
            height: barheight,
            fill: barColors[key],
        });
    }

    function createLabel(licenseItem, key) {
        return /*#__PURE__*/ React.createElement(
            "g",
            {
                transform:
                    "translate(" +
                    textStartX +
                    ", " +
                    licenseItem.textStartY +
                    ")",
                key: key,
            },
            /*#__PURE__*/ React.createElement("circle", {
                cx: "5",
                cy: "6",
                r: "5",
                fill: barColors[key],
            }),
            /*#__PURE__*/ React.createElement(
                "text",
                {
                    x: "15",
                    y: "10",
                    fill: "#fff",
                },
                licenseItem.name + " - " + licenseItem.count
            )
        );
    }

    return /*#__PURE__*/ React.createElement(
        React.Fragment,
        null,
        /*#__PURE__*/ React.createElement(
            "svg",
            {
                width: cardWidth,
                height: cardHeight,
                style: {
                    background: "#0d1017",
                },
                xmlns: "http://www.w3.org/2000/svg",
            },
            /*#__PURE__*/ React.createElement(
                "g",
                null,
                /*#__PURE__*/ React.createElement(
                    "mask",
                    {
                        xmlns: "http://www.w3.org/2000/svg",
                        id: "rect-mask",
                    },
                    /*#__PURE__*/ React.createElement("rect", {
                        x: barXStart,
                        y: barY,
                        width: barWidth,
                        height: barheight,
                        fill: "white",
                        rx: "5",
                    })
                ),
                licenseList.map(createMask),
                licenseList.map(createLabel)
            )
        )
    );
}

async function parser(data, res) {
    var licenses = {};
    var licname = "";
    for (var i = 0; i < data.length; i++) {
        if (data[i].license != null) {
            licname = data[i].license.name;
            if (licname in licenses == false) {
                licenses[licname] = 1;
            } else {
                licenses[licname]++;
            }
        }
    }
    makeImg(licenses, res);
}

app.get("/", (req, res) => {
    res.send("Give usage info here. ");
});

app.get("/testing", (req, res) => {
    var licenses = {
        "MIT License": 5,
        "MIT3 License": 15,
        "MIT2 License": 2,
        "Apache License 2.0": 7,
        Other: 17,
    };
    makeImg(licenses, res);
    res.send("Testing.");
});

app.get("/testingSvg", (req, res) => {
    var licenses = {
        "MIT License": 5,
        "MIT3 License": 15,
        "MIT2 License": 2,
        "Apache License 2.0": 7,
        Other: 17,
    };

    res.header("Content-Type", "image/svg+xml");
    res.send(ReactDOMServer.renderToString(makeSvg(licenses)));
});

app.get("/:username", (req, res) => {
    // 2 Hours cache browserside
    res.set("Cache-control", "public, max-age=7200");
    let username = req.params.username;
    fetch(`https://api.github.com/users/${username}/repos`)
        .then((response) => response.json())
        .then((data) => parser(data, res));
});

// PORT
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
