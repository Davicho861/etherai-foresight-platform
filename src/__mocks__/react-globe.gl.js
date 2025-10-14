import React from 'react';

// Minimal mock of react-globe.gl for Jest tests.
const Globe = (props) => {
  // Render a simple div that tests can query by role or textContent
  return React.createElement('div', { 'data-testid': 'mock-globe' }, props.children || null);
};

export default Globe;
