/*
 * Copyright 2021 Giordano Battilana
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';
import logo from './logo.png';
import './App.less';
import {Button, Col, Layout, Row} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {Link, Route, Switch} from 'react-router-dom';
import ServerPage from "./server/ServerPage";
import EditServerPage from "./edit-server/EditServerPage";
import HomePage from "./home/HomePage";

const {Content, Header} = Layout;

function App() {

    return (
        <Layout className={'main-layout'}>
            <Header>
                <Row gutter={16}>
                    <Col flex={"auto"}>
                        <Link to={"/"}>
                            <img alt={"logo"} className={"logo"} src={logo}/>
                            <span className={"title"}>CHOOTTD</span>
                        </Link>
                    </Col>
                    <Col>
                        <Link to={"/new-server"}>
                            <Button type="primary" icon={<PlusOutlined/>}>New Server</Button>
                        </Link>
                    </Col>
                </Row>
            </Header>
            <Content className={"main-content"}>
                <Switch>
                    <Route path="/server/:id">
                        <ServerPage/>
                    </Route>
                    <Route path="/new-server">
                        <EditServerPage/>
                    </Route>
                    <Route path="/edit-server">
                        <EditServerPage/>
                    </Route>
                    <Route path="/">
                        <HomePage/>
                    </Route>
                </Switch>
            </Content>
        </Layout>
    );
}

export default App;
