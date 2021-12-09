package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// cpuModule := "/proc/cpu_201801351"
// memoModule := "/proc/memo_201801351"

var upGrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type dataJson struct {
	Data string `json:"data"`
}

// =============================================================================
// MAIN
// =============================================================================
func main() {
	router := gin.Default()
	fmt.Println("Server on port", 5000)
	router.Use(GinMiddleware("http://localhost:3000"))
	router.GET("/ws/ram", wsRAM)
	router.GET("/ws/cpu", wsCPU)
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
func getHandler(c *gin.Context) {
	// /proc/ejemplo
	dataTxt := readFile("/proc/cpu_201801351")

	dataReplace := replaceSTR(dataTxt)

	fmt.Println(dataReplace)
	c.JSON(200, gin.H{
		"value": dataReplace,
	})
}

// =============================================================================
// HELPERS
// =============================================================================
/* -------------- -> READFILE <- -------------- */
func readFile(path string) string {
	txtFile, err := ioutil.ReadFile(path)

	if err != nil {
		log.Fatalf("Unable to read file: %v", err)
		return ""
	}

	return string(txtFile)
}

/* -------------- -> REPLACE <- -------------- */
func replaceSTR(dataStr string) string {
	/*
		Replace: ]},] -> ]}]
		Replace: ,] -> ]
	*/
	str := strings.ReplaceAll(dataStr, "\n", "")
	str1 := strings.Replace(str, "]},]", "]}]", -1)
	strReturn := strings.Replace(str1, ",]", "]", -1)
	return strReturn
}

// =============================================================================
// SOCKET
// =============================================================================

func wsRAM(c *gin.Context) {
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
		var newData dataJson
		newData.Data = readFile("/proc/memo_201801351")

		err = ws.WriteJSON(newData)
		if err != nil {
			log.Println(err)
		}
		time.Sleep(1 * time.Second)
	}

}

func wsCPU(c *gin.Context) {
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
		var newData dataJson
		newData.Data = replaceSTR(readFile("/proc/cpu_201801351"))
		err = ws.WriteJSON(newData)
		if err != nil {
			log.Println(err)
		}
		time.Sleep(2 * time.Second)
	}

}

// sudo kill $(sudo lsof -t -i:5000)
// sudo netstat -lnp -> ver los puetos
