import React from 'react';
import {
    Box, 
    Button,
    ResponsiveContext
} from 'grommet';
import { UserManager } from 'grommet-icons';
import { Link } from '@reach/router';

import logo from '../../logo_banner_png_192.png';

import * as Styled from './styles';



export const Header = () => {

    return(

    <Box
        background={{color: 'brand', dark: false}}
        pad='small'
        elevation="small"
        fill="horizontal"
        justify='between'
        responsive
        direction="row"
        tag="header"
        align="center"
    >
        
        <Link to="/"><Box
            tag="div"
            direction="row"
            responsive
            margin={{right: 'medium', left: 'medium'}}
        >
                <Styled.LogoImage fit="cover" src={ logo } />
        </Box></Link>
        
        <Link to="edit-user"><Button icon={<UserManager color="white" />} /></Link>
        
    </Box>
)};

export default Header;