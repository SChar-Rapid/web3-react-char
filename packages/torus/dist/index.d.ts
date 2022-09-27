import type detectEthereumProvider from "@metamask/detect-provider";
import type { Actions, AddEthereumChainParameter, Provider, WatchAssetParameters } from "@web3-react/types";
import { Connector } from "@web3-react/types";
declare type torusProvider = Provider;
/**
 * @param options - Options to pass to `@metamask/detect-provider`
 * @param onError - Handler to report errors thrown from eventListeners.
 */
export interface torusConstructorArgs {
    actions: Actions;
    options?: Parameters<typeof detectEthereumProvider>[0];
    onError?: (error: Error) => void;
}
export declare class TorusConnector extends Connector {
    /** {@inheritdoc Connector.provider} */
    provider?: torusProvider;
    private eagerConnection?;
    constructor({ actions, options, onError }: torusConstructorArgs);
    private isomorphicInitialize;
    /** {@inheritdoc Connector.connectEagerly} */
    connectEagerly(): Promise<void>;
    /**
     * Initiates a connection.
     *
     * @param desiredChainIdOrChainParameters - If defined, indicates the desired chain to connect to. If the user is
     * already connected to this chain, no additional steps will be taken. Otherwise, the user will be prompted to switch
     * to the chain, if one of two conditions is met: either they already have it added in their extension, or the
     * argument is of type AddEthereumChainParameter, in which case the user will be prompted to add the chain with the
     * specified parameters first, before being prompted to switch.
     */
    activate(desiredChainIdOrChainParameters?: number | AddEthereumChainParameter): Promise<void>;
    watchAsset({ address, symbol, decimals, image, }: WatchAssetParameters): Promise<true>;
}
export {};
