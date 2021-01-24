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

import {WS_URL} from "../Const";
import {webSocket} from "rxjs/webSocket";
import {catchError, tap} from "rxjs/operators";
import {Observable, of, Subject} from "rxjs";

export interface SessionEvent {
    timestamp: number
}

export interface WSEvent {
}

export interface ReceivedEvent extends WSEvent {
}

export interface SendEvent extends WSEvent {
}

export interface OpenttdEvent extends ReceivedEvent {
    configId: string
    event: SessionEvent
}

export interface DummyEvent extends ReceivedEvent {
}

export class SimpleSendEvent implements SendEvent {
    constructor(readonly message: string) {
    }
}

const webSocketSubject$ = webSocket<WSEvent>(WS_URL!);

export const webSocketInput$: Observable<ReceivedEvent> = webSocketSubject$
    .pipe(
        catchError((err) => {
            console.error(err);
            return of({} as DummyEvent)
        }),
        tap(event => {
            console.debug(event);
        })
    )

export const webSocketOutput$: Subject<SendEvent> = webSocketSubject$;
