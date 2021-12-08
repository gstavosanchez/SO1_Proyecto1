package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upGrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// =============================================================================
// MAIN
// =============================================================================
func main() {
	router := gin.Default()
	fmt.Println("Server on port", 5000)
	router.Use(GinMiddleware("http://localhost:3000"))
	router.GET("/ws", wsEndpoint)
	router.GET("/hola", getHandler)
	// router.Static("/public", "./public")
	// router.GET("/socket.io/", gin.WrapH(server))

	_ = router.Run(":5000")
}

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

// =============================================================================
// READFILE
// =============================================================================
func readFile(path string) string {
	txtFile, err := ioutil.ReadFile(path)

	if err != nil {
		log.Fatalf("Unable to read file: %v", err)
		return ""
	}

	return string(txtFile)
}

func getHandler(c *gin.Context) {
	// /proc/ejemplo
	dataTxt := readFile("/proc/cpu_201801351")

	c.JSON(200, gin.H{
		"msg": dataTxt,
	})
}

// =============================================================================
// SOCKET
// =============================================================================

func wsEndpoint(c *gin.Context) {
	ws, err := upGrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println(err)
	}
	defer ws.Close()
	log.Println("Cliente conectado exitosamente")
	var dataSala struct {
		Sala string `json:"Sala"`
	}

	err = ws.ReadJSON(&dataSala)
	if err != nil {
		log.Println(err)
	}

	for {

		err = ws.WriteJSON(struct {
			Msg string `json:"Msg"`
		}{Msg: "hola mundo"})
		if err != nil {
			log.Println(err)
		}
		time.Sleep(1 * time.Second)
	}

}
