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
import {ConfigResponse} from "../api/ConfigDTOs";
import {SessionEvent} from "../websocket/OpenttdEvents";

interface Props {
    config: ConfigResponse,
    sessionEvent?: SessionEvent,
}

function ServerItem({config, sessionEvent}: Props) {

    return <Card title={`${config.host}:${config.port}`} extra={1}>
        <p>{sessionEvent?.timestamp}</p>
    </Card>

}

export default ServerItem;
