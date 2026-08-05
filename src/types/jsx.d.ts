import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'buy-button-id'?: string;
          'publishable-key'?: string;
        },
        HTMLElement
      >;
    }
  }

  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'stripe-buy-button': React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            'buy-button-id'?: string;
            'publishable-key'?: string;
          },
          HTMLElement
        >;
      }
    }
  }
}
