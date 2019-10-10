# Software Requirements

This is an Alexa Skill that will answer user git questions, and, if you want, will send you a text with the command.

## Vision

Forget how to add a remote origin to local git repo? Did you forget the terminal command? It's ok. Ask Alexa. She'll tell you the command. If you want, a message can be sent to you with the command.

## Scope (In/Out)

- IN
  - Users can ask a short question about a git command
  - Alexa will answer with the correct command
  - Alexa will ask if the user would like to receive a message with the command.
  - If yes, then a message, containing the command, will be sent to the user.
- OUT
  - AlexaGitsMe will not utilize user authentication, e.g. user login
  - AlexaGitsMe will not answer why that command is the best one.

### MVP

- A user can ask a simple git question, Alexa will respond with the answer. She will then ask if the user wants a text with the command. If the user says "yes", then a message will be sent to the user with the git command.
  - User: Alexa, how do I check the status of a git repo?
  - Alexa: git status. Do you want me to send this to you?
  - If the user says "yes", a message sent will include: \$ git status

### Stretch

- A user can ask a generic question, e.g. "What are all the commands to merge and rebase?", and Alexa will read off all the commands and its description.
- She will follow up and ask if the user would like these commands sent to them.

## Functional Requirements

1. A user can ask Alexa a basic git question

- Alexa will respond with the answer
- Alexa will ask if they would like the answer sent to them via SMS.
- If yes, the user will get a text with the git command.

## Non-Functional Requirements

1. Reliability

- What: Alexa can understand what was asked and search for the answer.
- How: She'll look up the git command based on what it will do
- Why: This will start the decision tree process.

2. Usability

- What: This application will be easy to use to those looking for git answers.
- How: All users have to do is ask a short and simple question.
- Why: The easier it is to use, the more people will use it.

### Data Flow/Decision Tree

[Decision Tree](https://app.moqups.com/uluAsPw28y/view/page/aa9df7b72)

#### Decision Tree:

![White board](assets/whiteboard_image.jpg)
