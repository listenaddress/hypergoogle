const electron = require('electron');

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
      this.state = {searchText: ''};
      this._onTerminal = this._onTerminal.bind(this);
      this._onMouseUp = this._onMouseUp.bind(this);
      this._onChange = this._onChange.bind(this);
      this._onSearch = this._onSearch.bind(this);
    }

    _onTerminal (term) {
      if (this.props.onTerminal) this.props.onTerminal(term);
      this._window = term.document_.defaultView;
      this._window.addEventListener('mouseup', this._onMouseUp);
    }

    // Update this.state.searchText if needed
    _onMouseUp () {
      const newText = this._window.getSelection().toString();
      if (!newText && !this.state.searchText) return;
      this.setState({'searchText': newText});
    }

    _onChange (event) {
      this.setState({'searchText': event.target.value});
    }

    _onSearch () {
      const query = this.state.searchText.split(' ').join('+');
      electron.shell.openExternal('https://www.google.com/#q=' + query);
    }

    render () {
      let children = [
        React.createElement(Term, Object.assign({}, this.props, {
          onTerminal: this._onTerminal,
          key: 'term'
        })),
      ];

      if (this.state.searchText) {
        const div = React.createElement(
          'div',
          { style: {
            position: 'absolute',
            right: '-1px',
            padding: '5px 10px',
            paddingBottom: '8px',
            border: '1px solid white',
            backgroundColor: 'black',
            color: 'white',
            zIndex: '100',
            fontFamily: 'Menlo, "DejaVu Sans Mono", "Lucida Console", monospace',
          }},
          React.createElement(
            'input',
            {
              onChange: this._onChange,
              value: this.state.searchText,
              style: {
                width: '350px',
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                fontFamily: 'inherit',
                outline: 'none',
              },
            }
          ),
          React.createElement(
            'button',
            {
              onClick: this._onSearch,
              style: {
                position: 'absolute',
                width: '55px',
                height: '23px',
                bottom: '-24px',
                right: '-1px',
                fontFamily: 'inherit',
                borderRadius: '0px',
                border: '0px',
                backgroundColor: 'yellow',
                cursor: 'pointer',
              },
            },
            'Search'
          )
        );

        children.unshift(div);
      }

      return React.createElement('div', {style: {width: '100%', height: '100%', position: 'relative'}}, children);
    }

    componentWillUnmount () {
      this._window.removeEventListener('mouseup', this._onMouseUp);
    }
  }
};
