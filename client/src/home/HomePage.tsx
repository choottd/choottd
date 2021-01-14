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
import {ConfigResponse} from "../api/ConfigDTOs";
import {ConfigService} from "../api/ConfigService";
import {Col, Row} from "antd";
import ServerItem from "./ServerItem";
import {openttdEvents$, SessionEvent} from "../websocket/OpenttdEvents";

function HomePage() {
    const [configs, setConfigs] = useState<ConfigResponse[]>([]);
    const [eventsMap, setEventsMap] = useState<Map<string, SessionEvent>>(new Map());

    useEffect(() => {
        const ottdSub = openttdEvents$.subscribe(ev => {
            eventsMap.set(ev.configId, ev.event);
            setEventsMap(eventsMap);
        });
        const configSub = ConfigService.getConfigs().subscribe(setConfigs);
        return () => {
            ottdSub.unsubscribe();
            configSub.unsubscribe();
        };
    }, [eventsMap])

    return <div className={"page"}>
        <Row gutter={16}>
            {
                configs.map((config, index) =>
                    <Col span={6} key={index}>
                        <ServerItem config={config} sessionEvent={eventsMap.get(config.id)}/>
                    </Col>)
            }
        </Row>
    </div>

}

export default HomePage;
