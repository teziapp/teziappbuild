import React, { useEffect, useState} from 'react';
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
// import DateSimple from '..//FormElements/DateSimple';
import EmailInput from '../FormElements/EmailInput';
import PhoneInput from '../FormElements/PhoneInput';
import GstnInput from '../FormElements/GstnInput';
import PanInput from '../FormElements/PanInput';
import getDatabase from '../../database/getDB';
import dbFunc from '../../database/dbFunc';
import { COUCH_DB_MASTERS, COUCH_DB_USERS } from '../../constants';

const ownerGroupID = '000000001'; //localStorage.getItem('ownerid')

export const NewPartyForm = (input) => {
    // let clientsDB = [], groupHandles = [];
    const [companyHandles, setCompanyHandles] = useState([]);
    const [groupHandles, setGroupHandles] = useState([]);

    useEffect(() => {
    const clientsDB = getDatabase(COUCH_DB_MASTERS)
    
    console.log(clientsDB);

    clientsDB.find({
        selector: {
            type: {
                $eq: "client"
            }
        },
        fields  : ['groupHandle', 'companyHandles', 'companies']
        }).then ((db) => {
        db=db.docs;
        console.log(db);
        let companiesArray = [], groupsArray = [];
        let seen = new Set();
        outer:
        for(let i=0; i<db.length; i++){
            if(db[i].status !== "Active") continue outer ;
            groupsArray.push(db[i].groupHandle);
            
            if(db[i].companyHandles){
                for(let c=0; c<db[i].companyHandles.lengh; c++){
                    //Add only unique groupHandles to the Array
                    //using set is the fastest solution to add unique values to the array - https://medium.com/@jakubsynowiec/unique-array-values-in-javascript-7c932682766c
                    let companyValue = db[i].companyHandles[c];
                    if (db[i].companies[companyValue].status === "Active"){
                        companiesArray.push(companyValue);
                    }
                }
            }
        }

        setCompanyHandles(companiesArray);
        setGroupHandles(groupsArray);
        console.log(companyHandles, groupHandles);
    }).catch((err) => console.error(err))
}, [])

    const submit = e => {
        e.preventDefault();
        e = e.value;

        if( groupHandles.includes(e.groupHandle) || 
            companyHandles.includes(e.groupHandle)){
                alert("Group Handle needs be unique")
        } else if ( groupHandles.includes(e.companyHandle) ||
                    companyHandles.includes(e.companyHandle)) {
                        alert("Company Handle needs to be unique")
        } else {
            const newPartyDB = {
                _id             : `${ownerGroupID}_client_${e.companyHandle}_${e.companyID}`,
                type            : 'client',
                companyID       : (companyHandles.length+1).toString().padStart(9, "0"),
                ownerGroupID    : ownerGroupID,
                companyHandle   : e.companyHandle,
                companyName     : e.companyName,
                referenceBy     : e.referenceBy,
                primaryAgent    : e.companyPrimaryAgent,
                companyEmail    : e.companyEmail,
                companyPhone    : e.companyPhone,
                companyGstNumber       : e.companyGstNumber,
                companyPAN             : e.companyPAN,
                companyAddress  : [
                    {
                        address     : e.companyAddress,
                        pincode     : e.companyPincode,
                        city        : e.companyCity,
                        sinceDate   : new Date().toISOString()
                    }
                ],
                group   : {
                    groupHandle     : e.groupHandle,
                    groupName       : e.groupName,
                    groupID         : (groupHandles.length+1).toString().padStart(9, "0"),
                },
                notes           : e.notes
            }

            dbFunc(COUCH_DB_MASTERS).put(newPartyDB)
                .then(res => {
                    console.log(res);
                    alert("New Party Successfully Added")
                })
                .catch(err => console.error(err))
        }
    }

    // const change = e => {
    //     console.log('Form Change', e);
    //     console.log('State', newPartyData);
    // }
    
    return (
        <Form
            //onChange = {change} //{value => console.log('Change', value)}
            onSubmit = {submit} //console.log('Submit', event.value, event.touched)}
        >
        <Box pad="small" background="light-2" width="medium">
            <Box direction="row" alignSelf="center" >
                <Heading alignSelf="center" level={3} margin="small">
                    Add New Party
                </Heading>
            </Box>
            <Box background= "white" margin="small" pad="small">
                <FormField name="companyName" label="Company Name">
                    <TextInput required name="companyName" />
                </FormField>
                <FormField name="companyHandle" label="Company Handle / Short Name">
                    <TextInput required name="companyHandle" />
                </FormField>
                <SelectWithSearch name="companyPrimaryAgent" input={{name:"companyPrimaryAgent", label: 'Primary Agent', options:companyHandles, default:'', createNew: false}} />
                <FormField name="referenceBy" label="Reference By">
                    <TextInput name="referenceBy" />
                </FormField>
                <br />
                <EmailInput name="companyEmail" input={{name:"companyEmail"}} margin="small" />
                <br />
                <PhoneInput name="companyPhone" input={{name:"companyPhone"}} margin="small" />
                <FormField name="companyGstNumber" label="GST Number">
                    <GstnInput name="companyGstNumber" input={{name:"companyGstNumber"}} />
                </FormField>
                <FormField name="companyPAN" label="PAN">
                    <PanInput name="companyPAN" input={{name:"companyPAN"}} />
                </FormField>
                <FormField name="companyAddress" label="Address" border={{position: 'outer', side:'all'}}>
                    <TextArea name="companyAddress" />
                </FormField>
                <FormField name="companyCity" label="City">
                    <TextInput name="companyCity" />
                </FormField>
                <FormField name="companyPincode" label="Pincode">
                    <TextInput name="companyPincode" />
                </FormField>
                
            </Box>

            <Box background= "white" margin="small" pad="small">
                <FormField name="groupHandle" label="Group Handle / Short Name">
                    <TextInput name="groupHandle" />
                </FormField>
                <FormField name="groupName" label="Group Name">
                    <TextInput name="groupName" />
                </FormField>
            </Box>

            <FormField label="Notes" name="notes" border={{position: 'outer', side:'all'}} >
                <TextArea name="notes" />
            </FormField>
                
            <Box direction="row" justify="between" align="center" >
                <Button type="submit" margin="small" label="Save" primary />
            </Box>
        </Box>
        </Form>
    )
}

export default NewPartyForm