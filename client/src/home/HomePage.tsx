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
import {ErrorEvent, webSocketInput$, webSocketOutput$} from "../websocket/WebSocket";
import {interval} from "rxjs";
import {GameData, GameDate, GameDateEvent, GameUpdateEvent, OpenttdEvent} from "../websocket/OpenttdEvents";
import {filter, tap} from "rxjs/operators";
import {ConfigService} from "../api/ConfigService";
import {ConfigResponse} from "../api/ConfigDTOs";
import {FetchAllGameDates, FetchAllGameUpdates} from "../websocket/SendEvents";

function HomePage() {
    const [configs, setConfigs] = useState<ConfigResponse[]>([]);
    const [gameInfos, setGameInfos] = useState<Map<string, GameData>>(new Map());
    const [gameDates, setGameDates] = useState<Map<string, GameDate>>(new Map());

    useEffect(() => {
        ConfigService.getConfigs().subscribe(configs => setConfigs(configs));
        const wsSubscription = webSocketInput$
            .pipe(
                tap(ev => {
                    if (ev.error) {
                        console.error((ev as ErrorEvent).errorMessage)
                    }
                }),
                filter(ev => !ev.error),
                filter(ev => {
                    const oev = ev as OpenttdEvent;
                    return oev.eventType === "GameUpdateEvent" || oev.eventType === "GameDateEvent";
                })
            )
            .subscribe(event => {
                const ev = event as OpenttdEvent;
                switch (ev.eventType) {
                    case "GameUpdateEvent":
                        gameInfos.set(ev.configId, (ev.event as GameUpdateEvent).game);
                        setGameInfos(new Map(gameInfos.entries()));
                        break;

                    case "GameDateEvent":
                        gameDates.set(ev.configId, (ev.event as GameDateEvent).gameDate);
                        setGameDates(new Map(gameDates.entries()));
                        break;
                }
            });

        const pollSubscription = interval(5000)
            .subscribe(() => {
                webSocketOutput$.next(FetchAllGameUpdates)
                webSocketOutput$.next(FetchAllGameDates)
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
                configs.map((config, index) =>
                    <Col span={6} key={index}>
                        <ServerItem
                            config={config}
                            gameDate={gameDates.get(config.id)}
                            gameInfo={gameInfos.get(config.id)}/>
                    </Col>)
            }
        </Row>
    </div>

}

export default HomePage;
