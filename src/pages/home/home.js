import React, { useState, useEffect } from 'react';

// import Header from '../header/header';
// import Footer from '../footer/footer';

import { Layout, Menu, Breadcrumb, Button, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import './home.css';

// import '../../assets/js/pubnub';
// import '../../assets/js/webrtc';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const Home = () => {
    const [dialNumber, setDialNumber] = useState("");
    const [dialNumberEnable, setDialNumberEnable] = useState(false);
    const [callNumber, setCallNumber] = useState("");

    let phone = null;

    // useEffect(() => {
    //     const pubnub = document.createElement('script');
    //     const webrtc = document.createElement('script');
      
    //     pubnub.src = "https://cdn.pubnub.com/pubnub.js";
    //     pubnub.async = true;
    //     webrtc.src = "https://stephenlb.github.io/webrtc-sdk/js/webrtc.js";
    //     webrtc.async = true;
      
    //     document.body.appendChild(pubnub, webrtc);
    //     console.log('body: ', document.body)
      
    //     return () => {
    //       document.body.removeChild(pubnub, webrtc);
    //     }
    // }, []);

    const onLogIn = () => {
        if(phone) {
            phone.hangup();
            setDialNumberEnable(false);
        }else {
            // eslint-disable-next-line no-undef
            phone = PHONE({
                number: dialNumber || 'Anonymous',
                ssl: false,
                publish_key: 'pub-c-852c429e-19e8-4546-a41b-5efa97ba9d2b',
                subscribe_key: 'sub-c-f36d6a48-bcff-11ec-8ec5-9aa1b08a2b25',
                media: true
            });
            setDialNumberEnable(true);
        }

        console.log('media: ', navigator.getUserMedia,navigator.webkitGetUserMedia,navigator.mozGetUserMedia,navigator.msGetUserMedia)
        
        phone.debug( info => { console.log('info: ', phone, info) } );
        phone.unable( error => { alert('unable to connect', error) });

        phone.ready( session => {
            setDialNumberEnable(true);
            // $('#username').css( 'background', '#55ff5b' );
        } );

        phone.receive(function(session){
            session.ended( session => { document.querySelector('#vidbox').html('') } );
            session.connected( session => {
                document.querySelector('#vidbox').append(session.video);
            });
        });

        return false;
    }

    const onCall = () => {
        if (!window.phone)
            alert('Login First!');
        else
            phone.dial(callNumber);
        return false;
    }

    const onHangup = () => {
        if(phone){
            phone.hangup();
        }

        return false;
    }

    return (
        <Layout style={{ height: '100vh' }}>
            <Header className="header">
                <div className="logo" />
                <Input disabled={dialNumberEnable} type={"number"} onChange={e => setDialNumber(e.target.value)} value={dialNumber} style={{width: '100px'}} placeholder="Log in" />
                <Button onClick={onLogIn}>Log in</Button>
                <Input type={"number"} onChange={e => setCallNumber(e.target.value)} value={callNumber} style={{width: '100px'}} placeholder="Call" />
                <Button onClick={onCall}>Call</Button>
                <Button onClick={onHangup}>Hangup</Button>
            </Header>
            <Content style={{ display: 'flex', flexDirection: 'column', padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <Layout className="site-layout-background">
                    <Sider className="site-layout-background" width={200}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%' }}
                    >
                        <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
                        <Menu.Item key="1">option1</Menu.Item>
                        <Menu.Item key="2">option2</Menu.Item>
                        <Menu.Item key="3">option3</Menu.Item>
                        <Menu.Item key="4">option4</Menu.Item>
                        </SubMenu>
                    </Menu>
                    </Sider>
                    <Content id='vidbox' style={{ padding: '24px', minHeight: 280 }}>
                        teste
                    </Content>
                </Layout>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    )
}

export default Home;