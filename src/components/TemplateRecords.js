import React from 'react';
import ReactDOM from 'react-dom';
import { Card, CardBody, Row, Col, Button, Modal, Form, ModalHeader, ModalBody, FormGroup, Label } from 'reactstrap';
import Header from './Header';
import Footer from './Footer';
import {checkStatus, handleError, parseJSON, jsonHeader} from './util';
import { Loader } from 'react-overlay-loader';
import 'react-overlay-loader/styles.css';
import { API }  from "./config"
const $ = require('jquery');
$.DataTable = require('datatables.net');

class TemplateRecords extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      templateFieldsRecords: [],
      addTemplateBlockModal: false,
      layoutRecords: [],
      insertfields: [],
      columnfields: [],
      fields: [],
      templateRecords: [],
      selectfields: "",
		  loading: false,
      templateId: '',
      tableRecord: {},
      tableName: ''
    };
    this.addTemplateBlockToggle = this.addTemplateBlockToggle.bind(this);
  }

  addTemplateBlockToggle() {
		this.setState({ loading:false, addTemplateBlockModal:!this.state.addTemplateBlockModal});
	}

  openModal = (recordData) => {
    console.log("Record ====> ", recordData);
    let fields = this.state.fields;
    // eslint-disable-next-line
    /*templateFieldsRecords && templateFieldsRecords.map((record, index) => {
      fields[record.tfmFieldName.replace(/ /g,"_").toLowerCase()] = recordData.record.tfmFieldName.replace(/ /g,"_").toLowerCase();
    })*/

    for(let key in recordData) {
      if(recordData.hasOwnProperty(key)) {
          // var value = data[key];
          fields[key] = recordData[key];
          //do something with value;
      }
    }
    this.setState({ addTemplateBlockModal:!this.state.addTemplateBlockModal, tableRecord: recordData });
  }

  getTemplateFieldsRecords(templateId) {
    const url = API + 'templates/getTemplateField/' + templateId;

    const headers = new Headers({
      ...jsonHeader,
    })
    const options = {
      headers,
      method: 'GET'
    }
    fetch(url, options)
		    .then(checkStatus)
		    .then(parseJSON)
		    .then(data => {
          //console.log("In Field Data", data);
          let insertfields = [];
          let columnfields = [];
          let selectfields = "";
          columnfields.push({ "title": "Id", "data": "id" });
          // eslint-disable-next-line
          data.allfield && data.allfield.length > 0 && data.allfield.map((record, index) => {
            let temp = {
              title: record.tfmFieldName.replace(/ /g,"_").toLowerCase()
            }
            let temp1 = {
              title: record.tfmFieldName,
              data: record.tfmFieldName.replace(/ /g,"_").toLowerCase()
            }
            
            insertfields.push(temp);
            columnfields.push(temp1);
            selectfields += record.tfmFieldName.replace(/ /g,"_").toLowerCase() + ",";
          })
          columnfields.push({ "title": "Action", "data": null });
          console.log("columnfields =====>", columnfields);
          selectfields = selectfields.substring(0, selectfields.length - 1);
          this.setState({ loading:false, templateFieldsRecords: data.allfield, columnfields: columnfields, insertfields: insertfields, selectfields: selectfields });
		    })
		    .catch((error) => {
		        handleError(error).then((error)=>{
		      		console.log(error);
		      		if(error.status===401) {
						    localStorage.clear();
						    this.props.history.push('/');
					    } else if(error.status===404) {
						    localStorage.clear();
						    this.props.history.push('/');
						    this.setState({ loading:false });	
					    } else {
						    this.setState({ loading:false });	
					    }
		        }).catch((error)=>{
		        	console.log(error);
		        	if(error.status===401){
						    localStorage.clear();
						    this.props.history.push('/');
					    } else if(error.status===404) {
						    localStorage.clear();
						    this.props.history.push('/');
						    this.setState({ loading:false });	
					    } else {
						    this.setState({ loading:false });	
					    }
		        });
		    });
  }

  getTemplateRecords = () => {
    const { selectfields, columnfields, fields } = this.state;
    this.setState({ loading:true });
		const url = API + 'templates/getTemplateFieldsRecords';
    const headers = new Headers({
      ...jsonHeader,
    })
    let jsonObject = JSON.stringify({
      tableName: fields['tmpltName'].replace(/ /g,"_").toLowerCase(),
      fields: selectfields
    })
    const options = {
              headers,
              method: 'POST',
              body: jsonObject
            }
		fetch(url, options)
		    .then(checkStatus)
		    .then(parseJSON)
		    .then(data => {
            console.log("Field Record Datas", data);
            let records = data.data
            this.setState({ loading: false, templateRecords: data.data });
            this.$el = $(this.el);
            this.$el.DataTable({
              data: records,
              "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
              "columns": columnfields,
              "autoWidth": false,
              columnDefs : [
                {
                  'targets': [columnfields.length - 1],
                  createdCell : (td, cellData, rowData, row, col) => {
                    ReactDOM.render(<React.Fragment><Button type="button" onClick={() => this.openModal(rowData)}><i className="fa fa-eye"></i></Button> </React.Fragment>,td);
                  }
                }
              ],
              "buttons": [
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdfHtml5'
              ],
            });
		    })
		    .catch((error) => {
		        handleError(error).then((error)=>{
		      		if(error.status===401) {
						    localStorage.clear();
						    this.props.history.push('/');
					    } else if(error.status===404) {
						    localStorage.clear();
						    this.props.history.push('/');
						    this.setState({ loading:false });	
					    } else {
						    this.setState({ loading:false });	
					    }
		        }).catch((error)=>{
		        	console.log(error);
		        	if(error.status===401){
						    localStorage.clear();
						    this.props.history.push('/');
					    } else if(error.status===404) {
						    localStorage.clear();
						    this.props.history.push('/login');
						    this.setState({ loading:false });	
					    } else {
						    this.setState({ loading:false });	
					    }
		        });
		    });
  }

  getTemplateRecord = (id) => {
    this.setState({ loading:true });
		const url = API + 'templates/getTemplateRecord/'+id;
    const headers = new Headers({
      ...jsonHeader,
    })
    const options = {
              headers,
              method: 'GET'
            }
		fetch(url, options)
		    .then(checkStatus)
		    .then(parseJSON)
		    .then(data => {
            //console.log("In Here Template Record", data)
            let record = data.data;
            let templateRecord = record[0];
            let fields = this.state.fields;
            fields['tmpltName'] = templateRecord.tmpltName;
            //console.log("In Here Template Record", templateRecord.tmpltName)
            this.setState({ loading: false, fields: fields });
		    })
		    .catch((error) => {
		        handleError(error).then((error)=>{
		      		console.log(error);
		      		if(error.status===401) {
						    localStorage.clear();
						    this.props.history.push('/');
					    } else if(error.status===404) {
						    localStorage.clear();
						    this.props.history.push('/');
						    this.setState({ loading:false });	
					    } else {
						    this.setState({ loading:false });	
					    }
		        }).catch((error)=>{
		        	console.log(error);
		        	if(error.status===401){
						    localStorage.clear();
						    this.props.history.push('/');
					    } else if(error.status===404) {
						    localStorage.clear();
						    this.props.history.push('/');
						    this.setState({ loading:false });	
					    } else {
						    this.setState({ loading:false });	
					    }
		        });
		    });
  }

  componentDidMount() {
    this.setState({ loading:true, templateId:this.props.match.params.id });
    this.getTemplateRecord(this.props.match.params.id);
    this.getTemplateFieldsRecords(this.props.match.params.id);
    setTimeout(() => {
      this.getTemplateRecords();
    }, 4000) 
  }

  render() {
    const { templateFieldsRecords, loading, addTemplateBlockModal, fields } = this.state;
    return (
      <div>
        <Header />
        <div className="container-fluid with-color-picker">
          <Loader fullPage loading={loading} />
					<Row className="mt-5 mb-3"></Row>
          <Modal isOpen={addTemplateBlockModal} toggle={this.addTemplateBlockToggle} className="brandModal modal-dialog-centered w-600" keyboard={false} backdrop="static">
						<ModalHeader toggle={this.addBrandToggle}>{ "View Record" }</ModalHeader>
            <ModalBody>
              <Form className="brandForm" method="POST">
                
                
                {
                  templateFieldsRecords && templateFieldsRecords.length > 0 && templateFieldsRecords.map((record, index) => {
                    return (
                      <React.Fragment key={index}>
                        <FormGroup row>
                          <Label for="exampleEmail" sm={6}>{record.tfmFieldName}</Label>
                          <Col sm={6}>
                            <p>{fields[record.tfmFieldName.replace(/ /g,"_").toLowerCase()]}</p>
                          </Col>
                        </FormGroup>
                      </React.Fragment>
                      
                    )
                  })
                }
                
                <Row>
                  <Button type="button" className="brandButton w-100 d-block ml-auto mr-auto mb-4 mt-2" onClick={ this.addTemplateBlockToggle }>{"Close" }</Button>
                </Row>
              </Form>
            </ModalBody>
          </Modal>
          <Row>
						<Col lg="12">
              <Card>
                <CardBody> 
                  <div className="tbl-responsive">
                    <table id="example" className="display" width="100%" ref={el => this.el = el}>
                      <thead>
                        <tr>
                          <td>Id</td>
                          {
                            templateFieldsRecords && templateFieldsRecords.length > 0 && templateFieldsRecords.map((record, index) => {
                              return (
                                <td key={"thead_"+index}>{record.tfmFieldName}</td>
                              )
                            })
                          }
                          <td>Action</td>
                        </tr>
                      </thead>
                      <tbody></tbody>
                      <tfoot>
                        <tr>
                          <td>Id</td>
                          {
                            templateFieldsRecords && templateFieldsRecords.length > 0 && templateFieldsRecords.map((record, index) => {
                              return (
                                <td key={"tfoot_"+index}>{record.tfmFieldName}</td>
                              )
                            })
                          }
                          <td>Action</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <Footer />
      </div>
    );
  }
}

export default TemplateRecords;