const express = require('express');
const app = express();
const fs = require('fs');
var sqlite = require('sqlite3');
const AssistantV1 = require('ibm-watson/assistant/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

var path = require('path');
var bodyParser = require('body-parser');
var httpsMsgs = require('http-msgs');

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// var db = new sqlite.Database('db/botlists.db');
var db = new sqlite.Database('db/botlists.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the botlists SQlite database.');
});

var sql = `SELECT id bot_id,
          url bot_url,
          image_url bot_image,
          apikey bot_api,
          workspaceID bot_workspaceid,
          description d_w    
          FROM botlists
          WHERE id  = ?`;
app.get('/', function(req, res) {
  var all_list = [];
  db.serialize(function() {
    db.each(
      'SELECT * FROM botlists',
      function(err, row) {
        all_list.push(row);
      },
      function() {
        // All done fetching records, render response
        res.render('homepage.ejs', {
          bots: all_list,
        });
      }
    );
  });
});

app.post('/intent', function(req, ress) {
  var _des = req.body.des;
  console.log(_des);
  var _id = req.body.text;
  var id = _id;

  // id row only
  db.get(sql, [id], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    const service = new AssistantV1({
      version: '2019-02-28',
      authenticator: new IamAuthenticator({
        apikey: row.bot_api,
      }),
      url: row.bot_url,
    });
    const params = {
      workspaceId: row.bot_workspaceid,
    };

    service
      .listIntents(params)
      .then((res) => {
        var intentlist = res.result.intents;
        httpsMsgs.sendJSON(req, ress, {
          intent: intentlist,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

app.post('/question', function(req, ress) {
  var _intent = req.body.text;
  var _id = req.body.des;
  var id = _id;

  // id row only
  db.get(sql, [id], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    const service = new AssistantV1({
      version: '2019-02-28',
      authenticator: new IamAuthenticator({
        apikey: row.bot_api,
      }),
      url: row.bot_url,
    });

    const paramsintent = {
      workspaceId: row.bot_workspaceid,
      intent: _intent,
    };

    service
      .listExamples(paramsintent)
      .then((res) => {
        // console.log(JSON.stringify(res, null, 2));
        console.log(res.result.examples[0]);
        var resdata = res.result.examples[0];

        httpsMsgs.sendJSON(req, ress, {
          question: res.result.examples[0].text,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
app.post('/answer', function(req, ress) {
  var intent = req.body.text;
  var id = req.body.des;

  // id row only
  db.get(sql, [id], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    const service = new AssistantV1({
      version: '2019-02-28',
      authenticator: new IamAuthenticator({
        apikey: row.bot_api,
      }),
      url: row.bot_url,
    });

    service
      .message({
        workspaceId: row.bot_workspaceid,
        input: {
          text: intent,
        },
      })
      .then((res) => {
        console.log(res.result.output.text[0]);
        httpsMsgs.sendJSON(req, ress, {
          from: res.result.output.text[0],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

app.post('/intent_dia', function(req, ress) {
  console.log(req.body);
  var id = req.body.text;

  // id row only
  db.get(sql, [id], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    httpsMsgs.sendJSON(req, ress, {
      resp: row.bot_image,
      key: row.bot_api,
    });
  });
});
app.post('/save', function(req, res) {
  // console.log(req.body.text);
  var savedata = req.body.data;
  fs.writeFileSync('db/chatting.json', savedata);

  httpsMsgs.sendJSON(req, res, {
    resp: 'row.bot_image',
  });
});

app.listen('3000', function() {
  console.log('Server is running on port 3000.');
});
