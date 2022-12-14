import type { Actions, Provider } from '@web3-react/types';
import { Connector } from '@web3-react/types';
/**
 * @param provider - An EIP-1193 ({@link https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md}) provider.
 * @param onError - Handler to report errors thrown from eventListeners.
 */
export interface EIP1193ConstructorArgs {
    actions: Actions;
    provider: Provider;
    onError?: (error: Error) => void;
}
export declare class EIP1193 extends Connector {
    /** {@inheritdoc Connector.provider} */
    provider: Provider;
    constructor({ actions, provider, onError }: EIP1193ConstructorArgs);
    /** {@inheritdoc Connector.connectEagerly} */
    connectEagerly(): Promise<void>;
    /** {@inheritdoc Connector.activate} */
    activate(): Promise<void>;
}
