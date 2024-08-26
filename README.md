# Fediverse server viewer 
Progressive Web App (PWA) and API to keep track of server info and custom emojis.

## Architecture
The current production deployment has: 
- API
  - Hosted as serverless functions.
  - HTTP API Gateway endpoint access restricted with a Lambda authorizer [1].
  - CORS enabled.
  - Served through a CDN.
  - Using edge locations in North America and Europe.
- PWA 
  - Hosted as a secure static site [2] on object storage.
  - Served through a CDN. 
  - CloudFront Function [3] to rewrite URIs that are meant to be handled by client-side routing.
  - Content Security Policy for the response headers from the distribution.
  - Using edge locations in North America and Europe.
- Route 53 for DNS with custom domain for web app and API endpoints with SSL.
- Infrastructure as Code.

[1] [https://aws.amazon.com/blogs/networking-and-content-delivery/restricting-access-http-api-gateway-lambda-authorizer/](https://aws.amazon.com/blogs/networking-and-content-delivery/restricting-access-http-api-gateway-lambda-authorizer/)  
[2] [https://github.com/santisbon/static-site](https://github.com/santisbon/static-site)  
[3] [https://github.com/santisbon/amazon-cloudfront-functions](https://github.com/santisbon/amazon-cloudfront-functions)  

### API

![API](https://d2908q01vomqb2.cloudfront.net/5b384ce32d8cdef02bc3a139d4cac0a22bb029e8/2022/07/22/Picture1-8.png)

### PWA

![Web](https://i.imgur.com/ANDPmVO.png)

## To run web app locally

```shell
npm install
npm run dev # start dev server
npm run build # build for production
npm run preview # locally preview production build
```

If you want to run it on a different port:
```shell
npm run dev -- --port 8000
```

## To deploy API

Deploy to your AWS account with the AWS CLI e.g.
```sh
aws cloudformation package \
    --region us-east-1 \
    --template-file template.yaml \
    --output-template-file packaged.template \
    --s3-bucket $ARTIFACTS \

aws cloudformation deploy \
    --region us-east-1 \
    --stack-name $STACK \
    --template-file packaged.template \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides DomainName=$DOMAIN SubDomain=$SUBDOMAIN HostedZoneId=$HOSTEDZONE
```


## Implementation Details
<details> 
<summary>See more</summary>

### Client

The app was bootstrapped with [Vite](https://vitejs.dev) as the bundler and dev server and the React template:
```shell
npm create vite@latest name-of-your-project -- --template react
# follow prompts
cd <your new project directory>
npm install <your dependencies>
npm run dev
```
Icons created with [Favicon Generator](https://realfavicongenerator.net).  

The service worker was generated with [Vite Plugin PWA](https://vite-pwa-org.netlify.app/guide/). It was used to: 
- Generate the manifest.
- Configure the manifest with a link in the `head` of the app entry point.
- Generate a service worker.
- Generate a script to register the sw.
See [here](https://github.com/vite-pwa/vite-plugin-pwa/blob/main/src/types.ts) for details on the plugin options.  

To install the plugin:
```shell
npm i vite-plugin-pwa -D
```

</details>  