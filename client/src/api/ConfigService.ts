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

import {ApiService} from "./ApiService";
import {AddConfigCommand, ConfigResponse, UpdateConfigCommand} from "./ConfigDTOs";
import {API_URL} from "../Const";
import {Observable} from "rxjs";

export class ConfigService extends ApiService {

    // static getConfigs(): Observable<ConfigResponse[]> {
    //     return this.json(this._get(`${API_URL}/configs`));
    // }

    static getConfigById(id: string): Observable<ConfigResponse> {
        return this.json(this._get(`${API_URL}/configs/${id}`))
    }

    static postConfig(config: AddConfigCommand): Observable<Response> {
        return this._post(`${API_URL}/configs`, config);
    }

    static putConfig(config: UpdateConfigCommand): Observable<Response> {
        return this._put(`${API_URL}/configs`, config);
    }

}
