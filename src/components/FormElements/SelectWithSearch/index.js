import React, {useState, useEffect} from 'react';
import {FormField, Select} from 'grommet';

export const SelectWithSearch = ({input}) => {
    const OPTIONS = input.options;
    const [value, setValue] = useState(input.default); //Use the person entering as the default option
    const [options, setOptions] = useState(input.options);
    console.log({options, input, OPTIONS, value});

    useEffect(() => {
        setOptions(input.options);
        console.log(options);
    },[input.options])
    
    if(input.label){
        return (    
            <FormField name={input.name} label={input.label}>
            <Select
                name = {input.name}
                value={value}
                onSearch = {(searchText) => {
                    // console.log(searchText);
                    const regexp = new RegExp(searchText, 'i');
                    setOptions(() => {
                        if(OPTIONS.filter(o => o.match(regexp)).length<=0 && input.createNew){
                            const returnElement = [searchText];
                            return(returnElement);
                        } else {
                            return(OPTIONS.filter(o => o.match(regexp)));                       
                        }
                    });
                    setValue(options[0]);
                }}
                onChange={event => {
                    setValue(event.value || value);
                }}
                options={options}
            />
            </FormField>
        );
    } else {
        return (    
            <Select
                name = {input.name}
                value={value}
                onSearch = {(searchText) => {
                    // console.log(searchText);
                    const regexp = new RegExp(searchText, 'i');
                    setOptions(() => {
                        if(OPTIONS.filter(o => o.match(regexp)).length<=0 && input.createNew){
                            const returnElement = [searchText];
                            return(returnElement);
                        } else {
                            return(OPTIONS.filter(o => o.match(regexp)));                       
                        }
                    });
                    setValue(options[0]);
                }}
                // onChange={event => {
                //     setValue(event.value || value);
                // }}
                options={options}
            />
        );
    }
}

export default SelectWithSearch