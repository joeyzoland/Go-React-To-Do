import React, { Component } from "react";
import axios from "axios";
import { Card, Header, Form, Input, Icon, Button } from "semantic-ui-react";

let endpoint = "http://localhost:8080";

class ToDoList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: "",
      items: []
    };
  }

  componentDidMount() {
    this.getTask();
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  submitHandler = (e) => {
    e.preventDefault();
  };

  submitGoalTaskHandler = () => {
    this.submitTask("goal")
  }

  submitTimedTaskHandler = () => {
    this.submitTask("timed")
  }

  //combine this and below into one function!
  //figure out how to put multiple fields into request body and read on backend!
  submitTask = (taskType) => {
    console.log("taskType")
    console.log(taskType)
    let { task } = this.state;
    //console.log("this.state.task is " + this.state.task)
    if (task) {
      // task["type"] = 0;
      // console.log(task);
      axios
        .post(
          endpoint + "/api/task",
          {
            "task": task,
            "status": "incomplete",
            "type": taskType,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {
          this.getTask();
          this.setState({
            task: ""
          });
          //console.log(res)
        })
    }
  };

  getTask = () => {
    axios.get(endpoint + "/api/task").then(res => {
      //console.log(res)
      if (res.data){
        this.setState({
          items: res.data.map( item => {
            let color = "yellow";
            if (item.status === "inProgress") {
              color = "blue";
            }
            else if (item.status === "complete") {
              color = "green";
            }
            let icons;
            if (item.type === "goal"){
              icons =
                <div>
                  <Icon
                    name="check circle"
                    color="green"
                    onClick={() => this.updateTask(item._id)}
                  />
                  <span style={{ paddingRight:10 }}>Done</span>
                  <Icon
                    name="undo"
                    color="yellow"
                    onClick={() => this.undoTask(item._id)}
                  />
                  <span style={{ paddingRight:10 }}>Undo</span>
                </div>
            }
            if (item.type === "timed"){
              let hourglassIcon;
              let hourglassText;
              if (item.status === "incomplete"){
                hourglassIcon =
                  <Icon
                    name="hourglass start"
                    color="blue"
                    onClick={() => this.startTask(item._id)}
                  />
                hourglassText = "Start"
              }
              else{
                hourglassIcon =
                  <Icon
                    name="hourglass end"
                    color="blue"
                    onClick={() => this.stopTask(item._id)}
                  />
                hourglassText = "End"
              }
              icons =
                <div>
                  {hourglassIcon}
                  <span style={{ paddingRight:10 }}>{hourglassText}</span>
                  <Icon
                    name="delete"
                    color="red"
                    onClick={() => this.deleteTask(item._id)}
                  />
                  <span style={{ paddingRight:10 }}>Delete</span>
                </div>
            }

            return (
              <Card key={item._id} color={color} fluid>
                <Card.Content>
                  <Card.Header textAlign="left">
                    <div style={{ wordWrap: "break-word" }}>{item.task}</div>
                  </Card.Header>

                  <Card.Meta textAlign="right">
                    {icons}
                  </Card.Meta>
                </Card.Content>
              </Card>
            );
          })
        });
      } else {
        this.setState({
          items: []
        });
      }
    });
  };

  updateTask = id => {
    axios
      .put(endpoint + "/api/task/" + id, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => {
        //console.log(res);
        this.getTask();
      });
  };

  undoTask = id => {
    axios
      .put(endpoint + "/api/undoTask/" + id, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => {
        //console.log(res);
        this.getTask();
      });
  };

  //Note: This will eventually catch timestamp
  startTask = id => {
    console.log("hello")
    axios
    .put(endpoint + "/api/startTask/" + id, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    .then(res => {
      this.getTask();
    })
  }

  stopTask = id => {
    axios
    .put(endpoint + "/api/stopTask/" + id, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    .then(res => {
      this.getTask();
    })
  }

  deleteTask = id => {
    axios
      .delete(endpoint + "/api/deleteTask/" + id, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => {
        // console.log(res);
        this.getTask();
      });
  }

  deleteAllTask = () => {
    axios
      .delete(endpoint + "/api/deleteAllTask", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => {
        this.getTask();
      })
  }

  //Probably remove && statement below and copy icon conditional logic
  render() {
    return (
      <div>
        <div className="row">
          <Header className="header" as="h2">
            TO DO List
          </Header>
        </div>
        <div className="row">
          <Form onSubmit={this.submitHandler}>
            <Input
              type="text"
              name="task"
              onChange={this.onChange}
              value={this.state.task}
              fluid
              placeholder="Create Task"
            />
          </Form>
          <Button onClick = {this.submitGoalTaskHandler}>Goal Task</Button>
          <Button onClick = {this.submitTimedTaskHandler}>Timed Task</Button>
        </div>
        <div className="row">
          <Card.Group>{this.state.items}</Card.Group>
        </div>
        {(this.state.items).length > 0 &&
          <div>
            <br></br>
            <Button onClick = {this.deleteAllTask}> DELETE ALL </Button>
          </div>
        }
      </div>
    );
  }
}

export default ToDoList;
