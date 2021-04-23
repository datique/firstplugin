import React, { useState, useEffect } from 'react';

const Covid = ({ storeHelper, selectorsHelper }) => {
    const [error] = useState(null);
    const [isLoaded] = useState(false);
    const [isLoadedDetails] = useState(false);
    const [details] = useState({});
    const [regions, setRegions] = useState([]);
    const [regionId] = useState('');
    const [hasPnr] = useState();


    useEffect(() => {
        console.log("mounted");
        getData();
    });



    const getPnr = () => {

        const state = storeHelper.getState();
        const getCurrentTerminalIdFactory = () => (state) => state.terminals.current.currentTerminalId;

        selectorsHelper.registerFactory('getCurrentTerminalId', getCurrentTerminalIdFactory);

        const getCurrentTerminalId = selectorsHelper.make('getCurrentTerminalId');

        const currentTerminalId = getCurrentTerminalId(state);

        console.debug("currentTerminalId:" + currentTerminalId)


        const getDefaultHostConnectionId = selectorsHelper.make('getDefaultHostConnectionId');
        const getTerminalHostConnectionId = selectorsHelper.make('getTerminalHostConnectionId');

        const hostConnectionId = getTerminalHostConnectionId(state, { currentTerminalId, }) || getDefaultHostConnectionId(state);



        const { activePNR } = state.plugins.pnrRetrieve || {};

        const currentPnr = activePNR[hostConnectionId];
        const airSegments = currentPnr.airSegments;
        console.log("Click!!");
    }

    const getData = () => {
        fetch("http://localhost:8081/regions")
            .then(res => res.json())
            .then(
                (result) => {
                    //console.log(result)
                    /*
                    this.setState({
                        isLoaded: true,
                        regions: result
                    });
                    */
                    setRegions(result);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )

    }



    return (
        <>
            <h1>Hello world!</h1>
            <select >
                <option key='a-0' selected='selected' value={''}>Select a Region</option>
                {regions.map(item => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>
            <span>{hasPnr}</span>
            <button onClick={getPnr}>Get PNR</button>
        </>
    )

}

export default Covid