package middleware

//NOTE: Consider using mongoose instead of plain mongo

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
// const connectionString = "mongodb://localhost:27017"
//otherwise
//NOTE: Password is being displayed here because this is a test application, but this would be handled more securely in an actual application
const connectionString = "mongodb+srv://admin:v6KxjskKNPGnBvO4@cluster0-akkyk.mongodb.net/test?retryWrites=true&w=majority"

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
  insertOneTask(task)
  json.NewEncoder(w).Encode(task)
}

//TaskComplete route
func TaskComplete(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
  w.Header().Set("Access-Control-Allow-Origin", "*")
  w.Header().Set("Access-Control-Allow-Methods", "PUT")
  w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

  params := mux.Vars(r)
  taskComplete(params["id"])
  json.NewEncoder(w).Encode(params["id"])
}

//UndoTask route
func UndoTask(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
  w.Header().Set("Access-Control-Allow-Origin", "*")
  w.Header().Set("Access-Control-Allow-Methods", "PUT")
  w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

  params := mux.Vars(r)
  undoTask(params["id"])
  json.NewEncoder(w).Encode(params["id"])
}

//StartTask route
func StartTask(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
  w.Header().Set("Access-Control-Allow-Origin", "*")
  w.Header().Set("Access-Control-Allow-Methods", "PUT")
  w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

  params := mux.Vars(r)
  startTask(params["id"])
  json.NewEncoder(w).Encode(params["id"])
}

//StopTask route
func StopTask(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
  w.Header().Set("Access-Control-Allow-Origin", "*")
  w.Header().Set("Access-Control-Allow-Methods", "PUT")
  w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

  params := mux.Vars(r)
  stopTask(params["id"])
  json.NewEncoder(w).Encode(params["id"])
}

//DeleteTask route
func DeleteTask(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
  w.Header().Set("Access-Control-Allow-Origin", "*")
  w.Header().Set("Access-Control-Allow-Methods", "DELETE")
  w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
  params := mux.Vars(r)
  deleteOneTask(params["id"])
  json.NewEncoder(w).Encode(params["id"])
  //json.NewEncoder(w).Encode("Task not found")
}

//DeleteAllTask route
func DeleteAllTask(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
  w.Header().Set("Access-Control-Allow-Origin", "*")
  w.Header().Set("Access-Control-Allow-Methods", "DELETE")
  w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
  count := deleteAllTask()
  json.NewEncoder(w).Encode(count)
  // json.NewEncoder(w).Encode("Task not found")
}

//Get all tasks from the database and return it
func getAllTask() []primitive.M {
  fmt.Println("getting all tasks")
  cur, err := collection.Find(context.Background(), bson.D{{}})
  if err != nil {
    log.Fatal(err)
  }

  var results []primitive.M
  for cur.Next(context.Background()) {
    var result bson.M
    e := cur.Decode(&result)
    if e != nil {
      log.Fatal(e)
    }
    // fmt.Println("cur..>", cur, "result", reflect.TypeOf(result), reflect.TypeOf(result["id"]))
    results = append(results, result)
  }

  if err := cur.Err(); err != nil {
    log.Fatal(err)
  }

  cur.Close(context.Background())
  return results
}

//Insert one task into database
func insertOneTask(task models.ToDoList) {
  insertResult, err := collection.InsertOne(context.Background(), task)

  if err != nil {
    log.Fatal(err)
  }

  fmt.Println("Inserted a Single Record ", insertResult.InsertedID)
}

//Update task's status to 2, or done
func taskComplete(task string) {
  id, _ := primitive.ObjectIDFromHex(task)
  filter := bson.M{"_id": id}
  update := bson.M{"$set": bson.M{"status": "complete"}}
  result, err := collection.UpdateOne(context.Background(), filter, update)
  if err != nil {
    log.Fatal(err)
  }
  fmt.Println("modified count: ", result.ModifiedCount)

}

//Updates task's status to 0, or incomplete
func undoTask(task string) {
  id, _ := primitive.ObjectIDFromHex(task)
  filter := bson.M{"_id": id}
  update := bson.M{"$set": bson.M{"status": "incomplete"}}
  result, err := collection.UpdateOne(context.Background(), filter, update)
  if err != nil {
    log.Fatal(err)
  }
  fmt.Println("modified count: ", result.ModifiedCount)
}

func startTask(task string) {
  id, _ := primitive.ObjectIDFromHex(task)
  filter := bson.M{"_id": id}
  update := bson.M{"$set": bson.M{"status": "complete"}}
  result, err := collection.UpdateOne(context.Background(), filter, update)
  if err != nil {
    log.Fatal(err)
  }
  fmt.Println("modified count: ", result.ModifiedCount)
}

func stopTask(task string) {
  id, _ := primitive.ObjectIDFromHex(task)
  filter := bson.M{"_id": id}
  update := bson.M{"$set": bson.M{"status": "incomplete"}}
  result, err := collection.UpdateOne(context.Background(), filter, update)
  if err != nil {
    log.Fatal(err)
  }
  fmt.Println("modified count: ", result.ModifiedCount)
}

//Delete one task from the database
func deleteOneTask(task string) {
  id, _ := primitive.ObjectIDFromHex(task)
  filter := bson.M{"_id": id}
  d, err := collection.DeleteOne(context.Background(), filter)
  if err != nil {
    log.Fatal(err)
  }

  fmt.Println("Deleted Document", d.DeletedCount)
}

//Delete all tasks from the database
func deleteAllTask() int64 {
  d, err := collection.DeleteMany(context.Background(), bson.D{{}}, nil)
  if err != nil {
    log.Fatal(err)
  }
  fmt.Println("Deleted Document", d.DeletedCount)
  return d.DeletedCount
}
