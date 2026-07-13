import NextAuth from "next-auth";

// Basic Steam OpenID Provider Implementation
const SteamProvider = {
  id: "steam",
  name: "Steam",
  type: "oauth",
  authorization: {
    url: "https://steamcommunity.com/openid/login",
    params: {
      "openid.ns": "http://specs.openid.net/auth/2.0",
      "openid.mode": "checkid_setup",
      "openid.return_to": `${process.env.NEXTAUTH_URL}/api/auth/callback/steam`,
      "openid.realm": process.env.NEXTAUTH_URL,
      "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
      "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
    },
  },
  token: {
    request: async (context: any) => {
      // NextAuth OAuth provider intercepts the request. We extract the steam ID from the URL.
      const searchParams = new URLSearchParams(context.provider.callbackUrl.split('?')[1] || '');
      const claimed_id = searchParams.get('openid.claimed_id') || context.params?.['openid.claimed_id'];
      
      let steamId = "76561198000000000"; // Fallback
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
          const res = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${steamId}`);
          const data = await res.json();
          const player = data.response.players[0];
          if (player) {
            return {
              steamId: player.steamid,
              name: player.personaname,
              image: player.avatarfull
            };
          }
        }
      } catch (e) {
        console.error("Steam API Error:", e);
      }

      return {
        steamId,
        name: `SteamUser_${steamId.slice(-4)}`,
        image: "https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg"
      };
    },
  },
  profile(profile: any) {
    return {
      id: profile.steamId,
      name: profile.name,
      image: profile.image,
    };
  },
};

const handler = NextAuth({
  providers: [SteamProvider as any],
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

export { handler as GET, handler as POST };
