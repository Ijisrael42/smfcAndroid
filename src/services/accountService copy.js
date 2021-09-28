import { BehaviorSubject } from 'rxjs';
import { fetchWrapper } from "../helpers/fetchWrapper";
import { config } from "../helpers/config";
// import { generateToken } from '../helpers/firebase';
// import { applicationService } from './applicationService'; 

const userSubject = new BehaviorSubject(null);

const baseUrl = `${config.apiUrl}/accounts`;

export const accountService = {
    login,
    logout,
    refreshToken,
    register,
    googleSignUp,
    googleLogin,
    registerTutor,
    getJwt,
    getById,
    update,
    getWithTutorId,
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value || userParse() },
    switctToUser,
    switctToTutor
}; 

function switctToUser() {
    const user = userParse();
    user.role = "User";
    window.localStorage.setItem( 'user', JSON.stringify(user) );
}

function switctToTutor() {
    const user = userParse();
    user.role = "Tutor";
    window.localStorage.setItem( 'user', JSON.stringify(user) );
}

function login(email, password) {
    return fetchWrapper.post(`${baseUrl}/authenticate`, { email, password })
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            // user.jwtToken = null;
            userSubject.next(user);
            window.localStorage.setItem( 'user', JSON.stringify(user) );
            startRefreshTokenTimer();
            return user;
        });
}

async function getJwt() {
    const { email } = userParse();

    return fetchWrapper.post(`${baseUrl}/jwt`, { email })
    .then(user => {
        // publish user to subscribers and start timer to refresh token
        // user.jwtToken = null;
        userSubject.next(user);
        window.localStorage.setItem( 'user', JSON.stringify(user) );
        startRefreshTokenTimer();
        return user;
    });
}

function getWithTutorId(id) {

    if( fetchWrapper.isTokenExpired() ) {

        return getJwt()
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            // user.jwtToken = null;
            window.localStorage.setItem( 'user', JSON.stringify(user) );

            return fetchWrapper.get(`${baseUrl}/tutor/${id}`);
        });        
    }

    return fetchWrapper.get(`${baseUrl}/tutor/${id}`);
}

function userParse() { 
    return JSON.parse( window.localStorage.getItem('user') ); 
}

function logout() {
    // revoke token, stop refresh timer, publish null to user subscribers and redirect to login page
    return fetchWrapper.post(`${baseUrl}/revoke-token`, {}).then( response => {
        stopRefreshTokenTimer();
        userSubject.next(null);
        // window.localStorage.removeItem('user');
        return response;
    });
    // history.push('/login');
} 

function refreshToken() {
    // const { refreshToken } = userParse();
    // const { apiUrl } = config;

    // return fetchWrapper.post(`${baseUrl}/refresh-token`, { refreshToken, apiUrl } )
    return fetchWrapper.post(`${baseUrl}/refresh-token`, {} )
        .then(user => {
            userSubject.next(user);
            window.localStorage.setItem( 'user', JSON.stringify(user) );
            return user;
        });
}

function update(id, params) {

    // if( fetchWrapper.isTokenExpired() ) 
    {

        return getJwt()
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            window.localStorage.setItem( 'user', JSON.stringify(user) );

            return fetchWrapper.put(`${baseUrl}/${user.id}`, params)
            .then(user => {
                
                userSubject.next(user);
                window.localStorage.setItem( 'user', JSON.stringify(user) );
                startRefreshTokenTimer();
                return user;
            });
        });        
    }

/*     return fetchWrapper.put(`${baseUrl}/${id}`, params)
    .then(user => {
                
        userSubject.next(user);
        window.localStorage.setItem( 'user', JSON.stringify(user) );
        startRefreshTokenTimer();
        return user;
    });
 */
}

function register(params) {
    return fetchWrapper.post(`${baseUrl}/register`, params);
}

function getById(id) {

    if( fetchWrapper.isTokenExpired() ) {

        return getJwt()
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            // user.jwtToken = null;
            window.localStorage.setItem( 'user', JSON.stringify(user) );

            return fetchWrapper.get(`${baseUrl}/${id}`)
            .then(user => {
                // publish user to subscribers and start timer to refresh token
                userSubject.next(user);
                const oldDetails = userParse();
                user.jwtToken = oldDetails.jwtToken;

                window.localStorage.setItem( 'user', JSON.stringify(user) );
                startRefreshTokenTimer();
                return user;
            });
        });        
    }

    return fetchWrapper.get(`${baseUrl}/${id}`)
    .then(user => {
        // publish user to subscribers and start timer to refresh token
        userSubject.next(user);
        const oldDetails = userParse();
        user.jwtToken = oldDetails.jwtToken;

        window.localStorage.setItem( 'user', JSON.stringify(user) );
        startRefreshTokenTimer();
        return user;
    });
}

function googleSignUp(params) {
    return fetchWrapper.post(`${baseUrl}/google-signup`, params)
    .then(user => {
        // publish user to subscribers and start timer to refresh token
        // user.jwtToken = null;
        userSubject.next(user);
        window.localStorage.setItem( 'user', JSON.stringify(user) );
        startRefreshTokenTimer();
        return user;
    });
}

function googleLogin(params) {

    return fetchWrapper.post(`${baseUrl}/google-login`, params)
    .then(user => {
        // publish user to subscribers and start timer to refresh token
        // user.jwtToken = null;
        // generateToken();
        
        userSubject.next(user);
        window.localStorage.setItem( 'user', JSON.stringify(user) );
        startRefreshTokenTimer();
        return user;
    });
}

function registerTutor(params) {
    return fetchWrapper.post(`${baseUrl}/register-tutor`, params);
}

// helper functions

let refreshTokenTimeout;

function startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    if( userSubject && userSubject.value.jwtToken )
    {
        const jwtToken = JSON.parse(atob(userSubject.value.jwtToken.split('.')[1]));

        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        refreshTokenTimeout = setTimeout(refreshToken, timeout);
    }
}

function stopRefreshTokenTimer() {
    clearTimeout(refreshTokenTimeout);
}