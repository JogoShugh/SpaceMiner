const { warn } = console;

export default class UIAnalyticsEvent {
  constructor(props) {
    this.payload = props.payload;
    this.context = props.context || [];
    this.handlers = props.handlers || [];
    this.hasFired = false;
  }

  fire = (channel) => {
    if (this.hasFired) {
      warn('Cannot fire events more than one time.')
      return;
    }
    this.handlers.forEach(handler => handler(this, channel));
    this.hasFired = true;
  }

  update = (value) => {
    if (this.hasFired) {
      warn('Cannot update an event after firing');
      return this;
    }
    this.payload = typeof value === 'function'
      ? value(this.payload)
      : {
        ...this.payload,
        ...value,
      }

    return this;
  };
}
