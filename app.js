const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { connect } = require("net");
const { response } = require("express");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/sign-up.html");
})

app.post("/", function(req, res) {


    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }


    const jsonData = JSON.stringify(data);

    const url = 'https://us14.api.mailchimp.com/3.0/lists/57caf79323';

    const options = {
        method: "POST",
        auth: "daniel3:5f75387d654ed2ddeb80ca1d2962865b-us14"
    }

    const request = https.request(url, options, (response) => {
       if (response.statusCode === 200) {
           res.sendFile(__dirname + "/success.html")
       } else {
           res.sendFile(__dirname + "/failure.html")
       }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })


    request.write(jsonData);
    request.end();
})

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.listen(process.env.PORT, () => {
     console.log("server is running on port 3000")
});


