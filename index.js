const express = require("express");
const { default: fetch } = require("node-fetch");
const app = express();
const { createCanvas } = require('canvas')
const fs = require('fs')
const path = require('path');


async function parser(data, res) {
    var licenses = {
        'MIT License': 8,
        'Mozilla Public License 2.0': 3,
        'BSD 3-Clause "New" or "Revised" License': 1,
        'Apache License 2.0': 1
    };
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

app.get("/", (req, res) => {
    res.send("Give usage info here. ");
});

app.get("/:username", (req, res) => {
    console.log(req.params)
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
