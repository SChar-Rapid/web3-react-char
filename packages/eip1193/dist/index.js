"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EIP1193 = void 0;
const types_1 = require("@web3-react/types");
function parseChainId(chainId) {
    return typeof chainId === 'string' ? Number.parseInt(chainId, 16) : chainId;
}
class EIP1193 extends types_1.Connector {
    constructor({ actions, provider, onError }) {
        super(actions, onError);
        this.provider = provider;
        this.provider.on('connect', ({ chainId }) => {
            this.actions.update({ chainId: parseChainId(chainId) });
        });
        this.provider.on('disconnect', (error) => {
            var _a;
            this.actions.resetState();
            (_a = this.onError) === null || _a === void 0 ? void 0 : _a.call(this, error);
        });
        this.provider.on('chainChanged', (chainId) => {
            this.actions.update({ chainId: parseChainId(chainId) });
        });
        this.provider.on('accountsChanged', (accounts) => {
            this.actions.update({ accounts });
        });
    }
    /** {@inheritdoc Connector.connectEagerly} */
    connectEagerly() {
        return __awaiter(this, void 0, void 0, function* () {
            const cancelActivation = this.actions.startActivation();
            return Promise.all([
                this.provider.request({ method: 'eth_chainId' }),
                this.provider.request({ method: 'eth_accounts' }),
            ])
                .then(([chainId, accounts]) => {
                this.actions.update({ chainId: parseChainId(chainId), accounts });
            })
                .catch((error) => {
                cancelActivation();
                throw error;
            });
        });
    }
    /** {@inheritdoc Connector.activate} */
    activate() {
        return __awaiter(this, void 0, void 0, function* () {
            const cancelActivation = this.actions.startActivation();
            return Promise.all([
                this.provider.request({ method: 'eth_chainId' }),
                this.provider
                    .request({ method: 'eth_requestAccounts' })
                    .catch(() => this.provider.request({ method: 'eth_accounts' })),
            ])
                .then(([chainId, accounts]) => {
                this.actions.update({ chainId: parseChainId(chainId), accounts });
            })
                .catch((error) => {
                cancelActivation();
                throw error;
            });
        });
    }
}
exports.EIP1193 = EIP1193;
