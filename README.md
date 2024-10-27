# TYPE-RACING ONLINE GAME

this is a monorepo webapp build with nestjs as backend and react as a frontend

# Core Features

## User Registration and Authentication

## Enable players to sign up, log in, and manage profiles.
Store user data in a database (e.g., PostgreSQL or MongoDB).
Use JWT (JSON Web Token) for session management.
Real-Time Multiplayer Gameplay

## Allow multiple players to race against each other in real-time.
Use WebSockets (via socket.io in both NestJS and React) to synchronize game state, typing progress, and events across clients.
Typing Challenge Text

## Display a passage of text that players must type.
Randomize passages for each game session or allow for predefined passages.
Include a countdown timer to start typing.
Tracking Typing Speed and Accuracy

## Measure each player’s Words Per Minute (WPM) and accuracy.
Display progress to each player as they type.
Track real-time position on the passage (e.g., highlighting text as they type).
Game Timer and Progress Indicator

## Include a countdown timer that starts when the game begins.
Display each player’s progress (percentage completed) on a progress bar.
Notify when time runs out or when a player completes the passage.
Leaderboard and Scoreboard

## Show a real-time scoreboard during the game, displaying each player’s WPM, accuracy, and position.
After the game, show final results and rank players based on performance.
Optionally, store high scores in the database for long-term leaderboards.
Game Lobby

## Allow players to join an existing game or start a new one.
Display a list of available lobbies or game rooms.
Show information about each game room (e.g., number of players, countdown to game start).
Game Notifications

## Notify players of events like game start, end, player joins, and disconnections.
Announce the winner when the game ends.
Optional / Advanced Features
Single-Player Mode

## Allow players to practice solo by typing against the clock, aiming to beat their personal records.
Store personal best scores for solo mode.
Customizable Game Settings

## Allow players to select text difficulty, game duration, or typing themes.
Offer different game modes, like speed (WPM-focused), accuracy, or endurance (longer passages).
Performance Stats and Analytics

## Show a breakdown of stats after each game, such as typing speed, accuracy, and improvement over time.
Offer visual stats like charts or graphs for long-term tracking (e.g., weekly or monthly progress).
Achievements and Badges

## Add badges or rewards for reaching milestones (e.g., “100 WPM Club”).
Store and display achievements on the player’s profile.
Friends and Social Features

## Allow players to add friends, create friend-only lobbies, or challenge each other.
Add a chat feature to let players communicate in the lobby or game.
Global Leaderboard and Ranking

## Rank players based on their scores, WPM, and accuracy on a global leaderboard.
Track players’ rankings and allow them to compete for a spot on top.
Text Selection and Theme Customization

## Allow players to select from various passages (e.g., books, quotes).
Offer light/dark mode and customizable themes for a personalized experience.
Anti-Cheating Mechanisms

## Implement measures to detect and prevent cheating (e.g., monitoring unusually high speeds).
Optionally, add a “report player” feature to flag suspicious activity.