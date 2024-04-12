module.exports = {
  apps : [{
    name   : "cricket_quiz-frontend-cum-backend",
    script : "./server.js",
    env_production: {
       NODE_ENV: "production",
       ...(require('./secrets'))
    },
    env_development: {
       NODE_ENV: "development"
    }
  }]
}