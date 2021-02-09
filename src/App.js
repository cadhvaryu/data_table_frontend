import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, Row, Col } from 'reactstrap';
import { Loader } from 'react-overlay-loader';
import {checkStatus, handleError, parseJSON} from './util';
import 'react-overlay-loader/styles.css';
import './App.css';
//import { Tbl } from './Tbl';
const $ = require('jquery');
$.DataTable = require('datatables.net');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addStudentModal: false,
      fields: [],
      errors: {},
      success: {},
      studentsData: [],
      loading:false,
      studentId: null
    };
    this.addStudentToggle = this.addStudentToggle.bind(this);
    this.getStudentRecord = this.getStudentRecord.bind(this);
    this.getStudentRecords = this.getStudentRecords.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    /*this.brandDashboard = this.brandDashboard.bind(this);
    this.fontColorPicker = React.createRef();
    this.updateShowPublishStatus = this.updateShowPublishStatus.bind(this);
    this.deleteBrand = this.deleteBrand.bind(this);*/
  }


  getStudentRecords() {
    this.$el = $(this.el);
    this.$el.DataTable().destroy();
    this.setState({ loading:true });
    fetch('http://127.0.0.1:8000/api/students', {
      method: 'GET',
      headers: {
        "Accept": 'application/json',
        "Content-Type" : "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000/",
        "Access-Control-Allow-Methods":'HEAD, GET, POST, OPTIONS, PUT, PATCH, DELETE',
        "Access-Control-Allow-Headers":'Access-Control-*, Origin, X-Requested-With, Content-Type, Accept, Authorization',
        "Access-Control-Allow-Credentials":"true"
      },
    }).then(function (res) {
      
      if (res.status < 200 || res.status >= 300) {
        //return res.json().then(err => {throw err;});
        throw res;
        //throw Error(.statusText);
      } else { return res.json() }
    })
      .then(
        (res) => {
          if(res.length>0){
            this.setState({ loading:false, studentsData:res  });
            this.$el = $(this.el);
            this.$el.DataTable({
              data: res,
              "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
              "columns": [
                  { "data": "id" },
                  { "data": "name" },
                  { "data": "email" },
                  { "data": "age" },
                  { "data": "class" },
                  { "data": null }
              ],
              columnDefs : [
                {
                   'targets': 5,
                   createdCell : (td, cellData, rowData, row, col) => {
                    ReactDOM.render(<><Button type="button" color="primary" onClick ={() => this.getStudentRecord(rowData)}>Edit</Button> <Button type="button" color="success" onClick={() => this.deleteRow(rowData)}>Delete</Button> </>,td);
                   }
                }
              ]
            });
          }else{
            this.setState({ loading:false });
          }
          
        },
        (error) => {
          
          if(error.status===401){
            localStorage.clear();
            
          }else{
            this.setState({ loading:false });  
          }
          
        }
      ).catch(function(error){
        this.setState({ loading:false });
        if(error.status===401){
        }
      })
  }

  componentDidMount() {
    this.setState({ loading:true });
    fetch('http://127.0.0.1:8000/api/students', {
      method: 'GET',
      headers: {
        "Accept": 'application/json',
        "Content-Type" : "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000/",
        "Access-Control-Allow-Methods":'HEAD, GET, POST, OPTIONS, PUT, PATCH, DELETE',
        "Access-Control-Allow-Headers":'Access-Control-*, Origin, X-Requested-With, Content-Type, Accept, Authorization',
        "Access-Control-Allow-Credentials":"true"
      },
    }).then(function (res) {
      
      if (res.status < 200 || res.status >= 300) {
        //return res.json().then(err => {throw err;});
        throw res;
        //throw Error(.statusText);
      } else { return res.json() }
    })
      .then(
        (res) => {
          if(res.length>0){
            this.setState({ loading:false, studentsData:res  });
            this.$el = $(this.el);
            this.$el.DataTable({
              data: res,
              "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
              "columns": [
                  { "data": "id" },
                  { "data": "name" },
                  { "data": "email" },
                  { "data": "age" },
                  { "data": "class" },
                  { "data": null }
              ],
              columnDefs : [
                {
                   'targets': 5,
                   createdCell : (td, cellData, rowData, row, col) => {
                    ReactDOM.render(<><Button type="button" color="primary" onClick ={() => this.getStudentRecord(rowData)}>Edit</Button> <Button type="button" color="success" onClick={() => this.deleteRow(rowData)}>Delete</Button> </>,td);
                   }
                }
              ]
            });
          }else{
            this.setState({ loading:false });
          }
          
        },
        (error) => {
          
          if(error.status===401){
            localStorage.clear();
            
          }else{
            this.setState({ loading:false });  
          }
          
        }
      ).catch(function(error){
        this.setState({ loading:false });
        if(error.status===401){
        }
      })
  }

  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  addStudentToggle(){
    let fields = [];
    let success = {};
    this.setState({ loading:false, fields : fields, addStudentModal:!this.state.addStudentModal, success });
  }

  
  getStudentRecord(row) {
    let fields = this.state.fields;
    fields['studentname'] = row.name;
    fields['studentage'] = row.age;
    fields['studentclass'] = row.class;
    fields['studentemail'] = row.email;
    fields['studentid'] = row.id;
    this.setState({
      studentId: row.id,
      fields: fields,
      addStudentModal:!this.state.addStudentModal
    })
  }

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    const re = /^[0-9\b]+$/;
    //Email
    if (!fields["studentname"]) {
      formIsValid = false;
      errors["studentname"] = "Please enter studentname";
    }

    //newpass
    if (!fields["studentage"]) {
      formIsValid = false;
      errors["studentage"] = "Please enter studentage.";
    }else{

      if(re.test(fields["studentage"])){
      }else{
        formIsValid = false;
        errors["studentage"] = "Please enter studentaged value as number. Not allowed character.";
      }


    }

    if (!fields["studentclass"]) {
      formIsValid = false;
      errors["studentclass"] = "Please enter student class.";
    }

    if (!fields["studentemail"]) {
      formIsValid = false;
      errors["studentemail"] = "Please enter student email.";
    }
    
    this.setState({ errors: errors });
    return formIsValid;
  }

  deleteRow(row) {
    this.$el = $(this.el);
    this.$el.DataTable().destroy();
    this.setState({ loading:true });
    const url = 'http://127.0.0.1:8000/api/students/'+row.id;   
    const options = {
              method: 'DELETE'
            };
    fetch(url, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
          let success = {};
          success["successMessage"] = "Student Deleted Successfully";
          this.setState({ loading:false,  success });

          window.setTimeout(() => {
              this.setState({ success: '' });
          }, 5000);


          this.getStudentRecords();
          
      })
      .catch((error) => {
          handleError(error).then((error)=>{
            console.log(error);
            let success = {};
            success["errorModalMessage"] = error;
            this.setState({ loading:false, success });
            window.setTimeout(() => {
                  this.setState({ success: '' });
                }, 5000);
              
            }).catch((error)=>{
              console.log(error);
            });
      });
  }

  UpdateSubmitStudent = async(event) => {
    event.preventDefault();
    if (this.handleValidation()) {  
      let fields = this.state.fields;
      this.setState({ loading:true });

      let jsonBody = JSON.stringify({
          "name": fields['studentname'],
          "age": fields['studentage'],
          "class": fields['studentclass'],
          "email": fields['studentemail']
      });
      /*let formData = new FormData();
      formData.append("name", fields['studentname']);
      formData.append("age", fields['studentage']);
      formData.append("class", fields['studentclass']);
      formData.append("email", fields['studentemail']);*/

        const url = 'http://127.0.0.1:8000/api/students/'+this.state.studentId;   
        const options = {
                  method: 'PUT',
                  body: jsonBody
                }
        fetch(url, options)
          .then(checkStatus)
          .then(data => {
              if(data.status === 200) {
                let fields = [];
                let success = {};
                success["successMessage"] = "Student Updated Successfully";
                this.setState({ loading:false, fields : fields, addStudentModal:!this.state.addStudentModal, success });

                window.setTimeout(() => {
                    this.setState({ success: '' });
                }, 5000);

                this.getStudentRecords();  
              }
              
          })
          .catch((error) => {
              handleError(error).then((error)=>{
                console.log(error);
                let success = {};
                success["errorModalMessage"] = error;
                this.setState({ loading:false, success });
                window.setTimeout(() => {
                      this.setState({ success: '' });
                    }, 5000);
                  
                }).catch((error)=>{
                  console.log(error);
                });
          });
      }else{
        console.log("Form has errors.");
      }
  }

  SubmitStudent = async(event) => {

    event.preventDefault();
    if (this.handleValidation()) {  
      let fields = this.state.fields;
      this.setState({ loading:true });
      let formData = new FormData();
      formData.append("name", fields['studentname']);
      formData.append("age", fields['studentage']);
      formData.append("class", fields['studentclass']);
      formData.append("email", fields['studentemail']);

        const url = 'http://127.0.0.1:8000/api/students';   
        const options = {
                  method: 'POST',
                  body: formData
                }
        fetch(url, options)
          .then(data => {

              if(data.status === 201) {
                console.log(data);
                console.log("=========================");
                let fields = [];
                let success = {};
                success["successMessage"] = "Student Inserted Successfully";
                this.setState({ loading:false, fields : fields, addStudentModal:!this.state.addStudentModal, success });

                window.setTimeout(() => {
                    this.setState({ success: '' });
                }, 5000);

                this.getStudentRecords();
              }
              

          })
          .catch((error) => {
              handleError(error).then((error)=>{
                  let fields = [];
                  let success = {};
                  success["successMessage"] = "Student Inserted Successfully";
                  this.setState({ loading:false, fields : fields, addBannerModal:!this.state.addBannerModal, success });

                  window.setTimeout(() => {
                      this.setState({ success: '' });
                  }, 5000);
                  
                }).catch((error)=>{
                  console.log(error);
                });
          });

    }else{
      console.log("Form has errors.");
    }

  }

  render() {
    return (
      <div>
        <div className="container-fluid">
          <Loader fullPage loading={this.state.loading} />
          <Row className="mt-3 mb-3 ml-3">
            <Button type="button" color="primary" onClick={this.addStudentToggle} className="primary">Add Student</Button>
              <Modal isOpen={this.state.addStudentModal} toggle={this.addStudentToggle} className="brandModal modal-dialog-centered w-600" keyboard={false} backdrop="static">
                <ModalHeader toggle={this.addStudentToggle}>{ (this.state.studentId!==null) ? "Update Student" : "Add Student" }</ModalHeader>
                <Loader fullPage loading={this.state.loading} />
                <ModalBody>
                  <Form className="brandForm" method="POST">                    
                  <Row>
                    <Col>
                      <p className="error text-danger text-center">{this.state.success["errorModalMessage"]}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label for="studentname">Student Name</Label>
                        <Input type="text" name="studentname" id="studentname" placeholder="Enter Studentname" ref="studentname" onChange={this.handleChange.bind(this, "studentname")} value={this.state.fields["studentname"]} />
                        <span className="error text-danger">{this.state.errors["studentname"]}</span>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label for="studentage">Student Age</Label>
                        <Input type="text" name="studentage" id="studentage" placeholder="Enter Student Age" ref="studentage" onChange={this.handleChange.bind(this, "studentage")} value={this.state.fields["studentage"]} />
                        <span className="error text-danger">{this.state.errors["studentage"]}</span>
                      </FormGroup>
                      
                    </Col>
                  </Row>


                  <Row>
                    <Col>
                      <FormGroup>
                        <Label for="studentemail">Student Email</Label>
                        <Input type="text" name="studentemail" id="studentemail" placeholder="Enter Student Email" ref="clientsecret" onChange={this.handleChange.bind(this, "studentemail")} value={this.state.fields["studentemail"]} />
                        <span className="error text-danger">{this.state.errors["studentemail"]}</span>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label for="studentclass">Student Class</Label>
                        <Input type="text" name="studentclass" id="studentclass" placeholder="Enter Student Class" ref="studentclass" onChange={this.handleChange.bind(this, "studentclass")} value={this.state.fields["studentclass"]} />
                        <span className="error text-danger">{this.state.errors["studentclass"]}</span>
                      </FormGroup>
                    </Col>
                    
                  </Row>
                  <Button type="button" className="brandButton w-100 d-block ml-auto mr-auto mb-4 mt-2" onClick={ (this.state.studentId!==null) ? this.UpdateSubmitStudent : this.SubmitStudent }>{ (this.state.studentId!==null) ? "Update" : "Save" }</Button>
                </Form>
              </ModalBody>
            </Modal>
          </Row>
          <Row className="mt-3 mb-3 ml-3">
            <Col lg="12">
              {/*<Tbl data={this.state.studentsData && this.state.studentsData} /> */}
              <div>
                <table id="example" className="display" width="100%" ref={el => this.el = el}>
                  <thead>
                    <tr>
                      <td>Id</td>
                      <td>Name</td>
                      <td>Email</td>
                      <td>Age</td>
                      <td>Class</td>
                      <td>Action</td>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <td>Id</td>
                      <td>Name</td>
                      <td>Email</td>
                      <td>Age</td>
                      <td>Class</td>
                      <td>Action</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default App;
