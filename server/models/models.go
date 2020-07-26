package models

//import "go.mongodb.org/mongo-driver/bson/primitive"

//create a different struct for timed vs. goal
type ToDoList struct{
  //ID     primitive.ObjectID `json:"_ids omitempty" bson:"_ids, omitempty"`
  Task   string `json:"task, omitempty"`
  Status string `'json:"status, omitempty"`
  Type   string `'json:"type, omitempty"`
  Progress  int `'json:"progress, omitempty"`
  Target    int `'json:"target, omitempty"`
  Start     int `'json:"start, omitempty"`
}
