package router

import (
  "../middleware"
  "github.com/gorilla/mux"
)

func Router() *mux.Router {
  router := mux.NewRouter()

  router.HandleFunc("/api/task", middleware.GetAllTask).Methods("GET", "OPTIONS")
  router.HandleFunc("/api/task", middleware.CreateTask).Methods("POST", "OPTIONS")
  router.HandleFunc("/api/task/{id}/{target}", middleware.TaskComplete).Methods("PUT", "OPTIONS")
  router.HandleFunc("/api/undoTask/{id}", middleware.UndoTask).Methods("PUT", "OPTIONS")
  router.HandleFunc("/api/startTask/{id}", middleware.StartTask).Methods("PUT", "OPTIONS")
  router.HandleFunc("/api/stopTask/{id}", middleware.StopTask).Methods("PUT", "OPTIONS")
  router.HandleFunc("/api/addGoalProgress/{id}/{progress}/{target}", middleware.AddGoalProgress).Methods("PUT", "OPTIONS")
  router.HandleFunc("/api/deleteTask/{id}", middleware.DeleteTask).Methods("DELETE", "OPTIONS")
  router.HandleFunc("/api/deleteAllTask", middleware.DeleteAllTask).Methods("DELETE", "OPTIONS")
  return router
}
