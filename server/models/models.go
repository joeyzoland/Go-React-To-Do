package models

//import "go.mongodb.org/mongo-driver/bson/primitive"

//create a different struct for timed vs. goal
type ToDoList struct{
  //ID     primitive.ObjectID `json:"_ids omitempty" bson:"_ids, omitempty"`
  Task   string `json:"task, omitempty"`
  Status string `'json:"status, omitempty"`
  Type   string `'json:"type, omitempty"`
}

// type TimedTask struct{
//   Task   string `json:"task, omitempty"`
//   CurrentDuration string `json:"currentduration, omitempty"`
//   TargetDuration string `json:"targetduration, omitempty"`
// }
