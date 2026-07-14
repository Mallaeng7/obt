import NextAuth from "next-auth";
import { NextRequest } from "next/server";

function makeSteamProvider(baseUrl: string) {
  return {
    id: "steam",
    name: "Steam",
    type: "oauth",
    authorization: {
      url: "https://steamcommunity.com/openid/login",
      params: {
        "openid.ns": "http://specs.openid.net/auth/2.0",
        "openid.mode": "checkid_setup",
        "openid.return_to": `${baseUrl}/api/auth/callback/steam`,
        "openid.realm": baseUrl,
        "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
        "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
      },
    },
    token: {
      request: async (context: any) => {
        const searchParams = new URLSearchParams(context.provider.callbackUrl.split('?')[1] || '');
        const claimed_id = searchParams.get('openid.claimed_id') || context.params?.['openid.claimed_id'];

        let steamId = "76561198000000000";
        if (claimed_id) {
          const match = claimed_id.match(/id\/(\d+)/);
          if (match) steamId = match[1];
        }
        return { tokens: { access_token: steamId } };
      },
    },
    userinfo: {
      request: async (context: any) => {
        const steamId = context.tokens.access_token;

        try {
          const API_KEY = process.env.STEAM_API_KEY;
          if (API_KEY && API_KEY !== 'your_steam_web_api_key') {
            const res = await fetch(
              `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${steamId}`
            );
            const data = await res.json();
            const player = data.response.players[0];
            if (player) {
              return { steamId: player.steamid, name: player.personaname, image: player.avatarfull };
            }
          }
        } catch (e) {
          console.error("Steam API Error:", e);
        }

        return {
          steamId,
          name: `SteamUser_${steamId.slice(-4)}`,
          image: "https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
        };
      },
    },
    profile(profile: any) {
      return { id: profile.steamId, name: profile.name, image: profile.image };
    },
  };
}

// 요청의 실제 Host로 baseUrl을 동적으로 결정
// NEXTAUTH_URL이 설정돼 있으면 우선 사용, 없거나 localhost면 요청 host 사용
function getBaseUrl(req: NextRequest): string {
  const envUrl = process.env.NEXTAUTH_URL;
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl.replace(/\/$/, '');
  }
  // 요청 헤더에서 실제 host 추출
  const proto = req.headers.get('x-forwarded-proto') || 'http';
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost';
  return `${proto}://${host}`;
}

async function handler(req: NextRequest, context: any) {
  const baseUrl = getBaseUrl(req);

  const authHandler = NextAuth({
    providers: [makeSteamProvider(baseUrl) as any],
    callbacks: {
      async session({ session, token }) {
        if (session.user) {
          (session.user as any).id = token.sub;
        }
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development_only",
  });

  return authHandler(req, context);
}

export { handler as GET, handler as POST };
