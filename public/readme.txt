-topic of project
    Development of NodeJS and JavaScript based Multi Chatbot Interaction

-The purpose of project 
    the purpose of project is to demonstate interaction between difference chatbot framework based of chatbot APIs (dialogflow and watson assistant)

    

-How to install project
    install node in your local computer: url: https://nodejs.org/en/
    run npm install in cmd window
    run node app.js command 

-How to run project    
    if you run project , go to http://localhost:3000/ and you can see homepage
    In here, choose to question and answer bots in left panel(if you have many bots, can search in left top panel.)
    To stop conversation , please stop button. To continue , click start button again and to save, you can click save button.(after save, you can download in your computer when you click download button)
    To start new conversation, you can click reset button in left top of window.
    
- Configuration of the project
    This project has made by node.js/Express and backend is node.js frontend is EJS(JS engine)/Javascript
    Backend:        app.js
    frontend:       views/homepage.ejs, public/javascripts/main.js 
    database:       SQLite(db/botlists.db)
      To see you db data, you have to install "Navicat premium" or other for db.



    table structure
        id  image-url                                                                       botname                    api                                               token/ id                            workspaceid (only watson assistant)     description

        1	https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg	                    bot1		                                                    595198c8c9cb4007ba42584d0673e3c5		                                                dialogflow
        3	https://i.pinimg.com/originals/ac/b9/90/acb990190ca1ddbb9b20db303375bb58.jpg	bot2		                                                    20f3473aba18437aa1602577c49abec6		                                                dialogflow
        4	https://static.turbosquid.com/Preview/001214/650/2V/boy-cartoon-3D-model_D.jpg	bot3	https://gateway-wdc.watsonplatform.net/assistant/api	cq0r8YqtCGZgAJcBGiMT91jqm6VguNHWxcD3zDinYGLa	b9234428-b3e0-4daf-a331-cc1c1f494cb7	watson assistant

    
    External API: dialogflow and watson assistant 
        Bot1(dialogflow):       https://dialogflow.cloud.google.com/#/editAgent/f3fb739e-dd8a-4569-89e6-ced21c392a87/
        Bot2(dialogflow):       https://dialogflow.cloud.google.com/#/editAgent/008c0a5c-6663-437a-bf0b-f74051a5eb93/
        Bot3(watson assistant): https://assistant-us-east.watsonplatform.net/us-east/crn:v1:bluemix:public:conversation:us-east:a~2F525a1bcc48ea4759ab60ac566b4281a0:530671d6-b175-46e2-997d-24b835f9577b::/assistants



--Principle of the project
  1. If you run project, go to views/homepage.ejs  32 line ~ 49 line is part that receive data from db when you hit url with get mode (http://localhost:3000/) 
     backend: see app.js 37 line ~ 53 line
  2. Drag and drop
    when you drag and drop bots to question and answer, call getintents() function automatically after 10s  (you can see 74 line ~ 82 line in public/javascripts/main.js)
  3. when click start button, call getintent() function in manually
    if the bot to answer is watson assistant , call intentMessages_wa() function or :dialogflow , call intentMessages_dia() function.

    1) intentMessages_wa()  (241 line ~ 261 line) 
     In here you can get intent of conversation using ajax from node backend (app.js  : 53 line ~ 89 line)
     In backend call watson assistant to get intent using infor(api, url, workspaceid,...) from db.
     In frontend, after get intent, call startfunc_wa(intents) : 193 line ~ 204 line of public/javascripts/main.js.
     You can get message for question per every intent (questionMessage_wa(intent) : 296 ~ 331 line) and call answerMessage() : 409 line ~ 449 line.
     In backend (app.js) call watson assistant api to get question and answer like get intent (question message : 91 line ~ 129 line , answer message : 130 line ~ 164 line)
     so, question message and answer message are added in right panel step by step 
     
             *** call wait() function to delay time ***
    
    2)intentMessages_dia() (260 line ~ 294 line) -> to get intent you can see app.js 166 ~ 180
     In this function call external api directly to get intent.
     if success, call  startfunc_dia()
     in here, use array of intent like intentMessages_dia()

  4. When click stop button. call stop_conversation()  

  5. when click save button, call save_conversation() and save db/chatting.json and so click download button and download data.json


  6. Disadvantage of connector
    It doesn't mean for multichat because 
     if project have 3 bots have different intent, to chat each other every bot have a lot of data : include 3 intents
     The 3 different bots doesn't recognize intent, so chatting will stop and have not generally.
     
