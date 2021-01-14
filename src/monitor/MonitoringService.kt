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

import kotlinx.coroutines.flow.MutableSharedFlow
import org.choottd.config.Config
import org.choottd.librcon.session.fetchAllData
import java.util.*

class MonitoringService(
    private val openttdEventsFlow: MutableSharedFlow<OpenttdEvent>
) {

    private val facades = mutableMapOf<UUID, OpenttdFacade>()

    fun fetchGlobalData(configs: List<Config>) {
        configs.forEach {
            val facade = facades.getOrPut(it.id) { OpenttdFacade(it, openttdEventsFlow) }
            facade.openttdSession.fetchAllData()
        }
    }


}
