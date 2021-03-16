import React from 'react';
import { Box, Button, CheckBox, Form, MaskedInput } from 'grommet';
import { Phone } from 'grommet-icons';
import { PasswordInput } from 'grommet-controls';

    const Login = ({navigate}) => {

    const handleFormSubmit = (e) => {
        
        if(e.value.name.length<10){
            alert("Phone Number should be 10 digits");
        } else {
            localStorage.setItem('name', e.value.name);
            localStorage.setItem('password', e.value.password);
            localStorage.setItem('creationDate', (new Date()).toISOString());
            navigate(`/`);
        }
    }

    
        return(
            <Box align="center" pad="large">
                <Form onSubmit={handleFormSubmit}>
                    <Box margin="small">
                        <MaskedInput 
                        name="name" 
                        icon={<Phone />}
                        mask={[
                            {
                            length: 10,
                            regexp: /^[0-9]{1,10}$/
                            }
                        ]}
                        placeholder="Phone Number"
                        required
                        />
                    </Box>
                    <Box margin="small">
                        <PasswordInput name="password" placeholder="Password" required/>
                    </Box>
                    <Box align="center">
                        <Button alignSelf="center" id="loginSubmit" type="submit" label="Login" primary margin="small"/>
                    </Box>
                </Form>
            </Box>
        )
    
};

export default Login;