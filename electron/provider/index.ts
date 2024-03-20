import { IProvider } from "@canvas/electron/providers/base-provider";
import { getProvider } from "./setup";

export * from "./login";

export function getProviderExecutor<T extends keyof IProvider>(functionName: T) {
  // @ts-ignore
  return (_: Electron.IpcMainInvokeEvent, ...params: Parameters<IProvider[T]>) => getProvider()[functionName](...params);
}
