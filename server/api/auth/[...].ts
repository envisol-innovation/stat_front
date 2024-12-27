import { NuxtAuthHandler } from '#auth'
import Auth0Provider from "next-auth/providers/auth0";

console.log("hello??")

export default NuxtAuthHandler({
    // A secret string you define, to ensure correct encryption
    secret: process.env.NUXT_AUTH_SECRET,
    providers: [
        Auth0Provider.default({    // .default() is correct from the doc
            clientId: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            issuer: "https://" + process.env.AUTH0_DOMAIN,    // this must be the full url (with https://)
            wellKnown: "https://" + process.env.AUTH0_DOMAIN + ".well-known/openid-configuration"   // this is necessary for some obscure reason https://github.com/nextauthjs/next-auth/issues/7591
          })
    ],
    // callbacks: {
    //     jwt({ token, account, profile }) {
    //       if (account) {
    //         token.sessionToken = account.session_token
    //       }
    //       return token
    //     },
    //     // async session({ session, token }) {
    //     //     // Token we injected into the JWT callback above.
    //     //     const token = token.sessionToken
      
    //     //     // Fetch data OR add previous data from the JWT callback.
    //     //     const additionalUserData = await $fetch(`/api/session/${token}`)
      
    //     //     // Return the modified session
    //     //     return {
    //     //       ...session,
    //     //       user: {
    //     //         name: additionalUserData.name,
    //     //         avatar: additionalUserData.avatar,
    //     //         role: additionalUserData.role
    //     //       }
    //     //     }
    //     //   },
    // }
})