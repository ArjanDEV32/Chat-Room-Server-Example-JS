const fs = require("fs")
const http = require("http")
const ws = require("ws")
const wss =	new ws.Server({port:4000}) 
const Clients = {}
let userCount = 0
const messages = []


  http.createServer(function (req, res) {  
		if(req.url=="/"){ 
			let url = process.cwd() + "/User/" + "User.html"
			let fileStreamer = fs.createReadStream(url, "UTF-8")
			res.writeHead(200, {"Content-Type": "text/html"})
			fileStreamer.pipe(res)
		} else {   
			let url = process.cwd()+ "/User" + req.url
			if(!fs.existsSync(url)){
				res.writeHead(404, {"Content-Type": `text/plain`})
				res.end()
				return
			}
			let fileStreamer = fs.createReadStream(url, "UTF-8")
			res.writeHead(200, {"Content-Type": `text/${url.split(".")[1]}`})
			fileStreamer.pipe(res)
		}
  }).listen(8080,()=>{console.log("user: http://localhost:8080/")})

	wss.on("connection",(con, req)=>{
		userCount+=1
		con.send(`{"userCount": "${userCount}", "messages": [${messages}]}`)
    if(Clients[req.headers["sec-websocket-key"]]==undefined) Clients[req.headers["sec-websocket-key"]] = con
		con.on("message",(msg)=>{
			messages.push(msg.toString())
      for(const client in Clients) if(client!=req.headers["sec-websocket-key"]) Clients[client].send(msg.toString())
		})    
	})

