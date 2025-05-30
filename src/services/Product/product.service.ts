import axios from 'axios';

export const getProducts = async (
    page = 1,
    limit = 5,
    search = '',
    accessToken: string | null = null
  ) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }
  
    const response = await axios.get('http://localhost:3000/products', {
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

  export const getProductList = async (accessToken: string | null, tenantId: string) => {
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const response = await axios.get(`http://localhost:3000/products/list/${tenantId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }

  export const createProduct = async (
    formData: FormData,
    accessToken: string | null
  ) => {
    const res = await fetch('http://localhost:3000/products', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken || ''}`,
      },
      body: formData,
    });

    if (!res.ok) {
      let errorMessage = 'Failed to create product';

      try {
        const errorData = await res.json();
        if (errorData?.message) {
          errorMessage = typeof errorData.message === 'string'
            ? errorData.message
            : errorData.message.join?.(', ') || JSON.stringify(errorData.message);
        } else {
          errorMessage = JSON.stringify(errorData);
        }
      } catch (parseError) {
        const fallbackText = await res.text();
        errorMessage = fallbackText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
};


export const getCategories = async (accessToken: string | null) => {
  if (!accessToken) {
    throw new Error('No access token provided');
  }

  const response = await axios.get('http://localhost:3000/categories', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const getProductById = async (id: string, accessToken: string | null) => {
  if (!accessToken) {
    throw new Error('No access token provided');
  }

  const response = await axios.get(`http://localhost:3000/products/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const updateProduct = async (
  id: string,
  productData: any,
  accessToken: string | null
) => {
  if (!accessToken) {
    throw new Error('No access token provided');
  }

  try {
    const response = await axios.put(
      `http://localhost:3000/products/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const message =
        error.response.data.message || 'Something went wrong from server';
      if (Array.isArray(message)) {
        throw new Error(message.join('\n'));
      }
      throw new Error(message);
    }

    throw new Error(error.message || 'Unknown error');
  }
};

export const deleteProduct = async (id: string, token?: string) => {
  const response = await fetch(`http://localhost:3000/products/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete product');
  }
};