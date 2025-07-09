import instance from "./AxiosGlobal";

const country = () => instance.get("/negaras");

const getPortsByCountry = (params: Record<string, any>) =>
  instance.get("/pelabuhans", { params });

const getItemsByPort = (params: Record<string, any>) =>
  instance.get("/barangs", { params });

const APIs = {
  country,
  getPortsByCountry,
  getItemsByPort,
};

export default APIs;
