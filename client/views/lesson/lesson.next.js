const lastSeenText = date => {
  const dateText = moment(date).fromNow();
  if (dateText === 'Invalid date') return 'never seen';
  return `seen ${dateText}`;
};

var lesson = null;
var lessonProgress;
var lessonDep = new Tracker.Dependency;
const sectionNavVisible = new ReactiveVar(true);

var currentSecIndex = new ReactiveVar(0);
var currentPartIndex = new ReactiveVar(0);

function updateLessonProgress(lessonProgress) {
  LessonsProgress.update({_id:lessonProgress._id}, {$set: _.omit(lessonProgress, '_id')});
}

function getLessonProgressForCurrentUser() {
  return LessonsProgress.findOneForUser(lesson, Meteor.userId());
}

function updateLessonProgressPartLastViewed(lessonProgress, secIndex, partIndex, includeSec) {
  if (includeSec) {
    lessonProgress.sections.items[secIndex].lastViewed = new Date();
    lessonProgress.sections.lastIndex = secIndex;
  }
  lessonProgress.sections.items[secIndex].parts.items[partIndex].lastViewed = new Date();
  lessonProgress.sections.items[secIndex].parts.lastIndex = partIndex;
  updateLessonProgress(lessonProgress);
}

function setupWindowGlobals() {
  window.display = function(expr) {
    bootbox.alert(String(expr));
  }
}

const lessonToAssetApiPayload = (lesson, scopeName) => {
  const epic = {
    AssetType: 'Epic',
    Scope: scopeName,
    Description: lesson.description,
    Name: lesson.title,
    Subs: []
  };

  for(const section of lesson.sections) {
    const story = {
      AssetType: 'Story',
      Name: section.title,
      Description: section.description,
      Children: []
    };

    for(const part of section.parts) {
      const task = {
        AssetType: 'Task',
        Name: part.title
      };
      story.Children.push(task);
    }
    epic.Subs.push(story);
  }

  return epic;
};

const v1Setup = lesson => {
  const client = new V1Client();
  const userName = client.userName;
  const scopeName = `${userName}'s Project`;

  const data = {
    from: 'Epic',
    where: {
      Name: lesson.title,
      'Scope.Name': scopeName
    },
    select: ['Name']
  };

  client.query({data})
  .catch(error => console.error('Error querying existing Epic for Lesson: ', error))
  .then(result => {
    console.log('Query existing Epic for Lesson result: ', result);
    if (result.data && result.data[0].length === 0) {
      console.log('No Epic for Lesson found, will create...');
      const payload = lessonToAssetApiPayload(lesson, scopeName);
      client.assetsPost({data: payload})
      .catch(error => console.error("Error creating Epic for Lesson: ", error))
      .then(result => console.log("Epic for Lesson create succeeded. Assets created: ", result.data.assetsCreated.oidTokens.join(',')));
    } else {
      console.log('Found Epic for Lesson, will not create a new one');
    }
  });
  
};

Template.lesson.rendered = function() {
  setupWindowGlobals();

  //var id = Router.current().params._id;
  var id = Router.current().params.query.id;

  // Insane: not sure why I have to do this, but it prevents errors...
  Lessons.update({_id: id}, {$inc: {views:1}}, function(err, count) {
    lesson = Router.current().data();
    v1Setup(lesson);

    var secIndex = Router.current().params.query.sec;
    var partIndex = Router.current().params.query.part;

    lessonProgress = getLessonProgressForCurrentUser();
    LessonsProgress.overlayOnLesson(lesson, lessonProgress);
    lessonProgress.lastViewed = new Date();

    if (secIndex) {
      secIndex = parseInt(secIndex) - 1;
    } else {
      secIndex = lessonProgress.sections.lastIndex;
    }
    if (partIndex)  {
      // nothing special, just parse it
      partIndex = parseInt(partIndex) - 1;
    } else {
      partIndex = lessonProgress.sections.items[secIndex].parts.lastIndex;
    }
    currentSecIndex.set(secIndex);
    currentPartIndex.set(partIndex);
    lessonDep.changed();
    updateLessonProgressPartLastViewed(lessonProgress, secIndex, partIndex, true);
  });
}

