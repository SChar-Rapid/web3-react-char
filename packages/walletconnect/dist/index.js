"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnect = exports.URI_AVAILABLE = void 0;
const types_1 = require("@web3-react/types");
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const utils_1 = require("./utils");
exports.URI_AVAILABLE = 'URI_AVAILABLE';
function parseChainId(chainId) {
    return typeof chainId === 'string' ? Number.parseInt(chainId) : chainId;
}
class WalletConnect extends types_1.Connector {
    constructor({ actions, options, defaultChainId, timeout = 5000, onError }) {
        super(actions, onError);
        this.events = new eventemitter3_1.default();
        this.disconnectListener = (error) => {
            var _a;
            this.actions.resetState();
            if (error)
                (_a = this.onError) === null || _a === void 0 ? void 0 : _a.call(this, error);
        };
        this.chainChangedListener = (chainId) => {
            this.actions.update({ chainId: parseChainId(chainId) });
        };
        this.accountsChangedListener = (accounts) => {
            this.actions.update({ accounts });
        };
        this.URIListener = (_, payload) => {
            this.events.emit(exports.URI_AVAILABLE, payload.params[0]);
        };
        const { rpc } = options, rest = __rest(options, ["rpc"]);
        this.options = rest;
        this.rpc = Object.keys(rpc).reduce((accumulator, chainId) => {
            const value = rpc[Number(chainId)];
            accumulator[Number(chainId)] = Array.isArray(value) ? value : [value];
            return accumulator;
        }, {});
        this.defaultChainId = defaultChainId !== null && defaultChainId !== void 0 ? defaultChainId : Number(Object.keys(this.rpc)[0]);
        this.timeout = timeout;
    }
    isomorphicInitialize(chainId = this.defaultChainId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.eagerConnection)
                return;
            // because we can only use 1 url per chainId, we need to decide between multiple, where necessary
            const rpc = Promise.all(Object.keys(this.rpc).map((chainId) => __awaiter(this, void 0, void 0, function* () {
                return [
                    Number(chainId),
                    yield (0, utils_1.getBestUrl)(this.rpc[Number(chainId)], this.timeout),
                ];
            }))).then((results) => results.reduce((accumulator, [chainId, url]) => {
                accumulator[chainId] = url;
                return accumulator;
            }, {}));
            return (this.eagerConnection = Promise.resolve().then(() => __importStar(require('@walletconnect/ethereum-provider'))).then((m) => __awaiter(this, void 0, void 0, function* () {
                this.provider = new m.default(Object.assign(Object.assign({}, this.options), { chainId, rpc: yield rpc }));
                this.provider.on('disconnect', this.disconnectListener);
                this.provider.on('chainChanged', this.chainChangedListener);
                this.provider.on('accountsChanged', this.accountsChangedListener);
                this.provider.connector.on('display_uri', this.URIListener);
            })));
        });
    }
    /** {@inheritdoc Connector.connectEagerly} */
    connectEagerly() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const cancelActivation = this.actions.startActivation();
            try {
                yield this.isomorphicInitialize();
                if (!((_a = this.provider) === null || _a === void 0 ? void 0 : _a.connected))
                    throw Error('No existing connection');
                // for walletconnect, we always use sequential instead of parallel fetches because otherwise
                // chainId defaults to 1 even if the connecting wallet isn't on mainnet
                const accounts = yield ((_b = this.provider) === null || _b === void 0 ? void 0 : _b.request({ method: 'eth_accounts' }));
                if (!accounts.length)
                    throw new Error('No accounts returned');
                const chainId = yield this.provider
                    .request({ method: 'eth_chainId' })
                    .then((chainId) => parseChainId(chainId));
                this.actions.update({ chainId, accounts });
            }
            catch (error) {
                cancelActivation();
                throw error;
            }
        });
    }
    /**
     * @param desiredChainId - The desired chainId to connect to.
     */
    activate(desiredChainId) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            // this early return clause catches some common cases if activate is called after connection has been established
            if ((_a = this.provider) === null || _a === void 0 ? void 0 : _a.connected) {
                if (!desiredChainId || desiredChainId === this.provider.chainId)
                    return;
                // beacuse the provider is already connected, we can ignore the suppressUserPrompts
                return this.provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: `0x${desiredChainId.toString(16)}` }],
                });
            }
            const cancelActivation = this.actions.startActivation();
            // if we're trying to connect to a specific chain that we're not already initialized for, we have to re-initialize
            if (desiredChainId && desiredChainId !== ((_b = this.provider) === null || _b === void 0 ? void 0 : _b.chainId))
                yield this.deactivate();
            try {
                yield this.isomorphicInitialize(desiredChainId);
                const accounts = yield ((_c = this.provider) === null || _c === void 0 ? void 0 : _c.request({ method: 'eth_requestAccounts' }).catch((error) => __awaiter(this, void 0, void 0, function* () {
                    if ((error === null || error === void 0 ? void 0 : error.message) === 'User closed modal')
                        yield this.deactivate();
                    throw error;
                })));
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const chainId = yield this.provider.request({ method: 'eth_chainId' }).then((chainId) => parseChainId(chainId));
                this.actions.update({ chainId, accounts });
            }
            catch (error) {
                cancelActivation();
                throw error;
            }
        });
    }
    /** {@inheritdoc Connector.deactivate} */
    deactivate() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.provider) === null || _a === void 0 ? void 0 : _a.off('disconnect', this.disconnectListener);
            (_b = this.provider) === null || _b === void 0 ? void 0 : _b.off('chainChanged', this.chainChangedListener);
            (_c = this.provider) === null || _c === void 0 ? void 0 : _c.off('accountsChanged', this.accountsChangedListener);
            // we don't unregister the display_uri handler because the walletconnect types/inheritances are really broken.
            // it doesn't matter, anyway, as the connector object is destroyed
            yield ((_d = this.provider) === null || _d === void 0 ? void 0 : _d.disconnect());
            this.provider = undefined;
            this.eagerConnection = undefined;
            this.actions.resetState();
        });
    }
}
exports.WalletConnect = WalletConnect;
