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

package org.choottd.monitor

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.launch
import org.choottd.config.Config
import org.choottd.config.ConfigResponse
import org.choottd.librcon.session.Session
import kotlin.coroutines.CoroutineContext

class OpenttdFacade(
    private val config: Config,
    private val flow: MutableSharedFlow<OpenttdEvent>
) : CoroutineScope {

    private val job: Job = Job()

    override val coroutineContext: CoroutineContext
        get() = Dispatchers.IO + job

    val openttdSession: Session = Session(BOT_NAME, BOT_VERSION, config.password, config.host, config.port)

    fun start() = launch {
        while (job.isActive) {
            openttdSession.sessionEvents
                .onEach {
                    flow.emit(OpenttdEvent(ConfigResponse(config.id.toString(), config.host, config.port), it))
                }
                .launchIn(this)
            openttdSession.open().join()
        }
    }

    fun stop() = job.cancel()

    companion object {
        private const val BOT_NAME = "Choottd"
        private const val BOT_VERSION = "1"
    }

}
