import React, {useEffect, useState} from 'react';
import {
    Box, 
    Button, 
    Form, 
    FormField,
    Heading,
    Text,
    TextArea,
    TextInput
} from 'grommet';
// import { NumberInput } from 'grommet-controls';

import SelectWithSearch from '../FormElements/SelectWithSearch';
import DateSimple from '../FormElements/DateSimple';
import getDatabase from '../../database/getDB'
import {COUCH_DB_MASTERS, COUCH_DB_ORDERS} from '../../constants'
import { PdfDocument } from './OrderBuyerPDF';

const ownerGroupID = '000000002'; //should be imported from auth.

// const indexedDB = getDatabase('CLIENTS').createIndex({
//     index: {
//         fields: indexFields
//     }
// }). then(() => db.find({
//     selector: {
//         ownerGroupID:  ownerGroupID
//     }
// }))

export const NewOrderForm = ({ onClose }) => {

    let clientsDB=[], totalOrders = 0;
    
    const [newOrderData, setNewOrderData] = useState({
        ownerGroupID            : ownerGroupID,
        createdDate             : (new Date().toISOString()),
        orderNumber             : (totalOrders+1).toString().padStart(5, "0"),
        orderDate               : (new Date().toISOString()),
        employeeAccountHandle   : ['First', 'Second', 'Third', 'Thousand'],
        sellerCompanyHandle     : "",
        sellerCompanyName       : "",
        sellerGSTN              : "",
        sellerSubAgentHandle    : "",
        buyerCompanyHandle      : "",
        buyerCompanyName        : "",
        buyerGSTN               : "",
        buyerSubAgentHandle     : "",
        qualityName             : "",
        sortNumber              : "",
        orderQty                : "",
        orderUOM                : ['MTR', 'PCS', 'KGS', 'DOZ'],
        priceCurrency           : ['Rs.', 'USD', 'Euro', 'AUD'],
        priceAmt                : "",
        priceUOM                : ['MTR', 'PCS', 'KGS', 'DOZ'],
        packingMethod           : "",
        deliveryTimeUnit        : ['Days', 'Weeks', 'Ready'],
        deliveryTimeQty         : "",
        transportNameHandle     : "",
        deliveryAt              : "",
        paymentTermsUnit        : ['Days', 'Weeks', 'Advance', 'Against LR'],
        paymentTermsQty         : "",
        notes                   : "",
        tnc                     : "",
        companyHandles          : ['First', 'Second', 'Third'],
        groupHandles            : ['First', 'Second', 'Third'],
        allHandles              : ['First', 'Second', 'Third']
    })

    useEffect(() => {
        const clientsDB = getDatabase(COUCH_DB_MASTERS)
    
        console.log(clientsDB);

        clientsDB.find({
            selector: {
                type: {
                    $eq: "client"
                }
            },
            fields  : ['groupHandle', 'companiesList', 'status', 'companies']
            }).then ((db) => {
            db=db.docs;
            console.log(db);
            let companiesArray = [], groupsArray = [];

            outer:
            for(let i=0; i<db.length; i++){
                console.log(db[i].status);
                if(db[i].status !== "Active") continue outer ;
                groupsArray.push(db[i].groupHandle);
                console.log({groupsArray});
                if(db[i].companiesList){
                    for(let c=0; c<db[i].companiesList.length; c++){
                        //Add only unique groupHandles to the Array
                        //using set is the fastest solution to add unique values to the array - https://medium.com/@jakubsynowiec/unique-array-values-in-javascript-7c932682766c
                        let companyValue = db[i].companiesList[c];
                        console.log({companyValue}, db[i].companies);
                        if (db[i].companies[companyValue].status === "Active"){
                            companiesArray.push(companyValue);
                            console.log({groupsArray, companiesArray});
                        }
                    }
                }
            }
    
            setNewOrderData({
                ...newOrderData, 
                companyHandles  : companiesArray,
                groupHandles    : groupsArray,
                allHandles      : [...groupsArray, ...companiesArray]
            })
            console.log({newOrderData});
        }).catch((err) => console.error(err))

    getDatabase(COUCH_DB_ORDERS).info()
        .then(info => {
            totalOrders = info.doc_count;
        })
    
    console.log({clientsDB, newOrderData, totalOrders});
    }, [])

    const submit = e => {
        e.preventDefault();
        console.log(e.value);
        ReactPDF.render(<PdfDocument />, `${__dirname}/example.pdf`);
        // getDatabase('CLIENTS').put({
        //     _id: "1",
        //     ownerGroupID: 2,
        //     ...e.value
        // })
    }

    const change = e => {
        console.log({e});
        if(e.sellerCompanyHandle !== newOrderData.sellerCompanyHandle){
            console.log(e);
            getDatabase(COUCH_DB_MASTERS).find({
                selector: {
                    companyHandle: {
                        $eq: e.sellerCompanyHandle
                    }
                }        
            }). then(db => {
                console.log(db);
                let sellerDB = db.docs;
                console.log(sellerDB);
                setNewOrderData({...newOrderData, 
                    sellerCompanyHandle : e.sellerCompanyHandle,
                    sellerCompanyName   : sellerDB.companyName ?? "",
                    sellerGSTN          : sellerDB.companyGSTN ?? "",
                    sellerSubAgentHandle: sellerDB.primaryAgent ?? ""
                })
                console.log(newOrderData);
            })
           
        }
    }

    return (
        <Form
            onChange = {change} //onChange = {value => console.log('Change', value)}
            onSubmit = {submit} //{event => console.log('Submit', event.value, event.touched)}
        >
        <Box pad="small" background="light-2" width="medium">
            <Box direction="row" justify="between" align="center" alignSelf="center">
                <Heading align="center" level={3} margin="small">
                    Order Form - Buyer Version
                </Heading>
            </Box>

            <Box direction="row" justify="between" background= "white" margin="small">
                <FormField name="orderNumber" label="Order Number">
                    <TextInput name="orderNumber" value={newOrderData.orderNumber} onChange={e => setNewOrderData({...newOrderData, orderNumber: e.target.value})}/>
                </FormField>
                <DateSimple name="orderDate" input={{name:'orderDate', orderDate: newOrderData.orderDate}} onChange={e => setNewOrderData({...newOrderData, orderDate: e.target.value})} />
            </Box>

            {/* Take Employee names from db */}
            <Box background= "white" margin="small" pad="small">
                <SelectWithSearch name="employeeAccountHandle" input={{name:"employeeAccountHandle", label: 'Employee Account Handle', options:newOrderData.employeeAccountHandle, default:newOrderData.employeeAccountHandle[0], createNew: false}} />
            </Box>
            
            

            <Box background= "white" margin="small" pad="small">
                {/* Take Seller names from db 
                    First show Sellers followed by Buyers & Agents */}
                    <SelectWithSearch name="sellerCompanyHandle" input={{name:"sellerCompanyHandle", label: 'Seller Company Handle', options:newOrderData.allHandles, default:""}} /> {/* Default has to be seller-handle of the selected order number. */}
                    {/* Update GSTN & Seller Name based on the seller selected */}
                    <Text name="sellerCompanyName" id="sellerCompanyName">{newOrderData.sellerCompanyName}</Text>
                    <Text name="sellerGSTN" id="sellerGSTN">GSTN: {newOrderData.sellerGSTN}</Text>
            
                {/* Take Agent names from db 
                    First show Agents followed by Buyers & Sellers */}
                <SelectWithSearch name="sellerSubAgentHandle" input={{name:"sellerSubAgentHandle", label: 'Seller Sub-Agent Handle', options:newOrderData.allHandles, default:''}} /> {/* Default has to be primary-agent-handle of the seller. */}
            </Box>

            <Box background= "white" margin="small" pad="small">
                {/* Take Buyer names from db 
                    First show Buyers followed by Sellers & Agents */}
                <SelectWithSearch name = "buyeCompanyHandle" input={{name:"buyerCompanyHandle", label: 'Buyer Company Handle', options:newOrderData.allHandles, default:""}} /> {/* Default has to be buyer-handle of the selected order number. */}
                {/* Update GSTN based on the seller selected */}
                <Text name="buyerGSTN" id="buyerGSTN">GSTN: {newOrderData.buyerGSTN}</Text>

                {/* Take Agent names from db 
                    First show Agents followed by Buyers & Sellers */}
                <SelectWithSearch name="buyerAgentHandle" input={{name:"buyerAgentHandle", label: 'Buyer Sub-Agent Handle', options:newOrderData.allHandles, default:''}} /> {/* Default has to be primary-agent-handle of the seller. */}
            </Box>

            <Box background= "white" margin="small" pad="small">
                <Text align="center">Order Details - Buyer Version</Text>
                <FormField name="qualityName" label="Quality Name">
                    <TextInput name="qualityName" value={newOrderData.qualityName} onChange={e => setNewOrderData({...newOrderData, qualityName: e.target.value})}/>
                </FormField>
                <br/>
                <FormField name="sortNumber" direction="row" label="Sort No.">
                    <TextInput name="sortNumber" value={newOrderData.sortNumber} onChange={e => setNewOrderData({...newOrderData, sortNumber: e.target.value})}/>
                </FormField>
                <br />
                <Box direction="row" justify="between" align="center" >
                    <FormField name="orderQty" label="Order Quantity">
                        <TextInput name="orderQty" value={newOrderData.orderQty} onChange={e => setNewOrderData({...newOrderData, orderQty: e.target.value})}/>
                    </FormField>
                    <SelectWithSearch align="bottom" width="small" name="orderUOM" input={{ name:"orderUOM", label:'', options:newOrderData.orderUOM, default:"", createNew: true}} /> {/* Default has to be based on order number. */}
                </Box>
                <br />
                <Box direction="row" justify="between" align="center" >
                    <SelectWithSearch name="priceCurrency" input={{ name: "priceCurrency",label:"Rate", options:newOrderData.priceCurrency, default:"", createNew: true}} />
                    <TextInput name="priceAmt" value={newOrderData.priceAmt} onChange={e => setNewOrderData({...newOrderData, priceAmt: e.target.value})}/>
                    <Text>per</Text>
                    <SelectWithSearch name="priceUOM" input={{ name: "priceUOM", label:"", options:newOrderData.priceUOM, default:"", createNew: true}} />
                </Box>
                <br />
                <FormField name="packingMethod" direction="row" label="Packing Method">
                    <TextInput name="packingMethod" placeholder="Rolls / Than" value={newOrderData.packingMethod} onChange={e => setNewOrderData({...newOrderData, packingMethod: e.target.value})}/>
                </FormField>
                <Box direction="row" justify="between" align="center" >
                    <SelectWithSearch width="small" name="deliveryTimeUnit" input={{ name:'deliveryTimeUnit', label: 'Delivery Time', options:newOrderData.deliveryTimeUnit, default:'', createNew:true}} />
                    <TextInput name="deliveryTimeQty" value={newOrderData.deliveryTimeQty} onChange={e => setNewOrderData({...newOrderData, deliveryTimeQty: e.target.value})}/>
                </Box>
            </Box>
            <Box background= "white" margin="small" pad="small">
                <SelectWithSearch name="transportNameHandle" input={{name:'transportNameHandle', label: 'Transport Name', options:newOrderData.companyHandles, default:'Second', createNew: true}} />
                <SelectWithSearch name="deliveryAt" input={{name:'deliveryAt', label: 'Delivery At', options:newOrderData.companyHandles, default:'', createNew: true}} />
            </Box>
            <Box background= "white" margin="small" pad="small">
                <Box direction="row" justify="between" align="center" >
                    <SelectWithSearch name="paymentTermsUnit" input={{ name:'paymentTermsUnit', label:"Payment Terms", options:newOrderData.paymentTermsUnit, default:'', createNew: true}} />
                    <TextInput name='paymentTermsQty' value={newOrderData.paymentTermsQty} onChange={e => setNewOrderData({...newOrderData, paymentTermsQty: e.target.value})}/>
                </Box>
                <FormField name="notes" label="Notes" border={{position: 'outer', side:'all'}}>
                    <TextArea name="notes" value={newOrderData.notes} onChange={e => setNewOrderData({...newOrderData, notes: e.target.value})}/>
                </FormField>
                <FormField name="tnc" label="T&C" border={{position: 'outer', side:'all'}}>
                    <TextArea name="tnc" value={newOrderData.tnc} onChange={e => setNewOrderData({...newOrderData, tnc: e.target.value})}/>
                </FormField>
            </Box>
            <Box direction="row" justify="between" align="center" >
                {/* <PDFDownloadLink
                        document={<PdfDocument/>}
                        fileName="movielist.pdf"
                        style={{
                        textDecoration: "none",
                        padding: "10px",
                        color: "#4a4a4a",
                        backgroundColor: "#f2f2f2",
                        border: "1px solid #4a4a4a"
                        }}
                > Button
                     {({ blob, url, loading, error }) =>
                    loading ? "Loading document..." : "Download Pdf"
                    } 
                </PDFDownloadLink> */}
                <Button type="submit" margin="small" label="Save & Export PDF" primary />
                {/* <Button type="submit" margin="small" label="Update Seller Version" primary /> */}
            </Box>
        </Box>
        </Form>
    )
}

export default NewOrderForm