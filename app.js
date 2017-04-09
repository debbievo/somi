var restify = require ('restify');
var builder = require ('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');
var connect = require('./data/sqlconnection');



connect.insertrow();

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

var recognizer = new cognitiveservices.QnAMakerRecognizer({
	knowledgeBaseId: '67e04557-1c27-4045-b1c1-8469aab5e53c', 
	subscriptionKey: 'fe6e8e5c4d364d4ebb55428ec4030b48'});
	
var basicQnAMakerDialog = new cognitiveservices.QnAMakerDialog({ 
	recognizers: [recognizer],
	defaultMessage: 'No match! Try changing the query terms!',
	qnaThreshold: 0.3});

//=========================================================
// Bots Dialogs
//=========================================================

var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/name');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send(' Hi %s, How can I help you?', session.userData.name);
    }
]);
intents.matches(/^name/i, [
    function (session, results) {
        session.beginDialog('/name')
    }]);

intents.matches(/^get balance/i,
    function (session, results) {
        session.send('Ok... your balance is %f', session.userData.balance.toFixed(2));
    });

intents.matches(/^add/i, [
    function (session, results) {
        session.beginDialog('/add')
    }]);

intents.matches(/^deposit/i, [
    function (session, results) {
        session.beginDialog('/add')
    }]);

intents.matches(/^withdraw/i, [
    function (session, results) {
        session.beginDialog('/withdraw')
    }]);

bot.dialog('/name', [
    function (session) {
        builder.Prompts.text(session, 'Hey there, What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.beginDialog('/balance');
    }
]);

bot.dialog('/balance', [
    function (session, results) {
        builder.Prompts.text(session, 'What is your current balance?');
    },
    function (session, results) {
        session.userData.balance = parseFloat(results.response);
        session.endDialog();
    }
]);

bot.dialog('/add', [
    function (session) {
        builder.Prompts.text(session, 'How much do you want to add?');
    },
    function (session, results) {
        session.userData.balance += parseFloat(results.response);
        session.send('You now have $%f', session.userData.balance.toFixed(2));
        session.endDialog();
    }
]);

bot.dialog('/withdraw', [
    function (session) {
        builder.Prompts.text(session, 'How much do you want to take out?');
    },
    function (session, results) {
        if(session.userData.balance < parseFloat(results.response)){
            session.send("You don't have that much money!");
            session.send("This is all you have", session.userData.balance.toFixed(2));
        }
        else{
        session.userData.balance -= parseFloat(results.response);
        session.send('You now have %f', session.userData.balance.toFixed(2));
        session.endDialog();
        }
    }


]);



