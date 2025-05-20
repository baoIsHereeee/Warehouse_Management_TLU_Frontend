import axios from "axios";

export const getExports = async (
    page = 1,
    limit = 5,
    search = '',
    accessToken: string | null = null
  ) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
  
    const response = await axios.get('http://localhost:3000/exports', {
      params: {
        page,
        limit,
        search,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    return response.data;
  };

  export const getExportById = async (id: string, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const response = await axios.get(`http://localhost:3000/exports/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  export const createExport = async (exportData: any, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    const response = await axios.post('http://localhost:3000/exports', exportData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  export const updateExport = async (id: string, exportData: any, accessToken: string | null) => {  
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    const response = await axios.put(`http://localhost:3000/exports/${id}`, exportData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  export const deleteExport = async (id: string, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    const response = await axios.delete(`http://localhost:3000/exports/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }); 
    return response.data;
  };