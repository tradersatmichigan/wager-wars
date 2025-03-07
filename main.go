package main

import (
	// "bufio"
	"log"
  "fmt"
	"net/http"
	// "os"
	// "strings"
)

/*

Data:
user -> password
user -> player state
user.team -> team state

*/
// struct Player {
//   id uint
//   username string
//
//
// }
//
// func setup_user_data() map[string]string {
//   file, err := os.Open("test_passwords.txt")
//   if err != nil {
//     log.Printf("Unable to open test_passwords.txt")
//     return map[string]string{}
//   }
// 	defer file.Close()
//
// 	scanner := bufio.NewScanner(file)
//   var auth map[string]
//   var players map[string]Player
//
// 	for scanner.Scan() {
// 		line := scanner.Text()
//     data := strings.Split(line, "")
//
// 	}
//
// 	// Check for errors during scanning
// 	if err := scanner.Err(); err != nil {
// 		fmt.Println("Error reading file:", err)
// 	}
//
//
//
//
//   return players
//
// }
//
func serve_home(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Welcome! You have been redirected successfully.")
}

func serve_login(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "static/login.html")
}

func handle_login(w http.ResponseWriter, r *http.Request) {
  if r.Method != http.MethodPost {
    http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
    return
  }

  // Parse form data
  if err := r.ParseForm(); err != nil {
    http.Error(w, "Failed to parse form", http.StatusBadRequest)
    return
  }

  username := r.FormValue("username")
  password := r.FormValue("password")

  log.Printf("Received login - Username: %s, Password: %s", username, password)

  http.Redirect(w, r, "/", http.StatusSeeOther)
}

func main() {
  // setup_user_data()
  http.HandleFunc("/", serve_home)
  http.HandleFunc("/login", serve_login)
  http.HandleFunc("/login_handle", handle_login)
  fmt.Println("Server listening @ port 8080")
  log.Fatal(http.ListenAndServe(":8080", nil))
}
