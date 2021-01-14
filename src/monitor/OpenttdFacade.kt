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

import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.*
import org.choottd.config.Config
import org.choottd.librcon.session.Session

class OpenttdFacade(
    private val config: Config,
    private val flow: MutableSharedFlow<OpenttdEvent>
) {

    private lateinit var sessionState: Job
    private lateinit var session: Session
    val openttdSession: Session // using this to communicate with OpenTTD
        get() = session

    init {
        newSession()
    }

    private fun newSession() {
        session = Session(BOT_NAME, BOT_VERSION, config.password, config.host, config.port)
        session.sessionEvents
            .onEach {
                flow.emit(OpenttdEvent(config.id.toString(), it))
            }
            .launchIn(GlobalScope)
        sessionState = session.open()
//        sessionState.invokeOnCompletion { newSession() }
    }


    companion object {
        private const val BOT_NAME = "Choottd"
        private const val BOT_VERSION = "1"

    }

}
