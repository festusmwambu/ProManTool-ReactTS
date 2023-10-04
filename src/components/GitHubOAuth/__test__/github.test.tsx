import { render, screen } from '@testing-library/react';

import GitHubOAuth from '../github_oauth';



describe("<GitHubOAuth />", () => {
  it('Matches snapshot', () => {
    render(
      <GitHubOAuth onSuccess={jest.fn()} />
    );
    
    // Use screen.queryByTestId method
    const GitHubOAuthElement = screen.queryByTestId("gitHubOAuth-element");
        
    // Expectations
    expect(GitHubOAuthElement).toMatchSnapshot();
  });

  it('Receives text', () => {
    const testText = 'testText';

    render(
      <GitHubOAuth onSuccess={jest.fn()} text={testText} />
    );
    
    const GitHubOAuthElement = screen.queryByTestId("gitHubOAuth-element");
    
    expect(GitHubOAuthElement).toHaveTextContent('testText');
  });
});