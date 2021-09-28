// import { BehaviorSubject } from 'rxjs';
import { fetchWrapper } from "../helpers/fetchWrapper";
import { config } from "../helpers/config";
import { accountService } from './accountService'; 

const baseUrl = `${config.apiUrl}/bids`;

export const bidService = {
    create,
    update,
    getById,
    getByUserId,
    getByTutorId,
    getByCategory,
    getByVariable,
    getByQuestionId
}; 

function create(params) {

    if( fetchWrapper.isTokenExpired() ) {

        return accountService.getJwt()
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            // user.jwtToken = null;
            window.localStorage.setItem( 'user', JSON.stringify(user) );

            return fetchWrapper.post(baseUrl, params);
       });        
    }

    return fetchWrapper.post(baseUrl, params);
}

function update(id, params) {

    if( fetchWrapper.isTokenExpired() ) {

        return accountService.getJwt()
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            // user.jwtToken = null;
            window.localStorage.setItem( 'user', JSON.stringify(user) );

            return fetchWrapper.put(`${baseUrl}/${id}`, params);
       });        
    }

    return fetchWrapper.put(`${baseUrl}/${id}`, params);
}

function getById(id) {

    if( fetchWrapper.isTokenExpired() ) {

        return accountService.getJwt()
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            // user.jwtToken = null;
            window.localStorage.setItem( 'user', JSON.stringify(user) );

            return fetchWrapper.get(`${baseUrl}/${id}`);
       });        
    }

    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function getByUserId(user_id) {

    if( fetchWrapper.isTokenExpired() ) {

        return accountService.getJwt()
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            // user.jwtToken = null;
            window.localStorage.setItem( 'user', JSON.stringify(user) );

            return fetchWrapper.get(`${baseUrl}/list/${user_id}`);
       });        
    }

    return fetchWrapper.get(`${baseUrl}/list/${user_id}`);
}

function getByCategory(params) {

    if( fetchWrapper.isTokenExpired() ) {

        return accountService.getJwt()
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            // user.jwtToken = null;
            window.localStorage.setItem( 'user', JSON.stringify(user) );

            return fetchWrapper.post(`${baseUrl}/category`, params);
       });        
    }

    return fetchWrapper.post(`${baseUrl}/category`, params);
}

function getByVariable(params) {

    if( fetchWrapper.isTokenExpired() ) {

        return accountService.getJwt()
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            // user.jwtToken = null;
            window.localStorage.setItem( 'user', JSON.stringify(user) );

            return fetchWrapper.post(`${baseUrl}/variable`, params);
       });        
    }

    return fetchWrapper.post(`${baseUrl}/variable`, params);
}

function getByQuestionId(id) {

    if( fetchWrapper.isTokenExpired() ) {

        return accountService.getJwt()
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            // user.jwtToken = null;
            window.localStorage.setItem( 'user', JSON.stringify(user) );

            return fetchWrapper.get(`${baseUrl}/question/${id}`);
       });        
    }

    return fetchWrapper.get(`${baseUrl}/question/${id}`);
}

function getByTutorId(id) {

    if( fetchWrapper.isTokenExpired() ) {

        return accountService.getJwt()
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            // user.jwtToken = null;
            window.localStorage.setItem( 'user', JSON.stringify(user) );

            return fetchWrapper.get(`${baseUrl}/tutor-list/${id}`);
       });        
    }

    return fetchWrapper.get(`${baseUrl}/tutor-list/${id}`);
}