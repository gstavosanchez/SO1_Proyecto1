package main

import (
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"net/http"
	"os"
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

type DataJsonCPU struct {
	Data DataCPU `json:"data"`
}

type MemoryRAM struct {
	Ram        float64 `json:"ram"`
	Uso        float64 `json:"uso"`
	Porcentaje float64 `json:"porcentaje"`
}
type DataCPU struct {
	Uso string `json:"uso"`
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
	router.GET("/ws/uso/cpu", wsUsoCPU)
	router.GET("/hola", getHandler)
	router.GET("/kill/:id", handlerKill)
	// router.Static("/public", "./public")

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
	c.JSON(200, gin.H{
		"value": "hola mundo",
	})

}
func handlerKill(c *gin.Context) {
	id := c.Param("id")
	fmt.Println("id: ", id)

	res := killProcess(id)
	if !res {
		c.JSON(422, gin.H{
			"msg": "Not Kill process id:" + id,
		})
		return
	}
	c.JSON(200, gin.H{
		"data": "Kill process id:" + id,
	})
}

// =============================================================================
// HELPERS
// =============================================================================
/* -------------- -> READFILE <- -------------- */
func readFile(path string) string {
	if _, err := os.Stat(path); errors.Is(err, os.ErrNotExist) {
		fmt.Println("Not exist ", path)
		return ""
	}
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

/* -------------- -> PARSE FLOAT <- -------------- */
func parseFloat(data string) float64 {
	val, err := strconv.ParseFloat(data, 64)
	if err != nil {
		return 0.0
	}

	return val
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
	var ram strings.Builder

	isUser := false
	isRam := false

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

		} else if isRam {

			if string(val) == "$" {
				isRam = false
				ramValue := getPorcentajeRam(ram.String())
				newString.WriteString(ramValue)
				ram.Reset()
			} else {
				ram.WriteString(string(val))
			}

		} else {

			if string(val) == "<" {
				isUser = true
			} else if string(val) == "@" {
				isRam = true
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

func getPorcentajeRam(data string) string {
	// // 11893 -> ram
	bytesRam := parseFloat(data)
	var ram float64 = 11893

	if bytesRam == 0 {
		return "0"
	}

	porcentaje := roundTo(((bytesRam / 10000) / ram), 2)

	return fmt.Sprint(porcentaje)
}

/* -------------- -> CPU <- -------------- */
func getPorcentCPU() string {
	cmd := exec.Command("sh", "-c", "ps -eo pcpu | sort -k 1 -r | head -50")
	out, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println("Invalid commmand")
		return ""
	}

	cpu := strings.ReplaceAll(string(out[:]), "%CPU\n", "")
	cpu = strings.ReplaceAll(cpu, "\n", ",")
	return cpu
}

func getDataCPU() DataCPU {
	dataCpu := getPorcentCPU()
	total := 0.0
	for _, value := range strings.Split(dataCpu, ",") {
		dataFloat := parseFloat(strings.TrimSpace(value))
		total += dataFloat
	}
	return DataCPU{Uso: fmt.Sprint(roundTo(total/4, 2))}
}
func killProcess(id string) bool {
	cmd := exec.Command("sh", "-c", "kill -9 "+id)
	_, err := cmd.CombinedOutput()
	if err != nil {
		log.Fatal("Invalid Commmand")
		return false
	}
	return true
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

func wsUsoCPU(c *gin.Context) {
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
		var newData DataJsonCPU
		newData.Data = getDataCPU()
		err = ws.WriteJSON(newData)
		if err != nil {
			log.Println(err)
		}
		time.Sleep(1 * time.Second)
	}
}

// sudo kill $(sudo lsof -t -i:5000)
// sudo netstat -lnp -> ver los puetos
// getent passwd 1000 | cut -d: -f1 -> ver username
// free -m | awk '{print $6}'| head -2| tail -1

/*
Hacer un EDT sobre
la fiesta de aniversario de la universidad

Proveedores
gestion de invitados
definir localidad
comida
enviar invitaciones
Cotizaciones
los eventos relacionados con el aniversario
Recursos
Presupuesto
Interesados
*/
