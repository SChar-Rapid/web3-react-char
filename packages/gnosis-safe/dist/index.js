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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GnosisSafe = exports.NoSafeContext = void 0;
const types_1 = require("@web3-react/types");
class NoSafeContext extends Error {
    constructor() {
        super('The app is loaded outside safe context');
        this.name = NoSafeContext.name;
        Object.setPrototypeOf(this, NoSafeContext.prototype);
    }
}
exports.NoSafeContext = NoSafeContext;
class GnosisSafe extends types_1.Connector {
    constructor({ actions, options }) {
        super(actions);
        this.options = options;
    }
    /**
     * A function to determine whether or not this code is executing on a server.
     */
    get serverSide() {
        return typeof window === 'undefined';
    }
    /**
     * A function to determine whether or not this code is executing in an iframe.
     */
    get inIframe() {
        if (this.serverSide)
            return false;
        if (window !== window.parent)
            return true;
        return false;
    }
    isomorphicInitialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.eagerConnection)
                return;
            // kick off import early to minimize waterfalls
            const SafeAppProviderPromise = Promise.resolve().then(() => __importStar(require('@gnosis.pm/safe-apps-provider'))).then(({ SafeAppProvider }) => SafeAppProvider);
            yield (this.eagerConnection = Promise.resolve().then(() => __importStar(require('@gnosis.pm/safe-apps-sdk'))).then((m) => __awaiter(this, void 0, void 0, function* () {
                this.sdk = new m.default(this.options);
                const safe = yield Promise.race([
                    this.sdk.safe.getInfo(),
                    new Promise((resolve) => setTimeout(resolve, 500)),
                ]);
                if (safe) {
                    const SafeAppProvider = yield SafeAppProviderPromise;
                    this.provider = new SafeAppProvider(safe, this.sdk);
                }
            })));
        });
    }
    /** {@inheritdoc Connector.connectEagerly} */
    connectEagerly() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.inIframe)
                return;
            const cancelActivation = this.actions.startActivation();
            try {
                yield this.isomorphicInitialize();
                if (!this.provider)
                    throw new NoSafeContext();
                this.actions.update({
                    chainId: this.provider.chainId,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    accounts: [yield this.sdk.safe.getInfo().then(({ safeAddress }) => safeAddress)],
                });
            }
            catch (error) {
                cancelActivation();
                throw error;
            }
        });
    }
    activate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.inIframe)
                throw new NoSafeContext();
            // only show activation if this is a first-time connection
            let cancelActivation;
            if (!this.sdk)
                cancelActivation = this.actions.startActivation();
            return this.isomorphicInitialize()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                if (!this.provider)
                    throw new NoSafeContext();
                this.actions.update({
                    chainId: this.provider.chainId,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    accounts: [yield this.sdk.safe.getInfo().then(({ safeAddress }) => safeAddress)],
                });
            }))
                .catch((error) => {
                cancelActivation === null || cancelActivation === void 0 ? void 0 : cancelActivation();
                throw error;
            });
        });
    }
}
exports.GnosisSafe = GnosisSafe;
