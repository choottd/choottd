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
import {Button, Layout} from "antd";
import {PlusOutlined} from "@ant-design/icons";

const {Header, Content, Footer, Sider} = Layout;

function App() {

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsible>
                <div className={"logo-container"}>
                    <img alt={"logo"} className={"logo"} src={logo}/>
                </div>

                <div className={"button-container"}>
                    <Button type="primary" icon={<PlusOutlined/>}>New Server</Button>
                </div>

            </Sider>
            <Layout className="site-layout">
                <Content style={{margin: '0 16px'}}>
                    <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

export default App;
