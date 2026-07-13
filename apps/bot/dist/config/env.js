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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const zod_1 = require("zod");
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
const envSchema = zod_1.z.object({
    STEAM_API_KEY: zod_1.z.string().optional(),
    DISCORD_BOT_TOKEN: zod_1.z.string().optional(),
    DISCORD_APPLICATION_ID: zod_1.z.string().optional(),
    DISCORD_GUILD_ID: zod_1.z.string().optional(),
    FCM_CREDENTIALS: zod_1.z.string().optional(),
    DATABASE_URL: zod_1.z.string(),
    JWT_SECRET: zod_1.z.string(),
    ENCRYPTION_KEY: zod_1.z.string(),
    BOT_API_PORT: zod_1.z.string().default('3001'),
    WEB_PORT: zod_1.z.string().default('3000'),
    TTS_ENABLED: zod_1.z.string().transform((val) => val === 'true').default('true'),
    TTS_ENGINE: zod_1.z.string().default('node-edge-tts'),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.format());
    process.exit(1);
}
exports.env = parsed.data;