function getLesson() {
  lessonDep.depend();
  return lesson;
}

const selfAssessmentResourcePath = () => {
  const lesson = getLesson();
  const secIndex = currentSecIndex.get();
  const partIndex = currentPartIndex.get();
  const path = Lessons.resourcePath(lesson.lessonId, secIndex, partIndex);
  return path;
};

let answeredDep = new Tracker.Dependency;
let isQuiz = new ReactiveVar(false);

Template.lesson.helpers({
  sectionWidth() {
    return sectionNavVisible.get() ? '7' : '10';
  },
  sectionShimClass() {
    return sectionNavVisible.get() ? '' : 'lesson-section-fullscreen-left-shim';
  },
  lessonTitle() {
    const lesson = getLesson();
    if (!lesson) return '';
    return lesson.title;
  },
  lessonDescription() {
    const lesson = getLesson();
    return lesson ? lesson.description : '';
  },
  lessonLastViewed() {
    const lesson = getLesson();
    if (!lesson) return '';
    if (lesson.lastViewed) {
      const fmt = moment(lesson.lastViewed).fromNow();
      return 'lesson seen ' + fmt;
    }
    return 'lesson seen just now';
  },  
  gameData() {
    return {
      level: "boxStep",
      enableSound: false
    };
  },
  lesson: getLesson,
  challengeReady() {
    answeredDep.depend();
    var lesson = getLesson();
    if (!lesson) return;
    var questions = lesson.questions;
    var ready = _.every(questions, (question)=> {
      return question.correct;
    });
    if (ready) {
      $('.collapse').collapse('hide');
    }
    return ready;
  },
  rendered() {
    var lesson = getLesson();
    return lesson !== null;
  },
  currentPartIndex() {
    return currentPartIndex.get();
  },
  helpRequestsOptions() {    
    return { filterToUserId: Meteor.userId(), showLinks: true, displayMode: 'vertical'};
  },
  lessonFinished() {
    try {
      const index = currentSecIndex.get();     
      const lesson = getLesson();
      const sectionCount = lesson.sections.length;
      const partsCount = lesson.sections[index].parts.length;
      const partIndex = currentPartIndex.get();
      return (index >= lesson.sections.length - 1) && partIndex >= partsCount - 1;
    } catch(ex) {
      console.error('lessonFinished error: ', ex);
      return false;
    }
  },
  selfAssessmentResourcePath() {
    return selfAssessmentResourcePath();
  },
  selfAssessmentData() {
    return { nothing: 'here yet'};
  },
  onAssessmentSelected() {
    const instance = Template.instance();
    return () => {
      const continueButton = instance.find('.continue');
      continueButton.removeAttribute('disabled');
    };
  }  
});

let popquiz = {finished:false};
const popquizDep = new Tracker.Dependency();

Template.popquiz.rendered = function() {
  popquiz = this.data;
  popquiz.finished = false;
  popquizDep.changed();
  isQuiz.set(true);
};

Template.popquiz.helpers({
  lesson: getLesson,
  finished() {
    popquizDep.depend();
    return popquiz.finished;
  }
});


const updateV1StoryForSection = (lesson, sectionIndex) => {
  const client = new V1Client();
  const userName = client.userName;
  const scopeName = `${userName}'s Project`;

  const data = {
    from: 'Story',
    where: {
      Name: lesson.sections[sectionIndex].title,
      'Scope.Name': scopeName
    },
    set: {
      Owners: userName,
      Timebox: 'Iteration 1'
    }
  };

  client.assetsPost({data})
  .catch(error => console.error('Error updating Story for Section: ', error))
  .then(result => {
    if (result.data) {
      console.log('Updating Story for Section succeeded: ', result.data.assetsModified.oidTokens.join(','));
    } else {
      console.log('Did not find Story for Section. Maybe it was deleted?');
    }
  });
};

