import axios from "axios";

export const checkTenant = async (tenantName: string) => {
  const response = await axios.get(`http://localhost:3000/tenants/check/${tenantName}`);
  return response.data;
};