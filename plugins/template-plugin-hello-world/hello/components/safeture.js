

class Covid extends React.Component {


    constructor({ props, storeHelper, selectorsHelper }) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            isLoadedDetails: false,
            details: {},
            regions: [],
            regionId: 'test'

        };



        this.storeHelper = storeHelper;
        this.selectorsHelper = selectorsHelper;

        console.log("storeHelper:" + storeHelper);

        const state = storeHelper.getState();
        const getCurrentTerminalIdFactory = () => (state) => state.terminals.current.currentTerminalId;

        selectorsHelper.registerFactory('getCurrentTerminalId', getCurrentTerminalIdFactory);

        const getCurrentTerminalId = selectorsHelper.make('getCurrentTerminalId');

        const currentTerminalId = getCurrentTerminalId(state);

        console.debug("currentTerminalId:" + currentTerminalId)
    }

    attach() {
        this.storeHelper.handleAction(
            '@orion/terminals-helper/SEND_TERMINAL_ENTRY',
            ({ action, preventDefault }) => {
                const { terminalId, entry } = action;
                const state = storeHelper.getState();
                const getDefaultHostConnectionId = selectorsHelper.make('getDefaultHostConnectionId');
                const getTerminalHostConnectionId = selectorsHelper.make('getTerminalHostConnectionId');
                const hostConnectionId =
                    getTerminalHostConnectionId(state, {
                        terminalId,
                    }) || getDefaultHostConnectionId(state);

                console.log("terminalId:" + terminalId);
                console.log("hostConnectionId:" + hostConnectionId);


                let cryptic = entry?.cryptic;

                if (cryptic === 'ER' || cryptic === 'E') {
                    const { activePNR } = state.plugins.pnrRetrieve || {};
                    const currentPnr = activePNR[hostConnectionId];
                    const dueOrPaidSegments = currentPnr.DueOrPaidSegment;

                    if (Object.entries(dueOrPaidSegments).length === 0) {
                        //preventDefault();

                        //calculateAndApplyRetention(entry, currentPnr, terminalId, hostConnectionId);

                        //sendCommand(entry, 'ER', terminalId, hostConnectionId);
                    }
                }
            },
        );

    }


    async componentDidMount() {





        const requestOptions = {
            method: 'GET',
            //mode: 'no-cors', // no-cors, *cors, same-origin
            headers: {

            },
            //body: '{"userid":"travelport.oufb.api","password":"hsTRvbIY63bGFDT63vb","authentication":"BASIC"}'
        }



        fetch("http://localhost:8081/regions")
            .then(res => res.json())
            .then(
                (result) => {
                    //console.log(result)
                    this.setState({
                        isLoaded: true,
                        regions: result
                    });
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

        /*
    const state = storeHelper.getState();
    const getCurrentTerminalIdFactory = () => (state) => state.terminals.current.currentTerminalId;
    
    selectorsHelper.registerFactory('getCurrentTerminalId', getCurrentTerminalIdFactory);
    
    const getCurrentTerminalId = selectorsHelper.make('getCurrentTerminalId');
    
    const currentTerminalId = getCurrentTerminalId(state);
    
    
    const hostConnection = { id: 'hostConnection-1', host: '1G' };
    
    console.log(this._dispatchersHelper);
    
    this._dispatchersHelper.dispatch('createHostConnection', { hostConnection });
    
    this._dispatchersHelper.dispatch('sendHostConnectionEntry', {
        hostConnectionId: 'hostConnection-1',
        entry: { cryptic: '' },
    });
    */
    }


    onRegionChangeHandler = (event) => {
        var regionId = event.target.value;
        this.setState({ regionId: regionId, isLoadedDetails: false });

        console.log(regionId);


        fetch("http://localhost:8081/region/" + regionId)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);

                    this.setState({
                        isLoadedDetails: true,
                        details: result
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.state({
                        isLoadedDetails: true,
                        error
                    });
                }
            )

    }

    onClickHandler = (event) => {
        //alert('onClickHandler');

        const { storeHelper, selectorsHelper } = this.props;

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

        if (currentPnr) {
            const airSegments = currentPnr.airSegments;
            console.log("Click!!");
        }
    }


    /*
    fetchData = () => {
        alert(this.state.regionId);
     
        fetch("http://localhost:8081/region/andorra")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        details: result.data
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.state({
                        isLoaded: true,
                        error
                    });
                }
            )
    }
    */


    render() {
        const { error, isLoaded, isLoadedDetails, details, regions, regionId } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    <div>
                        <input type='button' value='Send' onClick={this.onClickHandler} />
                    </div>

                    <div>

                        <select onChange={this.onRegionChangeHandler}>
                            <option key='a-0' selected='selected' value={''}>Select a Region</option>
                            {regions.map(item => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>



                    {(isLoaded && !isLoadedDetails) &&

                        <div style={{ display: isLoadedDetails ? "none" : "block" }}>
                            <h3>Loading details..</h3>
                        </div>
                    }

                    {isLoadedDetails &&
                        <div style={{ display: !isLoadedDetails ? "none" : "block" }}>
                            <div style={{ width: '965px' }} >
                                <h1>{details.regionid} ({details.trend.value}%)</h1>
                                <div dangerouslySetInnerHTML={{ __html: details.trend.description }} />
                                <br />

                                <div style={{ height: '200px', overflowY: 'scroll', borderColor: 'olive', borderStyle: 'solid', padding: '10px' }}>
                                    {details.data.map(data => (
                                        <div>
                                            <h1>{data.title.toUpperCase()}</h1>
                                            <div dangerouslySetInnerHTML={{ __html: data.description }} />
                                            <br />

                                        </div>
                                    ))}

                                </div>

                            </div>

                        </div>
                    }
                </div >
            );
        }

    }
}

export default Covid;