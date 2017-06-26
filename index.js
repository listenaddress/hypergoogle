// The `decorateTerm` hook allows our extension to return a higher order react component
// It supplies us with:
// - Term: The terminal component
// - React: The enture React namespace
// - notify: Helper function for displaying notifications in the operating system
exports.decorateTerm = (Term, { React, notify }) => {
  // Define and return our higher order component
  return class extends React.Component {
    constructor (props, context) {
      super(props, context);
      this.state = {selectedText: ''};
      this._onTerminal = this._onTerminal.bind(this);
      this._onMouseUp = this._onMouseUp.bind(this);
    }

    _onTerminal (term) {
      if (this.props.onTerminal) this.props.onTerminal(term);
      this._window = term.document_.defaultView;
      this._window.addEventListener('mouseup', this._onMouseUp);
    }

    // Update this.state.selectedText if needed
    _onMouseUp () {
      console.log('mouse up');
      const newText = this._window.getSelection().toString();
      if (!newText && !this.state.selectedText) return;
      this.setState({'selectedText': newText});
    }

    render () {
      const children = [React.createElement(Term, Object.assign({}, this.props, {
        onTerminal: this._onTerminal,
        key: 'term'
      }))];

      const header = React.createElement('h1', {style: {color: 'red', position: 'absolute', top: 0}}, this.state.selectedText);
      children.push(header);
      return React.createElement('div', {style: {width: '100%', height: '100%', position: 'relative'}}, children);
    }

    componentWillUnmount () {
      this._window.removeEventListener('mouseup', this._onMouseUp);
    }
  }
};
