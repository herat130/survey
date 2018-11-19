import React from 'react';

export default class InputAnswer extends React.Component {

  renderInputField() {
    const { input, fieldType, questionIndex } = this.props;
    return (
      <input
        key={'renderInput'}
        type={fieldType}
        value={input}
        onChange={(e) => this.props.handleChangeOptions(e, questionIndex)}
      />
    )
  }

  renderTextArea() {
    const { input, questionIndex } = this.props;
    return (
      <textarea
        key={'renderArea'}
        value={input}
        onChange={(e) => this.props.handleChangeOptions(e, questionIndex)}
      />
    )
  }

  render() {
    const { type } = this.props;
    return type === 'text' ? this.renderInputField() : this.renderTextArea();
  }

}
