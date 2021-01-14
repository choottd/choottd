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

package org.choottd.websocket

import com.fasterxml.jackson.databind.ObjectMapper
import io.ktor.http.cio.websocket.*
import io.ktor.websocket.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.choottd.monitor.OpenttdEvent

val mapper = ObjectMapper()
private fun convertToJson(event: OpenttdEvent) = mapper.writeValueAsString(event)

suspend fun DefaultWebSocketServerSession.webSocketHandler(eventsFlow: SharedFlow<OpenttdEvent>) {
    val channel = Channel<OpenttdEvent>()
    launch(Dispatchers.IO) {
        eventsFlow.onEach { channel.offer(it) }.launchIn(this)
    }
    while (true) {
        val event = channel.receive()
        val json = convertToJson(event)
        send(json)
    }
}
