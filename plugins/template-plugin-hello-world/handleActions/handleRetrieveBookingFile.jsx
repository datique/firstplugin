import React, { useState } from 'react';



export const handleRetrieveBookingFile = ({ storeHelper, selectorsHelper, diHelper }) => {
  //const [pnrLoaded, setPnrLoaded] = useState(false);



  const pnrOpened = () => {
    return {
      type: 'OPENED'
    };
  };

  const pnrStateReducer = (state = 'NONE', action) => {
    switch (action.type) {
      case 'OPENED':
        return "OPENED";

      case "CLOSED":
        return "CLOSED";

      default:
        return "DONE";
    }
  };



  storeHelper.registerReducer('pnrState', pnrStateReducer);


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

      if (currentPnr) {
        if (airSegments) {
          if (Object.entries(airSegments).length > 0) {

            console.log('air segments found');
            selectorsHelper.registerFactory('pnrOpened', ({ PNR }) => () => PNR);

            diHelper.useValue('PNR', true);

            storeHelper.dispatch(pnrOpened());

          }
        }

        if (hotelSegments) {
          if (Object.entries(hotelSegments).length > 0) {
            console.log('hotel segments found');
          }
        }
      }
    }
  });

};
