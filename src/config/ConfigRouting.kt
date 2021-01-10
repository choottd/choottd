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

package org.choottd.config

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import org.kodein.db.DB
import org.kodein.db.asModelSequence
import org.kodein.db.deleteById
import org.kodein.db.getById
import org.kodein.memory.util.UUID

fun Route.configRouting(db: DB) {

    get("/api/configs") {
        val configs = db.find(Config::class).all()
            .use { it.asModelSequence().map { c -> ConfigResponse(c.id.toString(), c.host, c.port) }.toList() }
        call.respond(configs)
    }

    post("/api/configs") {
        val cmd = call.receive<AddConfigCommand>()
        val newConfig = Config(UUID.randomUUID(), cmd.host, cmd.port, cmd.password)
        db.put(newConfig)
        call.respond(HttpStatusCode.Created)
    }

    delete("/api/configs/{id}") {
        val id = call.parameters["id"] ?: kotlin.run {
            call.respond(HttpStatusCode.NotFound)
            return@delete
        }

        db.deleteById<Config>(id)
    }

    put("/api/configs/{id}") {
        val id = call.parameters["id"] ?: kotlin.run {
            call.respond(HttpStatusCode.BadRequest)
            return@put
        }

        val cmd = call.receive<UpdateConfigCommand>()
        val conf = db.getById<Config>(id) ?: kotlin.run {
            call.respond(HttpStatusCode.BadRequest)
            return@put
        }
        val newConf = conf.copy(password = cmd.password)
        db.put(newConf)
    }

}
