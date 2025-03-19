package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

type Message struct {
	Receivers   []string `json:"receivers"`
	Serial      string   `json:"serial"`
	Type        int      `json:"type"`
	Message     string   `json:"message"`
	TypePrinter int      `json:"typePrinter"`
}

const processedLog = "processed.log"

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error cargando .env")
	}

	logPath := os.Getenv("LOG_PATH")
	if logPath == "" {
		log.Fatal("LOG_PATH no definido en .env")
	}

	selectedPrinter := os.Getenv("SELECTED_PRINTER")
	if selectedPrinter == "" {
		selectedPrinter = selectPrinter()
		saveSelectedPrinter(selectedPrinter)
	}

	processedMessages := loadProcessedMessages()

	file, err := os.Open(logPath)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	for {
		scanner := bufio.NewScanner(file)
		for scanner.Scan() {
			line := scanner.Text()
			if strings.Contains(line, "Llego mensaje") {
				// Extraer la hora del log
				timeStamp := extractTimestamp(line)
				if timeStamp == "" {
					continue
				}

				// Extraer el mensaje JSON
				start := strings.Index(line, "{")
				end := strings.LastIndex(line, "}")
				if start == -1 || end == -1 {
					continue
				}
				jsonData := line[start : end+1]

				var msg Message
				err := json.Unmarshal([]byte(jsonData), &msg)
				if err != nil {
					log.Println("Error parseando JSON:", err)
					continue
				}

				// Verificar si el mensaje ya fue procesado usando la hora del log
				if _, exists := processedMessages[timeStamp]; exists {
					fmt.Println("Mensaje ya procesado, omitiendo...")
					continue
				}

				// Transformar el mensaje a ZPL
				zplCode := transformToZPL(msg.Message)
				printZPL(selectedPrinter, zplCode)

				// Marcar como procesado usando la hora del log
				markMessageAsProcessed(timeStamp)
			}
		}

		if err := scanner.Err(); err != nil {
			log.Fatal(err)
		}
		fmt.Println("Esperando 1 minuto para la siguiente revisión...")

		time.Sleep(60 * time.Second)
	}
}

// Función para extraer la hora del log
func extractTimestamp(line string) string {
	start := strings.Index(line, "[INFO  ")
	if start == -1 {
		return ""
	}
	end := strings.Index(line[start:], "]")
	if end == -1 {
		return ""
	}
	return strings.TrimSpace(line[start+7 : start+end])
}

// Función para listar impresoras y permitir al usuario elegir una
func selectPrinter() string {
	fmt.Println("Listando impresoras disponibles...")
	cmd := exec.Command("wmic", "printer", "get", "name")
	var out bytes.Buffer
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		log.Fatal("Error al listar impresoras:", err)
	}

	printers := strings.Split(out.String(), "\n")
	for i, printer := range printers {
		if strings.TrimSpace(printer) != "" && !strings.Contains(printer, "Name") {
			fmt.Printf("%d: %s\n", i, strings.TrimSpace(printer))
		}
	}

	fmt.Print("Seleccione el número de la impresora ZPL: ")
	var choice int
	fmt.Scan(&choice)

	return strings.TrimSpace(printers[choice])
}

// Función para guardar la impresora seleccionada en el archivo .env
func saveSelectedPrinter(printer string) {
	env, err := godotenv.Read()
	if err != nil {
		log.Fatal("Error leyendo .env:", err)
	}

	env["SELECTED_PRINTER"] = printer
	err = godotenv.Write(env, ".env")
	if err != nil {
		log.Fatal("Error guardando la impresora en .env:", err)
	}

	fmt.Println("Impresora guardada en .env.")
}

// Transformar EPL a ZPL

