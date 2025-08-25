// // auth.service.ts
// import * as Keycloak from 'keycloak-js';

// class AuthService {
//   private keycloak: Keycloak;

//   constructor() {
//     // Use process.env for Node.js environment or fallback to empty string
//     const keycloakUrl = process.env.KEYCLOAK_URL || process.env.VITE_KEYCLOAK_URL || '';

//     this.keycloak = new Keycloak({
//       url: keycloakUrl,
//       realm: 'gymmate-master',
//       clientId: 'gymmate-web',
//     });
//   }

//   async initialize(): Promise<boolean> {
//     const authenticated = await this.keycloak.init({
//       onLoad: 'check-sso',
//       silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
//     });

//     if (authenticated) {
//       this.setupTokenRefresh();
//     }

//     return authenticated;
//   }

//   async login(): Promise<void> {
//     await this.keycloak.login();
//   }

//   async logout(): Promise<void> {
//     await this.keycloak.logout();
//   }

//   getToken(): string | undefined {
//     return this.keycloak.token;
//   }

//   getUserInfo() {
//     return {
//       id: this.keycloak.tokenParsed?.sub,
//       username: this.keycloak.tokenParsed?.preferred_username,
//       email: this.keycloak.tokenParsed?.email,
//       tenantId: this.keycloak.tokenParsed?.tenant_id,
//       role: this.keycloak.tokenParsed?.gym_role,
//       permissions: this.keycloak.tokenParsed?.permissions || [],
//     };
//   }

//   private setupTokenRefresh() {
//     setInterval(async () => {
//       try {
//         await this.keycloak.updateToken(70);
//       } catch (error) {
//         console.error('Token refresh failed', error);
//         await this.logout();
//       }
//     }, 60000);
//   }
// }

// export const authService = new AuthService();
