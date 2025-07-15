const DEFAULT_API_KEY = process.env.STABILITY_API_KEY || 'try-it-out';
const API_URL_TEMPLATE = 'https://rpc.stabilityprotocol.com/zkt/';

function sanitizeKey(apiKey: string) {
  if (!apiKey || apiKey === 'try-it-out') return apiKey;
  return apiKey.length > 12 ? `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}` : '***';
}

async function postRequest(payload: any, apiKey: string = DEFAULT_API_KEY): Promise<string> {
  const url = `${API_URL_TEMPLATE}${apiKey}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.text();
  } catch (err: any) {
    return `Error: ${String(err).replace(apiKey, sanitizeKey(apiKey))}`;
  }
}

export async function postZktV1(message: string, apiKey?: string) {
  return postRequest({ arguments: message }, apiKey);
}

export interface ContractCall {
  to: string;
  abi: any[];
  method: string;
  arguments: any[];
  id?: number;
}

export async function callContractRead(call: ContractCall, apiKey?: string) {
  return postRequest({ ...call, id: call.id ?? 1 }, apiKey);
}

export interface ContractWrite extends ContractCall {
  wait?: boolean;
}

export async function callContractWrite(call: ContractWrite, apiKey?: string) {
  return postRequest({ ...call, wait: call.wait ?? true, id: call.id ?? 1 }, apiKey);
}

export interface DeployContract {
  code: string;
  arguments?: any[];
  wait?: boolean;
  id?: number;
}

export async function deployContract(call: DeployContract, apiKey?: string) {
  return postRequest({
    code: call.code,
    arguments: call.arguments || [],
    wait: call.wait ?? false,
    id: call.id ?? 1
  }, apiKey);
}

export { DEFAULT_API_KEY };
