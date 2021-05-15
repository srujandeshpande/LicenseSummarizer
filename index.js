const express = require("express");
const { default: fetch } = require("node-fetch");
const app = express();
const { createCanvas } = require('canvas')
const fs = require('fs')
const path = require('path');

async function makeImg(licenses, res) {
    const width = 1200
    const height = 630

    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')

    context.fillStyle = '#000'
    context.fillRect(0, 0, width, height)

    context.font = 'bold 30pt Menlo'
    context.textAlign = 'left'
    context.textBaseline = 'top'
    context.fillStyle = '#3574d4'

    // const textWidth = context.measureText(text).width
    // context.fillRect(600 - textWidth / 2 - 10, 170 - 5, textWidth + 20, 120)
    context.fillStyle = '#fff'
    var w = 100;

    for (const key in licenses) {
        console.log(`${key}: ${licenses[key]}`);
        context.fillText(`${key}: ${licenses[key]}`, 60, w);
        w += 120
    }

    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync('./public/test.png', buffer)
    res.sendFile(path.join(__dirname, '/public/test.png'));
    return;
}

async function parser(data, res) {
    var licenses = {};
    var licname = "";
    for (var i = 0; i < data.length; i++) {
        if (data[i].license != null) {
            licname = data[i].license.name;
            if ((licname in licenses) == false) {
                licenses[licname] = 1;
            }
            else {
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
    var licenses = { 'MIT License': 5, 'Apache License 2.0': 7, Other: 17 }
    makeImg(licenses, res);
});

app.get("/:username", (req, res) => {
    // 2 Hours cache browserside
    // res.set('Cache-control', 'public, max-age=7200');
    let username = req.params.username;
    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json())
        .then(data => parser(data, res))
});

// PORT
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
