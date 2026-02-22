module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        "error",
        "warn"
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSession",
    ()=>createSession,
    "deleteSession",
    ()=>deleteSession,
    "findOrCreateUser",
    ()=>findOrCreateUser,
    "generateOtp",
    ()=>generateOtp,
    "getAuthenticatedUser",
    ()=>getAuthenticatedUser,
    "getSession",
    ()=>getSession,
    "getSessionCookieName",
    ()=>getSessionCookieName,
    "getUserById",
    ()=>getUserById,
    "verifyOtp",
    ()=>verifyOtp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
;
;
const SESSION_COOKIE = "social-saver-session";
const OTP_TTL_MS = 5 * 60 * 1000 // 5 minutes
;
const SESSION_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours
;
async function generateOtp(identifier) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].otp.upsert({
        where: {
            identifier
        },
        create: {
            identifier,
            code,
            expiresAt
        },
        update: {
            code,
            expiresAt
        }
    });
    return code;
}
async function verifyOtp(identifier, code) {
    const row = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].otp.findUnique({
        where: {
            identifier
        }
    });
    if (!row) return false;
    if (new Date() > row.expiresAt) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].otp.delete({
            where: {
                identifier
            }
        }).catch(()=>{});
        return false;
    }
    if (row.code !== code) return false;
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].otp.delete({
        where: {
            identifier
        }
    });
    return true;
}
async function findOrCreateUser(identifier, type) {
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
        where: {
            identifier
        }
    });
    if (existing) {
        return toUser(existing);
    }
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.create({
        data: {
            identifier,
            type
        }
    });
    return toUser(user);
}
async function getUserById(id) {
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
        where: {
            id
        }
    });
    return user ? toUser(user) : undefined;
}
function toUser(row) {
    return {
        id: row.id,
        identifier: row.identifier,
        type: row.type,
        createdAt: row.createdAt.toISOString()
    };
}
async function createSession(userId) {
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    const session = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].session.create({
        data: {
            userId,
            expiresAt
        }
    });
    return {
        id: session.id,
        userId: session.userId,
        expiresAt: expiresAt.getTime()
    };
}
async function getSession(sessionId) {
    const session = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].session.findUnique({
        where: {
            id: sessionId
        }
    });
    if (!session) return null;
    if (new Date() > session.expiresAt) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].session.delete({
            where: {
                id: sessionId
            }
        }).catch(()=>{});
        return null;
    }
    return {
        id: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt.getTime()
    };
}
async function deleteSession(sessionId) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].session.delete({
        where: {
            id: sessionId
        }
    }).catch(()=>{});
}
async function getAuthenticatedUser() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
    if (!sessionId) return null;
    const session = await getSession(sessionId);
    if (!session) return null;
    const user = await getUserById(session.userId);
    if (!user) return null;
    return {
        user,
        session
    };
}
function getSessionCookieName() {
    return SESSION_COOKIE;
}
}),
"[project]/lib/data.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addLink",
    ()=>addLink,
    "deleteLink",
    ()=>deleteLink,
    "detectPlatform",
    ()=>detectPlatform,
    "filterByPlatform",
    ()=>filterByPlatform,
    "getAllLinks",
    ()=>getAllLinks,
    "getPlatformCounts",
    ()=>getPlatformCounts,
    "getStats",
    ()=>getStats,
    "searchLinks",
    ()=>searchLinks,
    "updateLink",
    ()=>updateLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
;
function detectPlatform(url) {
    const lower = url.toLowerCase();
    if (lower.includes("instagram.com") || lower.includes("instagr.am")) return "instagram";
    if (lower.includes("twitter.com") || lower.includes("x.com") || lower.includes("t.co")) return "twitter";
    if (lower.includes("dribbble.com")) return "dribbble";
    if (lower.includes("youtube.com") || lower.includes("youtu.be") || lower.includes("yt.be")) return "youtube";
    if (lower.includes("medium.com") || lower.includes("dev.to") || lower.includes("hashnode") || lower.includes("substack.com") || lower.includes("blog")) return "blog";
    return "other";
}
function toSavedLink(row) {
    return {
        id: row.id,
        name: row.name,
        url: row.url,
        description: row.description,
        platform: row.platform,
        createdAt: row.createdAt.toISOString(),
        userId: row.userId
    };
}
async function getAllLinks(userId) {
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].link.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return rows.map(toSavedLink);
}
async function addLink(name, url, description, userId) {
    const platform = detectPlatform(url);
    const link = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].link.create({
        data: {
            name,
            url,
            description,
            platform,
            userId
        }
    });
    return toSavedLink(link);
}
async function updateLink(id, userId, updates) {
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].link.findFirst({
        where: {
            id,
            userId
        }
    });
    if (!existing) return null;
    const data = {};
    if (updates.name !== undefined) data.name = updates.name;
    if (updates.description !== undefined) data.description = updates.description;
    if (updates.url !== undefined) {
        data.url = updates.url;
        data.platform = detectPlatform(updates.url);
    }
    const link = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].link.update({
        where: {
            id
        },
        data
    });
    return toSavedLink(link);
}
async function deleteLink(id, userId) {
    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].link.deleteMany({
        where: {
            id,
            userId
        }
    });
    return result.count > 0;
}
async function searchLinks(query, userId) {
    const lower = query.toLowerCase();
    const all = await getAllLinks(userId);
    return all.filter((l)=>l.name.toLowerCase().includes(lower) || l.description.toLowerCase().includes(lower) || l.url.toLowerCase().includes(lower));
}
async function filterByPlatform(platform, userId) {
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].link.findMany({
        where: {
            userId,
            platform
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return rows.map(toSavedLink);
}
async function getStats(userId) {
    const all = await getAllLinks(userId);
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thisWeek = all.filter((l)=>new Date(l.createdAt) >= oneWeekAgo);
    const platforms = new Set(all.map((l)=>l.platform));
    return {
        total: all.length,
        platforms: platforms.size,
        thisWeek: thisWeek.length,
        lastAdded: all[0]?.createdAt ?? null
    };
}
async function getPlatformCounts(userId) {
    const all = await getAllLinks(userId);
    const counts = {};
    for (const link of all){
        counts[link.platform] = (counts[link.platform] || 0) + 1;
    }
    return counts;
}
}),
"[project]/app/api/send-whatsapp/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAuthenticatedUser"])();
    if (!auth) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unauthorized"
        }, {
            status: 401
        });
    }
    try {
        const body = await request.json();
        const { receiverNumber } = body;
        if (!receiverNumber || typeof receiverNumber !== "string" || !receiverNumber.trim()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "WhatsApp number is required"
            }, {
                status: 400
            });
        }
        const links = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAllLinks"])(auth.user.id);
        if (!links || links.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "No saved links to send"
            }, {
                status: 400
            });
        }
        const automationServiceUrl = process.env.WHATSAPP_WORKER_URL || "http://localhost:3001/send-message";
        let sentCount = 0;
        for (const link of links){
            const messageText = `*${link.name}*\n${link.description}\n${link.url}`;
            try {
                const res = await fetch(automationServiceUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        receiverNumber: receiverNumber.trim(),
                        messageText
                    })
                });
                if (res.ok) {
                    sentCount++;
                } else {
                    console.error("Failed to queue message for:", link.name);
                }
            } catch (err) {
                console.error("Error communicating with WhatsApp worker:", err);
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Messages queued successfully",
            sentCount
        }, {
            status: 200
        });
    } catch (error) {
        console.error(error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal server error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f9244fab._.js.map