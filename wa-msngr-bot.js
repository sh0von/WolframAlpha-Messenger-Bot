'use strict'
	const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === '12345') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
var sender
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        if(event){
            if(event.message){
                sender = event.sender.id
                if(event.message.text)
                {
                    let text = event.message.text
            //call
                    console.log(text);
                    //console.log("http://www.wolframalpha.com/input/?i="+text)
                    rateProf(text);
                    continue;
                }
            }
        }
    }
res.sendStatus(200)
})

const token = "Facebook Token Here"

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

var Client = require('node-wolfram');
      /*if (event.message && event.message.text) {
        let text = event.message.text
        if (text === 'Generic') {
            sendGenericMessage(sender)
            continue
        }
        sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
      }
      if (event.postback) {
        let text = JSON.stringify(event.postback)
        sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
        continue
      }
  }*/
  var Wolfram = new Client('WOlfram-Api-Here');  
  //console.log("wolfram name")
  //console.log(Wolfram)
  function rateProf(text) {

    var callback = function(e,result){
        if (!result) {
            console.log("return");
            return;
        }
        console.log("in"); 
    //Wolfram.query(text1, function(err, result) {
    //if(err)
     //   console.log(err);
    //else
    //{ 
        var flag = 0
        console.log("inside"); 
        if(result)
        {
            console.log("Result emp:")
            if(result.queryresult)
            {
                console.log("QueryResult emp:")
                if(result.queryresult.pod)
                {
                    console.log("Pod emp:")
                    for(var a=1; a<(result.queryresult.pod.length>3?3:result.queryresult.pod.length); a++)
                    {
                        var pod = result.queryresult.pod[a];
                        if(!pod)
                        {
                            console.log("return");
                            //return;
                        }
                        else
                        {
                            console.log(pod.$.title,": ");
                            for(var b=0; b<(pod.subpod.length>3?3:pod.subpod.length); b++)
                            {
                                var subpod = pod.subpod[b];
                                if(subpod)
                                {
                                    console.log("Subpod")
                                    for(var c=0; c<subpod.plaintext.length; c++)
                                    {
                                        var text = subpod.plaintext[c];
                                        console.log('\t', text);
                                        sendTextMessage(sender,text)
                                        flag = 1

                                    }
                                }
                            }
                            //return;
                        }
                    }
                }
            }
        }
        if(flag == 0)
        sendTextMessage(sender,"?????????????????? sir, ?????? ???????????????????????? ???????????? ???????????????????????? ??????, ?????????????????? ?????????????????? ?????????!")
        //sendTextMessage(sender,"http://www.wolframalpha.com/input/?i="+text)
    }

                    //console.log("


    Wolfram.query(text,callback);
};
