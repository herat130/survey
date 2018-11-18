import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
    };
  }

  componentDidCatch(error, info) {
    this.setState({
      error: true,
    })
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;
    if (error)
      return (
        <h1>Encounder some issue</h1>
      )
    return children;
  }
}