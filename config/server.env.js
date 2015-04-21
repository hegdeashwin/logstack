/**
 * Application configuration setup.
 */
module.exports = {
    "server": {
        "dev": {
            "port": 9000,
            "uri": "localhost",
            "codebase": "client/src"
        },
        "prod": {
            "port": 8000,
            "uri": "localhost",
            "codebase": "client/prod"
        }
    }
}