// init value
var sourceid = '';
var m_chatting = [];
var m_stop_button = 0;
var m_question = '';
var m_answer = '';
var m_start = '';
var m_question_img = '';
var m_answer_img = '';
var qestion_str = '';
var description = '';
$('.btn-ultra-voilet').prop('disabled', true);
$('.save').prop('disabled', true);
$('.btn-purple-moon').prop('disabled', true);

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData('text', ev.target.id);
  sourceid = ev.target.id;

  document.getElementById('question').style.opacity = '0.2 ';
  document.getElementById('answer').style.opacity = '0.2 ';
  document.getElementById('question').style.border = 'dashed ';
  document.getElementById('answer').style.border = 'dashed ';
}

function dragEnter(event) {
  document.getElementById('_question').style.display = 'none';
  document.getElementById('_answer').style.display = 'none';
}

async function drop_question(ev) {
  if (!Boolean(m_question)) {
    document.getElementById('question').style.border = 'none ';
    document.getElementById('answer').style.border = 'none ';
    document.getElementById('_question').style.display = 'none';
    document.getElementById('answer').style.opacity = '1 ';
    document.getElementById('question').style.opacity = '1 ';
    m_question = sourceid;

    ev.preventDefault();
    var data = ev.dataTransfer.getData('text');
    m_question_img = document.getElementById(data).getAttribute('src');
    ev.target.appendChild(document.getElementById(data));
    if (m_answer && !m_start) {
      $('.btn-purple-moon').prop('disabled', false);
      var str = 'you can click start button or start after 5s.';
      alertfunc(str);
      await wait(5);
      if (!m_start) {
        getintents();
      }
    }
  }
}

async function drop_answer(ev) {
  if (!m_answer) {
    document.getElementById('answer').style.border = 'none ';
    document.getElementById('question').style.border = 'none ';
    document.getElementById('_answer').style.display = 'none';
    document.getElementById('answer').style.opacity = '1 ';
    document.getElementById('question').style.opacity = '1 ';
    m_answer = sourceid;
    ev.preventDefault();
    m_answer_img = document.getElementById(m_answer).getAttribute('src');
    var data = ev.dataTransfer.getData('text');
    ev.target.appendChild(document.getElementById(data));

    description = document.getElementById(data).innerText;
    if (m_question) {
      var str = 'you can click start button or start automatically after 10s.';
      alertfunc(str);
      $('.btn-purple-moon').prop('disabled', false);
      await wait(10);
      if (!m_start) {
        getintents();
      }
    }
  }
}

function stop_conversation() {
  var str = 'conversation was stopped. please click save button.';
  alertfunc(str);
  $('.btn-ultra-voilet').prop('disabled', true);
  $('.save').prop('disabled', false);
  $('.btn-purple-moon').prop('disabled', false);
  m_stop_button = 2;
}

async function save_conversation() {
  $.ajax({
    url: '/save',
    method: 'POST',
    data: {
      data: JSON.stringify(m_chatting),
    },
    dataType: 'json',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    success: async function(res) {
      var data =
        'text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(m_chatting));
      document.getElementById('savebutton').style.display = 'none';
      $(
        '<a href="data:' +
          data +
          '" download="data.json" class="col btn save btn-success btn-rounded " id="download">download JSON</a>'
      ).appendTo('#download');
    },
    error: function(error) {
      console.log('some error in fetching the notifications');
    },
  });
}

function reset_conversation() {
  location = location.href;
}

//search function
function mysearch() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  ul = document.getElementById('myUL');
  li = ul.getElementsByTagName('li');
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByClassName('user_info')[0];
    if (a) {
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = '';
      } else {
        li[i].style.display = 'none';
      }
    }
  }
}

//function delaying time
function wait(sec) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('done!');
    }, sec * 1000);
  });
}

