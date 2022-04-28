# Cloud Security Simulator

## 1 Descriptions

We propose the development of a money management application hosted on a cloud-provider infrastructure to account for our three tier security implementation. The money management application shall have a client side in which users have the ability to login to their account and view critical information such as account information and user information and password updates. The application will also have a server component which will handle the routes from the client requests to providing access to our storage needs. 

In implementing the application we create an initial baseline of the application with little to no security features to understand the impact of attacks to an organization. A second and later third project implementation, branches from our initial baseline, will be hardened to protect the full stack to varying degrees. 

Our project implementation includes developing a web application written in HTML, CSS, and javascript with a Node.js server. Our intended storage solution is a non-SQL database utilizing MongoDB to demonstrate access to a storage implementation. As a proof of concept we want to demonstrate the impact of implementing a non-security implementation versus a security hardened system will allow comparable results. 

The first tier will be the baseline design that will resemble a website similar to what a first time web developer would construct. It will contain little to no threat mitigation techniques. The second tier design will be a step up in threat mitigation and will include a moderate amount of security implementation. The third and final tier will be another step up in threat mitigation and will include the highest amount of security implementation. 

The intent is to perform various attacks through this three-tiered approach to demonstrate the effectiveness of threat mitigation strategies. As attacks are performed, the system will evolve to include new threat mitigation strategies for the tier two and tier three systems. 

## 2 Setup

This system utilizes node.js and MySQL. Both of which would need to be installed prior to using. Ensure that the schema in MySQL is 'pennywise'. Ensure that the host is 'localhost', the user is 'root', and password is 'cloudsecurity'. 

Ensure that at directory of each tier to install node by running npm install. 

To begin the node server please run npm start. 
Ensure to run npm install mysql if packages not installed. 
Run a node server at each tier to run the three different tiers.

## 3 Layout

### Tier 1

Baseline code

### Tier 2

Security improvements:

- local storage management
- XSS checks for client text fields 
- SQL injection checks for client text fields
- Request rate limit
- Force secure password
- Using POST requests instead of GET requests

### Tier 3

Security improvements:

- Tier 2 improvements
- SQL injection checks in the server
- Using a CAPTCHA
- Disable accounts after an excess number of requests
- Encrypt passwords

## 4 Authors

- Jake Summerville
- Martin Lopez
- Diego Moscoso



