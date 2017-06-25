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
      this._onTerminal = this._onTerminal.bind(this);
    }

    _onTerminal (term) {
      if (this.props.onTerminal) this.props.onTerminal(term);
      const searchBox = document.createElement('div');
      searchBox.innerHTML = '<h1>Search</h1>';
      document.body.appendChild(searchBox);
    }

    render () {
      return React.createElement(Term, Object.assign({}, this.props, {
        onTerminal: this._onTerminal
      }));
    }

    componentWillUnmount () {

    }
  }
};
