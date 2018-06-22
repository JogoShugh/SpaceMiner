# Markdown cheatsheet

https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet

# Clear out LessonsProgress

Sometimes when adding new lessons, the lesson structure gets hosed up and causes problems when it has already tracked progress. Run this on the JS console to clear out the progress:

```javascript
LessonsProgress.find().fetch().forEach(x => LessonsProgress.remove(x._id)); LessonsProgress.find().fetch() 
```

You should get back `[]`
