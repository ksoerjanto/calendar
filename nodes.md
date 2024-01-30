## Features

- View calendar by day or week
- Add events by using natural language prompts
- View events through UI elements
- Edit or delete events through UI elements

## How to run the app

Run `npm install` and `npm run start` and navigate to localhost:3000 on your browser.

In order to make calls to Open AI's DaVinci endpoint, you will need to obtain a key and replace the first line in lib/gpt.js to: 

```
const openai_key = 'sk_yourkeyhere';
```
