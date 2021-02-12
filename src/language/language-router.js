const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const LinkedList = require('./LinkedList')

const languageRouter = express.Router()
const jsonBodyParser = express.json()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter.get("/head", async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get("db"),
        req.language.id
      );
  
      res.json({
        nextWord: words[0].original,
        totalScore: req.language.total_score,
        wordCorrectCount: words[0].correct_count,
        wordIncorrectCount: words[0].incorrect_count
      });
    } catch (err) {
      next(err);
    }
  });
  
languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    try {
      console.log(req.body)
      if(!req.body.guess)
        return res.status(400).json({
          error: `Missing 'guess' in request body`,
        })
      
      const guess = req.body.guess;
      const words = await LanguageService.getLanguageWords(
          req.app.get("db"),
          req.language.id
        );

      const wordsLinkedList = LanguageService.getLanguageWordsLinkedList(words);
      const currentWord = wordsLinkedList.first().val;
      const nextWord = wordsLinkedList.first().next.val;

      const isCorrect = currentWord.translation === guess;
     console.log(`IS CORRECT?: ${isCorrect}`)
      if(isCorrect){
        req.language.total_score++;
        await LanguageService.updateLanguageScore(
          req.app.get("db"),
          req.language.id,
          req.language.total_score);

        currentWord.correct_count++;
        currentWord.memory_value *= 2;
      } else {
        currentWord.incorrect_count++;
        currentWord.memory_value = 1;
      }  

      const result = {
        nextWord: nextWord.original,
        totalScore: req.language.total_score,
        wordCorrectCount: nextWord.correct_count,
        wordIncorrectCount: nextWord.incorrect_count,
        answer: currentWord.translation,
        isCorrect: isCorrect
      };  

      wordsLinkedList.moveHeadForward(currentWord.memory_value);

      await LanguageService.saveLanguageWordsLinkedList(
        req.app.get("db"),
        wordsLinkedList
      )

      return res.json(result);
    } catch (error) {
      next(error)
    }
  })
  

module.exports = languageRouter
