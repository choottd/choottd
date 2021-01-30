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

package org.choottd

import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.http.cio.websocket.*
import io.ktor.http.content.*
import io.ktor.jackson.*
import io.ktor.routing.*
import io.ktor.server.engine.*
import io.ktor.websocket.*
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import org.choottd.config.configRouting
import org.choottd.monitor.MonitoringService
import org.choottd.monitor.OpenttdEvent
import org.choottd.websocket.webSocketHandler
import org.dizitart.kno2.nitrite
import java.io.File
import java.time.Duration

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
fun Application.module() {
    install(ContentNegotiation) {

        jackson {
            enable(SerializationFeature.INDENT_OUTPUT)
            registerModule(KotlinModule())
        }
    }

    install(Compression) {
        gzip {
            priority = 1.0
        }
        deflate {
            priority = 10.0
            minimumSize(1024) // condition
        }
    }

    install(CORS) {
        method(HttpMethod.Options)
        method(HttpMethod.Get)
        method(HttpMethod.Put)
        method(HttpMethod.Post)
        method(HttpMethod.Delete)
        header(HttpHeaders.AccessControlAllowHeaders)
        header(HttpHeaders.ContentType)
        header(HttpHeaders.AccessControlAllowOrigin)
        allowCredentials = true
        anyHost()
    }

    install(ShutDownUrl.ApplicationCallFeature) {
        // The URL that will be intercepted (you can also use the application.conf's ktor.deployment.shutdown.url key)
        shutDownUrl = "/ktor/application/shutdown"
        // A function that will be executed to get the exit code of the process
        exitCodeSupplier = { 0 } // ApplicationCall.() -> Int
    }

    install(WebSockets) {
        pingPeriod = Duration.ofSeconds(15)
        timeout = Duration.ofSeconds(30)
        maxFrameSize = Long.MAX_VALUE
        masking = false
    }

    val dbpath = environment.config.propertyOrNull("ktor.choottd.db-path")?.getString() ?: "./choottd.db"
    val db = nitrite {
        file = File(dbpath)
        autoCommitBufferSize = 2048
        compress = true
        autoCompact = false
    }


    val openttdEventsFlow = MutableSharedFlow<OpenttdEvent>()
    val monitoringService = MonitoringService(db, openttdEventsFlow)

    routing {

        configRouting(db)

        static("/") {
            resources("static")
            defaultResource("static/index.html")
        }

        webSocket("/openttdEvents") {
            webSocketHandler(jacksonObjectMapper(), monitoringService, openttdEventsFlow.asSharedFlow())
        }
    }

    Runtime.getRuntime().addShutdownHook(Thread {
        monitoringService.stop()
    })
}

