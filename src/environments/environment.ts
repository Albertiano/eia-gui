export const environment = {
  production: false,
  apiUrl: 'http://localhost:8090/api',

  tokenWhitelistedDomains: [
    new RegExp('localhost:8090'),
    new RegExp('18.228.235.215:8080'),
    new RegExp('192.168.0.10:8096'),
    new RegExp('eiasiscon.com.br'),
    new RegExp('25.16.233.222')
  ],
  tokenBlacklistedRoutes: [ new RegExp('\/auth\/login'), new RegExp('\/auth\/token') ]
};
