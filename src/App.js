import React, { Component } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import Template from './components/Template';
import TemplateRecords from './components/TemplateRecords';
import TemplateField from './components/TemplateField';
import TemplateForm from './components/TemplateForm';
import AllForm from './components/AllForm';
import SubmitForm from './components/SubmitForm';
import history from './components/history';


class App extends Component {
  render() {
    return (
     		<Router history={history}>
				<Switch>
					<Route exact path="/" component={Template} />
					<Route exact path="/forms" component={AllForm} />
					<Route exact path="/submit-form" component={SubmitForm} />
					<Route exact path="/template/field/:id" component={TemplateField} />
					<Route exact path="/template/form/:id" component={TemplateForm} />
					<Route exact path="/template/records/:id" component={TemplateRecords} />
 				</Switch>
			</Router>
    );
  }
}

export default App;
