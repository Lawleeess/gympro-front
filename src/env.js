// Enviroment variables | development by default;
(function (window) {
  window.__env = window.__env || {};
  window.__env.endpoint = "http://localhost:8080/api/v1";
  //window.__env.endpoint = "https://epa-api-l6dmrzkz7a-uc.a.run.app/api/v1";
  window.__env.production = false;
})(this);
