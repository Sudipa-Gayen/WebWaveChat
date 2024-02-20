const socket = io('http://localhost:8000');
//get DOM element in the respective js variable
const form=document.getElementById("send-container");
const messageInp=document.getElementById("messageInp");
const messageContainer=document.querySelector(".container");

//to play the audio tune
var audio=new Audio('notification.mp3');


//function which will append the event into the container
const append = (message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){
        audio.play();
    }
}
//Ask new user for his/her name
const name=prompt("Enter Your Name");
socket.emit('new-user-joined', name);
//if new user join , receive the event from the server
socket.on('user-joined', name =>{
    append(`${name} joined the chat`,'right');
})
//if server sennds a message,receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`,'left');
})
//if a user leave the chat then append the message into container
socket.on('left', name =>{
    append(`${name} left the chat`,'right');
})
//If the form get submitted,send server the message
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInp.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInp.value='';
})