import React, { Component } from 'react';

class Header extends Component{

    //displays based on if the headerOrFooter is equal to header or footer
    headerOrFooter() {
        let html = '';
        if (this.props.headerOrFooter == "header") {
            html = <h1>moviedaze</h1>
        }
        else {
            html =<div><h3>Copyright? 2018</h3>
                    <h4>moviedaze</h4></div>
        }

        return html;
    }



    render() {
      
        return (
            <div className="header">
                {this.headerOrFooter()}
            </div>
        )
    }
}

export default Header