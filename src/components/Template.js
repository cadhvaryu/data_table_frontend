import React from 'react';
import { Button, Form, FormGroup, Label, Input, Card, Modal, ModalHeader, ModalBody, CardBody, Table, Row, Col } from 'reactstrap';
import {  withRouter } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import {checkStatus, handleError, parseJSON, jsonHeader, tokenHeader} from './util';
import { Loader } from 'react-overlay-loader';
import 'react-overlay-loader/styles.css';
import { API }  from "./config"


class Template extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			addTemplateModal: false,
			fields: [],
			errors: {},
			success: {},
      getTemplateRecord: [],
      templateRecords: [],
      layoutRecords: [],
		  barndloading: false,
		  loading: false,
		  templateId: ''
		};
		this.addTemplateToggle = this.addTemplateToggle.bind(this);
	}

	addTemplateToggle(){
		let fields = [];
		let success = {};
		this.setState({ loading:false, fields : fields, addTemplateModal:!this.state.addTemplateModal, success });
  }

  getTemplateRecords() {
    const url = API + 'templates/getTemplates';

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
          this.setState({ loading:false, templateRecords: data.data });
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
  
  getLayoutRecords() {
    const url = API + 'templates/getLayoutRecords';
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
          this.setState({ loading:false, layoutRecords: data.data });
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
	
	openTemplateField = (record) => {
		this.props.history.push('/template/field/' + record.tmpltId)
	}

	openTemplateForm = (record) => {
		this.props.history.push('/template/form/' + record.tmpltId)
	}

	deleteTemplate = (record) => {
		this.setState({ loading:true });
		const url = API + 'templates/deleteTemplate/'+record.tmpltId;
    const headers = new Headers({
      ...jsonHeader,
      ...tokenHeader,
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
				    success["successMessage"] = "Template Deleted Successfully";
				    window.setTimeout(() => {
				      this.setState({ success: '' });
				    }, 5000);
		        this.setState({ loading:false, success  });
		        this.getTemplateRecords();
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
  
  getTemplateRecord = (record) => {
    this.setState({ loading:true });
		const url = API + 'templates/getTemplateRecord/'+record.tmpltId;
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
            fields['tmpltLayoutId'] = templateRecord.tmpltLayoutId
		        this.setState({ loading: false, fields: fields, templateId: templateRecord.tmpltId,addTemplateModal: !this.state.addTemplateModal });
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
	
	UpdateSubmitTemplate = async(event) => {
		event.preventDefault();
		if (this.handleValidation()) {
			const { fields } = this.state;
			this.setState({ loading:true });
      let jsonObject = JSON.stringify({
        tmpltName: fields['tmpltName'],
        tmpltLayoutId: fields['tmpltLayoutId']
      });   
      const url = API + 'templates/updateTemplate/'+this.state.templateId;
      const headers = new Headers({
        ...jsonHeader
      })
      const options = {
                headers,
                method: 'PUT',
                body: jsonObject
              }
			fetch(url, options)
			    .then(checkStatus)
			    .then(parseJSON)
			    .then(data => {
			        console.log(data);
			        let fields = [];
					    let success = {};
			        success["successMessage"] = data.message;
					    this.setState({ loading:false, fields : fields, templateId: '', addTemplateModal:!this.state.addTemplateModal, success });

					    window.setTimeout(() => {
		              this.setState({ success: '' });
		          }, 5000);
		          this.getTemplateRecords();
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
		} else {
			console.log("Form has errors.")
		}
	}

	SubmitTemplate = async(event) => {

		event.preventDefault();
		if (this.handleValidation()) {	
      const { fields } = this.state;
			this.setState({ loading:true });
      let jsonObject = JSON.stringify({
        tmpltName: fields['tmpltName'],
        tmpltLayoutId: fields['tmpltLayoutId']
      });   
      const url = API + 'templates/addTemplate';
      const headers = new Headers({
        ...jsonHeader,
        ...tokenHeader,
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
			        let fields = [];
					    let success = {};
			        success["successMessage"] = data.message;
					    this.setState({ loading:false, fields : fields, addTemplateModal:!this.state.addTemplateModal, success });

					    window.setTimeout(() => {
		              this.setState({ success: '' });
		          }, 5000);
		          this.getTemplateRecords();
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
		if (!fields["tmpltName"]) {
			formIsValid = false;
			errors["tmpltName"] = "Please enter template name.";
		} else {
      errors["tmpltName"] = "";
    }

		if (!fields["tmpltLayoutId"]) {
			formIsValid = false;
			errors["tmpltLayoutId"] = "Please select layout.";
		}else{
      errors["tmpltLayoutId"] = "";
    }
		
		this.setState({ errors: errors });
		return formIsValid;
	}

	handleChange(field, e) {
		let fields = this.state.fields;
		fields[field] = e.target.value;
		this.setState({ fields });
	}
	
	componentDidMount() {
    this.setState({ loading:true, templateId:'' });
    this.getLayoutRecords();
    this.getTemplateRecords();
	}
	

	render() {
    const { addTemplateModal, loading, templateId, layoutRecords, templateRecords } = this.state;
		return (
			<div>
				<Header />
				<div className="container-fluid with-color-picker">
					<Loader fullPage loading={loading} />
					<Row className="mt-5 mb-3">
						<Col className="d-flex align-items-center">
							<h4 className="m-0">Templates</h4>
						</Col>
						<Col className="text-right">
							<Button type="button" onClick={this.addTemplateToggle}  className="lgnButton">Add Template</Button>
							<Modal isOpen={addTemplateModal} toggle={this.addTemplateToggle} className="brandModal modal-dialog-centered w-600" keyboard={false} backdrop="static">
			          <ModalHeader toggle={this.addBrandToggle}>{ templateId !== '' ? "Update Template" : "Add Template" }</ModalHeader>
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
													<Label for="tmpltName">Template Name</Label>
													<Input type="text" name="tmpltName" id="tmpltName" placeholder="Enter Template Name" ref="tmpltName" onChange={this.handleChange.bind(this, "tmpltName")} value={this.state.fields["tmpltName"]} />
													<span className="error text-danger">{this.state.errors["tmpltName"]}</span>
												</FormGroup>
											</Col>
										</Row>
                    <Row>
                      <Col>
												<FormGroup>
													<Label for="tmpltLayoutId">Layout</Label>
                          <Input type="select" name="tmpltLayoutId" id="tmpltLayoutId" onChange={this.handleChange.bind(this, "tmpltLayoutId")}>
                            <option>Select value</option>
                            {
                              layoutRecords.length >0 && layoutRecords.map((item, index) => {
                                return (
                                  <React.Fragment key={index}>
                                    <option value={item.lytId} selected={item.lytId === this.state.fields['tmpltLayoutId'] ? "selected" : null}>{item.lytName}</option>
                                  </React.Fragment>
                                )
                              })
                            }
                          </Input>
													<span className="error text-danger">{this.state.errors["tmpltLayoutId"]}</span>
												</FormGroup>
											</Col>
                    </Row>

                    <Row>
                      <Button type="button" className="brandButton w-100 d-block ml-auto mr-auto mb-4 mt-2" onClick={ this.addTemplateToggle }>{"Close" }</Button>
                      <Button type="button" className="brandButton w-100 d-block ml-auto mr-auto mb-4 mt-2" onClick={ templateId !== '' ? this.UpdateSubmitTemplate : this.SubmitTemplate }>{ templateId ? "Update" : "Save" }</Button>
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
												<th>#</th>
												<th>Template Name</th>
												<th>Layout Name</th>
												<th>Active</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>
										{
                      templateRecords.length > 0 ?
                      templateRecords.map((templateRecord, i) => {
                        return (
                          <tr key={"template_"+i}>
                            <td>{i+1}</td>
                            <td><a href={"/template/records/" + templateRecord.tmpltId}>{templateRecord.tmpltName}</a></td>
                            <td>{templateRecord.layoutName}</td>
                            <td><label className="gbSwitch"><input type="checkbox" id={"active_"+templateRecord.tmpltId+"_"+templateRecord.tmpltIsActive} defaultChecked={templateRecord.tmpltIsActive} /><div className="gbCustomCheckBox"></div></label></td>
                            <td>
                              <div style={{display:"inline-block"}}>
                                <i className="fa fa-edit" onClick={() => this.getTemplateRecord(templateRecord)}></i>
                                <i className="fa fa-trash ml-3" onClick={() => this.deleteTemplate(templateRecord)} ></i>
																<i className="fa fa-list ml-3" onClick={() => this.openTemplateField(templateRecord)} />
																<i className="fa fa-list-alt ml-3" alt="Form" onClick={() => this.openTemplateForm(templateRecord)} />
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
export default withRouter(Template);	
