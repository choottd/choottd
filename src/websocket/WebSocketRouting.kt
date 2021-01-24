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
import io.ktor.application.*
import io.ktor.http.cio.websocket.*
import io.ktor.websocket.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.channels.ClosedReceiveChannelException
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.launch
import org.choottd.monitor.MonitoringService
import org.choottd.monitor.OpenttdEvent
import org.slf4j.LoggerFactory

private val logger = LoggerFactory.getLogger(Application::class.java)
private val mapper = ObjectMapper()
private fun convertToJson(event: OpenttdEvent) = mapper.writeValueAsString(event)

@ExperimentalCoroutinesApi
suspend fun DefaultWebSocketServerSession.webSocketHandler(
    monitoringService: MonitoringService,
    eventsFlow: SharedFlow<OpenttdEvent>
) {
    val channel = Channel<OpenttdEvent>()

    // copies from the flow to the channel
    val eventsJob = launch(Dispatchers.IO) {
        eventsFlow.onEach { channel.offer(it) }.launchIn(this)
    }

    val senderJob = launch(Dispatchers.IO) {
        while (true) {
            val event = channel.receive()
            val json = convertToJson(event)
            send(json)
        }
    }

    var stop = false
    while (!stop) {
        if (incoming.isClosedForReceive) {
            stop = true
            logger.debug("Websocket closed")
            continue
        }

        try {
            incoming.receive()
            // TODO support other kind of messages
            monitoringService.fetchGlobalData()
        } catch (ex: ClosedReceiveChannelException) {
            logger.debug("Websocket closed while waiting for incoming messages")
        }
    }

    eventsJob.cancel()
    senderJob.cancel()

}
