import { BehaviorSubject } from 'rxjs';
import { useHistory } from "react-router-dom";
import { fetchWrapper } from "../helpers/fetchWrapper";
import { history } from "../helpers/history";
import { config } from "../helpers/config";
import { tutorService } from './tutorService';
// import { generateToken } from '../helpers/firebase';
// import { applicationService } from './applicationService'; 
import { Storage } from '@capacitor/storage';

const userSubject = new BehaviorSubject(null);
const tutorSubject = new BehaviorSubject(null);

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
    getAll,
    getById,
    update,
    getWithTutorId,
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value || userParse() },
    get tutorValue () { return tutorSubject.value || tutorParse() },
    switctToUser,
    switctToTutor,
    setUser,
    setTutor
}; 

async function setUser(user){
    userSubject.next(user);
    await Storage.set({ key: 'user', value: JSON.stringify(user) });
}

async function setTutor(tutor){
    tutorSubject.next(tutor);
    await Storage.set({ key: 'tutor', value: JSON.stringify(tutor), });
}

async function switctToUser() {
    const user = await userParse();
    user.role = "User";
    setUser(user);
    return user;
}

async function switctToTutor() {
    const user = await userParse();
    user.role = "Tutor";
    setUser(user);
    return user;
}

function login(email, password) {
    return fetchWrapper.post(`${baseUrl}/authenticate`, { email, password })
    .then( async (user) => {
        // publish user to subscribers and start timer to refresh token
        user.role = (user.tutor_id) ? "Tutor" : "User"; 
        if(user.tutor_id) {
            const tutor = await tutorService.getById(user.tutor_id);
            // console.log(tutor);
            setTutor(tutor);
        }
        setUser(user);
        return user;
    });
}

async function getJwt() {
    const user = await userParse();

    if(user) {

        const { email, role } = user;
        return fetchWrapper.post(`${baseUrl}/jwt`, { email })
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            user.role = role;
            setUser(user);        
            return user;
        });
    }

    return null;
/*     const user = await fetchWrapper.post(`${baseUrl}/jwt`, { email });
    // publish user to subscribers and start timer to refresh token
    // user.jwtToken = null;
    userSubject.next(user);
    window.localStorage.setItem('user', JSON.stringify(user));
    startRefreshTokenTimer();
    return user;
 */
}

function getWithTutorId(id) {

    if( fetchWrapper.isTokenExpired() ) {

        return getJwt()
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            setUser(user);            
            return fetchWrapper.get(`${baseUrl}/tutor/${id}`);
        });        
    }

    return fetchWrapper.get(`${baseUrl}/tutor/${id}`);
}

async function userParse() { 
    const { value } = await Storage.get({ key: 'user' });
    return JSON.parse( value ); 
}

async function tutorParse() { 

    const { value } = await Storage.get({ key: 'tutor' });
    return JSON.parse( value ); 
}

function logout() {

    if( fetchWrapper.isTokenExpired() ) {
        console.log("First thing")
        removeUserDetails();
        return 'success';
    }
    
    const user = userParse();
    // revoke token, stop refresh timer, publish null to user subscribers and redirect to login page
    return fetchWrapper.post(`${baseUrl}/revoke-token`, { token: user.refreshToken})
    .then( response => {
        removeUserDetails();
        return 'success';
    });
} 

async function removeUserDetails() {
    stopRefreshTokenTimer();
    userSubject.next(null);
    await Storage.remove({ key: 'user' });
    await Storage.remove({ key: 'tutor' });
}

function refreshToken() {
    // const { refreshToken } = userParse();
    // const { apiUrl } = config;

    // return fetchWrapper.post(`${baseUrl}/refresh-token`, { refreshToken, apiUrl } )
    return fetchWrapper.post(`${baseUrl}/refresh-token`, {} )
        .then( async (user) => {
            user.role = (user.tutor_id) ? "Tutor" : "User";
            if(user.tutor_id) {
                const tutor = await tutorService.getById(user.tutor_id);
                setTutor(tutor);
            }
            setUser(user);
            return user;
        });
}

function update(id, params) {

    if( fetchWrapper.isTokenExpired() ) {

        return getJwt()
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            setUser(user);        

            return fetchWrapper.put(`${baseUrl}/${id}`, params)
            .then(user => {
                // publish user to subscribers and start timer to refresh token
                const oldDetails = userParse();
                user.jwtToken = oldDetails.jwtToken;
                user.role = oldDetails.role;
                setUser(user);        
                return user;
            });
        });        
    }
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
    .then(user => {
        // publish user to subscribers and start timer to refresh token
        const oldDetails = userParse();
        user.jwtToken = oldDetails.jwtToken;
        user.role = oldDetails.role;
        setUser(user);        
        return user;
    });
}

function register(params) {
    return fetchWrapper.post(`${baseUrl}/register`, params);
}

function getById(id) {

    if( fetchWrapper.isTokenExpired() ) {

        return getJwt()
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            setUser(user);        

            return fetchWrapper.get(`${baseUrl}/${id}`)
            .then(user => {
                // publish user to subscribers and start timer to refresh token
                const oldDetails = userParse();
                user.jwtToken = oldDetails.jwtToken;
                user.role = oldDetails.role;
                setUser(user);        
                return user;
            });
        });        
    }

    return fetchWrapper.get(`${baseUrl}/${id}`)
    .then(user => {
        // publish user to subscribers and start timer to refresh token
        const oldDetails = userParse();
        user.jwtToken = oldDetails.jwtToken;
        user.role = oldDetails.role;
        setUser(user);        
        return user;
    });
}

function getAll() {
    if( fetchWrapper.isTokenExpired() ) {
        return getJwt()
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            setUser(user);        
            return fetchWrapper.get(baseUrl);
        });
    }   

    return fetchWrapper.get(baseUrl);
}


function googleSignUp(params) {
    return fetchWrapper.post(`${baseUrl}/google-signup`, params)
    .then(user => {
        // publish user to subscribers and start timer to refresh token
        setUser(user);        
        return user;
    });
}

function googleLogin(params) {

    return fetchWrapper.post(`${baseUrl}/google-login`, params)
    .then( async (user) => {
        // publish user to subscribers and start timer to refresh token
        user.role = (user.tutor_id) ? "Tutor" : "User";
        if(user.tutor_id) {
            const tutor = await tutorService.getById(user.tutor_id);
            setTutor(tutor);
        }
        setUser(user);
        return user;
    });
}

function registerTutor(params) {
    
    return fetchWrapper.post(`${baseUrl}/register-tutor`, params)
    .then( async (user) => {
        // publish user to subscribers and start timer to refresh token
        user.role = (user.tutor_id) ? "Tutor" : "User";
        if(user.tutor_id) {
            const tutor = await tutorService.getById(user.tutor_id);
            setTutor(tutor);
        }
        setUser(user);
        return user;
    });
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