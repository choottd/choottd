import {from, Observable} from "rxjs";
import {mergeMap} from "rxjs/operators";
import {ConfigResponse} from "./ConfigDTOs";

const DEFAULT_HEADERS = Object.freeze({'Content-Type': 'application/json'});

function createHeaders(headers = DEFAULT_HEADERS) {
    // TODO good place where to load auth if we add it
    return headers;
}

export class ApiService {


    private static checkForErrors(response: any) {
        // TODO hook where we can check for common error HTTP statuses
        return response;
    }

    private static onPromiseError() {
        // TODO hook where we can check for common error statuses
    }

    protected static _get(url: string, headers = createHeaders()): Observable<Response> {
        const promise = fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers
        });
        promise.then(ApiService.checkForErrors, ApiService.onPromiseError);
        return from(promise);
    }

    protected static _post(url: string, data: any = null, headers = createHeaders()): Observable<Response> {
        const promise = fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers,
            body: JSON.stringify(data)
        });
        promise.then(ApiService.checkForErrors, ApiService.onPromiseError);
        return from(promise);
    }

    protected static _put(url: string, data: any, headers = createHeaders()): Observable<Response> {
        const promise = fetch(url, {
            method: 'PUT',
            mode: 'cors',
            headers,
            body: JSON.stringify(data)
        });
        promise.then(ApiService.checkForErrors, ApiService.onPromiseError);
        return from(promise);
    }

    protected static _delete(url: string, headers = createHeaders()): Observable<Response> {
        const promise = fetch(url, {
            method: 'DELETE',
            mode: 'cors',
            headers
        });
        promise.then(ApiService.checkForErrors, ApiService.onPromiseError);
        return from(promise);
    }

    protected static json<T>(observable: Observable<Response>) {
        return observable.pipe(mergeMap(resp => from(resp.json() as Promise<T>)))
    }
}
