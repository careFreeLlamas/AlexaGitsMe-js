/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const commands = require('./gitCommands').default;
const utterances = require('./utterances');

const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

/* INTENT HANDLERS */
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const item = requestAttributes.t(getRandomItem(utterances.UTTERANCE_EN_US));

    const speakOutput = requestAttributes.t('WELCOME_MESSAGE', requestAttributes.t('SKILL_NAME'), item);
    const repromptOutput = requestAttributes.t('WELCOME_REPROMPT');

    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
      .getResponse();
  },
};

const getCommandHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'getCommandIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const actionSlot = handlerInput.requestEnvelope.request.intent.slots.action.resolutions.resolutionsPerAuthority[0].values[0].value.id;
    const thingSlot = handlerInput.requestEnvelope.request.intent.slots.thing.resolutions.resolutionsPerAuthority[0].values[0].value.id;

    let commandReference = actionSlot.toLowerCase() + '_' + thingSlot.toLowerCase();

    const myCommands = requestAttributes.t('COMMANDS');
    const command = myCommands[commandReference];
    let speakOutput = '';

    if (command) {
      sessionAttributes.speakOutput = command;
      handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

      return handlerInput.responseBuilder
        .speak(sessionAttributes.speakOutput)
        // .addDelegateDirective('sendCommandIntent') // TODO: check to see if this works.
        .getResponse();
    }

    // save outputs to attributes, so we can use it to repeat
    sessionAttributes.speakOutput = speakOutput;

    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    return handlerInput.responseBuilder
      .speak(sessionAttributes.speakOutput)
      .getResponse();
  },
};

// TODO: sendCommandHandler fn

const HelpHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const item = requestAttributes.t(getRandomItem(Object.keys(commands.COMMAND_EN_US)));

    sessionAttributes.speakOutput = requestAttributes.t('HELP_MESSAGE', item);
    sessionAttributes.repromptSpeech = requestAttributes.t('HELP_REPROMPT', item);

    return handlerInput.responseBuilder
      .speak(sessionAttributes.speakOutput)
      .reprompt(sessionAttributes.repromptSpeech)
      .getResponse();
  },
};

const RepeatHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent';
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    return handlerInput.responseBuilder
      .speak(sessionAttributes.speakOutput)
      .reprompt(sessionAttributes.repromptSpeech)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const speakOutput = requestAttributes.t('STOP_MESSAGE', requestAttributes.t('SKILL_NAME'));

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    console.log('Inside SessionEndedRequestHandler');
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say it again.')
      .reprompt('Sorry, I can\'t understand the command. Please say it again.')
      .getResponse();
  },
};

/* Helper Functions */

// Finding the locale of the user
const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true,
    });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    };
  },
};

// getRandomItem
function getRandomItem(arrayOfItems) {
  // the argument is an array [] of words or phrases
  let i = 0;
  i = Math.floor(Math.random() * arrayOfItems.length);
  return (arrayOfItems[i]);
}

/* LAMBDA SETUP */
const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    getCommandHandler,
    HelpHandler,
    RepeatHandler,
    ExitHandler,
    SessionEndedRequestHandler,
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();

// langauge strings for localization
// TODO: Check these

const languageStrings = {
  'en': {
    translation: {
      UTTERANCES: utterances.UTTERANCE_EN_US,
      COMMANDS: commands.COMMAND_EN_US,
      SKILL_NAME: 'gitHelp',
      WELCOME_MESSAGE: 'Welcome to %s. You can ask a question like, %s ... Now, what can I help you with?',
      WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
      HELP_MESSAGE: 'You can ask questions such as, %s, or, you can say exit...Now, what can I help you with?',
      HELP_REPROMPT: 'You can say things like, %s, or you can say exit...Now, what can I help you with?',
      STOP_MESSAGE: 'Goodbye!',
      REPEAT_MESSAGE: 'Try saying repeat.',
    },
  },
  'en-US': {
    translation: {
      UTTERANCES: utterances.UTTERANCE_EN_US,
      COMMANDS: commands.COMMAND_EN_US,
      SKILL_NAME: 'gitHelp',
    },
  }
};
