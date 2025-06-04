import axios from "axios";

interface CreateTenantDTO {
  name: string;
  email: string;
}

export const checkTenant = async (tenantName: string) => {
  const response = await axios.get(`http://localhost:3000/tenants/check/${tenantName}`);
  return response.data;
};

export const createTenant = async (data: CreateTenantDTO) => {
  const response = await axios.post('http://localhost:3000/tenants', data);
  return response.data;
};
