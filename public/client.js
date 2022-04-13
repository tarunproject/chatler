// adding socket.io
const socket = io();

// selectors
const leaveButton = document.querySelector('#leaveRoom');
const roomName = document.querySelector('#getName');
const inputMessage = document.querySelector("#message");
const sendMessagebtn = document.querySelector('#sendMessage');
const userList = document.querySelector('#usersList');
const chatMessageContainer = document.querySelector(".chatMessages");
const chatForm = document.querySelector('#chat-form')

// variables
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

   // making time function
var time = new Date();
var hour = time.getHours();
var minute = time.getMinutes();
var am = "AM";

switch (hour){
    case 13:
    hour = 1;
    am = " PM";
    break;
     case 14:
    hour = 2;
    am = " PM";
    break;
     case 15:
    hour = 3;
    am = " PM";
    break;
     case 16:
    hour = 4;
    am = " PM";
    break;
     case 17:
    hour = 5;
    am = " PM";
    break;
     case 18:
    hour = 6;
    am = " PM";
    break;
     case 19:
    hour = 7;
    am = " PM";
    break;
     case 20:
    hour = 8;
    am = " PM";
    break;
     case 21:
    hour = 9;
    am = " PM";
    break;
     case 22:
    hour = 10;
    am = " PM";
    break;
     case 23:
    hour = 11;
    am = " PM";
    break;
     case 24:
    hour = 0;
    am = " PM";
    break;
}


// creating exact time format to add in time
let exactTime = hour+":"+minute+am;



//   socket.io
// sending  a join request to server
  socket.emit('joinRoom' , username,room);

  // show the room and user list in aside bar
  socket.on('roomUsers',({room,users}) => {
    roomName.innerHTML = room;
    addRoomUsers(users)

    userList.scrollTop = userList.scrollHeight;
  })



//   welcome to new user by bot message 
  socket.on('getMessage',(username)=>{
     messageBox("Chatler bot",`Hi ${username}, welcome to chatler`)
     chatMessageContainer.scrollTop = chatMessageContainer.scrollHeight;
  })

//   send message to other user that a new user joined the chat
socket.on('joinUser',(username) => {
    messageBox("Chatler bot",`${username} joined the chat`)
    chatMessageContainer.scrollTop = chatMessageContainer.scrollHeight;
})


// when user leave the chat show this message - recieving message to server
socket.on('leaveUser',(username) => {
    messageBox("Chatler bot",`${username} leave the chat`)
    chatMessageContainer.scrollTop = chatMessageContainer.scrollHeight;
})

// appear and recieve message from server in chat message box 
socket.on('message',(username,message)=>{
    messageBox(username,message);
    chatMessageContainer.scrollTop = chatMessageContainer.scrollHeight;
})


// send and recieve messages
chatForm.addEventListener('submit',(e) => {
e.preventDefault();
let msg = e.target.elements.message.value;
msg = msg.trim();

// send message to server
socket.emit("sendMessage",username,msg)
// Clear input
e.target.elements.message.value = '';
e.target.elements.message.focus();
})


//   add roomname and user to chatler

function addRoomUsers(users){
  userList.innerHTML = '';
  users.forEach((user) =>{
    let p = document.createElement('p');
    p.innerHTML = user.username;
   userList.appendChild(p)
  })
       
    
}

// add message box to area
function messageBox(sender,senderMessage){
    let div = document.createElement('div');
    div.classList.add('messageBox');
    let msg = `<div class="upperMessage">
    <h4 class="usernameinMessage">${sender}</h4>
    <h4 class="time">${exactTime}</h4></div>
    <h2 class="messageInChatArea">${senderMessage}</h2>`;
    div.innerHTML = msg;
    chatMessageContainer.appendChild(div)
}

// click leave button
leaveButton.addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });


 