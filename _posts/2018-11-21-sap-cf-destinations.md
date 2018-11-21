---
layout: post
title:  "SAP CP Cloud Foundry destinations demystified"
date:   2018-11-21 21:40:00 +0100
categories: SAPCP
tags: SAPCP CloudFoundry nodejs
---
Coming from the `neo` environment in SAP Cloud Platform, a so-called `destination` enables proxying `HTTP` requests at runtime. This not only fullfilled [`CORS`](https://enable-cors.org) requirements in a browser-based scenario, but also allowed querying data in a SAPCP-application from an on-premise system.  
Even though the name `destination` is the same in the SAP CP `Cloud Foundry (cf)` environment, it's usage is completely different. Let's elaborate.
# Concept
`destinations` are of substantical value in hybrid application architectures, where a cloud application wants to retrieve data from an on-premise system via the [Cloud Connector](https://help.sap.com/viewer/cca91383641e40ffbe03bdc78f00f681/Cloud/en-US/e6c7616abb5710148cfcf3e75d96d596.html).  

In `neo`, calling
~~~
https://myapp-4711.dispatcher.hana.ondemand.com/destinations/<destination-name>/path/to/resource
~~~
would proxy `/path/to/resource` on the server configured in `<destination-name>` (can be an on-premise system!) to the application running on `https://myapp-4711.dispatcher.hana.ondemand.com` - a really convenient way to proxy requests fullfilling CORS requirements.   

Achieving this in `cf`, it's necessary to
- create a `destination` (sub-account level)
- create a `destination` instance (space level)
- create a `connectivity` instance (space level)
- create a `xsuaa` instance (space level)

Then, the `connectivity` instance serves as a generic reverse proxy, where as the `destination` instance is nothing more but a catalogue organizing proxy targets (including on-premise systems).  

The `xsuaa` instance serves as the credentials authority, issuing [`JWT`](https://jwt.io) (via `OAuth 2.0) to allow 
- querying the `destination` instance for an entry
- using the reverse proxy (aka `connectivity` instance) for actually proxying requests

So in `cf`:  
1. retrieve token from `xsuaa` instance for using the `destination` instance
2. use token for querying a specific destination from `destination` instance
3. retrieve token from `xsuaa` instance for using the reverse proxy (aka `connectivity` instance)
4. use token for querying some `<uri>` in the destination

😳 👉 🥳

# Programmatic usage (`nodejs`)
There are 2 main blogs/tutorials out there that describe how to handle using `destinations`/`connectivity` in `nodejs`:
- <https://blogs.sap.com/2018/10/08/using-the-destination-service-in-the-cloud-foundry-environment/>  
  gives a good overview of the entire process, but leaves out using the actual proxy for querying resources
- <https://blogs.sap.com/2018/10/16/call-sap-cloud-platform-cloud-foundry-destinations-from-your-node.js-application/ >  
  explains the concept of command line `cf` along with services, bindings and instances nicely, but also doesn't mention any proxying and is difficult to re-use

**Spoiler alert** That's why I wrapped the entire process in a node module, `sap-cf-destination` (super alpha pre-release, yada yada).

I took the liberty and read throught the reference `Java` implementation at <https://help.sap.com/viewer/cca91383641e40ffbe03bdc78f00f681/Cloud/en-US/313b215066a8400db461b311e01bd99b.html> and ported it to a reusable `node` module in `JavaScript`.

Overall usage (all following code is flavored pidgin-code):
~~~ javascript
const callDestination = require('sap-cf-destination');

callDestination({
        // url to call on proxied server
        url: '/api/json',
        // name of the CF connectivity service instance
        connectivity_instance: 'connectivity-lite',
        // name of the CF xsuaa service instance
        uaa_instance: 'uaa-lite',
        // name of the CF destination service instance
        destination_instance: 'destination-lite',
        // name of the configured destination
        destination_name: 'my_destination'
    })
        .then(response => {
            // do sth clever from the response
            // of $server_behind_destination_'my_destination'/api/json
        })
        .catch(err => {
            // oh no 💩
        })
~~~

Under the hood, an `OAuth 2.0` client is used for retrieving tokens from both connectivity- and destination-instance, wrapped in a `Promise`:
~~~ javascript
new Promise((resolve, reject) => {
    const oAuthClient = new OAuth2(
        <either destination or connectivity client id>,
        <either destination or connectivity client secret>, 
        <url of cf xsuaa instance>, 
        '/oauth/authorize', // authorization endpoint
        'oauth/token', // token issuer endpoint
        null // no custom headers
    );
    oAuthClient.getOAuthAccessToken(
        '', 
        {grant_type: 'client_credentials'},
        (err, accessToken, refreshToken, results) => {
            if (err) {
                reject(err);
            }
            resolve(accessToken);
        }
    );
});
~~~

Utilizing the `cf` proxy is done via the npm [`request-promise`](https://github.com/request/request-promise) http client module:
~~~ javascript
const proxy = `http://${connectivityInstance.credentials.onpremise_proxy_host}:${connectivityInstance.credentials.onpremise_proxy_port}`;

const options = {
        url: <destination api/destination>,
        method: 'GET',
        headers: <proxy access token>,
        proxy: proxy
    };

request(options);
~~~

Code is over at <https://github.com/vobu/sap-cf-destination.git> - collaboration welcome!  

Granted, it has the "Geschmäckle" of "why doesn't SAP provide this anyway?!?" - but hey, [@SAPCP](https://twitter.com/sapcp), you never know who will contribute, right. Right?!?

🤭 🙃