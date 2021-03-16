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
// import DateSimple from '../../FormElements/DateSimple';
import EmailInput from '../FormElements/EmailInput';
import PhoneInput from '../FormElements/PhoneInput';
import GstnInput from '../FormElements/GstnInput';
import PanInput from '../FormElements/PanInput';
import getDatabase from '../../database/getDB';
import {COUCH_DB_MASTERS} from '../../constants'

export const UserEditForm = () => {

    const [userValues, setUserValues] = useState({});
    console.log(userValues);

    useEffect(() => {
        const userDB = getDatabase(COUCH_DB_MASTERS);

        console.log(userDB);

        userDB.find({
            selector: {
                type: {
                    $eq: "ownerGroup"
                }
            }
        }).then ((db) => {
            db=db.docs[0];
            console.log(db);
            setUserValues(db);
            console.log(userValues);
        })
    },[]);


    const submit = e => {
        e.preventDefault();
        e = e.value;
        console.log(e);
    }
    
    return (
        <Form
            // onChange = {value => console.log('Change', value)}
            onSubmit = {submit} // onSubmit = {event => console.log('Submit', event.value, event.touched)}
        >
        <Box pad="small" background="light-2" width="medium">
            <Box direction="row" alignSelf="center" >
                <Heading alignSelf="center" level={3} margin="small">
                    Manage User Details
                </Heading>
            </Box>
            {/* Take Employee names from db */}
            <Box background= "white" margin="small" pad="small">
                <FormField name="groupName" label="Group Name">
                    <TextInput name="groupName" value={userValues.groupName}/>
                </FormField>
                <FormField name="groupHandle" label="Group Handle / Short Name">
                    <TextInput name="groupHandle" value={userValues.groupHandle}/>
                </FormField>
            </Box>
            
            <Box background= "white" margin="small" pad="small">
                <FormField name={`${userValues.companyName}.companyName`} label="Company Name">
                    <TextInput name={`${userValues.companyName}.companyName`} value={userValues.companyName}/>
                </FormField>
                <FormField name={`${userValues.companyHandle}.companyHandle`} label="Company Name">
                    <TextInput name={`${userValues.companyHandle}.companyHandle`} value={userValues.companyHandle}/>
                </FormField>
                <br />
                <EmailInput margin="small" input={{value: userValues.companyEmail}}/>
                <br />
                <PhoneInput margin="small" />
                <FormField label="GST Number">
                    <GstnInput />
                </FormField>
                <FormField label="PAN">
                    <PanInput />
                </FormField>
                <FormField label="Address" border={{position: 'outer', side:'all'}}>
                    <TextArea />
                </FormField>
                <FormField label="City">
                    <TextInput placeholder="Ahmedabad"/>
                </FormField>
                <FormField name="companyPincode" label="Pincode">
                    <TextInput name="companyPincode" />
                </FormField>
            </Box>

            <Box background= "white" margin="small" pad="small">
                <FormField label="Employee Name">
                    <TextInput value=""/>
                </FormField>
                <FormField label="Employee Handle / Short Name">
                    <TextInput value=""/>
                </FormField>
                <br />
                <EmailInput margin="small" />
                <br />
                <PhoneInput margin="small" />
                <FormField label="Address" border={{position: 'outer', side:'all'}}>
                    <TextArea />
                </FormField>
                <FormField label="City">
                    <TextInput placeholder="Ahmedabad"/>
                </FormField>
                <FormField name="employeePincode" label="Pincode">
                    <TextInput name="employeePincode" />
                </FormField>
            </Box>

            <Box direction="row" alignSelf="center" >
                <Button type="submit" margin="small" label="Save" primary />
            </Box>
        </Box>
        </Form>
    )
}

export default UserEditForm