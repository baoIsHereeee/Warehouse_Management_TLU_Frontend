import axios from 'axios';

export const getTotalNumberOfInventory = async (accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const response = await axios.get('http://localhost:3000/report/total-number-of-inventory', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }

export const getTotalValueOfInventory = async (accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    
    const response = await axios.get('http://localhost:3000/report/total-value-of-inventory', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
} 

export const getTotalValueOfImports = async (accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    
    const response = await axios.get('http://localhost:3000/report/total-value-of-imports', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
}

export const getTotalValueOfExports = async (accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    
    const response = await axios.get('http://localhost:3000/report/total-value-of-exports', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
}

export const getInventoryValuePerWarehouse = async (accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    
    const response = await axios.get('http://localhost:3000/report/inventory-value-per-warehouse', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
}   

export const getTotalInventoryPerWarehouse = async (accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    
    const response = await axios.get('http://localhost:3000/report/total-inventory-per-warehouse', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
}

export const getLowStockProducts = async (accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    
    const response = await axios.get('http://localhost:3000/report/low-stock-products', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
}   

export const getInventoryDistributionByCategory = async (accessToken: string | null) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
    
    const response = await axios.get('http://localhost:3000/report/inventory-distribution-by-category', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
}

