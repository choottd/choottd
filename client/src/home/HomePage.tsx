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
import {Col, Row} from "antd";
import ServerItem from "./ServerItem";
import {
    OpenttdEvent,
    SessionEvent,
    SimpleSendEvent,
    webSocketInput$,
    webSocketOutput$
} from "../websocket/OpenttdEvents";
import {interval} from "rxjs";

function HomePage() {
    const [eventsMap, setEventsMap] = useState<Map<string, SessionEvent>>(new Map());

    useEffect(() => {
        const wsSubscription = webSocketInput$
            .subscribe(event => {
                const ev = event as OpenttdEvent;
                eventsMap.set(ev.configId, ev.event);
                const newMap = new Map(eventsMap.entries())
                setEventsMap(newMap);
            });

        const pollSubscription = interval(5000)
            .subscribe(() => {
                webSocketOutput$.next(new SimpleSendEvent("Hello!"))
            });

        return () => {
            console.debug("Unsubscribe from observables")
            wsSubscription.unsubscribe();
            pollSubscription.unsubscribe();
        };
    }, [])

    return <div className={"page"}>
        <Row gutter={16}>
            {
                Array.from(eventsMap.values()).map((sessionEvent, index) =>
                    <Col span={6} key={index}>
                        <ServerItem sessionEvent={sessionEvent}/>
                    </Col>)
            }
        </Row>
    </div>

}

export default HomePage;
