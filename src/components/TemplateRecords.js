import React from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
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
      layoutRecords: [],
      insertfields: [],
      columnfields: [],
      fields: [],
      templateRecords: [],
      selectfields: "",
		  loading: false,
      templateId: '',
      tableName: ''
    };
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
          let insertfields = [];
          let columnfields = [];
          let selectfields = "";
          // eslint-disable-next-line
          data.data && data.data.length > 0 && data.data.map((record, index) => {
            let temp = {
              title: record.tfmFieldName
            }
            let temp1 = {
              data: record.tfmFieldName.replace(" ","_").toLowerCase()
            }
            insertfields.push(temp);
            columnfields.push(temp1);
            selectfields += record.tfmFieldName.replace(" ","_").toLowerCase() + ",";
          })
          selectfields = selectfields.substring(0, selectfields.length - 1);
          this.setState({ loading:false, templateFieldsRecords: data.data, columnfields: columnfields, insertfields: insertfields, selectfields: selectfields });
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
      tableName: fields['tmpltName'].replace(" ","_").toLowerCase(),
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
            console.log("Field Record Data", data);
            this.setState({ loading: false, templateRecords: data.data });
            this.$el = $(this.el);
            this.$el.DataTable({
              dom: 'Bfrtip',
              data: data.data,
              "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
              "columns": columnfields,
              "buttons": [
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdfHtml5'
              ]

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
            console.log("In Here Template Record", data)
            let record = data.data;
            let templateRecord = record[0];
            let fields = this.state.fields;
            fields['tmpltName'] = templateRecord.tmpltName;
            console.log("In Here Template Record", templateRecord.tmpltName)
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
    const { templateFieldsRecords, loading } = this.state;
    return (
      <div>
        <Header />
        <div className="container-fluid with-color-picker">
          <Loader fullPage loading={loading} />
					<Row className="mt-5 mb-3"></Row>
          <Row>
						<Col lg="12">
              <Card>
                <CardBody> 
                  <div>
                    <table id="example" className="display" width="100%" ref={el => this.el = el}>
                      <thead>
                        <tr>
                          {
                            templateFieldsRecords && templateFieldsRecords.length > 0 && templateFieldsRecords.map((record, index) => {
                              return (
                                <td key={"thead_"+index}>{record.tfmFieldName}</td>
                              )
                            })
                          }
                        </tr>
                      </thead>
                      <tfoot>
                        <tr>
                          {
                            templateFieldsRecords && templateFieldsRecords.length > 0 && templateFieldsRecords.map((record, index) => {
                              return (
                                <td key={"tfoot_"+index}>{record.tfmFieldName}</td>
                              )
                            })
                          }
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