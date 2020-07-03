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

  onSubmit = () => {
    let { task } = this.state;
    //console.log("this.state.task is " + this.state.task)
    if (task) {
      axios
        .post(
          endpoint + "/api/task",
          {
            task
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
    console.log("check f")
    axios.get(endpoint + "/api/task").then(res => {
      //console.log(res)
      if (res.data){
        this.setState({
          items: res.data.map( item => {
            let color = "yellow";
            if (item.status === 1) {
              color = "blue";
            }
            else if (item.status === 2) {
              color = "green";
            }
            return (
              <Card key={item._id} color={color} fluid>
                <Card.Content>
                  <Card.Header textAlign="left">
                    <div style={{ wordWrap: "break-word" }}>{item.task}</div>
                  </Card.Header>

                  <Card.Meta textAlign="right">
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
                    <Icon
                      name="hourglass start"
                      color="blue"
                      onClick={() => this.startTask(item._id)}
                    />
                    <span style={{ paddingRight:10 }}>Start</span>
                    <Icon
                      name="delete"
                      color="red"
                      onClick={() => this.deleteTask(item._id)}
                    />
                    <span style={{ paddingRight:10 }}>Delete</span>
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

  render() {
    console.log(Date.now())
    return (
      <div>
        <div className="row">
          <Header className="header" as="h2">
            TO DO List
          </Header>
        </div>
        <div className="row">
          <Form onSubmit={this.onSubmit}>
            <Input
              type="text"
              name="task"
              onChange={this.onChange}
              value={this.state.task}
              fluid
              placeholder="Create Task"
            />
            {/* <Button>Create Task</Button> */}
          </Form>
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
