import axios from 'axios';

export const getSuppliers = async (
    page = 1,
    limit = 5,
    search = '',
    accessToken: string | null = null
  ) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
  
    const response = await axios.get('http://localhost:3000/suppliers', {
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

  export const getSupplierList = async (accessToken: string, tenantId: string) => {
    const response = await axios.get(`http://localhost:3000/suppliers/list/${tenantId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
  };

  export const createSupplier = async (categoryData: any, accessToken: string) => {
    const response = await axios.post('http://localhost:3000/suppliers', categoryData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const getSupplierById = async (id: string, accessToken: string) => {
    const response = await axios.get(`http://localhost:3000/suppliers/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const updateSupplier = async (id: string, supplierData: any, accessToken: string) => {
    const response = await axios.put(`http://localhost:3000/suppliers/${id}`, supplierData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const deleteSupplier = async (id: string, accessToken: string) => {
    const response = await axios.delete(`http://localhost:3000/suppliers/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};          

