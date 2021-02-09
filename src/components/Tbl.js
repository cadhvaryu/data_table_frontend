import React from 'react';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export class Tbl extends React.Component {

  componentDidMount() {
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

  render() {
    return (
      <div>
        <table className="display" width="100%" ref={el => this.el = el}>
        </table>
      </div>
    );
  }
}