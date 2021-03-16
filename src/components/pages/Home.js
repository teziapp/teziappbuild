import React from 'react';
import { Box, Button } from 'grommet';
import { Link } from '@reach/router'

export const Home = () => (
    <Box align="center" pad="large">
        <Link to="create-new-order"><Button Primary label = "Add New Order" margin="small"/></Link>
        <Link to="create-new-client"><Button Primary label = "Add New Party" margin="small"/></Link>
    </Box>
);

export default Home;