const updateV1TaskForPart = (lesson, sectionIndex, partIndex) => {
  const client = new V1Client();
  const userName = client.userName;
  const scopeName = `${userName}'s Project`;

  const data = {
    from: 'Task',
    where: {
      Name: lesson.sections[sectionIndex].parts[partIndex].title,
      'Scope.Name': scopeName
    },
    set: {
      Status: 'In Progress'
    }
  };

  client.assetsPost({data})
  .catch(error => console.error('Error updating Task for Part: ', error))
  .then(result => {
    if (result.data) {
      console.log('Updating Task for Part succeeded: ', result.data.assetsModified.oidTokens.join(','));
    } else {
      console.log('Did not find Task for Part. Maybe it was deleted?');
    }
  });
};

Template.section.helpers({
  current() {
    var index = currentSecIndex.get();    
    return this.index === index;
  },
  title() {
    var index = currentSecIndex.get();
    var lesson = getLesson();
    return lesson.sections[index].title;
  },
  currentPart() {
   var index = currentPartIndex.get();
   return this.index === index;
  },
  lastViewedPart() {
    currentPartIndex.get();
    return this.lastViewed ? 'step ' + (this.index+1) + ' seen ' + moment(this.lastViewed).fromNow() : 'step ' + (this.index+1) + ' seen just now';
  },
  partIndex() {
    return this.index + 1;
  },
  partIndex() {
    lessonDep.depend();
    const index = currentPartIndex.get();
    return index;
  },
  options() {
    lessonDep.depend();
    const secIndex = currentSecIndex.get();
    const partIndex = currentPartIndex.get();
    return { resourcePath: Lessons.resourcePath(Router.current().params.query.id, secIndex, partIndex), limit: 5 };
  }
});

const isCurrentSection = index => index === currentSecIndex.get();

Template.sectionNav.helpers({
  current() {
    return isCurrentSection(this.index) ? 'active' : '';
  },
  seenStar() {
    currentSecIndex.get();
    return this.lastViewed !== null ? 'fa-star' : 'fa-star-o';
  },
  seenBadge() {
    currentSecIndex.get();
    return this.lastViewed !== null ? 'alert-success' : '';
  },
  lastViewed() {
    var index = currentSecIndex.get();
    if (this.lastViewed) {
      var fmt = moment(this.lastViewed).fromNow();
      return 'seen ' + fmt;
    }
    return index === this.index ? 'seen just now' : 'never seen';
  },
  sectionCurrent() {
    return currentSecIndex.get() + 1;
  },
  sectionTotal() {
    const lesson = getLesson();
    return lesson.sections.length;
  },
  sectionCurrentClass() {
    return isCurrentSection(this.index) ? '' : 'lesson-section-nav-unselected';
  }
});

Template.sectionNav.events({
  'click .sectionNav'(evt, template) {
    currentSecIndex.set(template.data.index);
    currentPartIndex.set(0);
    var lesson = getLesson();
    LessonsProgress.overlayOnLesson(lesson, lessonProgress);
    updateLessonProgressPartLastViewed(lessonProgress, template.data.index, 0, true);
    updateV1StoryForSection(lesson, template.data.index);
  }
});

const isCurrentPart = index => currentPartIndex.get() === index;

Template.sectionNavParts.helpers({
  current() {
    return isCurrentPart(this.index);
  },
  partIndex() {
    return this.index + 1;
  },
  seenStatusColor() {
    const seenText = lastSeenText(this.lastViewed);
    return seenText === 'never seen' ? 'primary' : 'success';
  },
  seenStatusEye() {
    const seenText = lastSeenText(this.lastViewed);
    return seenText === 'never seen' ? 'fa-eye-slash' : 'fa-eye';
  },
  labelType() {
    return isCurrentPart(this.index) ? 'primary' : 'default';
  },
  stepCurrent() {
    return currentPartIndex.get() + 1;
  },
  stepTotal() {
    const lesson = getLesson();
    return lesson.sections[currentSecIndex.get()].parts.length;
  },
  isQuiz() {
    const wellIsIt = isQuiz.get();
    return wellIsIt;
  },
  selfAssessmentResourcePath() {
    return selfAssessmentResourcePath();
  },
  selfAssessmentData() {
    return { nothing: 'here yet'};
  },
  onAssessmentSelected() {
    const instance = Template.instance();
    return () => {
      const continueButton = instance.find('.continue');
      continueButton.removeAttribute('disabled');
    };
  }
});

