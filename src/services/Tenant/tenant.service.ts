import axios from "axios";

export const checkTenant = async (tenantName: string) => {
  const response = await axios.get(`http://localhost:3000/tenants/check/${tenantName}`);
  return response.data;
};

export const createTenant = async (name: string) => {
  const response = await axios.post('http://localhost:3000/tenants', { name });
  return response.data;
};