//start conversation( continue or new play)
async function getintents() {
  //init button
  $('.btn-purple-moon').prop('disabled', true);
  $('.save').prop('disabled', true);
  $('.btn-ultra-voilet').prop('disabled', false);
  m_start = true;

  // when choose both bots
  if (m_question && m_answer) {
    //when click start button again
    if (m_stop_button == 2) {
      m_stop_button = 1;
    }

    //when start new conversation
    if (m_stop_button == 0) {
      if (description.length > 20) {
        intentMessages_wa();
      } else {
        intentMessages_dia();
      }
      var str = 'start chatting';
      alertfunc(str);
    }
  } else {
    alert('Add bots to drag and drop panel');
    $('.btn-purple-moon').prop('disabled', false);
  }
}

async function alertfunc(str) {
  document.getElementById('state-alert').innerHTML = str;
  document.getElementById('state-alert').style.opacity = '1';
  await wait(1);
  document.getElementById('state-alert').style.transitionProperty = 'opacity';
  document.getElementById('state-alert').style.opacity = '0';
}

async function startfunc_wa(intentarray) {
  // alert(intentarray);
  for (var x in intentarray) {
    // alert(x);
    var intent = intentarray[x].intent;
    // console.log(intent);

    while (m_stop_button == 2) {
      await wait(1);
    }
    await wait(3);
    questionMessage_wa(intent);
    await wait(3);
  }
}

async function startfunc_dia(array, token) {
  var i;
  console.log(name);
  console.log(token);

  //pushing topic of conversation
  var id2 = m_answer + '_name';
  var answer_bot_name = document.getElementById(id2).innerHTML;
  var id1 = m_question + '_name';
  var question_bot_name = document.getElementById(id1).innerHTML;
  var topic =
    'chatting between ' + question_bot_name + ' and ' + answer_bot_name;
  m_chatting.push({
    topic: topic,
  });

  //conversation sort
  array.sort(sortByProperty('name'));
  console.log(array);

  for (i = 0; i < array.length; i++) {
    var id = array[i].id;
    await wait(5);
    while (m_stop_button == 2) {
      await wait(1);
    }
    Message_dia(id, token);
  }
}

var sortByProperty = function(property) {
  return function(x, y) {
    return x[property] === y[property] ? 0 : x[property] > y[property] ? 1 : -1;
  };
};

async function intentMessages_wa() {
  $.ajax({
    url: '/intent',
    method: 'POST',
    data: {
      text: m_answer,
      des: 'watson assistant',
    },
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    success: function(res) {
      var intents = res.intent;
      startfunc_wa(intents);
    },
    error: function(error) {
      console.log('some error in fetching the intents');
    },
  });
}

async function intentMessages_dia() {
  $.ajax({
    url: '/intent_dia',
    method: 'POST',
    data: {
      text: m_answer,
    },
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    success: function(res_db) {
      var token = res_db.key;
      var api_url = 'https://api.dialogflow.com/v1/intents?v=20150910';
      $.ajax({
        url: api_url,
        type: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },

        success: function(res) {
          console.log(res);
          // console.log(JSON.parse(res));
          startfunc_dia(res, token);
        },
        error: function(error) {
          alert('failed to API connection. Try againafter a few minutes');
          console.log(error);
        },
      });
    },
    error: function(error) {
      console.log('some error in fetching the intents');
    },
  });
}

function questionMessage_wa(intent) {
  $.ajax({
    url: '/question',
    method: 'POST',
    data: {
      text: intent,
      des: m_answer,
    },
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    success: async function(res) {
      while (m_stop_button == 2) {
        await wait(1);
      }
      var str = '';
      str += '<div class="msg_cotainer">' + res.question + '</div>';
      $('.msg_card_body').append(
        '<div class="d-flex justify-content-start mb-4"><div class="img_cont_msg"><img class="rounded-circle user_img_msg" src="' +
          m_question_img +
          '" /></div>' +
          str +
          '</div>'
      );
      // alert(res.question);
      updatescrollbar();
      var id = m_question + '_name';
      var question_bot_name = document.getElementById(id).innerHTML;
      var obj = {};
      obj[question_bot_name] = res.question;
      var chat = {};
      m_chatting.push(obj);
      answerMessage(res.question);
    },
    error: function(error) {
      console.log('some error in fetching the notifications');
    },
  });
}

