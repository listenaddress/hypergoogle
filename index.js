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
        const theme = {
          backgroundColor: this.props.backgroundColor,
          fontFamily: this.props.fontFamily,
          fontSize: `${this.props.fontSize}px`,
          lineHeight: `${this.props.fontSize * 2}px`,
          padding: this.props.padding,
          inputColor: this.props.foregroundColor,
          buttonColor: this.props.colors.green,
          border: `2px solid ${this.props.colors.cyan}`,
        }

        const div = React.createElement(
          'div',
          { style: {
            position: 'absolute',
            top: '0',
            right: '0',
            padding: '0 10px',
            backgroundColor: theme.backgroundColor,
            zIndex: '100',
            fontFamily: theme.fontFamily,
            fontSize: theme.fontSize,
            lineHeight: theme.lineHeight
          }},
          React.createElement(
            'input',
            {
              onChange: this._onChange,
              value: this.state.searchText,
              style: {
                width: '240px',
                backgroundColor: 'inherit',
                color: theme.inputColor,
                border: theme.border,
                position: 'relative',
                right: '56px',
                padding: theme.padding,
                fontFamily: 'inherit',
                fontSize: 'inherit',
                lineHeight: 'inherit',
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
                width: 'auto',
                right: '0',
                fontFamily: 'inherit',
                border: theme.border,
                backgroundColor: 'inherit',
                padding: theme.padding,
                color: theme.buttonColor,
                fontSize: 'inherit',
                lineHeight: 'inherit',
                outline: 'none',
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
