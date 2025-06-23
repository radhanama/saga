import React from 'react';
import './inlineError.scss';

const InlineError = ({ message }) => {
  if (!message) return null;
  return <div className="inline-error">{message}</div>;
};

export default InlineError;
