import React from 'react';
import { Button, Form, FormGroup, Label, Input, Card, CardBody, Row, Col } from 'reactstrap';
import {  withRouter } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import {checkStatus, handleError, parseJSON, jsonHeader, tokenHeader} from './util';
import { Loader } from 'react-overlay-loader';
import 'react-overlay-loader/styles.css';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { API }  from "./config"

class TemplateForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			addTemplateModal: false,
			fields: [],
			errors: {},
			success: {},
      getTemplateRecord: [],
      checkinSubmitDate: moment(new Date()).format('MM/DD/YYYY'),
      templateFieldsRecords: [],
      layoutRecords: [],
      barndloading: false,
      insertfields: "",
		  loading: false,
      templateId: '',
      minDate: new Date(),
      checkindate: ''
    };
    this.dateCheckInChanged = this.dateCheckInChanged.bind(this);
    this.setMultipleValue = this.setMultipleValue.bind(this);
  }

  setMultipleValue(field, event) {
    let fields = this.state.fields;
    if (fields[field] === undefined) {
      if (event.target.checked) {
        let value = [];
        value.push(event.target.value);
        fields[field] = value;
      }
    } else {
      if (event.target.checked) {
        let value = fields[field];
        value.push(event.target.value);
        fields[field] = value;
      } else {
        let value = fields[field];
        value = value.filter((item) => item !== event.target.value);
        fields[field] = value;
      }
    }
    this.setState({ fields: fields });

  }

  dateCheckInChanged(date, field) {
    let fields = this.state.fields;
    fields[field] = moment(date).format('MM/DD/YYYY');
    this.setState({
      checkindate: date,
      minDate: date,
      checkinSubmitDate: moment(date).format('MM/DD/YYYY'),
      fields: fields
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
          let insertfields = "";
          // eslint-disable-next-line
          data.data && data.data.length > 0 && data.data.map((record, index) => {
            insertfields += record.tfmFieldName.replace(" ","_").toLowerCase() + ",";
          })
          insertfields = insertfields.substring(0, insertfields.length - 1);
          this.setState({ loading:false, templateFieldsRecords: data.data, insertfields: insertfields });
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

	SubmitTemplate = async(event) => {
    event.preventDefault();
		if (this.handleValidation()) {	
      const { fields, templateFieldsRecords, insertfields } = this.state;
      this.setState({ loading:true });
      let values = [];
      // eslint-disable-next-line
      templateFieldsRecords && templateFieldsRecords.length > 0 && templateFieldsRecords.map((record, index) => {
        if(record.tfmField === "integer") {
          // eslint-disable-next-line
          values.push(parseInt(fields[record.tfmFieldName.replace(" ","_").toLowerCase()]));
        } else {
          if (record.tfmField === "multiselect") {
            values.push(fields[record.tfmFieldName.replace(" ","_").toLowerCase()].toString());
          } else {
            values.push(fields[record.tfmFieldName.replace(" ","_").toLowerCase()]);
          }
        }
        
        fields[record.tfmFieldName.replace(" ","_").toLowerCase()] = '';
      })

      let jsonObject = JSON.stringify({
        tableName: fields['tmpltName'].replace(" ","_").toLowerCase(),
        fields: insertfields,
        values: values
      });   
      const url = API + 'templates/saveTemplateForm';
      const headers = new Headers({
        ...jsonHeader
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
					    let success = {};
			        success["successMessage"] = data.message;
					    this.setState({ loading:false, checkindate: '', success });

					    window.setTimeout(() => {
                window.location.reload(); 
		            this.setState({ success: '', fields:[] });
		          }, 2000);
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
    const { fields, templateFieldsRecords } = this.state;
		let errors = {};
		let formIsValid = true;
    //const re = /^[0-9\b]+$/;
    // eslint-disable-next-line
    templateFieldsRecords && templateFieldsRecords.length > 0 && templateFieldsRecords.map((record, index) => {
      if (record.tfmFieldRequired === 1) {
        if (!fields[record.tfmFieldName.replace(" ","_").toLowerCase()]) {
          console.log("In If Condition", index)
          formIsValid = false;
          errors[record.tfmFieldName.replace(" ","_").toLowerCase()] = "Please enter valid value.";
        } else {
          errors[record.tfmFieldName.replace(" ","_").toLowerCase()] = "";
        }
      }
    })
		
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
            fields['tmpltName'] = templateRecord.tmpltName;
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
	
	componentDidMount() {
    this.setState({ loading:true, templateId:this.props.match.params.id });
    this.getTemplateRecord(this.props.match.params.id);
    this.getTemplateFieldsRecords(this.props.match.params.id);
	}
	

	render() {
    const {  loading, fields, templateFieldsRecords } = this.state;
		return (
			<div>
				<Header />
				<div className="container-fluid with-color-picker">
					<Loader fullPage loading={loading} />
					<Row className="mt-5 mb-3">
						<Col className="d-flex align-items-center">
							<h4 className="m-0">{fields['tmpltName']}</h4>
						</Col>
					</Row>
					<Row>
						<Col lg="12">
							<p className="error text-success text-center">{this.state.success["successMessage"]}</p>
							<p className="error text-danger text-center">{this.state.success["errorMessage"]}</p>
							<Card>
								<CardBody>
									<Form>
                    {
                      templateFieldsRecords && templateFieldsRecords.length > 0 &&
                      templateFieldsRecords.map((record, index) => {
                        return (
                          <React.Fragment key={index}>
                            <Row>
                              <Col>
                                <FormGroup>
                                  {
                                    record.tfmField !== "checkbox" && (
                                      <Label for="tfmFieldName">{record.tfmFieldName}  {record.tfmFieldRequired && (<span className="error">*</span>)}</Label>
                                    )
                                  }
                                  
                                  {
                                    record.tfmField === "text" && (
                                      <React.Fragment>
                                        <Input type="text" name={record.tfmFieldName.replace(" ","_").toLowerCase()} id={record.tfmFieldName.replace(" ","_").toLowerCase()} ref={record.tfmFieldName.replace(" ","_").toLowerCase()} onChange={this.handleChange.bind(this, record.tfmFieldName.replace(" ","_").toLowerCase())} value={this.state.fields[record.tfmFieldName.replace(" ","_").toLowerCase()]}
                                        max={record.tfmFieldLength}  />    
                                      </React.Fragment>
                                    )
                                  }
                                  {
                                    record.tfmField === "phone" && (
                                      <React.Fragment>
                                        <Input type="number" name={record.tfmFieldName.replace(" ","_").toLowerCase()} id={record.tfmFieldName.replace(" ","_").toLowerCase()} ref={record.tfmFieldName.replace(" ","_").toLowerCase()} onChange={this.handleChange.bind(this, record.tfmFieldName.replace(" ","_").toLowerCase())} value={this.state.fields[record.tfmFieldName.replace(" ","_").toLowerCase()]}
                                        max={record.tfmFieldLength}  />    
                                      </React.Fragment>
                                    )
                                  }
                                  {
                                    record.tfmField === "email" && (
                                      <React.Fragment>
                                        <Input type="email" name={record.tfmFieldName.replace(" ","_").toLowerCase()} id={record.tfmFieldName.replace(" ","_").toLowerCase()} ref={record.tfmFieldName.replace(" ","_").toLowerCase()} onChange={this.handleChange.bind(this, record.tfmFieldName.replace(" ","_").toLowerCase())} value={this.state.fields[record.tfmFieldName.replace(" ","_").toLowerCase()]}
                                        max={record.tfmFieldLength}  />    
                                      </React.Fragment>
                                    )
                                  }

                                  {
                                    record.tfmField === "url" && (
                                      <React.Fragment>
                                        <Input type="url" name={record.tfmFieldName.replace(" ","_").toLowerCase()} id={record.tfmFieldName.replace(" ","_").toLowerCase()} ref={record.tfmFieldName.replace(" ","_").toLowerCase()} onChange={this.handleChange.bind(this, record.tfmFieldName.replace(" ","_").toLowerCase())} value={this.state.fields[record.tfmFieldName.replace(" ","_").toLowerCase()]}
                                        max={record.tfmFieldLength}  />    
                                      </React.Fragment>
                                    )
                                  }

                                  {
                                    record.tfmField === "textbox" && (
                                      <React.Fragment>
                                        <Input type="textarea" name={record.tfmFieldName.replace(" ","_").toLowerCase()} id={record.tfmFieldName.replace(" ","_").toLowerCase()} ref={record.tfmFieldName.replace(" ","_").toLowerCase()} onChange={this.handleChange.bind(this, record.tfmFieldName.replace(" ","_").toLowerCase())} value={this.state.fields[record.tfmFieldName.replace(" ","_").toLowerCase()]}
                                        max={record.tfmFieldLength}  />    
                                      </React.Fragment>
                                    )
                                  }

                                  {
                                    record.tfmField === "integer" && (
                                      <React.Fragment>
                                        <Input type="number" name={record.tfmFieldName.replace(" ","_").toLowerCase()} id={record.tfmFieldName.replace(" ","_").toLowerCase()} ref={record.tfmFieldName.replace(" ","_").toLowerCase()} onChange={this.handleChange.bind(this, record.tfmFieldName.replace(" ","_").toLowerCase())} value={this.state.fields[record.tfmFieldName.replace(" ","_").toLowerCase()]}
                                        max={record.tfmFieldLength}  />    
                                      </React.Fragment>
                                    )
                                  }

                                  {
                                    record.tfmField === "dropdown" && (
                                      <React.Fragment>
                                        <Input type="select"  name={record.tfmFieldName.replace(" ","_").toLowerCase()} id={record.tfmFieldName.replace(" ","_").toLowerCase()} ref={record.tfmFieldName.replace(" ","_").toLowerCase()} onChange={this.handleChange.bind(this, record.tfmFieldName.replace(" ","_").toLowerCase())} >    
                                          <option value="">Select value</option>
                                          {
                                            record.tfmFieldValue && record.tfmFieldValue.split(",").map((item, index) => {
                                              return(
                                                <React.Fragment key={index}>
                                                  <option value={item}>{item}</option>
                                                </React.Fragment>
                                              )
                                            })
                                          }
                                        </Input>
                                      </React.Fragment>
                                    )
                                  }
                                  {
                                    record.tfmField === "multiselect" && (
                                      <React.Fragment>
                                        {
                                          record.tfmFieldValue && record.tfmFieldValue.split(",").map((item, index) => {
                                            return(
                                              <React.Fragment key={index}>
                                                <FormGroup check inline>
                                                  <Label check>
                                                    <Input type="checkbox" onChange={this.setMultipleValue.bind(this, record.tfmFieldName.replace(" ","_").toLowerCase())} value={item} /> {item}
                                                  </Label>
                                                </FormGroup>
                                              </React.Fragment>
                                            )
                                          })
                                        }
                                      </React.Fragment>
                                    )
                                  }

                                  {
                                    record.tfmField === "radio" && (
                                      <React.Fragment>
                                        {
                                          record.tfmFieldValue && record.tfmFieldValue.split(",").map((item, index) => {
                                            return(
                                              <React.Fragment key={index}>
                                                <FormGroup check inline>
                                                  <Label check>
                                                    <Input type="radio" onChange={this.handleChange.bind(this, record.tfmFieldName.replace(" ","_").toLowerCase())} value={item} /> {item}
                                                  </Label>
                                                </FormGroup>
                                              </React.Fragment>
                                            )
                                          })
                                        }
                                      </React.Fragment>
                                    )
                                  }

                                  {
                                    record.tfmField === "checkbox" && (
                                      <React.Fragment>
                                        <FormGroup row>
                                          <Label style={{marginLeft: "15px", marginRight: "35px"}} for="tfmFieldRequired">{record.tfmFieldName}  {record.tfmFieldRequired && (<span className="error">*</span>)}</Label>
                                          <Label style={{marginTop: "-5px"}} check>
                                            <Input type="checkbox" name={record.tfmFieldName.replace(" ","_").toLowerCase()} id={record.tfmFieldName.replace(" ","_").toLowerCase()} onChange={(e) => this.checkBoxMandatoryChecked(e, record.tfmFieldName.replace(" ","_").toLowerCase())}  />
                                          </Label>
                                        </FormGroup>
                                      </React.Fragment>
                                    )
                                  }
                                  
                                  {
                                    record.tfmField === "date" && (
                                      <React.Fragment>
                                        <React.Fragment>
                                          <Input type="date" name={record.tfmFieldName.replace(" ","_").toLowerCase()} id={record.tfmFieldName.replace(" ","_").toLowerCase()} ref={record.tfmFieldName.replace(" ","_").toLowerCase()} onChange={this.handleChange.bind(this, record.tfmFieldName.replace(" ","_").toLowerCase())} value={this.state.fields[record.tfmFieldName.replace(" ","_").toLowerCase()]}  />    
                                        </React.Fragment>
                                      </React.Fragment>
                                    )
                                  }
                                  <span className="error text-danger">{this.state.errors[record.tfmFieldName.replace(" ","_").toLowerCase()]}</span>
                                </FormGroup>
                              </Col>
                            </Row>
                          </React.Fragment>
                        )
                      })
                    }

                    <Row>
                      <Button type="button" className="brandButton w-100 d-block ml-auto mr-auto mb-4 mt-2" onClick={ this.SubmitTemplate }>{ "Submit Form" }</Button>
                    </Row>
                  </Form>
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
export default withRouter(TemplateForm);	
