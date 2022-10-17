# Mail sender with inspirational quotes

### Usecases
- Can import quotes from an url or csv content string (into Dynamo-Db)
- Can send mails with randomly selected imported quote via cronjob
- Can return a randomly selected imported quote via API
- Can send a mail with a randomly selected imported quote via api

### Initialized via:
```
npx cdk init app -l typescript
```

### Deployment:
```
npx cdk bootstrap
npx cdk deploy // Disclaimer: Endpoints will not be protected after Deployment
```

### Required Secrets
Define a new Secret in AWS Secretmanager: `quotes_mailer`
with following secrets:
```
mailApiKey: <Basic-Auth-Password for mailgun-Api>
mailApiUrl: <Base-Path of mailgun-Api>
mailSender: <Verified Email for Sender in mailgun-Test-Domain>
mail_receiver: <Verified Email for Recipient in mailgun-Test-Domain>
```

### External Apis:
- Mailgun
- Quotes fetched from: https://raw.githubusercontent.com/dwyl/quotes/main/quotes.json