function Message_dia(id, token) {
  var api_url = 'https://api.dialogflow.com/v1/intents/' + id + '?v=20150910';
  $.ajax({
    url: api_url,
    type: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    success: async function(res) {
      while (m_stop_button == 2) {
        await wait(1);
      }
      if (m_stop_button == 0 || m_stop_button == 1) {
        var usersays = res.userSays[0].data[0].text;
        var str = '';
        str += '<div class="msg_cotainer">' + usersays + '</div>';
        $('.msg_card_body').append(
          '<div class="d-flex justify-content-start mb-4"><div class="img_cont_msg"><img class="rounded-circle user_img_msg" src="' +
            m_question_img +
            '" /></div>' +
            str +
            '</div>'
        );
        updatescrollbar();
        var id = m_question + '_name';
        var question_bot_name = document.getElementById(id).innerHTML;
        var obj_question = {};
        obj_question[question_bot_name] = usersays;
        m_chatting.push(obj_question);
      }

      await wait(3);

      while (m_stop_button == 2) {
        await wait(1);
      }
      if (m_stop_button == 0 || m_stop_button == 1) {
        var strs = '';
        if (res.responses[0].messages[0].speech[0].length > 1) {
          strs = res.responses[0].messages[0].speech[0];
        } else {
          strs = res.responses[0].messages[0].speech;
        }

        var str2 = '';
        str2 += '<div class="msg_cotainer_send">' + strs + '</div>';
        $('.msg_card_body').append(
          '<div class="d-flex justify-content-end mb-4">' +
            str2 +
            '<div class="img_cont_msg"><img class="rounded-circle user_img_msg" src="' +
            m_answer_img +
            '" /></div></div>'
        );
        updatescrollbar();
        var nameid = m_answer + '_name';
        var answer_bot_name = document.getElementById(nameid).innerHTML;
        var obj_answer = {};
        obj_answer[answer_bot_name] = strs;
        m_chatting.push(obj_answer);
        var pos = strs.indexOf('bye');
        if (pos > 0) {
          var finishstr = 'the conversation have been finished.';
          alertfunc(finishstr);
          $('.save').prop('disabled', false);
          await wait(0.1);
        }
      }
    },
    error: function(error) {
      alert('failed to connect api');
      console.log('some error in fetching the intents');
    },
  });
}

function answerMessage(intent) {
  $.ajax({
    url: '/answer',
    method: 'POST',
    data: {
      text: intent,
      des: m_answer,
    },
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    success: async function(res) {
      while (m_stop_button == 2) {
        await wait(1);
      }
      var str = '';
      str += '<div class="msg_cotainer_send">' + res.from + '</div>';
      $('.msg_card_body').append(
        '<div class="d-flex justify-content-end mb-4">' +
          str +
          '<div class="img_cont_msg"><img class="rounded-circle user_img_msg" src="' +
          m_answer_img +
          '" /></div></div>'
      );
      updatescrollbar();
      var id = m_answer + '_name';
      var answer_bot_name = document.getElementById(id).innerHTML;
      var obj = {};
      obj[answer_bot_name] = res.from;
      m_chatting.push(obj);
      var pos = str.indexOf('bye');
      if (pos > 0) {
        var finishstr = 'the conversation have been finished.';
        alertfunc(finishstr);
        $('.save').prop('disabled', false);
        await wait(0.1);
      }
    },
    error: function(error) {
      console.log('some error in fetching the notifications');
    },
  });
}

function updatescrollbar() {
  var mydiv = $('.msg_card_body');
  mydiv.animate(
    {
      scrollTop: mydiv.prop('scrollHeight'),
    },
    'slow'
  );
}

// $(document).ready(function() {});
