import React from 'react';
import { Button, Form, FormGroup, Label, Input, Card, Modal, ModalHeader, ModalBody, CardBody, Table, Row, Col } from 'reactstrap';
import {  withRouter } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import {checkStatus, handleError, parseJSON, jsonHeader, tokenHeader} from './util';
import { Loader } from 'react-overlay-loader';
import 'react-overlay-loader/styles.css';
import { API }  from "./config"


class TemplateField extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			addTemplateModal: false,
			fields: [],
			errors: {},
			success: {},
      getTemplateRecord: [],
      templateFieldsRecords: [],
      layoutRecords: [],
		  barndloading: false,
		  loading: false,
		  templateId: ''
		};
		this.addTemplateToggle = this.addTemplateToggle.bind(this);
	}

	addTemplateToggle(){
		let success = {};
		this.setState({ loading:false, addTemplateModal:!this.state.addTemplateModal, success });
  }

  addTemplateFieldRecords() {
    const url = API + 'templates/getTemplateFields';

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
          this.setState({ loading:false, templateFieldRecords: data.data });
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
						    this.props.history.push('/login');
						    this.setState({ loading:false });	
					    } else {
						    this.setState({ loading:false });	
					    }
		        });
		    });
  }

	deleteTemplate = (record) => {
		this.setState({ loading:true });
		const url = API + 'templates/deleteTemplateField/'+record.tfmId;
    const headers = new Headers({
      ...jsonHeader,
    })
    const options = {
              headers,
              method: 'DELETE'
            }
		fetch(url, options)
		    .then(checkStatus)
		    .then(parseJSON)
		    .then(data => {
		        console.log(data);
		        let success = {};
				    success["successMessage"] = "Field Deleted Successfully";
				    window.setTimeout(() => {
				      this.setState({ success: '' });
				    }, 5000);
		        this.setState({ loading:false, success  });
		        this.getTemplateFieldsRecords(record.tfmTemplateId)
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
      ...tokenHeader,
    })
    const options = {
              headers,
              method: 'GET'
            }
		fetch(url, options)
		    .then(checkStatus)
		    .then(parseJSON)
		    .then(data => {
            console.log("Template Record ", data);
            let record = data.data;
            let templateRecord = record[0];
            let fields = this.state.fields;
            fields['tmpltName'] = templateRecord.tmpltName
		        this.setState({ loading: false, fields: fields, templateId: templateRecord.tmpltId });
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
						    this.props.history.push('/login');
						    this.setState({ loading:false });	
					    } else {
						    this.setState({ loading:false });	
					    }
		        });
		    });
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
          this.setState({ loading:false, templateFieldsRecords: data.data });
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
						    this.props.history.push('/login');
						    this.setState({ loading:false });	
					    } else {
						    this.setState({ loading:false });	
					    }
		        });
		    });
  }

  updateFieldStatus = (record) => {
		this.setState({ loading:true });
    const url = API + 'templates/updateFieldStatus/'+record.tfmId;
		let currentShowValue;
    const headers = new Headers({
      ...jsonHeader
    })
    if(record.tfmFieldIsActive === 1){
      currentShowValue = 0;
    }else{
      currentShowValue = 1;
    }
	    let jsonsetLoginData = JSON.stringify({
				tfmFieldIsActive: currentShowValue
			});
	    const options = {
	    					headers,
	    					method: 'PUT',
	    					body:jsonsetLoginData
	    				}
		fetch(url, options)
		    .then(checkStatus)
		    .then(parseJSON)
		    .then(data => {
		        console.log(data);
		        this.setState({ loading:false });
		        this.getTemplateFieldsRecords(record.tfmTemplateId);
		    })
		    .catch((error) => {
		        handleError(error).then((error)=>{
		      		console.log(error);
		      		if(error.status===401){
						    localStorage.clear();
                  this.props.history.push('/');
                }else if(error.status===404){
                  localStorage.clear();
                  this.props.history.push('/');
                  this.setState({ barndloading:false });	
                }else{
                  this.setState({ barndloading:false });	
                }
		        }).catch((error)=>{
		        	console.log(error);
		        	if(error.status===401){
                localStorage.clear();
                this.props.history.push('/');
              }else if(error.status===404){
                localStorage.clear();
                this.props.history.push('/');
                this.setState({ barndloading:false });	
              }else{
                this.setState({ barndloading:false });	
              }
		        });
		    });

	}

	SubmitTemplate = async(event) => {

		event.preventDefault();
		if (this.handleValidation()) {	
      const { fields, templateId } = this.state;
      let mandatory = false;
      let active = true;
      if (fields['tfmFieldRequired']) {
        mandatory = fields['tfmFieldRequired']
      }
      if (fields['tfmFieldIsActive']) {
        active = fields['tfmFieldIsActive']
      }
			this.setState({ loading:true });
      let jsonObject = JSON.stringify({
        tfmTemplateId: templateId,
        tfmField: fields['tfmField'],
        tfmFieldName: fields['tfmFieldName'],
        tmpltName: fields['tmpltName'].replace(" ","_").toLowerCase(),
        tfmFieldIsActive: active,
        tfmFieldRequired: mandatory,
        tfmFieldLength: fields['tfmFieldLength']
      });   
      const url = API + 'templates/addTemplateField';
      const headers = new Headers({
        ...jsonHeader,
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
			        console.log(data);
			        fields['tfmField'] = '';
              fields['tfmFieldName'] = '';
              fields['tfmFieldLength'] = '';
              fields['tfmFieldRequired'] = '';
              fields['tfmFieldIsActive'] = '';
					    let success = {};
			        success["successMessage"] = data.message;
					    this.setState({ loading:false, fields : fields, addTemplateModal:!this.state.addTemplateModal, success });

					    window.setTimeout(() => {
		              this.setState({ success: '' });
		          }, 5000);
		          this.getTemplateFieldsRecords(this.state.templateId);
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
			console.log("Form has errors.")
		}

	}

	handleValidation() {
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;
		//const re = /^[0-9\b]+$/;
		if (!fields["tfmFieldName"]) {
			formIsValid = false;
			errors["tfmFieldName"] = "Please enter field name.";
		} else {
      errors["tfmFieldName"] = "";
    }

    if (!fields["tfmField"]) {
			formIsValid = false;
			errors["tfmField"] = "Please select field.";
		} else {
      errors["tfmField"] = "";
    }

    if (!fields["tfmFieldLength"]) {
			formIsValid = false;
			errors["tfmFieldLength"] = "Please enter field length.";
		} else {
      errors["tfmFieldLength"] = "";
    }
    
		
		this.setState({ errors: errors });
		return formIsValid;
  }
  
  checkBoxMandatoryChecked = (e) => {
    console.log(e.target.checked);
    const { fields } = this.state;
    if (e.target.checked) {
      fields['tfmFieldRequired'] = e.target.checked
    } else {
      fields['tfmFieldRequired'] = e.target.checked
    }
    this.setState({ fields: fields });
  }

  checkBoxStatusChecked = (e) => {
    console.log(e.target.checked);
    const { fields } = this.state;
    if (e.target.checked) {
      fields['tfmFieldIsActive'] = e.target.checked
    } else {
      fields['tfmFieldIsActive'] = e.target.checked
    }
    this.setState({ fields: fields });
  }

	handleChange(field, e) {
		let fields = this.state.fields;
		fields[field] = e.target.value;
		this.setState({ fields });
	}
	
	componentDidMount() {
    this.setState({ loading:true, templateId:this.props.match.params.id });
    this.getTemplateRecord(this.props.match.params.id);
    this.getTemplateFieldsRecords(this.props.match.params.id);
	}
	

	render() {
    const { addTemplateModal, loading, fields, templateFieldsRecords } = this.state;
		return (
			<div>
				<Header />
				<div className="container-fluid with-color-picker">
					<Loader fullPage loading={loading} />
					<Row className="mt-5 mb-3">
						<Col className="d-flex align-items-center">
							<h4 className="m-0">{fields['tmpltName']}</h4>
						</Col>
						<Col className="text-right">
							<Button type="button" onClick={this.addTemplateToggle}  className="lgnButton">Add Template Field</Button>
							<Modal isOpen={addTemplateModal} toggle={this.addTemplateToggle} className="brandModal modal-dialog-centered w-600" keyboard={false} backdrop="static">
			          <ModalHeader toggle={this.addBrandToggle}>{ "Add Template Field" }</ModalHeader>
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
													<Label for="tfmField">Field Type <span className="error">*</span></Label>
                          <Input type="select" name="tfmField" id="tfmField" onChange={this.handleChange.bind(this, "tfmField")}>
                            <option>Select value</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="date">Date</option>
                            <option value="dropdown">Dropdown List</option>
                            <option value="email">Email</option>
                            <option value="integer">Integer</option>
                            <option value="multiselect">MultiSelect</option>
                            <option value="phone">Phone</option>
                            <option value="radio">Radiobutton</option>
                            <option value="text">Text</option>
                            <option value="textbox">Textarea</option>
                            <option value="url">Url</option>
                          </Input>
													<span className="error text-danger">{this.state.errors["tfmField"]}</span>
												</FormGroup>
											</Col>
                    </Row>
                    
                    <Row>
											<Col>
												<FormGroup>
													<Label for="tfmFieldName">Field Title <span className="error">*</span></Label>
													<Input type="text" name="tfmFieldName" id="tfmFieldName" placeholder="Enter Field Name" ref="tfmFieldName" onChange={this.handleChange.bind(this, "tfmFieldName")} value={this.state.fields["tfmFieldName"]} />
													<span className="error text-danger">{this.state.errors["tfmFieldName"]}</span>
												</FormGroup>
											</Col>
										</Row>

                    <Row>
											<Col>
												<FormGroup>
													<Label for="tfmFieldLength">Length <span className="error">*</span></Label>
													<Input type="text" name="tfmFieldLength" id="tfmFieldLength" placeholder="Enter Field Length" ref="tfmFieldLength" onChange={this.handleChange.bind(this, "tfmFieldLength")} value={this.state.fields["tfmFieldLength"]} />
													<span className="error text-danger">{this.state.errors["tfmFieldLength"]}</span>
												</FormGroup>
											</Col>
										</Row>
                    
                    <Row>
                      <Col>
                        <FormGroup row>
                          <Label style={{marginLeft: "15px", marginRight: "35px"}} for="tfmFieldRequired">Mandatory</Label>
                          <Label style={{marginTop: "-5px"}} check>
                            <Input type="checkbox" name="tfmFieldRequired" id="tfmFieldRequired" onChange={(e) => this.checkBoxMandatoryChecked(e)}  />
                          </Label>
                        </FormGroup>
                        <span className="error text-danger">{this.state.errors["tfmFieldRequired"]}</span>  
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <FormGroup row>
                          <Label style={{marginLeft: "15px", marginRight: "35px"}} for="tfmFieldIsActive">Active</Label>
                          <Label style={{marginTop: "-5px"}} check>
                            <Input type="checkbox" name="tfmFieldIsActive" id="tfmFieldIsActive" onChange={(e) => this.checkBoxStatusChecked(e)}  />
                          </Label>
                        </FormGroup>
                        <span className="error text-danger">{this.state.errors["tfmFieldIsActive"]}</span> 
                      </Col>
                    </Row>
                      

                    <Row>
                      <Button type="button" className="brandButton w-100 d-block ml-auto mr-auto mb-4 mt-2" onClick={ this.addTemplateToggle }>{"Close" }</Button>
                      <Button type="button" className="brandButton w-100 d-block ml-auto mr-auto mb-4 mt-2" onClick={ this.SubmitTemplate }>{ "Save" }</Button>
                    </Row>
										
									</Form>
			          </ModalBody>
			        </Modal>
						</Col>
					</Row>
					<Row>
						<Col lg="12">
							<p className="error text-success text-center">{this.state.success["successMessage"]}</p>
							<p className="error text-danger text-center">{this.state.success["errorMessage"]}</p>
							<Card>
								<CardBody>
									<Table responsive>
										<thead>
											<tr>
												<th>Field Name</th>
                        <th>Active</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>
										{
                      templateFieldsRecords && templateFieldsRecords.length > 0 ?
                      templateFieldsRecords.map((templateRecord, i) => {
                        return (
                          <tr key={"templatefield_"+i}>
                            <td>{templateRecord.tfmFieldName}</td>
                            <td>
                              <label className="gbSwitch">
                                <input type="checkbox" id={"active_"+templateRecord.tfmId+"_"+templateRecord.tfmFieldIsActive} onClick={() => this.updateFieldStatus(templateRecord)} defaultChecked={templateRecord.tfmFieldIsActive} />
                                <div className="gbCustomCheckBox"></div>
                              </label>
                            </td>
                            <td>
                              <div style={{width:"100px", display:"inline-block"}}>
                                <i className="fa fa-trash ml-3" onClick={() => this.deleteTemplate(templateRecord)} ></i>
                              </div>
                            </td>
                          </tr>
                        )
                      }) :
                      <tr>
                        <td colSpan="8" className="text-center">No Record Found</td>
                      </tr>
				            }
										</tbody>
									</Table>
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
export default withRouter(TemplateField);	
