FROM node:21
WORKDIR /usr/src/ui
COPY . .

RUN npm install --force
RUN npm run build 
CMD ["npm", "run", "start"]
