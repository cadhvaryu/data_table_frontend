import React, {Component} from 'react';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export class Tbl extends Component {

  componentDidMount() {
    console.log("In Component Did Mount Table Class",this.props.data);
    this.$el = $(this.el);
    this.$el.DataTable({
      data: this.props.data,
      columns: [
        { title: "Name"},
        { title: "Email"},
        { title: "Age"},
        { title: "Class"}
      ]
    })
  }

  componentWillUnmount() {
    this.$el.DataTable.destroy(true);
  }

  render() {
    return (
      <div>
        <table className="display" width="100%" ref={el => this.el = el}>
        </table>
      </div>
      );
  }
}