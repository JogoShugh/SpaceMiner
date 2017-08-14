Template.selfAssessment.onCreated(function(){
	if (!this.data.resourcePath) this.data.resourcePath = null;
	if (!this.data.data) this.data.data = {};
	if (!this.data.selected) this.data.selected = () => {};
});

const insert = (instance, sense) => {
	const data = instance.data;
	SelfAssessments.save(data.resourcePath, sense, data.data);
};

const advance = (instance, sense) => {
	const data = instance.data;
	data.selected(sense);
};

const insertAndAdvance = (instance, sense) => {
	insert(instance, sense);
	advance(instance, sense);
};

const getMySense = instance => {
  const assessment = SelfAssessments.findByUserIdAndResourcePath(Meteor.userId(), instance.resourcePath);
  if (assessment) return assessment.sense;
  return undefined;
};

Template.selfAssessment.helpers({
  not() {
    return getMySense(Template.instance().data) === 'not';
  },
  almost() {
    return getMySense(Template.instance().data) === 'almost';
  } , 
  yes() {
    return getMySense(Template.instance().data) === 'yes';
  },
  activeFor(type) {
    const resourcePath = Template.instance().data.resourcePath;
    if (type === 'wants-help-yes')  return SelfAssessments.wantsHelp(resourcePath)  ? 'active' : '';
    if (type === 'wants-help-no')   return SelfAssessments.wantsHelp(resourcePath)  ? '' : 'active';
    if (type === 'will-help-yes')   return SelfAssessments.willHelp(resourcePath)   ? 'active' : '';
    if (type === 'will-help-no')    return SelfAssessments.willHelp(resourcePath)   ? '' : 'active';    
    return '';
  }
});

const publishUserOpenedLessonSectionPartEvent = resourcePath => {
  // TODO: Fix total hack!
  const lesson = Router.current().data();
  const pathParts = resourcePath.split('/');
  const sectionIndex = pathParts[2];
  const partIndex = pathParts[3];

  // TODO: use better event name here
  publish('userOpenedLessonSectionPart', {lesson, sectionIndex, partIndex, status: 'yes'});
};


Template.selfAssessment.events({
  'click .not'() {
    insertAndAdvance(Template.instance(), 'not');
  },
  'click .almost'() {
    insertAndAdvance(Template.instance(), 'almost');
  },
  'click .yes'() {
    const inst = Template.instance();
    const resourcePath = inst.data.resourcePath;
    insertAndAdvance(inst, 'yes');
    publishUserOpenedLessonSectionPartEvent(resourcePath);
  },
  'click .not-help'() {
  	SelfAssessments.helpRequest(Template.instance().data.resourcePath);
  },
  'click .not-help-cancel'() {
    SelfAssessments.helpRequestCancel(Template.instance().data.resourcePath);
  },  
  'click .almost-help'() {
	 SelfAssessments.helpRequest(Template.instance().data.resourcePath);
  },
  'click .almost-help-cancel'() {
   SelfAssessments.helpRequestCancel(Template.instance().data.resourcePath);
  },  
  'click .i-can-help'() {
  	SelfAssessments.helpAvailable(Template.instance().data.resourcePath);
  },
  'click .i-can-help-cancel'() {
    SelfAssessments.helpAvailableCancel(Template.instance().data.resourcePath);
  }  
});