package models

//import "go.mongodb.org/mongo-driver/bson/primitive"

type ToDoList struct{
  //ID     primitive.ObjectID `json:"_ids omitempty" bson:"_ids, omitempty"`
  Task   string `json:"task, omitempty"`
  Status int `'json:"status, omitempty"`
  Type   string `'json:"type, omitempty"`
}
