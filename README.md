# Croco
Croco-draw is an simple real-time multiplayer game. This game is for two people. 

The goal of the first player is make a riddle-word and try to draw this word. 

Second player must guess the word.

# Deployment: [Link](https://croco-draw-game.vercel.app/main)

# UML class schema: [Link](https://miro.com/app/board/uXjVMXR0BAk=/?share_link_id=289366143613)

## Run localy:
```
npm install
npx nx run-many --target=serve --all=true
````

# App Features:

- Real time drawing with floodFill and other basic tools
- Rooms for manage games
- Websocket server with websocket generators
- Cool design with prime-ng library
- Integrated NX mono-repository with CI/CD (CI with Github and CD to Vercel)

# Stack 

- Angular
- RxJs
- Prime-Ng
- Websocket (client / server)
- NX workspace and CI/CD
- ngneat/until-destroy
