const express = require('express')
var bodyParser = require('body-parser')
const AWS = require('aws-sdk');

if (!AWS.config.region) {
    AWS.config.update({
      region: 'us-east-1'
    });
  }

const app = express();

const meeting = require('./controllers/meeting.js');
const appointment = require('./controllers/appointment.js');
const questionnaire = require('./controllers/questionnaire.js');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/questionnaire',questionnaire)
app.use('/appointment',appointment);
app.use('/meeting',meeting);

app.use(express.static("client/build"));

app.get("", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`) 
});
