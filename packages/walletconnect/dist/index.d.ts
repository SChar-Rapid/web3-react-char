/// <reference types="node" />
import type WalletConnectProvider from '@walletconnect/ethereum-provider';
import type { IWCEthRpcConnectionOptions } from '@walletconnect/types';
import type { Actions } from '@web3-react/types';
import { Connector } from '@web3-react/types';
import EventEmitter3 from 'eventemitter3';
import type { EventEmitter } from 'node:events';
export declare const URI_AVAILABLE = "URI_AVAILABLE";
declare type MockWalletConnectProvider = WalletConnectProvider & EventEmitter;
declare type WalletConnectOptions = Omit<IWCEthRpcConnectionOptions, 'rpc' | 'infuraId' | 'chainId'> & {
    rpc: {
        [chainId: number]: string | string[];
    };
};
/**
 * @param options - Options to pass to `@walletconnect/ethereum-provider`
 * @param defaultChainId - The chainId to connect to in activate if one is not provided.
 * @param timeout - Timeout, in milliseconds, after which to treat network calls to urls as failed when selecting
 * online urls.
 * @param onError - Handler to report errors thrown from eventListeners.
 */
export interface WalletConnectConstructorArgs {
    actions: Actions;
    options: WalletConnectOptions;
    defaultChainId?: number;
    timeout?: number;
    onError?: (error: Error) => void;
}
/**
 * @param desiredChainId - The desired chainId to connect to.
 * @param preventUserPrompt - If true, will suppress user-facing interactions and only connect silently.
 */
export interface ActivateOptions {
    desiredChainId?: number;
    onlyIfAlreadyConnected?: boolean;
}
export declare class WalletConnect extends Connector {
    /** {@inheritdoc Connector.provider} */
    provider?: MockWalletConnectProvider;
    readonly events: EventEmitter3<string | symbol, any>;
    private readonly options;
    private readonly rpc;
    private readonly defaultChainId;
    private readonly timeout;
    private eagerConnection?;
    constructor({ actions, options, defaultChainId, timeout, onError }: WalletConnectConstructorArgs);
    private disconnectListener;
    private chainChangedListener;
    private accountsChangedListener;
    private URIListener;
    private isomorphicInitialize;
    /** {@inheritdoc Connector.connectEagerly} */
    connectEagerly(): Promise<void>;
    /**
     * @param desiredChainId - The desired chainId to connect to.
     */
    activate(desiredChainId?: number): Promise<void>;
    /** {@inheritdoc Connector.deactivate} */
    deactivate(): Promise<void>;
}
export {};
