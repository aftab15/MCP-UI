import axios from "axios";
const BASE_URL = "http://localhost:3000/mcp";

export const listTools = async () => {
  const resp = await axios.post(BASE_URL, {
    jsonrpc: "2.0",
    method: "tool.list",
    id: 1,
  });
  return resp.data.result.tools;
};

export const invokeTool = async (toolId, input) => {
  const resp = await axios.post(BASE_URL, {
    jsonrpc: "2.0",
    method: "tool.invoke",
    params: { toolId, input },
    id: Date.now(),
  });
  if (resp.data.error) throw new Error(resp.data.error.message);
  return resp.data.result;
};
