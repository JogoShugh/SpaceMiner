var g = this['window'] !== undefined ? window : global;

g.markdownLesson = function(lessonFile, lessonId, environment = {}) {
  const params = [
    lessonFile,
    lessonId,
    environment
  ];
  if (Meteor.isServer) {
    const fm = Meteor.npmRequire('front-matter');
    const md = Meteor.npmRequire('markdown').markdown;
    const unescape = Meteor.npmRequire('unescape-html');
    const fs = Npm.require('fs');
    const hash = Meteor.npmRequire('string-hash');
    const babel = Meteor.npmRequire('babel-core');

    const training = (trainingId, programId, code) => {
      programId = programId || trainingId;
      return editor('game', {
        _id: programId,
        code,
        context: {
          level: trainingId,
          enableSound: false,
          buttons: ['gamePause', 'gamePlay', 'gameReset']
        }
      });
    };

    const env = environment;

    const run = sourceCode => {
      const newCode = babel.transform(sourceCode, {stage:1, ast:false}).code;
      return eval(newCode);
    }

    const dump = obj => console.log(JSON.stringify(obj, null, 2));

    let hashCurrent;
    const doc = Lessons.findOne(lessonId);
    if (doc) hashCurrent = doc.hash;

    fs.readFile(Lessons.lessonPath(lessonFile), 'utf8', (err, data) => {
      if (err) {
        console.error("ERROR PARSING LESSON");
        console.error(err);
      }

      const hashNew = hash(data);

      const content = fm(data);
      let p;
      const body = content.body.trim();
      const attrs = content.attributes;
      /*
      if (hashNew === hashCurrent) {
        console.log(`No changes for ${lessonId} found, exiting...`);
        return;
      }
      */

      const lesson = {
        _id: attrs.id,
        title: '',
        description: '',
        topics_main: attrs.topics,
        topics_sub: attrs['sub-topics'],
        sections: []
      };

      const states = {
        none: Symbol('none'),
        needLessonDescription: Symbol('needLessonDescription'),
        needSectionDescription: Symbol('needSectionDescription'),
        needStepData: Symbol('needStepData')
      };

      const state = {
        token: null,
        headingCount: 0,
        headingDepth: 0,
        current: states.none
      };

      const stateSet = newState => {
        state.current = newState;
      };  

      const stateIs = match => state.current === match;

      const typeIs = type => state.token[0] === type;

      const html = () => {
        if (state.token[0] === 'para' && state.token[1].indexOf('${') === 0) {
          let code = state.token[1].substring(2);
          code = code.substring(0, code.length-1);      
          let result = run(code);
          return result;
        }
        return md.renderJsonML(md.toHTMLTree(state.token));
      };

      const pos = (position, val) => val === position;
      const gt = (position, val) => val > position;
      const level = levelNum => state.token && state.token[1] && state.token[1].level === levelNum;
      const is = match => state.token && state.token[2] && state.token[2] === match;

      const headingPos = position => pos(position, state.headingCount);
      const headingGt = position => gt(position, state.headingCount);

      const lessonTitleSet = () => {
        lesson.title = html();
        stateSet(states.needLessonDescription);
      }

      const lessonDescriptionSet = () => lesson.description += html();

      const sectionAdd = () => {
        const section = {
          title: state.token[2],
          description: '',
          steps: []
        };
        lesson.sections.push(section);
        stateSet(states.needSectionDescription);    
        return section;
      };

      const sectionGet = () => lesson.sections[lesson.sections.length - 1];

      const sectionDescriptionSet = () => sectionGet().description += html();

      const stepAdd = () => {
        const step = {
          title: state.token[2],
          paras: []
        };
        sectionGet().steps.push(step);
        stateSet(states.needStepData);
        return step;
      }

      const stepGet = () => {
        const section = sectionGet();
        const step = section.steps[section.steps.length - 1];
        return step;
      };

      const stepParaAdd = () => {
        const para = html();
        stepGet().paras.push(para);
      };

      p = md.parse(body);
      //dump(p);

      for(let token of p) {
        state.token = token;
        if (typeIs('header')) {
          state.headingCount++;
          if (headingPos(1)) lessonTitleSet();
          else if (headingGt(1) && level(1)) sectionAdd();
          else if (headingGt(2) && level(2)) stepAdd();
        }
        else if (typeIs('para') && stateIs(states.needLessonDescription)) lessonDescriptionSet();
        else if (typeIs('para') && stateIs(states.needSectionDescription)) sectionDescriptionSet();
        else if (typeIs('para') && stateIs(states.needStepData)) stepParaAdd();
        else if (typeIs('bulletlist')) stepParaAdd();
      }
      
      const lessonSpec = {
        _id: lesson._id,
        title: unescape(lesson.title),
        description: unescape(lesson.description),
        topics_main: attrs.topics,
        topics_sub: attrs['sub-topics'],
        sections: [],
        hash: hashNew
      };

      for(let _sec of lesson.sections) {
        const secArgs = [unescape(_sec.title), {description:unescape(_sec.description)}];
        for (let _step of _sec.steps) {
          let text = '';
          // TODO this is goofy:
          const stepArray = [_step.title, ''];
          for (let _para of _step.paras) {
            if (_.isObject(_para)) {
              // Compensate for anything left over:
              if (text !== '') {
                stepArray[1] = text;
                text = '';
              }
              stepArray[1] = _para;
            } else {
              text += '<p>' + unescape(_para) + '</p>';
            }
          }
          stepArray[1] = text;
          secArgs.push(stepArray);
        }
        lessonSpec.sections.push(sec(...secArgs));
      }

      Lessons.add(lessonSpec, params);
    });
  }
};