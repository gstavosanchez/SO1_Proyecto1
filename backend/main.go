package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"net/http"
	"os/exec"
	"strconv"
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

type DataJsonRam struct {
	Data MemoryRAM `json:"data"`
}

type MemoryRAM struct {
	Ram        float64 `json:"ram"`
	Uso        float64 `json:"uso"`
	Porcentaje float64 `json:"porcentaje"`
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
	// dataTxt := readFile("/proc/cpu_201801351")

	// dataReplace := replaceSTR(dataTxt)

	// fmt.Println(dataReplace)
	// c.JSON(200, gin.H{
	// 	"value": dataReplace,
	// })

	// datatxt := getMemoryCache()

	c.JSON(200, gin.H{
		"value": "hola mundo",
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
	return searchUserInStr(strReturn)
}

/* -------------- -> PARSE INT <- -------------- */
func parseInt(data string) int {
	intVar, err := strconv.Atoi(data)
	if err != nil {
		return 0
	}

	return intVar
}

/* -------------- -> REDONDEAR <- -------------- */
func roundTo(n float64, decimals uint32) float64 {
	return math.Round(n*math.Pow(10, float64(decimals))) / math.Pow(10, float64(decimals))
}

/* ----------------------------------------- */
/* -------------- -> USER  <- -------------- */
func searchUserInStr(dataStr string) string {
	var newString strings.Builder
	var idUser strings.Builder
	isUser := false

	for _, val := range dataStr {
		if isUser {

			if string(val) == ">" {
				isUser = false
				userName := getNameUser(idUser.String())
				newString.WriteString(userName)
				idUser.Reset()
			} else {
				idUser.WriteString(string(val))
			}

		} else {

			if string(val) == "<" {
				isUser = true
			} else {
				newString.WriteString(string(val))
			}
		}

	}
	return newString.String()
}

func getNameUser(userId string) string {
	cmd := exec.Command("sh", "-c", "getent passwd "+userId+" | cut -d: -f1")
	out, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println("error userId ", userId, " no existe")
		return "\"gustavo\""
	}
	output := string(out[:])
	return "\"" + strings.ReplaceAll(output, "\n", "") + "\""
}

/* -------------- -> MEMORY RAM <- -------------- */
func getMemoryCache() int {
	cmd := exec.Command("sh", "-c", "free -m | awk '{print $6}'| head -2| tail -1")
	out, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println("Invalid commmand")
		return 0
	}
	cache := strings.ReplaceAll(string(out[:]), "\n", "")

	return parseInt(cache)
}

func getRamData() MemoryRAM {
	dataStr := readFile("/proc/memo_201801351")
	var memory MemoryRAM
	cache := getMemoryCache()
	total, uso := splitDataRam(dataStr)

	memory.Ram = float64(total)
	memory.Uso = float64(uso - cache)
	memory.Porcentaje = roundTo(((memory.Uso * 100) / memory.Ram), 2)

	return memory
}

func splitDataRam(data string) (int, int) {
	dataList := strings.Split(data, ",")

	splitRam := strings.Split(dataList[0], ":")
	totalRam := strings.TrimSpace(splitRam[1])

	splitUso := strings.Split(dataList[1], ":")
	usoRam := strings.TrimSpace(splitUso[1])

	return parseInt(totalRam), parseInt(usoRam)
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
		var newData DataJsonRam
		newData.Data = getRamData()

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
// getent passwd 1000 | cut -d: -f1 -> ver username
// free -m | awk '{print $6}'| head -2| tail -1
