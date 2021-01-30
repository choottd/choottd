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

import React from "react";
import {Button, Card, Descriptions, Spin} from "antd";
import {GameData, GameDate} from "../websocket/OpenttdEvents";
import {ConfigResponse} from "../api/ConfigDTOs";
import {CalendarOutlined, CloudServerOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import moment from "moment";

interface Props {
    config: ConfigResponse,
    gameInfo?: GameData,
    gameDate?: GameDate,
    timestamp?: number
}

function ServerItem({config, gameInfo, gameDate, timestamp}: Props) {

    const gameDateStr = () => {
        if (gameDate !== undefined) {
            return `${gameDate.day}.${gameDate.month}.${gameDate.year}`
        } else {
            return <Spin/>
        }
    };

    return <Card
        className={'server-item'}
        title={gameInfo?.name ?? <Spin/>}
        extra={timestamp ? <span className={'timestamp'}>{moment.utc(timestamp * 1000).fromNow()}</span> : <Spin/>}
        actions={[
            <Link to={`/server/${config.id}`}><Button type={"primary"}>View Details</Button></Link>
        ]}>
        <Descriptions colon={true} column={2}>
            <Descriptions.Item label={<CloudServerOutlined title={"Server"}/>}>
                {`${config.host}:${config.port}`}
            </Descriptions.Item>
            <Descriptions.Item label={<CalendarOutlined title={"Game Date"}/>}>
                {gameDateStr()}
            </Descriptions.Item>
        </Descriptions>
    </Card>

}

export default ServerItem;
