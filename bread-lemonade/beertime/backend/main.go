package main

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

type BeerApplication struct {
	Name  string `json:"name"`
	Place string `json:"place"`
	Date  string `json:"date"`
}

var storage []BeerApplication

var upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}
var conns []*websocket.Conn
var connmu sync.Mutex

func notifyNewBeer() {
	connmu.Lock()
	defer connmu.Unlock()
	for _, c := range conns {
		c.WriteJSON(storage)
	}
}

const port = "8080"

func beer(w http.ResponseWriter, r *http.Request) {
	log.Println("serving on port " + port)
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err.Error())
		return
	}
	defer c.Close()
	log.Println("connection at ", c.RemoteAddr())

	connmu.Lock()
	conns = append(conns, c)
	connmu.Unlock()
	c.WriteJSON(storage)
	for {
		var nba BeerApplication
		err := c.ReadJSON(&nba)
		if err != nil {
			if websocket.IsCloseError(err) || websocket.IsUnexpectedCloseError(err) {
				log.Println("disconnect at ", c.RemoteAddr())
				break
			}
			log.Println("read:", err.Error())
			continue
		}
		log.Println("new appl from ", c.RemoteAddr(), nba.Name, nba.Place, nba.Date)
		storage = append(storage, nba)
		notifyNewBeer()
	}
}

func main() {
	http.HandleFunc("/beer", beer)
	log.Fatalln(http.ListenAndServe(":"+port, nil))
}
