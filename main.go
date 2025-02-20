package main

import (
	"log"
	"net/http"
)

func main() {
	// Create a file server handler for static files
	fs := http.FileServer(http.Dir("static"))

	// Handle all requests by serving static files
	http.Handle("/", fs)

	// Start the server on port 8080
	log.Println("Server starting on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