func transformToZPL(message string) string {
	lines := strings.Split(strings.ReplaceAll(message, "\r\n", "\n"), "\n")
	var zplBuilder strings.Builder

	// Obtener los valores de escalamiento desde variables de entorno
	scaleX, err := strconv.ParseFloat(os.Getenv("SCALE_X"), 64)
	if err != nil {
		log.Println("Error obteniendo SCALE_X, usando valor por defecto 0.1")
		scaleX = 0.1
	}

	scaleY, err := strconv.ParseFloat(os.Getenv("SCALE_Y"), 64)
	if err != nil {
		log.Println("Error obteniendo SCALE_Y, usando valor por defecto 0.1")
		scaleY = 0.1
	}

	scaleHeight, err := strconv.Atoi(os.Getenv("SCALE_HEIGHT"))
	if err != nil {
		log.Println("Error obteniendo SCALE_HEIGHT, usando valor por defecto 11")
		scaleHeight = 11
	}

	WidthBar, err := strconv.Atoi(os.Getenv("SCALE_WIDTH_BAR"))
	if err != nil {
		log.Println("Error obteniendo SCALE_WIDTH, usando valor por defecto 2")
		WidthBar = 1
	}

	widtText, err := strconv.Atoi(os.Getenv("SCALE_WIDTH_TEXT"))
	if err != nil {
		log.Println("Error obteniendo SCALE_WIDTH, usando valor por defecto 2")
		widtText = 1
	}
	// Iniciar el comando ZPL
	zplBuilder.WriteString("^XA\n")

	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}

		parts := strings.Split(line, ",")
		if len(parts) < 2 {
			continue
		}

		if strings.HasPrefix(line, "A") && len(parts) >= 8 { // Texto
			xStr, yStr := parts[0][1:], parts[1]

			// Convertir x e y a float64
			xVal, err := strconv.ParseFloat(xStr, 64)
			if err != nil {
				log.Println("Error convirtiendo x a float:", err)
				continue
			}
			yVal, err := strconv.ParseFloat(yStr, 64)
			if err != nil {
				log.Println("Error convirtiendo y a float:", err)
				continue
			}

			// Aplicar escala desde las variables de entorno
			xVal *= scaleX
			yVal *= scaleY

			// Convertir de vuelta a string
			x := fmt.Sprintf("%.0f", xVal) // Redondeamos al entero más cercano
			y := fmt.Sprintf("%.0f", yVal)

			font := "0" // Fuente predeterminada en ZPL

			widthMultiplier, err := strconv.Atoi(parts[4])
			if err != nil {
				log.Println("Error convirtiendo altura a entero:", err)
				continue
			}
			widthMultiplier *= widtText

			heightMultiplier, err := strconv.Atoi(parts[5])
			if err != nil {
				log.Println("Error convirtiendo altura a entero:", err)
				continue
			}
			heightMultiplier *= scaleHeight

			heightMultiplierStr := strconv.Itoa(heightMultiplier)
			widthMultiplierStr := strconv.Itoa(widthMultiplier)

			text := strings.Trim(parts[7], "\"") // Eliminar comillas si existen

			// Convertir a ZPL con ajustes de escala
			zplBuilder.WriteString(fmt.Sprintf("^FO%s,%s\n^A%s,%s,%s\n^FD%s^FS\n", x, y, font, heightMultiplierStr, widthMultiplierStr, text))
		} else if strings.HasPrefix(line, "B") && len(parts) >= 9 { // Código de barras
			xStr, yStr := parts[0][1:], parts[1]

			// Convertir x e y a float64
			xVal, err := strconv.ParseFloat(xStr, 64)
			if err != nil {
				log.Println("Error convirtiendo x a float:", err)
				continue
			}
			yVal, err := strconv.ParseFloat(yStr, 64)
			if err != nil {
				log.Println("Error convirtiendo y a float:", err)
				continue
			}

			// Aplicar escala desde las variables de entorno
			xVal *= scaleX
			yVal *= scaleY

			// Convertir de vuelta a string
			x := fmt.Sprintf("%.0f", xVal) // Redondeamos al entero más cercano
			y := fmt.Sprintf("%.0f", yVal)

			height, err := strconv.Atoi(parts[5])
			if err != nil {
				log.Println("Error convirtiendo altura a entero:", err)
				continue
			}
			height *= scaleHeight
			width, err := strconv.Atoi(parts[4])
			if err != nil {
				log.Println("Error convirtiendo altura a entero:", err)
				continue
			}
			width *= WidthBar

			// humanReadable es la penúltima parte del mensaje
			// humanReadable es la penúltima parte del mensaje
			humanReadable := parts[len(parts)-2]
			data := strings.Trim(parts[8], "\"") // Remover comillas

			heightstr := strconv.Itoa(height) // Convertir height a string
			widthstr := strconv.Itoa(width)   // Convertir width a string
			// Incluir ^BY para ajustar el ancho del código de barras
			zplBuilder.WriteString(fmt.Sprintf("^FO%s,%s\n^BY%s\n^BCN,%s,%s,N,N\n^FD%s^FS\n", x, y, widthstr, heightstr, humanReadable, data))
		}
	}

	// Finalizar el comando ZPL
	zplBuilder.WriteString("^XZ\n")
	return zplBuilder.String()
}

