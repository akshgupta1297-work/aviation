const https = require("https");

const getLocationData = () => {
    return new Promise((resolve, reject) => {
        const options = {
            path: "/json/",
            host: "ipapi.co",
            port: 443,
            headers: {
                "User-Agent": "nodejs-ipapi-v1.02",
            },
        };

        https
            .get(options, (resp) => {
                let body = "";

                resp.on("data", (data) => {
                    body += data;
                });

                resp.on("end", () => {
                    try {
                        const loc = JSON.parse(body);
                        resolve(loc);
                    } catch (error) {
                        reject(error);
                    }
                });
            })
            .on("error", (error) => {
                reject(error);
            });
    });
};

module.exports = {
    getLocationData
}