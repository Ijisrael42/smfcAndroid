// import { BehaviorSubject } from 'rxjs';
// import { useHistory } from "react-router-dom";
import { fetchWrapper } from "../helpers/fetchWrapper";
import { config } from "../helpers/config";
import { accountService } from './accountService'; 

// const questionSubject = new BehaviorSubject(null);

const baseUrl = `${config.apiUrl}/fields`;

export const fieldService = {
    create,
    getById,
    getByParams,
    getAll,
    update,
    delete: _delete
}; 

function create(params) {
    accountService.getJwt();
    return fetchWrapper.post(baseUrl, params);
}

function getByParams(params) {
    accountService.getJwt();
    return fetchWrapper.post(`${baseUrl}/params`, params);
}

function getById(id) {
    accountService.getJwt();
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function getAll() {
    // accountService.getJwt();
    return fetchWrapper.get(`${baseUrl}`);
}

function update(id, params) {
    accountService.getJwt();
    return fetchWrapper.put(`${baseUrl}/${id}`, params);
}

function _delete(id) {
    accountService.getJwt();
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}
