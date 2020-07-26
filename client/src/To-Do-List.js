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

  //consider using semantic-ui modal instead of prompting user input
  submitTask = (taskType) => {
    let target;
    let { task } = this.state;
    //console.log("this.state.task is " + this.state.task)
    if (task) {
      if (taskType === "timed"){
        target = prompt("Please insert the target duration, in min:");
        if (target === ""){
          alert("Please insert a duration to create this task.");
          return;
        }
      }
      else if (taskType === "goal"){
        target = prompt("Please insert the target quantity, or leave blank if not applicable:");
      }
      console.log("target")
      console.log(target)
      if (target !== ""){
        target = parseInt(target)
        if (isNaN(target) || target <= 0){
          alert("Please insert an integer of 1 or greater to create this task.");
          return;
        }
        else if(target >= 1000000000000000){
          alert("Please insert an integer less than 1 quadrillion.");
          return;
        }
      }
      axios
        .post(
          endpoint + "/api/task",
          {
            "task": task,
            "status": "incomplete",
            "type": taskType,
            "target": parseInt(target)
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

  //figure out how to parse response with multiple values
  getTask = () => {
    axios.get(endpoint + "/api/task").then(res => {
      if (res.data){
        this.setState({
          items: res.data.map( item => {
            let color = "yellow";
            if (item.status === "complete") {
              color = "green";
            }
            let icons;
            if (item.type === "goal"){
              icons =
                <div style={{backgroundColor: "blue", marginRight: 0}}>
                  <div style= {{backgroundColor: "orange", marginRight: 0}}>
                    <Icon
                      name="check circle"
                      color="green"
                      onClick={() => this.updateTask(item._id, item.target)}
                    />
                    <span style={{ paddingRight:10}}>Done</span>
                  </div>
                  <div style= {{backgroundColor: "pink"}}>
                    <Icon
                      name="calendar plus outline"
                      color="blue"
                      onClick={() => this.addGoalProgress(item._id, item.progress, item.target)}
                    />
                    <span style={{ paddingRight:10}}>Progress</span>
                  </div>
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
                    onClick={() => this.stopTask(item._id, item.start)}
                  />
                hourglassText = "End"
              }
              icons =
                <div style={{ backgroundColor: "green", marginRight: 0}}>
                  {hourglassIcon}
                  <span style={{ paddingRight:10}}>{hourglassText}</span>
                </div>
            }

            //May want to clean up target rendering, and make conditional
            return (
              <Card key={item._id} color={color} fluid>
                <Card.Content>
                  <Card.Header textAlign="left">
                    <div>
                      <div style={{ wordWrap: "break-word", display: "inline-block", width: "40%", backgroundColor: "blue"}}>{item.task}</div>
                      <div style={{display: "inline-block", width:"10%"}}></div>
                      <div style={{display: "inline-block", backgroundColor: "purple" }} >Progress: {item.progress}/{item.target}</div>
                    </div>
                  </Card.Header>
                  <Card.Meta style = {{textAlign:"right"}}>
                    <div style={{backgroundColor:"black"}}>
                      {icons}
                      <div style={{backgroundColor: "red", marginRight: 0}}>
                        <Icon
                          name="undo"
                          color="yellow"
                          onClick={() => this.undoTask(item._id)}
                        />
                        <span style={{ paddingRight:10 }}>Reset</span>
                      </div>
                      <div style={{backgroundColor: "yellow"}}>
                        <Icon
                          name="delete"
                          color="red"
                          onClick={() => this.deleteTask(item._id)}
                        />
                        <span style={{ paddingRight:10 }}>Delete</span>
                      </div>
                     </div>
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

  updateTask = (id, target) => {
    axios
      .put(endpoint + `/api/task/${id}/${target}`, {
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
    const time = new Date().getTime();
    axios
    .put(endpoint + `/api/startTask/${id}/${time}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    .then(res => {
      this.getTask();
    })
  }

  stopTask = (id, start) => {
    const time = new Date().getTime();
    //Divide by 60000 to convert milliseconds/epoch to minutes
    var progress = time - start;
    axios
    .put(endpoint + `/api/stopTask/${id}/${progress}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    .then(res => {
      this.getTask();
    })
  }

  addGoalProgress = (id, progress, target) => {
    let input;
    let current;
    input = prompt("Please insert the target progress:");
    current = parseInt(progress) + parseInt(input);
    axios
    // .put(endpoint + "/api/addGoalProgress/" id, {
    .put(`${endpoint}/api/addGoalProgress/${id}/${current}/${target}`, {
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

  resetAllTask = () => {
    axios
      .put(endpoint + "/api/resetAllTask", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => {
        this.getTask();
      })
  }

  //Probably use a prompt to change durations
  //Consider rendering delete statement below, but need to figure out how to format correctly as the div's would otherwise be different (see how I piped in text for hourglass statuses)
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
            <Button onClick = {this.resetAllTask}> RESET ALL </Button>
          </div>
        }
      </div>
    );
  }
}

export default ToDoList;
