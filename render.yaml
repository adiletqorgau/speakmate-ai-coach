services:
  - type: web
    name: speakmate-ai-coach
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: HOST
        value: 0.0.0.0
      - key: OPENAI_MODEL
        value: gpt-4o-mini
      - key: OPENAI_API_KEY
        sync: false
