const TextInput = document.getElementById("text-input")
const sendButton = document.getElementById("send-button")
const ButtonCont = document.getElementById("button-container")
const MessageDisplay = document.getElementById("messages-display")
const ws = new WebSocket(`ws://localhost:4000`)
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const days = ["Mon", "The", "Wed", "Thu", "Fri", "Sat", "Sun"]
let userCount = 0


function getCurrentDate(){
	let date = new Date()
	let h = date.getHours(), d = date.getDate(), y = date.getFullYear() 
	return `${days[(d%days.length)-(y%4==0 ? 2 : 1)]} ${months[date.getMonth()]} ${d} ${y}, ${h}:${date.getMinutes()} ${h>12?"PM":"AM"}`
}

function displayUser(user){return "User " + user + " 👤"}

function displayMessage(data, className, color){
	let messageCont = document.createElement("div")
	messageCont.classList.add(className)
	messageCont.innerHTML = `
	<div style="background-color: ${color};"><p>${data.message}</p></div>
	<div style="color:rgb(12,12,45); width:1000px; font-size:10px;"><p>${displayUser(data.user)}</p></div>
	<div style="color:rgb(12,12,45); width:1000px; font-size:10px;"><p>${getCurrentDate()}</p></div>`
	MessageDisplay.appendChild(messageCont)
}

function displayChatRoomMessages(messages){
	for(const m of messages) displayMessage(m, "u2-message-cont","rgb(151, 189, 246)")
}

TextInput.addEventListener("input",()=>{
	TextInput.style.height = "auto" 
	if(TextInput.value!=""){
		TextInput.style.height = `${TextInput.scrollHeight}px`
		ButtonCont.style.height = `${TextInput.scrollHeight}px`
	} else{
		TextInput.style.height = "0px"
		ButtonCont.style.height = `0px`
	}
})

sendButton.addEventListener("click",()=>{
	if(TextInput.value!=""){
		let data = {message:TextInput.value, user:userCount}
		displayMessage(data,"u1-message-cont","rgb(56, 136, 255)")
		ws.send(JSON.stringify(data))
		TextInput.value = ""
		TextInput.style.height = "0px"
		ButtonCont.style.height = `0px`
	}
})


ws.addEventListener("message", (msg)=>{
	let data = JSON.parse(msg.data)
	if(data.message==undefined){
		userCount = data.userCount  
		displayChatRoomMessages(data.messages)
		let title = document.head.getElementsByTagName("title")
     title[0].innerText = displayUser(data.userCount)
	} else  displayMessage(data,"u2-message-cont","rgb(151, 189, 246)")
	
})