import { WsClient } from "tsrpc-browser";
import { serviceProto, ServiceType } from "./shared/protocols/serviceProto";
import { mockApis } from "./models/mockApis";

export function getClient(): WsClient<ServiceType> {
    const client =  new WsClient(serviceProto, {
        server: "ws://127.0.0.1:9002",
        // Remove this to use binary mode (remove from the server too)
        json: true,
        logger: console,
    })
    // // Client Mock
    // client.flows.preCallApiFlow.push(async v => {
    //     // 有对应的 MockAPI 则 Mock，否则请求真实后端
    //     let mockApi = mockApis[v.apiName];
    //     if (mockApi) {
    //         client.logger?.log('[MockReq]', v.apiName, v.req);
    //         v.return = await mockApi!(v.req as any);
    //         client.logger?.log('[MockRes]', v.apiName, v.return);
    //     }

    //     return v;
    // })
    return client;
}