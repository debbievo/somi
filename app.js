var restify = require ('restify');
var builder = require ('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');
var connect = require('./data/sqlconnection');

<<<<<<< HEAD
=======
connect.insertrow();

>>>>>>> c4d94d82dff5a8d235a4bc0cbd38e319cbc757e7
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
	knowledgeBaseId: '05ea5c10-d052-444b-878a-f896b0f1d656', 
	subscriptionKey: '8753c18466b04b2bb2abb26ea4e3bdae'});
	
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
intents.matches(/^help/i, [
    function (session, results) {
        session.beginDialog('/help')
    }]);
intents.matches(/^get balance/i,
    function (session, results) {
        session.send('Ok... your balance is $%f', session.userData.balance.toFixed(2));
    });
intents.matches(/^balance/i,
    function (session, results) {
        session.send('Ok... your balance is $%f', session.userData.balance.toFixed(2));
    });
intents.matches(/^check balance/i,
    function (session, results) {
        session.send('Ok... your balance is $%f', session.userData.balance.toFixed(2));
    });
intents.matches(/^current balance/i,
    function (session, results) {
        session.send('Ok... your balance is $%f', session.userData.balance.toFixed(2));
    });

intents.matches(/^add/i, [
    function (session, results) {
        session.beginDialog('/add')
    }]);
intents.matches(/^deposit/i, [
    function (session, results) {
        session.beginDialog('/add')
    }]);
intents.matches(/^place/i, [
    function (session, results) {
        session.beginDialog('/add')
    }]);
intents.matches(/^put/i, [
    function (session, results) {
        session.beginDialog('/add')
    }]);

intents.matches(/^withdraw/i, [
    function (session, results) {
        session.beginDialog('/withdraw')
    }]);
intents.matches(/^take/i, [
    function (session, results) {
        session.beginDialog('/withdraw')
    }]);

intents.matches(/^remove/i, [
    function (session, results) {
        session.beginDialog('/withdraw')
    }]);

intents.matches(/^pull/i, [
    function (session, results) {
        session.beginDialog('/withdraw')
    }]);

intents.matches(/^transfer/i, [
    function (session, results) {
        session.beginDialog('/transfer')
    }]);

//bot.dialog('/help', [
//    function (session) {
//        session.beginDialog('/herocardHelp');
//   }
//]);

bot.dialog('/name', [
    function (session) {
        session.beginDialog('/herocard');
    },
    function (session) {
        builder.Prompts.text(session, 'What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.beginDialog('/balance');
    }
]);
bot.dialog('/herocard', [
    function (session, results) {
        var card = createHeroCard(session);
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        session.endDialog();  
    }
]);
bot.dialog('/balance', [
    function (session, results) {
        builder.Prompts.text(session, 'What is your current balance?');
    },
    function (session, results) {
        session.userData.balance = parseFloat(results.response);
        //connect.insertRow(session.userData.name, session.userData.balance);
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
            session.send("All you have is %f", session.userData.balance.toFixed(2));
        }
        else{
        session.userData.balance -= parseFloat(results.response);
        session.send('You now have %f', session.userData.balance.toFixed(2));
        session.endDialog();
        }
    }]);

bot.dialog('/transfer', [
    function (session) {
        builder.Prompts.text(session, 'What do you want to transfer?');
    },
    function (session, results) {
        if(session.userData.balance < parseFloat(results.response)){
            session.send("You don't have that much money!");
            session.send("All you have is $%f", session.userData.balance.toFixed(2));
        }
        else{
        session.userData.balance -= parseFloat(results.response);
        session.send('You now have $%f', session.userData.balance.toFixed(2));
        session.endDialog();
        }
    }
]);
function createHeroCard(session) {
    return new builder.HeroCard(session)
        .title('Hi, my name is Somi!')
        .subtitle('I can help manage your bank account.')
        .images([
            builder.CardImage.create(session, 'https://raw.githubusercontent.com/tiffany-pan/somi/master/pics/somi.png?token=AVlM59if0lbstuqBTx4bvRqEkl5tjlzaks5Y81KTwA%3D%3D')
        ]);
}