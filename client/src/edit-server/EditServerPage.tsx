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

import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Button, Col, Form, Input, notification, Row} from "antd";
import {CloudServerOutlined, KeyOutlined, NumberOutlined} from "@ant-design/icons";
import {AddConfigCommand, ConfigResponse, UpdateConfigCommand} from "../api/ConfigDTOs";
import {ConfigService} from "../api/ConfigService";

function EditServerPage() {
    const history = useHistory();
    const params = useParams<{ id: string | undefined }>();
    const isEdit = params.id !== undefined;

    const [config, setConfig] = useState<ConfigResponse>()

    const [form] = Form.useForm();

    useEffect(() => {
        (async () => {
            if (isEdit) {
                const conf = await ConfigService.getConfigById(params.id!);
                setConfig(conf)
            }
        })();
    });

    const onFinish = async (values: any) => {
        if (isEdit) {
            const data = {
                password: values.password,
            } as UpdateConfigCommand;
            await ConfigService.putConfig(data)
        } else {
            const data = {
                host: values.host,
                port: values.port,
                password: values.password,
            } as AddConfigCommand;
            await ConfigService.postConfig(data)
        }
        notification.success({
            message: 'Configuration Added',
            description: 'New Configuration added!',
        });
        history.push("/");
    };

    const onFinishFailed = () => {
        notification.error({
            message: 'Error',
            description: 'Failed to add the configuration',
        });
    };

    return <div className={"page"}>
        <Row>
            <Col offset={8} span={8}>
                <h1>Create a new server configuration</h1>
                <Form
                    form={form}
                    name="basic"
                    layout={"vertical"}
                    initialValues={{
                        host: config?.host,
                        port: config?.port ?? 3977,
                        password: config?.password,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}>
                    <Form.Item
                        label="Host"
                        name="host"
                        rules={[{required: true, message: 'Please input the remote host'}]}>
                        <Input readOnly={isEdit} prefix={<CloudServerOutlined/>}/>
                    </Form.Item>
                    <Form.Item
                        label="Port"
                        name="port"
                        rules={[{required: true, type: 'number', message: 'Please input a valid port'}]}>
                        <Input readOnly={isEdit} prefix={<NumberOutlined/>}/>
                    </Form.Item>
                    <Form.Item
                        label="Admin Password"
                        name="password"
                        rules={[{required: true, message: 'Please input the game password'}]}>
                        <Input prefix={<KeyOutlined/>}/>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    </div>

}

export default EditServerPage;
