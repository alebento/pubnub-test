import React, { useState } from 'react';

// import Header from '../header/header';
// import Footer from '../footer/footer';

import { Layout, Menu, Breadcrumb, Button, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import './home.css';

import PubNub from 'pubnub';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const Home = () => {
    const [dialNumber, setDialNumber] = useState("");
    const [dialNumberEnable, setDialNumberEnable] = useState(false);
    const [callNumber, setCallNumber] = useState("");
    const [callNumberEnable, setCallNumberEnable] = useState(true);
    
    const [pubnubState, setPubnubState] = useState({});
    const [myStream, setMyStream] = useState({});
    const [userList, setUserList] = useState([]);

    function publishStream() {
        var uuid = callNumber;
        var tempPubnub = pubnubState;

		// tempPubnub.publish({
		// 	user: uuid,
		// 	stream: myStream
		// });

		tempPubnub.subscribe({
			user: uuid,
			stream: function (data, event) {
				gotStream(event.stream, 'vidbox2');
			},
			disconnect: function (uuid, pc) {
				document.querySelector('#vidbox2').src = "";
                onHangup();
            }
        });

        setPubnubState(tempPubnub);
    };	
    
    function gotStream(stream, locale) {
        var video = document.querySelector(`#${locale}`);
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
            video.play();
        };
	};

    function onLogIn () {
        var pubnub = new PubNub({
            publishKey : "pub-c-852c429e-19e8-4546-a41b-5efa97ba9d2b",
            subscribeKey : "sub-c-f36d6a48-bcff-11ec-8ec5-9aa1b08a2b25",
            uuid: dialNumber
        });

        // pubnub.onNewConnection(function (uuid) {
        //     if (myStream != null) {
        //         publishStream(uuid);
        //     }
        // });

        pubnub.subscribe({
            channel: 'phonebook',
            callback: function (message) {
                console.log('msg: ', message)
            },
            presence: function (data) {
                console.log('usuario: ', data)
                if (data.action === 'join' && data.uuid !== dialNumber) {
                    var parts = data.uuid.split('-');
                    var newUser = {
                        name: parts[1],
                        id: parts[0]
                    };
                    var tempUserList = userList;
                    tempUserList.push(newUser);
                    setUserList(tempUserList);
                } else if (data.action === 'leave' && data.uuid !== dialNumber) {
                    // var parts = data.uuid.split('-');
                    // var item = userList.find(“li[data-user=\”” + parts[0] + '\"]');
                    // item.remove();
                }
            }
        });
    
        pubnub.subscribe({
            channel: 'answer',
            callback: function (data) {
                console.log('data: ', data)
                if (data.caller === dialNumber) {
                    publishStream(data.caller);
                }
            }
        });
        
        setPubnubState(pubnub);
        setCallNumberEnable(false);
        
        var tempUserList = userList;
        tempUserList.push({
            name: dialNumber,
            id: dialNumber
        });
        setUserList(tempUserList)
        
        navigator.mediaDevices.getUserMedia({ audio: true, video: true}).then(function(stream) {
            gotStream(stream, 'vidbox');

            setMyStream(stream);
        }).catch(function(err) {
            console.log(err);
        });
    }

    function onHangup () {
        // tempPubnub.closeConnection(myStream, function () {
		// 	document.querySelector('#vidbox').srcObject = "";
		// })
    }

    return (
        <Layout style={{ height: '100vh' }}>
            <Header className="header">
                <div className="logo" />
                <Input min={1} disabled={dialNumberEnable ? 1 : 0} type={"number"} onChange={e => setDialNumber(e.target.value)} value={dialNumber} style={{width: '120px', marginRight: '8px'}} placeholder="Your ID" />
                <Button type="primary" style={{marginRight: '8px'}} onClick={onLogIn}>Log in</Button>
                <Input disabled={callNumberEnable ? 1 : 0} min={1} type={"number"} onChange={e => setCallNumber(e.target.value)} value={callNumber} style={{width: '120px', marginRight: '8px'}} placeholder="Call" />
                <Button disabled={callNumberEnable ? 1 : 0} type="primary" style={{marginRight: '8px'}} onClick={publishStream}>Call</Button>
                <Button disabled={callNumberEnable ? 1 : 0} type="primary" danger style={{marginRight: '8px'}} onClick={onHangup}>Hangup</Button>
            </Header>
            <Content style={{ display: 'flex', flexDirection: 'column', padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>PubNub</Breadcrumb.Item>
                </Breadcrumb>
                <Layout className="site-layout-background">
                    <Sider className="site-layout-background" width={200}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%' }}
                    >
                        <SubMenu key="sub1" icon={<UserOutlined />} title="Usuários">
                            {
                                userList.forEach(user => {
                                    return(
                                        <Menu.Item key="1">{user.name}</Menu.Item>
                                    )
                                })
                            }
                        </SubMenu>
                    </Menu>
                    </Sider>
                    <Content style={{ padding: '24px', minHeight: 280 }}>
                        <video id='vidbox' style={{width: '25%'}}></video>
                        <video id='vidbox2' style={{width: '25%'}}></video>
                    </Content>
                </Layout>
            </Content>
            <Footer style={{ textAlign: 'center' }}>PubNub Test ©2022 Alexandre Bento Pereira</Footer>
        </Layout>
    )
}

export default Home;