

class Covid extends React.Component {


    constructor({ props, storeHelper, selectorsHelper }) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            isLoadedDetails: false,
            hasData: false,
            details: {},
            regions: [],
            data: [],
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




    async componentDidMount() {
        const requestOptions = {
            method: 'GET',
            headers: {
            }
        }


        fetch("http://localhost:8081/allregions")
            .then(res => res.json())
            .then(
                (result) => {
                    //console.log(result)
                    this.setState({
                        isLoaded: true,
                        regions: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    getRegion(regionId) {
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
                (error) => {
                    this.setState({
                        isLoadedDetails: true,
                        error
                    });
                }
            )
    }

    getRegions(regionIds) {
        fetch("http://localhost:8081/regions/" + regionIds)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);

                    this.setState({
                        hasData: true,
                        data: result
                    });
                },
                (error) => {
                    this.setState({
                        hasData: false,
                        error
                    });
                }
            )
    }

    onRegionChangeHandler = (event) => {
        var regionId = event.target.value;
        this.setState({ regionId: regionId, isLoadedDetails: false });

        console.log(regionId);

        this.getRegion(regionId);


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


            this.getSegmentData(airSegments);

        }
    }

    getSegmentData(airSegments) {
        var countryCodes = [];

        for (var key in airSegments) {
            if (airSegments.hasOwnProperty(key)) {
                var segment = airSegments[key];
                var code = segment.originZone.countryCode;

                if (!countryCodes.includes(code))
                    countryCodes.push(code);

                code = segment.destinationZone.countryCode;

                if (!countryCodes.includes(code))
                    countryCodes.push(code);

                console.log(key + " -> " + segment);
            }
        }

        console.log(countryCodes.join());

        if (countryCodes && countryCodes.length > 0) {
            this.getRegions(countryCodes.join());
        }
    }





    render() {
        const { error, isLoaded, isLoadedDetails, details, regions, regionId, hasData, data } = this.state;

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
                                <option key={item.regionid} value={item.regionid}>
                                    {item.region}
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

                    {hasData &&
                        <div style={{ display: !hasData ? "none" : "block" }}>
                            {data.map(region => (
                                <div>
                                    <h1>{region.regionid}</h1>

                                    <div dangerouslySetInnerHTML={{ __html: region.trend.description }} />
                                    <br />

                                </div>
                            ))}
                        </div>

                    }
                </div >
            );
        }

    }
}

export default Covid;