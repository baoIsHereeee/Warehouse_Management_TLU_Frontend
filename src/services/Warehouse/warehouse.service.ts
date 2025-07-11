import axios from 'axios';

export const getWarehouses = async (
    page = 1,
    limit = 5,
    search = '',
    accessToken: string | null = null
  ) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
  
    const response = await axios.get('http://localhost:3000/warehouses', {
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

  export const getWarehouseList = async (accessToken: string | null, tenantId: string) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const response = await axios.get(`http://localhost:3000/warehouses/list/${tenantId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      },
    });

    return response.data;
  };

  export const getWarehouseById = async (id: string, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const response = await axios.get(`http://localhost:3000/warehouses/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
  };

  export const createWarehouse = async (
    warehouseData: any,
    accessToken: string | null
  ) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const response = await axios.post('http://localhost:3000/warehouses', warehouseData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
  };

  export const updateWarehouse = async (id: string, warehouseData: any, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const response = await axios.put(`http://localhost:3000/warehouses/${id}`, warehouseData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
  };
  
  export const deleteWarehouse = async (id: string, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const response = await axios.delete(`http://localhost:3000/warehouses/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
  };

  export const getWarehouseTransferList = async (
      page = 1,
      limit = 5,
      search = '',
      accessToken: string | null = null
    ) => {
      if (!accessToken) {
        throw new Error('No access token provided');
      }
    
      const response = await axios.get('http://localhost:3000/warehouses/transfers', {
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

  export const getWarehouseTransferById = async (id: string, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const response = await axios.get(`http://localhost:3000/warehouses/transfers/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
  };

  export const createWarehouseTransfer = async (
    warehouseTransferData: any,
    accessToken: string | null
  ) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const response = await axios.post('http://localhost:3000/warehouses/transfers', warehouseTransferData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
  };

  export const updateWarehouseTransfer = async (id: string, warehouseTransferData: any, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const response = await axios.put(`http://localhost:3000/warehouses/transfers/${id}`, warehouseTransferData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
  };

  export const deleteWarehouseTransfer = async (id: string, accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const response = await axios.delete(`http://localhost:3000/warehouses/transfers/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
  };