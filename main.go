package main

import (
	"bufio"
	"log"
	"net/http"
	"os"
	"strings"
)

/*

Data:
user -> password
user -> player state
user.team -> team state

*/
struct Player {
  id uint
  username string


}

func setup_user_data() map[string]string {
  file, err := os.Open("test_passwords.txt")
  if err != nil {
    log.Printf("Unable to open test_passwords.txt")
    return map[string]string{}
  }
	defer file.Close()

	scanner := bufio.NewScanner(file)
  var auth map[string]
  var players map[string]Player

	for scanner.Scan() {
		line := scanner.Text()
    data := strings.Split(line, "")

	}

	// Check for errors during scanning
	if err := scanner.Err(); err != nil {
		fmt.Println("Error reading file:", err)
	}




  return players

}

func handle_login(w http.ResponseWriter, r *http.Request) {

}

func main() {
  setup_user_data()
  http.HandleFunc("/login", handle_login)
  log.Fatal(http.ListenAndServe(":8080", nil))
}
