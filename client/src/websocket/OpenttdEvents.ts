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

import {ReceivedEvent} from "./WebSocket";

type EventType = 'GameUpdateEvent' | 'GameDateEvent' | 'CompanyUpdateEvent' | 'ServerProtocolEvent'

export interface SessionEvent {
    timestamp: number
}

export interface GameDate {
    year: number,
    month: number,
    day: number
}

export interface GameData {
    name: string,
    gameVersion: string,
    dedicated: boolean,
    map: {
        name: string,
        landscape: string,
        dateStart: GameDate,
        seed: number,
        height: number,
        width: number
    }
}

export interface GameDateEvent extends SessionEvent {
    gameDate: GameDate
}

export interface GameUpdateEvent extends SessionEvent {
    game: GameData
}

export interface OpenttdEvent extends ReceivedEvent {
    readonly configId: string
    readonly eventType: EventType
    readonly event: SessionEvent
}
