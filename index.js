const express = require("express");
const { default: fetch } = require("node-fetch");
const app = express();

async function parser(data) {
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
    console.log(licenses)
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
        .then(data => parser(data))
        .then(res.send("Thanks bye."))
});

// PORT
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
