// import { BehaviorSubject } from 'rxjs';
// import { useHistory } from "react-router-dom";
import { fetchWrapper } from "../helpers/fetchWrapper";
import { config } from "../helpers/config";
import { accountService } from './accountService'; 

const baseUrl = `${config.apiUrl}/suppliers`;

export const supplierService = { 
    create,
    getById,
    getAll,
    getAllActive,
    update
}; 
 
function create(params) {
    accountService.getJwt();
    return fetchWrapper.post(baseUrl, params);
}

function getById(id) {
    // accountService.getJwt();
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function getAll() {
    // accountService.getJwt();
    return fetchWrapper.get(baseUrl);
}

function getAllActive() {
    // accountService.getJwt();
    return fetchWrapper.get(`${baseUrl}/active`);
}

function update(id, params) {

    if( fetchWrapper.isTokenExpired() ) {

        return accountService.getJwt()
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            // user.jwtToken = null;
            accountService.setUser(user); 

            return fetchWrapper.put(`${baseUrl}/${id}`, params)
            .then((supplier) => {
                // publish user to subscribers and start timer to refresh token
                accountService.setSupplier(supplier);
                return supplier;
            });
        });        
    }

    return fetchWrapper.put(`${baseUrl}/${id}`, params)
    .then((supplier) => {
        // publish user to subscribers and start timer to refresh token
        accountService.setSupplier(supplier);
        return supplier;
    });
}