// Enviar código ZPL a la impresora
// Enviar código ZPL a la impresora
func printZPL(printer string, zplCode string) {
	fmt.Println("Enviando a imprimir en:", printer)
	fmt.Println("Código ZPL:", zplCode)

	// Crear un archivo temporal con el código ZPL
	tmpFile, err := ioutil.TempFile("", "zpl_*.zpl")
	if err != nil {
		log.Fatal("Error creando archivo temporal:", err)
	}
	defer os.Remove(tmpFile.Name())

	// Escribir el código ZPL en el archivo temporal
	_, err = tmpFile.WriteString(zplCode)
	fmt.Println("Archivo temporal:", zplCode)
	if err != nil {
		log.Fatal("Error escribiendo en archivo temporal:", err)
	}
	tmpFile.Close()

	// Obtener el nombre del equipo (hostname)
	hostname, err := os.Hostname()
	if err != nil {
		log.Fatal("Error obteniendo el nombre del equipo:", err)
	}

	// Construir la ruta UNC de la impresora
	uncPath := `\\` + hostname + `\` + printer
	fmt.Println("Ruta UNC de la impresora:", uncPath)

	//Construir el comando COPY
	cmd := exec.Command("cmd", "/C", "COPY", "/B", tmpFile.Name(), uncPath)
	fmt.Println("Comando ejecutado:", cmd.String())

	// Capturar la salida estándar y de error del comando
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	// Ejecutar el comando
	err = cmd.Run()
	if err != nil {
		fmt.Println("Error ejecutando el comando:", err)
		fmt.Println("Salida de error:", stderr.String())
		log.Fatal("Error enviando a imprimir:", err)
	}

	//Mostrar la salida del comando
	fmt.Println("Salida del comando:", stdout.String())
	fmt.Println("Impresión enviada correctamente.")
}

// Cargar mensajes procesados desde processed.log
func loadProcessedMessages() map[string]bool {
	messages := make(map[string]bool)

	file, err := os.Open(processedLog)
	if err != nil {
		if os.IsNotExist(err) {
			return messages
		}
		log.Fatal("Error abriendo processed.log:", err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		messages[scanner.Text()] = true
	}

	if err := scanner.Err(); err != nil {
		log.Fatal("Error leyendo processed.log:", err)
	}

	return messages
}

// Marcar un mensaje como procesado usando la hora del log
func markMessageAsProcessed(timestamp string) {
	file, err := os.OpenFile(processedLog, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatal("Error abriendo processed.log:", err)
	}
	defer file.Close()

	_, err = file.WriteString(timestamp + "\n")
	if err != nil {
		log.Fatal("Error escribiendo en processed.log:", err)
	}
}
