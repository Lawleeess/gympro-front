// Enviroment variables | development by default;
(function (window) {
  window.__env = window.__env || {};
  window.__env.endpoint = "http://localhost:8080/api/v1";
  window.__env.production = false;
})(this);
