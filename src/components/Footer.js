import React from 'react';
import moment from 'moment';

class Footer extends React.Component {
  
  render() {
    return (
      <footer className="text-center pt-5 pb-3">
        Copyright {moment().format("YYYY")} Template Application.
      </footer>
    );
  }
}
export default Footer;
