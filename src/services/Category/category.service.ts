import axios from 'axios';

export const getCategories = async (accessToken: string) => {
    const response = await axios.get('http://localhost:3000/categories', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const createCategory = async (categoryData: any, accessToken: string) => {
    const response = await axios.post('http://localhost:3000/categories', categoryData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const getCategoryById = async (id: string, accessToken: string) => {
    const response = await axios.get(`http://localhost:3000/categories/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const updateCategory = async (id: string, categoryData: any, accessToken: string) => {
    const response = await axios.put(`http://localhost:3000/categories/${id}`, categoryData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const deleteCategory = async (id: string, accessToken: string) => {
    const response = await axios.delete(`http://localhost:3000/categories/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};