import React from 'react';
import { Grommet, Box } from 'grommet';
import { grommet } from 'grommet/themes';
import { Router } from "@reach/router";

import Header from './Header';
import OfflineMessage from './OfflineMessage';
import Home from './pages/Home';
import Login from './pages/Login'
import fetchRequest from '../database/fetchRequest'
import NewOrderForm from './pages/NewOrderForm';
import NewClientForm from './pages/NewClientForm';
import UserEditForm from './pages/UserEditForm';
import getDatabase from '../database/getDB';
import OrderBuyerPDF from './pages/OrderBuyerPDF';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = { 
            online          : true,
            isLoading       : false,
            isLoggedIn      : true,
            ownerGroupID    : '000000002',
            username        : '1111111111' };
    }

    componentDidMount() {
        this.mounted = true;
        this.heartBeat();
        if (localStorage.getItem('name') && localStorage.getItem('password')) {
        console.log(localStorage.getItem('name'), localStorage.getItem('password'))
        this.checkLogin();
        }
    }

    heartBeat() {
        if (!this.mounted) {
            return;
        }

        fetch(fetchRequest).then((result) => {
            if (!this.mounted) {
                return;
            }
            if (result.ok && !this.state.online) {
                this.setState({
                    online: true,
                });
            } else if (!result.ok && this.state.online) {
                this.setState({
                    online: false,
                });
            }
            setTimeout(this.heartBeat.bind(this), 2000);
        }).catch(() => {
            if (!this.mounted) {
                return;
            }
            if (this.state.online) {
                this.setState({
                    online: false,
                });
            }
            setTimeout(this.heartBeat.bind(this), 2000);
        });
    };

    componentWillUnmount() {
        this.mounted = false;
    }

    checkLogin() {
        const db = getDatabase("user");
        console.log(db);
    }
    

    render() {
        const { online } = this.state;

        const NotFound = () => (
            <div>Sorry, nothing here.</div>
          )
        
        if(this.state.isLoading) {
            return (<Div>'Loading....'</Div>)
        } else if (!this.state.isLoggedIn) {
            return (
                <Grommet full={true} theme={grommet}>
                <Box fill={true}>
                    <Header />
                    <OfflineMessage online={this.state.online} />
                    <Box fill>
                        <Login />
                    </Box>
                    <OfflineMessage online={this.state.online} />
                </Box>
            </Grommet>
            )
        }
        return (
            <Grommet full={true} theme={grommet}>
                <Box fill={true}>
                    <Header />
                    <OfflineMessage online={this.state.online} />
                    <Box fill>
                        <Router style={{ height: '100%' }}>
                            <Home path="/"/>
                                <Login path="login" />
                                <UserEditForm path="edit-user" />
                                <NewClientForm path="create-new-client" /> 
                                <NewOrderForm path="create-new-order" />
                                <OrderBuyerPDF path = "order-buyer-pdf/:orderNumber"/>
                            <NotFound default />                            
                        </Router>
                    </Box>
                </Box>
            </Grommet>
        );
    }
}

export default App;