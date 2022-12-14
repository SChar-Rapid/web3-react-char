import type { Networkish } from '@ethersproject/networks';
import type { BaseProvider, Web3Provider } from '@ethersproject/providers';
import type { Actions, Connector, Web3ReactState, Web3ReactStore } from '@web3-react/types';
import type { UseBoundStore } from 'zustand';
export declare type Web3ReactHooks = ReturnType<typeof getStateHooks> & ReturnType<typeof getDerivedHooks> & ReturnType<typeof getAugmentedHooks>;
export declare type Web3ReactSelectedHooks = ReturnType<typeof getSelectedConnector>;
export declare type Web3ReactPriorityHooks = ReturnType<typeof getPriorityConnector>;
/**
 * Wraps the initialization of a `connector`. Creates a zustand `store` with `actions` bound to it, and then passes
 * these to the connector as specified in `f`. Also creates a variety of `hooks` bound to this `store`.
 *
 * @typeParam T - The type of the `connector` returned from `f`.
 * @param f - A function which is called with `actions` bound to the returned `store`.
 * @returns [connector, hooks, store] - The initialized connector, a variety of hooks, and a zustand store.
 */
export declare function initializeConnector<T extends Connector>(f: (actions: Actions) => T): [T, Web3ReactHooks, Web3ReactStore];
/**
 * Creates a variety of convenience `hooks` that return data associated with a particular passed connector.
 *
 * @param initializedConnectors - Two or more [connector, hooks(, store)] arrays, as returned from initializeConnector.
 * @returns hooks - A variety of convenience hooks that wrap the hooks returned from initializeConnector.
 */
export declare function getSelectedConnector(...initializedConnectors: [Connector, Web3ReactHooks][] | [Connector, Web3ReactHooks, Web3ReactStore][]): {
    useSelectedStore: (connector: Connector) => Web3ReactStore;
    useSelectedChainId: (connector: Connector) => number | undefined;
    useSelectedAccounts: (connector: Connector) => string[] | undefined;
    useSelectedIsActivating: (connector: Connector) => boolean;
    useSelectedAccount: (connector: Connector) => string | undefined;
    useSelectedIsActive: (connector: Connector) => boolean;
    useSelectedProvider: <T extends BaseProvider = Web3Provider>(connector: Connector, network?: Networkish | undefined) => T | undefined;
    useSelectedENSNames: (connector: Connector, provider?: BaseProvider | undefined) => undefined[] | (string | null)[];
    useSelectedENSName: (connector: Connector, provider?: BaseProvider | undefined) => string | null | undefined;
};
/**
 * Creates a variety of convenience `hooks` that return data associated with the first of the `initializedConnectors`
 * that is active.
 *
 * @param initializedConnectors - Two or more [connector, hooks(, store)] arrays, as returned from initializeConnector.
 * @returns hooks - A variety of convenience hooks that wrap the hooks returned from initializeConnector.
 */
export declare function getPriorityConnector(...initializedConnectors: [Connector, Web3ReactHooks][] | [Connector, Web3ReactHooks, Web3ReactStore][]): {
    useSelectedStore: (connector: Connector) => Web3ReactStore;
    useSelectedChainId: (connector: Connector) => number | undefined;
    useSelectedAccounts: (connector: Connector) => string[] | undefined;
    useSelectedIsActivating: (connector: Connector) => boolean;
    useSelectedAccount: (connector: Connector) => string | undefined;
    useSelectedIsActive: (connector: Connector) => boolean;
    useSelectedProvider: <T extends BaseProvider = Web3Provider>(connector: Connector, network?: Networkish | undefined) => T | undefined;
    useSelectedENSNames: (connector: Connector, provider?: BaseProvider | undefined) => undefined[] | (string | null)[];
    useSelectedENSName: (connector: Connector, provider?: BaseProvider | undefined) => string | null | undefined;
    usePriorityConnector: () => Connector;
    usePriorityStore: () => Web3ReactStore;
    usePriorityChainId: () => number | undefined;
    usePriorityAccounts: () => string[] | undefined;
    usePriorityIsActivating: () => boolean;
    usePriorityAccount: () => string | undefined;
    usePriorityIsActive: () => boolean;
    usePriorityProvider: <T_1 extends BaseProvider = Web3Provider>(network?: Networkish | undefined) => T_1 | undefined;
    usePriorityENSNames: (provider?: BaseProvider | undefined) => undefined[] | (string | null)[];
    usePriorityENSName: (provider?: BaseProvider | undefined) => string | null | undefined;
};
declare function getStateHooks(useConnector: UseBoundStore<Web3ReactStore>): {
    useChainId: () => Web3ReactState['chainId'];
    useAccounts: () => Web3ReactState['accounts'];
    useIsActivating: () => Web3ReactState['activating'];
};
declare function getDerivedHooks({ useChainId, useAccounts, useIsActivating }: ReturnType<typeof getStateHooks>): {
    useAccount: () => string | undefined;
    useIsActive: () => boolean;
};
declare function getAugmentedHooks<T extends Connector>(connector: T, { useAccounts, useChainId }: ReturnType<typeof getStateHooks>, { useAccount, useIsActive }: ReturnType<typeof getDerivedHooks>): {
    useProvider: <T_1 extends BaseProvider = Web3Provider>(network?: Networkish | undefined, enabled?: boolean) => T_1 | undefined;
    useENSNames: (provider?: BaseProvider | undefined) => undefined[] | (string | null)[];
    useENSName: (provider?: BaseProvider | undefined) => undefined | string | null;
};
export {};
