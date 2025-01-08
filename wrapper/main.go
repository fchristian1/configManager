package main

import (
	"log"
	"net/url"
	"os"
	"time"

	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
)

const (
	serverURL         = "ws://localhost:3001" // URL des WebSocket-Servers
	reconnectInterval = 1 * time.Second       // Intervall für Wiederverbindungsversuche
)

var secondsWithoutConnections int = 0

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Fehler beim Laden der .env-Datei")
	}
	connection_data := os.Getenv("CONNECTION_DATA")

	for {
		// Versuche, eine Verbindung zum Server herzustellen
		err := connectAndListen()
		if err != nil {
			log.Printf("Verbindung fehlgeschlagen: %v", err)
		}

		// Warte vor dem nächsten Verbindungsversuch
		time.Sleep(reconnectInterval)
		secondsWithoutConnections++
	}
}

func connectAndListen() error {
	u, err := url.Parse(serverURL)
	if err != nil {
		return err
	}

	// Aufbau der WebSocket-Verbindung
	c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		return err
	}
	defer c.Close()

	log.Println("Verbunden mit dem Server")

	// Kanal, um das Ende der Verbindung zu signalisieren
	done := make(chan struct{})

	// Goroutine für den Empfang von Nachrichten
	go func() {
		defer close(done)
		for {
			_, message, err := c.ReadMessage()
			if err != nil {
				log.Printf("Lesefehler oder Verbindung beendet: %v", err)
				return
			}
			log.Printf("Empfangene Nachricht: %s", message)
		}
	}()
	if secondsWithoutConnections > 0 {
		log.Printf("Sekunden ohne Verbindung: %d", secondsWithoutConnections)
		secondsWithoutConnections = 0
	}
	<-done
	return nil
}
