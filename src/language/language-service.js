'use strict';
const LinkedList = require('./LinkedList');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score'
      )
      .where('language.user_id', user_id)
      .first();
  },

  updateLanguageScore(db, user_id, new_score) {
    return db('language')
      .where('language.user_id', user_id)
      .update(
        {'total_score': new_score}
      );
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({ language_id });
  },

  getLanguageWordsLinkedList(words) {
    const wordsLinkedList = new LinkedList();

    //Find the node that no node points to
    const nextIds = words.map(word => word.next);
    const head = words.find(word => !nextIds.includes(word.id));

    wordsLinkedList.push(head);
    
    let curr = head;
    while(curr.next !== null){
      const nextWord = words.find(word => word.id === curr.next);
      wordsLinkedList.push(nextWord);
      curr = nextWord;
    }

    return wordsLinkedList;
  },

  saveLanguageWordsLinkedList: async (db, wordsLinkedList) => {
    const updateWord = (db, word) => {
      return db('word')
        .where('word.id', word.id)
        .update(word);
    };

    let currentWordNode = wordsLinkedList.first();
    while(currentWordNode !== null){
      const currentWord = currentWordNode.val;
      if(currentWordNode.next !== null) {
        currentWord.next = currentWordNode.next.val.id;
      } else {
        currentWord.next = null;
      }
      await updateWord(db, currentWord);

      currentWordNode = currentWordNode.next;
    }

    
  }
};

module.exports = LanguageService;

