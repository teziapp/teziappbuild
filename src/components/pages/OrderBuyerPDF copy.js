import React, { PureComponent } from 'react';
import jsPDF from 'jspdf';
import {Box, Button} from 'grommet';
import getDatabase from '../../database/getDB';
import { COUCH_DB_ORDERS } from '../../constants'

export default class OrderBuyerPDF extends PureComponent {
    constructor(props){
        super(props);
        console.log(this.props);
        this.state = {};
    }

    componentDidMount(){
        const ordersDB = getDatabase(COUCH_DB_ORDERS);

        console.log(ordersDB);

        ordersDB.find({
            selector: {
                orderNumber : {
                    $eq: this.props.orderNumber
                }
            }
        }).then((db) => {
            console.log(db.docs);
            if(db.docs.length > 1){
                console.log("if logging in")
                alert("Request Error");
            } else {
                this.setState(db.docs[0]);
                console.log(this.state);
            }
        })
    }
    generatePDF = () => {
        const element = document.getElementById('printingElement') 
        // html2pdf(element);
        // let doc = new jsPDF('p', 'pt');
        let doc = new jsPDF();
        doc.html(element,{
            callback: function(doc) {
            doc.save()
            },
            x: 10,
            y:10
        })
        // doc.text(20,20,'This is default text');
        // doc.setFont('Roboto');
        // doc.text(20,30, 'This is text with Roboto Font & Bold');
     
        // doc.save("generated.pdf");
    }

    render () {
        if(this.state.orderNumber === this.props.orderNumber){
            return(
                <Box align="center">
                    <Box id="printingElement" align="center">
                        <Box id="header" align = "center" alignSelf="center">
                            <Box>{this.state.ownerGroupName}</Box>
                            <Box alignSelf="center" align="center">{this.state.ownerGroupAddress.address}</Box>
                            <Box>{this.state.ownerGroupAddress.city} - {this.state.ownerGroupAddress.pincode}</Box>
                            <Box>{this.state.ownerGroupEmail} Ph: {this.state.ownerGroupPhoneNumber}</Box>
                        </Box>
                    </Box>
                    <Button alignSelf="center" onClick={this.generatePDF} pad="small" primary> Generate PDF </Button> 
                </Box>
            )
        } else {
            return(
                <Box>Loading...</Box>
            )
        }
    }
}