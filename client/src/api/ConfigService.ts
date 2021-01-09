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
import {AddConfigCommand, Config, UpdateConfigCommand} from "./ConfigDTOs";
import {API_URL} from "../Const";

export class ConfigService extends ApiService {

    static async getConfigs(): Promise<Config[]> {
        const resp = await this._get(`${API_URL}/configs`);
        return await resp.json();
    }

    static async getConfigById(id: string): Promise<Config> {
        const resp = await this._get(`${API_URL}/configs/${id}`);
        return await resp.json();
    }

    static async postConfig(config: AddConfigCommand): Promise<Response> {
        return await this._post(`${API_URL}/configs`, config);
    }

    static async putConfig(config: UpdateConfigCommand): Promise<Response> {
        return await this._put(`${API_URL}/configs`, config);
    }

}
