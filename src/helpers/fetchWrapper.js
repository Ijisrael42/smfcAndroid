// import { config } from './config';
import { accountService } from '../services/accountService'; 

export const fetchWrapper = {
    get,
    post,
    put,
    delete: _delete,
    file,
    download,
    isTokenExpired
}

async function get(url) {
    const requestOptions = {
        method: 'GET',
        headers: await authHeader(url)
    };
    return fetch(url, requestOptions).then(handleResponse); 
}

async function post(url, body) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...await authHeader(url) },
        credentials: 'include',
        body: JSON.stringify(body)
    };

    return fetch(url, requestOptions).then(handleResponse);

}

async function download(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/pdf', ...await authHeader(url) },
        credentials: 'include',
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

async function file(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(url) },
        body: body
    };
    return fetch(url, requestOptions).then(handleResponse);
}

async function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...await authHeader(url) },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);    
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        headers: await authHeader(url)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// helper functions

async function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const user = await accountService.userValue;
    const isLoggedIn = user && user.jwtToken;
    //const isApiUrl = url.startsWith(config.apiUrl);

    if (isLoggedIn ) return { Authorization: `Bearer ${user.jwtToken}` }; //&& isApiUrl) {
    else return {};
}

/* 
async function authHeader(url) {

    // return auth header with jwt if user is logged in and request is to the api url
    let user = accountService.userValue;
    const isLoggedIn = user && user.jwtToken;
    //const isApiUrl = url.startsWith(config.apiUrl);

    if (isLoggedIn ) {//&& isApiUrl) {
        if( isTokenExpired(user) ) {
            user = await refreshToken();
            console.log(user);
            window.localStorage.setItem( 'user', JSON.stringify(user) );
        }

        const jwtToken = JSON.parse(atob(user.jwtToken.split('.')[1]));
        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        console.log(expires);

        return { Authorization: `Bearer ${user.jwtToken}` };
    } else { 
        return {};
    }
} 

async function refreshToken() {
    const url = `${config.apiUrl}/accounts/refresh-token`;
    const body = {};

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
    };

    const res = await fetch(url, requestOptions);
    const data = await res.json();
    return data;
}*/

async function isTokenExpired() {

    let user = await accountService.userValue;
    // console.log(user);
    
    if( user && user.jwtToken ){
        const jwtToken = JSON.parse(atob(user.jwtToken.split('.')[1]));
        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);

        if( expires.getTime() < Date.now()) return true;        
    }
    return false;
}

function handleResponse(response) {
    return response.text().then( async (text) => {
        const data = text && JSON.parse(text);
        
        if (!response.ok) {
            let user = await accountService.userValue;

            if ([401, 403].includes(response.status) && user) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                // accountService.logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}