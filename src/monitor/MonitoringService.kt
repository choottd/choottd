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

import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableSharedFlow
import org.choottd.config.Config
import org.choottd.librcon.session.fetchAllData
import org.choottd.librcon.session.fetchGameDate
import org.choottd.librcon.session.fetchGameInfo
import org.dizitart.no2.Nitrite
import org.slf4j.LoggerFactory
import java.util.*
import kotlin.coroutines.CoroutineContext

class MonitoringService(
    db: Nitrite,
    private val openttdEventsFlow: MutableSharedFlow<OpenttdEvent>
) : CoroutineScope {
    private val logger = LoggerFactory.getLogger(MonitoringService::class.java)
    private val configRepository = db.getRepository(Config::class.java)
    private val facades = mutableMapOf<UUID, OpenttdFacade>()

    private val job = Job()
    override val coroutineContext: CoroutineContext
        get() = Dispatchers.IO + job

    fun stop() {
        configRepository.close()
        job.cancel()
    }

    private fun populateFacades() {
        val configs = configRepository.find().toList()
        logger.debug("Found ${configs.size} configurations")
        configs.forEach {
            facades.getOrPut(it.id) {
                val fac = OpenttdFacade(it, openttdEventsFlow)
                logger.debug("Created facade for $it")
                fac.start()
                fac
            }
        }
    }

    fun fetchGlobalData() {
        populateFacades()
        facades.values.forEach {
            it.openttdSession.fetchAllData()
        }
    }

    fun fetchAllGameUpdates() {
        populateFacades()
        facades.values.forEach {
            it.openttdSession.fetchGameInfo()
        }
    }

    fun fetchAllGameDates() {
        populateFacades()
        facades.values.forEach {
            it.openttdSession.fetchGameDate()
        }
    }


}
