package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	socketio "github.com/googollee/go-socket.io"
)

type allMsg []string

var msgList = allMsg{}

func GinMiddleware(allowOrigin string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", allowOrigin)
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type, Content-Length, X-CSRF-Token, Token, session, Origin, Host, Connection, Accept-Encoding, Accept-Language, X-Requested-With")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Request.Header.Del("Origin")

		c.Next()
	}
}

func main() {
	server := socketio.NewServer(nil)

	//sockets
	server.OnConnect("/", func(so socketio.Conn) error {
		so.SetContext("")
		so.Join("chat_room")
		fmt.Println("nuevo usuario conectado")
		so.Emit("chat message", msgList)
		return nil
	})

	server.OnEvent("/", "chat message", func(so socketio.Conn, msg string) {
		fmt.Println("msg: ", msg)
		msgList = append(msgList, msg)
		so.Emit("chat message", msgList)
		server.BroadcastToRoom("chat_room", "chat message", msg)
	})

	go server.Serve()
	defer server.Close()

	router := gin.Default()
	router.Use(GinMiddleware("http://localhost:3000"))
	router.GET("/socket.io/", gin.WrapH(server))
	fmt.Println("Server on port", 4000)
	_ = router.Run(":4000")
}
