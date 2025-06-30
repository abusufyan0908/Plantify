import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  // This method is called when an error is caught
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // This method is called after an error has been caught
  componentDidCatch(error, info) {
    console.log("Error caught in ErrorBoundary: ", error);
    console.log("Error info: ", info);
    this.setState({ errorMessage: error.message });
  }

  render() {
    if (this.state.hasError) {
      // Customize the fallback UI when an error occurs
      return (
        <div className="error-boundary">
          <h2>Something went wrong!</h2>
          <p>{this.state.errorMessage}</p>
        </div>
      );
    }

    // If no error, render children as normal
    return this.props.children;
  }
}

export default ErrorBoundary;
