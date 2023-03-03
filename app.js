const express = require("express");
const bodyParser = require("body-parser");
const request = require("request")
const https = require("https");
const { json } = require("body-parser");
const e = require("express");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
const firstName = req.body.fname;
const lastName = req.body.lname;
const email = req.body.email;

const Mailchimp = require('mailchimp-api-v3');
const myListId = "fe12bb1781";
const myApi = "48e603c3f642508a30f262320dbe42da-us12"
const mailchimp = new Mailchimp(myApi);

mailchimp.post(`/lists/${myListId}/members`, {
  email_address: email,
  status: 'subscribed',
  merge_fields: {
    FNAME: firstName,
    EMAIL: email,
    LNAME : lastName
  }
})
/*const data = {
    members: [
        {
        email_address: email,
        status : "suscribed",
        merge_fields: {
            FNAME : firstName,
            LNAME : lastName,
            EMAIL : email
        
        }
        }
    ]
}*/
const jsonData = JSON.stringify(mailchimp);

let url = "https://us12.api.mailchimp.com/3.0/lists/fe12bb1781/members"

let options = {
    method:"POST",
    auth:"davi1:48e603c3f642508a30f262320dbe42da-us12"

}

const request = https.request(url, options, function(response){

    if(response.statusCode === 400){
        res.sendFile(__dirname + "/success.html");
    }else{
        res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(mailchimp){
        console.log(JSON.parse(mailchimp))
    })
})
request.write(jsonData);
request.end();
})

app.post("/failure", function(req, send){
    res.redirect("/");
})
app.listen(3000, function(){
        console.log("app running on port 3000.")
    })


    // api key
    //48e603c3f642508a30f262320dbe42da-us12

    // list id
    //fe12bb1781