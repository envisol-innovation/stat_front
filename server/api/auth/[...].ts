// import { NuxtAuthHandler } from '#auth'
// import Auth0Provider from "next-auth/providers/auth0";


// export default NuxtAuthHandler({
//     // A secret string you define, to ensure correct encryption
//     secret: useRuntimeConfig().authSecret,
//     providers: [
//         // GithubProvider.default({
//         //     clientId: 'your-client-id',
//         //     clientSecret: 'your-client-secret'
//         // }),
//         Auth0Provider.default({
//             clientId: "BHTUZ8hZh6XXG5vGsBEyZJ74CAG3PonM",
//             clientSecret: "HLvhitWev-8HLclHEaGCExfenoGExxGg9IucD0a8HTczkrLPyZu4tHPqBsodUfd6",
//             issuer: "https://dev-0isu4xeopx0o8w7f.eu.auth0.com/",    // this must be the full url (with https://)
//             wellKnown: `https://dev-0isu4xeopx0o8w7f.eu.auth0.com/.well-known/openid-configuration`   // this is necessary for some obscure reason https://github.com/nextauthjs/next-auth/issues/7591
//           })
//     ],
//     // callbacks: {
//     //     jwt({ token, account, profile }) {
//     //       if (account) {
//     //         token.sessionToken = account.session_token
//     //       }
//     //       return token
//     //     },
//     //     // async session({ session, token }) {
//     //     //     // Token we injected into the JWT callback above.
//     //     //     const token = token.sessionToken
      
//     //     //     // Fetch data OR add previous data from the JWT callback.
//     //     //     const additionalUserData = await $fetch(`/api/session/${token}`)
      
//     //     //     // Return the modified session
//     //     //     return {
//     //     //       ...session,
//     //     //       user: {
//     //     //         name: additionalUserData.name,
//     //     //         avatar: additionalUserData.avatar,
//     //     //         role: additionalUserData.role
//     //     //       }
//     //     //     }
//     //     //   },
//     // }
// })