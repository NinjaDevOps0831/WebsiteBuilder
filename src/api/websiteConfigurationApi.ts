import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const fetchWebsiteConfigurations = async () => {
    try {
        const response = await api.get('/api/templates/');
        return response.data;
    } catch (error) {
        console.error('Error fetching website configurations: ', error);
        throw error;
    }
};

export const getWebsiteConfiguration = async (id) => {
    try {
        const response = await api.get(`/api/templates/${id}/`);
        return response.data;
    } catch (error) {
        console.log('Error getting website configuration: ', error);
    }
};

export const createWebsiteConfiguration = async (configurationData) => {  
    try{
        const response = await api.post('/api/templates/', configurationData);  
        return response.data;  
    } catch(error) {
        console.error('Error creating website configuration: ', error);
        throw error;
    }
};  

export const updateWebsiteConfiguration = async (id, configurationData) => { 
    try {
        const response = await api.put(`/api/templates/${id}/`, configurationData);  
        return response.data;  
    } catch(error) {
        console.error('Error updating website configuration: ', error);
        throw error;
    }
};  

export const deleteWebsiteConfiguration = async (id) => {
    try {
        await api.delete(`/api/templates/${id}/`);
    } catch (error) {
        console.error('Error deleting website configuration: ', error);
        throw error;
    }
};