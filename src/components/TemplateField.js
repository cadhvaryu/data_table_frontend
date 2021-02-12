import React from 'react';
import { Button, Form, FormGroup, Label, Input, Card, Modal, Table, ModalHeader, ModalBody, CardBody, Row, Col, Collapse } from 'reactstrap';
import {  withRouter } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import {checkStatus, handleError, parseJSON, jsonHeader, tokenHeader} from './util';
import { Loader } from 'react-overlay-loader';
import 'react-overlay-loader/styles.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { API }  from "./config"

// eslint-disable-next-line
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `${k}`,
    content: `${k}`,
  }));

// a little function to help us with reordering the result
// eslint-disable-next-line
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgrey' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'white' : 'white',
  padding: grid
});

class TemplateField extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			addTemplateModal: false,
			addTemplateBlockModal: false,
			fields: [],
			errors: {},
			success: {},
      getTemplateRecord: [],
      templateFieldsRecords: [],
			templateBlockRecords: [],
      layoutRecords: [],
		  barndloading: false,
		  loading: false,
		  templateId: '',
			blockId: ''
		};
		this.addTemplateToggle = this.addTemplateToggle.bind(this);
		this.addTemplateBlockToggle = this.addTemplateBlockToggle.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
	}

	addTemplateToggle(){
		let success = {};
		this.setState({ loading:false, addTemplateModal:!this.state.addTemplateModal, success, blockId: '' });
  }

	openCustomField = (blockId) => {
		let success = {};
		this.setState({ loading:false, addTemplateModal:!this.state.addTemplateModal, success, blockId: blockId });
	}

	onDragEnd(result) {

		console.log(result);

		// dropped outside the list

		/*var bannerId = result.draggableId;
		var scrollOrder = result.destination.index;
		var sourceOrder = result.source.index;*/
		//console.log(result)
		if (!result.destination) {
			return;
		}
	}

	addTemplateBlockToggle() {
		let success = {};
		this.setState({ loading:false, addTemplateBlockModal:!this.state.addTemplateBlockModal, success });
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

	getTemplateBlockRecords(templateId) {
		const url = API + 'templates/getTemplateBlock/' + templateId;

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
          this.setState({ loading:false, templateBlockRecords: data.data });
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

	SubmitBlock = async(event) => {
		event.preventDefault();
		if (this.handleBlockValidation()) {	
			const { fields, templateId, templateBlockRecords } = this.state;
			let order = 0;
			if (templateBlockRecords.length === 0) {
				order = 1;
			} else {
				order = templateBlockRecords.length + 1;
			}
			this.setState({ loading:true });
			let jsonObject = JSON.stringify({
        tbmTemplateId: templateId,
        tbmBlockName: fields['tbmBlockName'],
        tbmOrder: order
      });


			const url = API + 'templates/addTemplateBlock';
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
			        fields['tbmBlockName'] = '';
              fields['tbmOrder'] = '';
					    let success = {};
			        success["successMessage"] = data.message;
					    this.setState({ loading:false, fields : fields, addTemplateBlockModal:!this.state.addTemplateBlockModal, success });

					    window.setTimeout(() => {
		              this.setState({ success: '' });
		          }, 5000);
		          this.getTemplateBlockRecords(templateId);
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
	}

	SubmitTemplate = async(event) => {
		event.preventDefault();
		if (this.handleValidation()) {	
      const { fields, templateId, blockId } = this.state;
      let mandatory = false;
      let active = true;
      if (fields['tfmFieldRequired']) {
        mandatory = fields['tfmFieldRequired']
      }
      if (fields['tfmFieldIsActive']) {
        active = fields['tfmFieldIsActive']
      }

			let dropDownValue = "";
			if (fields["tfmFieldValue"]) {
				let concatFieldValue = fields['tfmFieldValue'].split("\n");
				for(let i=0;i<concatFieldValue.length;i++) {
					dropDownValue += concatFieldValue[i] + ","
				}
				dropDownValue = dropDownValue.substring(0, dropDownValue.length - 1);
			}

			this.setState({ loading:true });
      let jsonObject = JSON.stringify({
        tfmTemplateId: templateId,
				tfmBlockId: blockId,
        tfmField: fields['tfmField'],
        tfmFieldName: fields['tfmFieldName'],
        tmpltName: fields['tmpltName'].replace(" ","_").toLowerCase(),
				tfmFieldValue: dropDownValue,
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
							fields['tfmFieldValue'] = '';
              fields['tfmFieldLength'] = '';
              fields['tfmFieldRequired'] = '';
              fields['tfmFieldIsActive'] = '';
					    let success = {};
			        success["successMessage"] = data.message;
					    this.setState({ loading:false, fields : fields, addTemplateModal:!this.state.addTemplateModal, success });

					    window.setTimeout(() => {
		              this.setState({ success: '' });
		          }, 5000);
		          this.getTemplateBlockRecords(templateId);
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

	handleBlockValidation() {
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;

		if (!fields["tbmBlockName"]) {
			formIsValid = false;
			errors["tbmBlockName"] = "Please enter block name.";
		} else {
      errors["tbmBlockName"] = "";
    }

		this.setState({ errors: errors });
		return formIsValid;
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
    //this.getTemplateFieldsRecords(this.props.match.params.id);
		this.getTemplateBlockRecords(this.props.match.params.id);
	}
	

	render() {
    const { addTemplateModal, loading, fields, templateBlockRecords, addTemplateBlockModal } = this.state;
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
							<Button type="button" onClick={this.addTemplateBlockToggle}  className="lgnButton">Add Custom Field</Button>
							<Modal isOpen={addTemplateBlockModal} toggle={this.addTemplateBlockToggle} className="brandModal modal-dialog-centered w-600" keyboard={false} backdrop="static">
								<ModalHeader toggle={this.addBrandToggle}>{ "Add Custom Block" }</ModalHeader>
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
													<Label for="tbmBlockName">Block Name <span className="error">*</span></Label>
													<Input type="text" name="tbmBlockName" id="tbmBlockName" placeholder="Enter Block Name" ref="tbmBlockName" onChange={this.handleChange.bind(this, "tbmBlockName")} value={this.state.fields["tbmBlockName"]} />
													<span className="error text-danger">{this.state.errors["tbmBlockName"]}</span>
												</FormGroup>
											</Col>
										</Row>

										{/*
										<Row>
                      <Col>
												<FormGroup>
													<Label for="tbmOrder">Block Position </Label>
                          <Input type="select" name="tbmOrder" id="tbmOrder" onChange={this.handleChange.bind(this, "tbmOrder")}>
                            <option>Select value</option>
                            {
															templateBlockRecords && templateBlockRecords.map((item, index) => {
																return (
																	<React.Fragment key={index}>
																		<option value={item.tbmId}>{"After " + item.tbmBlockName}</option>
																	</React.Fragment>
																)
															})
														}
                          </Input>
												</FormGroup>
											</Col>
										</Row>*/}

										<Row>
                      <Button type="button" className="brandButton w-100 d-block ml-auto mr-auto mb-4 mt-2" onClick={ this.addTemplateBlockToggle }>{"Close" }</Button>
                      <Button type="button" className="brandButton w-100 d-block ml-auto mr-auto mb-4 mt-2" onClick={ this.SubmitBlock }>{ "Save" }</Button>
                    </Row>
									</Form>
								</ModalBody>
							</Modal>
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

										{
											(fields['tfmField'] === 'dropdown' || fields['tfmField'] === 'multiselect') ? (
												<Row>
													<Col>
														<FormGroup>
															<Label for="tfmFieldValue">Field Value <span className="error">*</span></Label>
															<Input type="textarea" style={{height: "150px"}} cols={20} name="tfmFieldValue" id="tfmFieldValue" placeholder="Enter Field Name" ref="tfmFieldValue" onChange={this.handleChange.bind(this, "tfmFieldValue")} value={this.state.fields["tfmFieldValue"]} />
															<span className="error text-danger">{this.state.errors["tfmFieldValue"]}</span>
														</FormGroup>
													</Col>
												</Row>
											) : null}

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

							{
								templateBlockRecords && templateBlockRecords.length > 0 && templateBlockRecords.map((item, index) => {
									return(
										<React.Fragment key={index}>
											<Collapse isOpen={true}>
												<Card body>
													<CardBody>
														<Row className="mt-1 mb-3">
															<Col className="d-flex align-items-center">
																<h4 className="m-0">{item.tbmBlockName}</h4>
															</Col>
															<Col className="text-right">
																<div style={{display:"inline-block"}}>
																	<i className="fa fa-plus fa-lg" onClick={() => this.openCustomField(item.tbmId)} aria-hidden="true" title="Add Custom Field" />
																	<i className="fa fa-edit fa-lg ml-3" aria-hidden="true" title="Edit Custom Block"></i>
																	<i className="fa fa-trash fa-lg ml-3" aria-hidden="true" title="Delete Custom Block"></i>
																</div>
															</Col>
														</Row>
														
													
																			
														<Card>
															<CardBody>
																<Table responsive>
																	<DragDropContext onDragEnd={this.onDragEnd}>
																		<Droppable droppableId="droppable">
																			{(provided, snapshot) => (
																				<tbody ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
																					{
																						(item.templateFieldRecords && item.templateFieldRecords.length > 0) ?
																							item.templateFieldRecords.map((field, i) => {
																								return (

																									<Draggable key={i} draggableId={field.tfmId} index={i + 1}>
																										{(provided, snapshot) => (

																										<tr key={"channel_"+i} ref={provided.innerRef}
																																{...provided.draggableProps}
																																{...provided.dragHandleProps}
																																style={getItemStyle(
																																	snapshot.isDragging,
																																	provided.draggableProps.style
																															)}>
																											<td>{field.tfmFieldName} {field.tfmFieldRequired === 1 ? <span className="error">*</span> : null}</td>
																										</tr>

																									)}
																									</Draggable>
																								) 
																							}) :
																							<tr>
																								<td colSpan="5" className="text-center">No Record Found</td>
																							</tr>
																					}
																				</tbody>
																			)}
																		</Droppable>
																	</DragDropContext>
																</Table>
															</CardBody>
														</Card>

													
													</CardBody>
												</Card>
											</Collapse>
										</React.Fragment>
									)
								})
							}
							{/*
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
							</Card> */}
						</Col>
					</Row>
				</div>
				<Footer />
			</div>
		);
	}
}
export default withRouter(TemplateField);	
