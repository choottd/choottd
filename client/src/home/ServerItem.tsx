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
import {Card} from "antd";
import {GameData, GameDate} from "../websocket/OpenttdEvents";
import {ConfigResponse} from "../api/ConfigDTOs";

interface Props {
    config: ConfigResponse,
    gameInfo?: GameData,
    gameDate?: GameDate,
}

function ServerItem({config, gameInfo, gameDate}: Props) {

    const gameDateStr = () => {
        if(gameDate !== undefined) {
            return `${gameDate.day}.${gameDate.month}.${gameDate.year}`
        } else {
            return `???`
        }
    };

    return <Card title={`${config.host}:${config.port}`} extra={gameDateStr()}>
        <p>{gameInfo?.name ?? "???"}</p>
    </Card>

}

export default ServerItem;
