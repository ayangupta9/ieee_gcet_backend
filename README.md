# ICAC3N - 2022 : BACKEND
Web server providing services for https://icac3n.in


## Description
IEEE – International Conference on Advances in Computing, Communication Control and Networking (ICAC3N) is held for interaction, sharing experience and difficult technical breakthroughs of top academicians, researchers and scholars. This website allows general
user to get knowledge about the conferences and helps them submitting their research papers and the admin can manage the conference and the papers submitted. 

### Data Flow Diagram
<img width="500" src="https://user-images.githubusercontent.com/71624964/195849106-e017443e-2f6f-4b6a-9d92-0000af160a8b.jpeg" alt="Data flow diagram of the web portal"/>

## Build With
- ExpressJS
- MySQL

## Features
- Isolated role based access (participants and admin)
- Timed sessions (using JWT authentication)
- Fast updation changes

# Getting Started

## Dependencies
- Setting up MySQL server and provide database credentials in the `.env` file of the project
- NodeJS environment

## Installation
- Clone project from branch `v1.1.0`
- Run command `npm install` to install necessary npm packages
- Make changes in .env and incorporate database credentials
- Run `npm run serve` for development mode and `npm run start` for production mode
- Access at `localhost:8080`

## Authors
[@AyanGupta](https://www.linkedin.com/in/ayan-gupta-4b2158213/)

## License
This project is licensed under the MIT License - see the LICENSE.md file for details
