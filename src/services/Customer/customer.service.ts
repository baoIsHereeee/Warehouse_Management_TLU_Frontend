import axios from 'axios';

export const getCustomers = async (
    page = 1,
    limit = 5,
    search = '',
    accessToken: string | null = null
  ) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
  
    const response = await axios.get('http://localhost:3000/customers', {
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

  export const getCustomerList = async (accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const response = await axios.get('http://localhost:3000/customers/list', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  export const createCustomer = async (categoryData: any, accessToken: string) => {
    const response = await axios.post('http://localhost:3000/customers', categoryData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const getCustomerById = async (id: string, accessToken: string) => {
    const response = await axios.get(`http://localhost:3000/customers/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const updateCustomer = async (id: string, customerData: any, accessToken: string) => {
    const response = await axios.put(`http://localhost:3000/customers/${id}`, customerData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const deleteCustomer = async (id: string, accessToken: string) => {
    const response = await axios.delete(`http://localhost:3000/customers/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};          

