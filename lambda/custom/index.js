/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const commands = require('./gitCommands');
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

    // TODO: this prints the gitCommand variable with underscores, line 18 and 21.
    const item = requestAttributes.t(getRandomItem(Object.keys(commands.COMMAND_EN_US)));

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

    // TODO: get slot values
    /*
      If below does not work, try this:
      var slotValues = getSlotValues(this.event.request.intent.slots);
      followLink(this.event, [slotValues['direction']['resolved'], slotValues['direction']['synonym']])
    */
    const actionSlot = handlerInput.requestEnvelope.request.intent.slots.action.value;
    const thisSlot = handlerInput.requestEnvelope.request.intent.slots.this.value;
    const thingSlot = handlerInput.requestEnvelope.request.intent.slots.thing.value;

    let commandReference;
    if (thisSlot != null) {
      commandReference = actionSlot.toLowerCase() + '_' + thisSlot.toLowerCase() + '_' + thingSlot.toLowerCase();
    } 
    commandReference = actionSlot.toLowerCase() + '_' + thingSlot.toLowerCase();


    const cardTitle = requestAttributes.t('DISPLAY_CARD_TITLE', requestAttributes.t('SKILL_NAME'), commandReference);
    const myCommands = requestAttributes.t('COMMANDS');
    const command = myCommands[commandReference];
    let speakOutput = '';

    if (command) {
      sessionAttributes.speakOutput = command;
      // uncomment the _2_ reprompt lines if you want to repeat the info
      // and prompt for a subsequent action
      // sessionAttributes.repromptSpeech = requestAttributes.t('RECIPE_REPEAT_MESSAGE');
      handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

      return handlerInput.responseBuilder
        .speak(sessionAttributes.speakOutput)
        // .reprompt(sessionAttributes.repromptSpeech)
        .withSimpleCard(cardTitle, command)
        .getResponse();
    }

    const repromptSpeech = requestAttributes.t('NOT_FOUND_REPROMPT');
    if (commandReference) {
      speakOutput += requestAttributes.t('NOT_FOUND_WITH_ITEM_NAME', commandReference);
    } else {
      speakOutput += requestAttributes.t('NOT_FOUND_WITHOUT_ITEM_NAME');
    }
    speakOutput += repromptSpeech;

    // save outputs to attributes, so we can use it to repeat
    sessionAttributes.speakOutput = speakOutput;
    sessionAttributes.repromptSpeech = repromptSpeech;

    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    return handlerInput.responseBuilder
      .speak(sessionAttributes.speakOutput)
      .reprompt(sessionAttributes.repromptSpeech)
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
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
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
// TODO: The items below this comment need your attention

const languageStrings = {
  'en': {
    translation: {
      COMMANDS: commands.COMMAND_EN_US,
      SKILL_NAME: 'gitHelp',
      WELCOME_MESSAGE: 'Welcome to %s. You can ask a question like, what\'s the command for a %s? ... Now, what can I help you with?',
      WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
      DISPLAY_CARD_TITLE: '%s  - Command for %s.',
      HELP_MESSAGE: 'You can ask questions such as, what\'s the Command for a %s, or, you can say exit...Now, what can I help you with?',
      HELP_REPROMPT: 'You can say things like, what\'s the command for a %s, or you can say exit...Now, what can I help you with?',
      STOP_MESSAGE: 'Goodbye!',
      REPEAT_MESSAGE: 'Try saying repeat.',
      NOT_FOUND_WITH_ITEM_NAME: 'I\'m sorry, I currently do not know the command for %s. ',
      NOT_FOUND_WITHOUT_ITEM_NAME: 'I\'m sorry, I currently do not know that command. ',
      NOT_FOUND_REPROMPT: 'What else can I help with?',
    },
  },
  'en-US': {
    translation: {
      COMMANDS: commands.COMMAND_EN_US,
      SKILL_NAME: 'gitHelp',
    },
  }
};
