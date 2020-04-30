import React from 'react';
import { action } from '@storybook/addon-actions';
import { StoryContext } from '@storybook/addons';
import { Store } from 'store';
import SwapWizard from 'components/loop/swap/SwapWizard';

export default {
  title: 'Components/Swap Wizard',
  component: SwapWizard,
  parameters: { contained: true },
  decorators: [(storyFn: any) => <div style={{ padding: 100 }}>{storyFn()}</div>],
};

export const Default = (ctx: StoryContext) => {
  // grab the store from the Storybook parameter defined in preview.tsx
  const { channels } = ctx.parameters.store as Store;
  return <SwapWizard channels={channels.slice(0, 3)} onClose={() => action('onClose')} />;
};
