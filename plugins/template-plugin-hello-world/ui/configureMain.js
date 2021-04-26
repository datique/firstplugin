export function configureMain({ uiHelper }) {
  /*uiHelper.addChildToComponent('Home', {*/
  uiHelper.addChildToComponent('Main', {
    componentName: 'HelloWorld',
    order: 3,
    props: { position: 'HEADER' },
    /*props: {
      noWindow: false,
      windowProps: {
        defaultHeaderProps: {
          title: 'C19 Plugin',
        },
      },
      showHeader: true,
      disabled: false,
      isCollapsed: false
    }
    */
  });
}
