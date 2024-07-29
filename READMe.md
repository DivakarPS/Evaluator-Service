1. 
```
npm init -y
```

2. 
```
npm install -D typescript
npm install concurrently

```

3. 
```
tsc --init
```

4. 
```
Add the following scripts in package.json

{
    "build": "npx tsc",
    "watch": "npx tsc -w",
    "prestart": "npm run build",
    "start": "npx nodemon dist/index.js",
    "dev": "npx concurrently --kill-others \"npm run watch\" \"npm start\""
}

```

Note: Make relevant config changes in tsconfig.json, look at the tsconfig.json file with keys - "outDir": "./dist" and 
"exclude": [
    "node_modules"
  ],
  "include": [
    "./src/**/*.ts"
  ]

5. 
```
npm run dev
```