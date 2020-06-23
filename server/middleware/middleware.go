package middleware

import (
  "context"
  "encoding/json"
  "fmt"
  "log"
  "net/http"

  "../models"
  "github.com/gorilla/mux"

  "go.mongodb.org/mongo-driver/bson"
  "go.mongodb.org/mongo-driver/bson/primitive"
  "go.mongodb.org/mongo-driver/mongo"
  "go.mongodb.org/mongo-driver/mongo/options"
)

//localhost mongodb
const connectionString = "mongodb://localhost:27017"
//otherwise
//const connectionString = "Connection String"

//database Name
const dbName = "test"

//collection Name
const collName = "todolist"

//collection object/instance
var collection *mongo.Collection

//create connection with mongodb
func init() {
  //set client options
  clientOptions := options.Client().ApplyURI(connectionString)

  //connect to mongo db
  client, err := mongo.Connect(context.TODO(), clientOptions)

  if err != nil {
    log.Fatal(err)
  }

  //check the connection
  err = client.Ping(context.TODO(), nil)

  if err!= nil{
    log.Fatal(err)
  }

  fmt.Println("Connected to MongoDB, hooray!")

  collection = client.Database(dbName).Collection(collName)

  fmt.Println("Collection instance created, hooray!")
}

//GetAllTasks route
func GetAllTask(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
  w.Header().Set("Access-Control-Allow-Origin", "*")
  payload := getAllTask()
  json.NewEncoder(w).Encode(payload)
}

//CreateTask route
func CreateTask(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
  w.Header().Set("Access-Control-Allow-Origin", "*")
  w.Header().Set("Access-Control-Allow-Methods", "POST")
  w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
  var task models.ToDoList
  _ = json.NewDecoder(r.Body).Decode(&task)
  //fmt.Println(task, r.Body)
  insertOneTask(task)
  json.NewEncoder(w).Encode(task)
}

func TaskComplete(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
  w.Header().Set("Access-Control-Allow-Origin", "*")
  w.Header().Set("Access-Control-Allow-Methods", "PUT")
  w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

  params := mux.Vars(r)
  taskComplete(params["id"])
  json.NewEncoder(w).Encode(params["id"])
}
