import React, { useState, useEffect } from 'react';

export const handleRetrieveBookingFile = ({ storeHelper, selectorsHelper }) => {
  //const [hasPnr] = useState(false);

  const state = storeHelper.getState();
  const getCurrentTerminalIdFactory = () => (state) => state.terminals.current.currentTerminalId;

  selectorsHelper.registerFactory('getCurrentTerminalId', getCurrentTerminalIdFactory);

  const getCurrentTerminalId = selectorsHelper.make('getCurrentTerminalId');

  const currentTerminalId = getCurrentTerminalId(state);

  console.debug("currentTerminalId:" + currentTerminalId)



  storeHelper.handleAction('@pos-web/terminals-helper/SEND_TERMINAL_ENTRY', ({ action }) => {
    const { terminalId, entry } = action;
    const state = storeHelper.getState();
    const getDefaultHostConnectionId = selectorsHelper.make('getDefaultHostConnectionId');
    const getTerminalHostConnectionId = selectorsHelper.make('getTerminalHostConnectionId');
    const hostConnectionId =
      getTerminalHostConnectionId(state, {
        terminalId,
      }) || getDefaultHostConnectionId(state);

    const cryptic = entry?.cryptic;
    if (cryptic === '*R' || (cryptic.startsWith('*') && cryptic.length === 7)) {
      const { activePNR } = state.plugins.pnrRetrieve || {};
      const currentPnr = activePNR[hostConnectionId];
      const airSegments = currentPnr.airSegments;
      const hotelSegments = currentPnr.hotelSegments;
      if (Object.entries(airSegments).length > 0) {
        console.log('air segments found');
        // this.setState({
        //  hasPnr: true
        //});
      }

      if (Object.entries(hotelSegments).length > 0) {
        console.log('hotel segments found');
      }
    }
  });

};