Template.sectionNavParts.events({
  'click .lesson-section-nav-parts-part-link': function(evt, template) {
    currentPartIndex.set(this.index);
    LessonsProgress.overlayOnLesson(lesson, lessonProgress);
    updateLessonProgressPartLastViewed(lessonProgress, currentSecIndex.get(), this.index);
    updateV1TaskForPart(lesson, currentSecIndex.get(), this.index);
  }
});

Template.lesson.events({
  'click .lesson-menu-hide'() {
    $('.lesson-menu').hide();
    $('.lesson-menu-show').show();
    sectionNavVisible.set(false);
  },
  'click .lesson-menu-show'() {
    $('.lesson-menu-show').hide();    
    $('.lesson-menu').show();
    sectionNavVisible.set(true);
  },  
  'click .prev'() {
    var index = currentSecIndex.get(); 
    currentSecIndex.set(index-1);
  },
  'click .continue'(evt, template) {
    var index = currentSecIndex.get();     
    var lesson = getLesson();
    LessonsProgress.overlayOnLesson(lesson, lessonProgress);
    var parts = lesson.sections[index].parts;
    var partIndex = currentPartIndex.get();
    if (partIndex < parts.length - 1) {
      const nextIndex = partIndex + 1;
      currentPartIndex.set(nextIndex);
      updateLessonProgressPartLastViewed(lessonProgress, index, nextIndex);
    }
    if (partIndex === parts.length -1) {
      currentSecIndex.set(index+1);
      currentPartIndex.set(0);
      updateLessonProgressPartLastViewed(lessonProgress, index+1, 0, true);
    }
    $(template.find('.continue')).attr('disabled', 'disabled');
  },  
});

var sharedHelpers = {
  partIndex: function() {
    return this.index + 1;
  }  
};

_.each(['paragraph', 'quickCheck', 'popquiz'], function(item) {
  Template[item].helpers(sharedHelpers);
});

Template.paragraph.rendered = function() {  
  $('script[type="text/spaceminer+dynamic"]').each(function() {
    var el = $(this);
    var name = el.attr('data-name');
    var data;
    var text = el.text();
    try {
      var data = JSON.parse(text);
    } catch (ex) {
      data = text;
    }
    UI.insert(UI.renderWithData(Template[name], data), this.parentNode, this);
    el.remove();
  }); 
};

['paragraph', 'quickCheck', 'popquiz'].forEach(templateName => {
  Template[templateName].onRendered(() => {
    const lesson = getLesson();
    const resourcePath = `lesson/${lesson.lessonId}/${currentSecIndex.get()}/${currentPartIndex.get()}`;
    Presence.presenceUpdate(resourcePath, 'lesson');
  });
});

Template.quickCheck.events({
  'click .quickCheckSubmit'(evt, template) {
    const input = $(template.find('.quickCheckInput')).val();
    const index = currentSecIndex.get();
    const lesson = getLesson();
    LessonsProgress.overlayOnLesson(lesson, lessonProgress);    
    const part = template.data;
    try {
      const evaluator = eval(part.evaluator);
      const correct = evaluator(input);
      if (correct) {
        bootbox.alert("<div class='bbalert'><i class='fa fa-smile-o'></i><h2>Correct!</h2> <p>Press OK to continue...</p></div>", ()=> {
          currentSecIndex.set(index+1);
          currentPartIndex.set(0);
          updateLessonProgressPartLastViewed(lessonProgress, index+1, 0, true);
        });
      } else {
        bootbox.alert("<div class='bbalert'><i class='fa fa-frown-o'></i><h2>Nope!</h2><p>Press OK to try again...</p></div>");
      }
    } catch(ex) {
      bootbox.alert("<h2>There was a problem with the system!</h2>");
      console.error('quickCheck:click .quickCheckSubmit exception: ', ex);      
    }
  }
});

let questionClock = new ReactiveClock('questionClock');

let questionClockReset = () => {
  questionClock.setElapsedSeconds(0);
  questionClock.start();
};

let currentQuestionDep = new Tracker.Dependency();

Tracker.autorun(() => {
  currentQuestionDep.depend();
  questionClockReset();
});

Tracker.autorun(() => {
  let currentPart = currentPartIndex.get();
  isQuiz.set(false);
});

