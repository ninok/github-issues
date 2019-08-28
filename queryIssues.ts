const https = require('https');

const userAgent = "Node.js";

const reqHeader = {
    'User-Agent': userAgent,
    'Accept': 'application/vnd.github.v3+json'
}

interface GithubIssueSummary {
    url: string
    number: Number
}


async function githubQuery(get: string) {
    return new Promise((resolve, reject) => {
        https.get('https://api.github.com/repos/heremaps/harp.gl/issues', { headers: reqHeader },
            (response) => {
                if (response.statusCode < 200 || response.statusCode > 299) {
                    reject(new Error('Failed to load page, status code: ' + response.statusCode));
                }
                // temporary data holder
                const body = [];
                // on every content chunk, push it to the data array
                response.on('data', (chunk) => body.push(chunk));
                // we are done, resolve promise with those joined chunks
                response.on('end', () => resolve(JSON.parse(body.join(''))));
            }).on("error", (err) => {
                reject(err);
            })
    })
}

githubQuery('').then((body)=>{
    const issues  = body as GithubIssueSummary[];

        issues.forEach((issue: GithubIssueSummary) => console.log(issue.number));
    
});

// https.get('https://api.github.com/repos/heremaps/harp.gl/issues', { headers: reqHeader },
//     (resp) => {
//         let data = '';
//         resp.on('data', (chunk) => {
//             data += chunk;
//         });
//         resp.on('end', () => {
//             onGithubIssues(JSON.parse(data));
//         });
//     }).on("error", (err) => {
//         console.log("Error: " + err.message);
//     });