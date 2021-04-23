export function configureMain({ uiHelper }) {
  uiHelper.addChildToComponent('Main', {
    componentName: 'HelloWorld',
    order: 3,
    props: { position: 'HEADER' },
  });
}
