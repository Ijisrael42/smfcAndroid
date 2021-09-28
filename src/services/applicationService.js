// import { BehaviorSubject } from 'rxjs';
// import { useHistory } from "react-router-dom";
import { fetchWrapper } from "../helpers/fetchWrapper";
import { config } from "../helpers/config";
import { accountService } from './accountService'; 

const baseUrl = `${config.apiUrl}/applications`;

export const applicationService = {
    create,
    getById,
    getByUserId
}; 

function create(params) {

    return fetchWrapper.post(baseUrl, params);
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