Template.question.rendered = function() {
  $('.choice').button();
  questionClockReset();
};

Template.question.helpers({
  current: function() {
    currentQuestionDep.depend();
    return this.current;
  },
  questionNumber: function() {
    return this.index + 1;
  },
  questionCount: function() {
    popquizDep.depend();
    if (popquiz.questions) return popquiz.questions.length;
    return 1;
  },
  prevDisabled: function() {
    answeredDep.depend();
    return this.index === 0 ? 'disabled' : '';
  },
  nextDisabled: function() {
    answeredDep.depend();
    return this.nextEnabled ? '' : 'disabled';
  }
});

let attemptLog = (index, attemptTime, correct) => ({
  index,
  attemptTime,
  correct
});

Template.question.events({
  'click .check': function(evt, template) {
    var val = $(template.find('.question .btn-group .btn[class*="active"] input')).val();
    let attemptTime = questionClock.elapsedTime();
    questionClockReset();
    if (val) {
      var index = parseInt(val);
      var correct = this.correctIndex == parseInt(index);
      var icon = correct ? 'fa fa-check' : 'fa fa-ban';
      var bg = correct ? 'seagreen' : 'indianred';
      $(template.find('.feedback')).html(`<div style='padding: 4px; color: white; background-color: ${bg}'><span class='${icon}'></span>&nbsp;` + this.choices[index].feedback + '</div>');
      $(template.find('.feedback')).hide();
      $(template.find('.feedback')).fadeIn('slow');
      this.correct = correct;
      this.attempts.push(attemptLog(index, attemptTime, correct));
      if (correct) this.nextEnabled = true;
      answeredDep.changed();
    }
  },
  'click .prevQuestion': function(evt, template) {
    let prev = popquiz.questions[this.index - 1];
    if (prev) {
      this.current = false;
      prev.current = true;
      currentQuestionDep.changed();
    }
  },
  'click .nextQuestion': function(evt, template) {
    let next = popquiz.questions[this.index + 1];
    if (next) {
      this.current = false;
      next.current = true;
    } else {
      popquiz.finished = true;
      this.current = false;
      popquizDep.changed();
    }
    currentQuestionDep.changed();
  }
});

Template.popquizChoiceReview.helpers({
  active: function() {
    return this.choice.value.correct ? 'active' : ''
  },
  correct: function() {
    return this.choice.value.correct ? 'greenChecked' : '';
  },
  attempt: function() {
    let attempts = popquiz.questions[this.question].attempts;
    let attemptIndex = 0;
    let theAttempt;
    let attemptNumber = 0;
    for(let attempt of attempts) {
      attemptIndex++;
      if (attempt.index === this.choice.index) {
        attemptNumber = attemptIndex;
        theAttempt = attempt;
        break;
      }
    }
    if (attemptNumber > 0) {
      let star = theAttempt.correct ? " <span class='fa fa-star'></span>" : '';
      return `<span class='badge' title='${theAttempt.attemptTime}'>${attemptNumber}${star}</span>`;
    }
    else return '';
  }
});

let popquizQuestionReviewTemplate = {};

Template.popquizQuestionReview.rendered = function() {
  let correctChoice;
  for(let choice of this.data.popquiz.choices) {
    if (choice.correct) correctChoice = choice;
  }
  const icon = 'fa fa-check';
  const bg = 'seagreen';
  $(this.view.templateInstance().find('.feedback-' + this.data.question)).html(`<div style='padding: 4px; color: white; background-color: ${bg}'><span class='${icon}'></span>&nbsp;` + correctChoice.feedback + '</div>');
  $(this.view.templateInstance().find('.feedback-' + this.data.question)).show();
};

Template.popquizChoiceReview.events({
  'click .choice': function() {
    const correct = this.choice.value.correct;
    const icon = correct ? 'fa fa-check' : 'fa fa-ban';
    const bg = correct ? 'seagreen' : 'indianred';
    $('.feedback-' + this.question).html(`<div style='padding: 4px; color: white; background-color: ${bg}'><span class='${icon}'></span>&nbsp;` + this.choice.value.feedback + '</div>');
    $('.feedback-' + this.question).hide();
    $('.feedback-' + this.question).fadeIn('slow');
  }
});