// adding modules
const express = require('express')
const app = express();
const path = require("path");
const server = require('http').createServer(app);
const io = require("socket.io")(server);


// creating variable
const staticPath = path.join(__dirname, "/public/");
const port = process.env.PORT || 5000;
// middleware
app.use('/images',express.static(path.join(__dirname, "/images/")))
app.use(express.static(staticPath))

// routing
app.get("/", (req, res) => {
    res.sendFile(staticPath + "/index.html")
})


// user list 
const users = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}
// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}




// whenever someone connects this gets executed by socket.io
io.on("connection", (socket) => {
// show that user join the chat in server console
    console.log("a user connected");

    // get join request to client
    socket.on('joinRoom', (username, room) => {

        // creating variables
        const user = userJoin(socket.id,username,room)
        socket.join(user.room);
        
        // sending bot message
        socket.emit('getMessage', username);
        socket.broadcast.to(room).emit('joinUser', username)

        // adding room name and add a user
        io.to(user.room).emit('roomUsers', {
            room:user.room,
            users:getRoomUsers(user.room)
        });


        // send and recieve messages 
        socket.on('sendMessage',(username,message)=>{
            io.to(user.room).emit('message',username,message)
        })
    })



    // whenever some disconnect this code will executed
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            socket.broadcast.to(user.room).emit('leaveUser', user.username)
    
          // Send users and room info
          io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
          });
        }else{}
      });
})



// listening to the port 
server.listen(port, () => {
    console.log("the server is listening on 5000")
})