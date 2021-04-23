import { screen } from '@testing-library/dom';
import { renderPOSComponent } from '@orion/ui/test-utils';
import { useKernels, addPlugin } from '@orion/core/test-utils';
import { i18nTestUtilsKernel } from '@orion/i18n/test-utils';

import TemplatePluginHelloWorld from '../index';
import TemplatePluginHelloWorldMetadata from '../package.json';

beforeEach(async () => {
  useKernels(i18nTestUtilsKernel);

  addPlugin(TemplatePluginHelloWorldMetadata, TemplatePluginHelloWorld);
});

test('has "hello" content translated', () => {
  renderPOSComponent('HelloWorld');
  const contentNode = screen.getByText('T_hello');

  expect(contentNode).toBeInTheDocument();
});
