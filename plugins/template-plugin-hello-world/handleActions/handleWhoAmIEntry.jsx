/** @jsx jsxTAST */

import { Scope, buildTAST, Inline, jsxTAST } from '@pos-web/devkit-jsx-tast';

export const handleWhoAmIEntry = ({ storeHelper, dispatchersHelper }) => {
  storeHelper.handleAction(
    '@pos-web/terminals-helper/SEND_TERMINAL_ENTRY',
    ({ action, preventDefault }) => {
      const { terminalId, entry } = action;
      const cryptic = entry?.cryptic;

      if (cryptic === 'WHO AM I') {
        preventDefault();

        const tast = buildTAST(
          <Scope>
            <Inline inlineType="infoLink" action={{ toggleRef: 'terminalIdInline' }}>
              CLICK TO HIDE/SHOW THE TERMINAL ID
            </Inline>

            <Inline ref="terminalIdInline" isVisible={false}>
              <br />
              {terminalId}
            </Inline>
          </Scope>,
        );

        dispatchersHelper.dispatch('receiveTerminalResponse', {
          terminalId,
          response: {
            lineAddress: '49',
            entry,
            tast,
          },
        });
      }
    },
  );
};
