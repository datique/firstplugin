import React from 'react';
import Tabs from "./Tabs";
//import icon from '/plugins/template-plugin-hello-world/hello/images/icon.jpg'


//require('../main.css')

class Covid extends React.Component {


    constructor({ props, storeHelper, selectorsHelper }) {
        super(props);
        this.state = {
            showLoading: false,
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

        this.setState({ showLoading: true });

        fetch("http://localhost:8081/allregions")
            .then(res => res.json())
            .then(
                (result) => {
                    //console.log(result)
                    this.setState({
                        isLoaded: true,
                        regions: result,
                        showLoading: false
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        showLoading: false,
                        error

                    });
                }
            )
    }

    getRegion(regionId) {
        this.setState({ showLoading: true });

        fetch("http://localhost:8081/region/" + regionId)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);

                    this.setState({
                        isLoadedDetails: true,
                        details: result,
                        showLoading: false
                    });
                },
                (error) => {
                    this.setState({
                        isLoadedDetails: true,
                        error,
                        showLoading: false
                    });
                }
            )
    }

    getRegions(regionIds) {
        this.setState({ showLoading: true });

        fetch("http://localhost:8081/regions/" + regionIds)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);

                    this.setState({
                        hasData: true,
                        data: result,
                        showLoading: false
                    });
                },
                (error) => {
                    this.setState({
                        hasData: false,
                        error,
                        showLoading: false
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
        const { showLoading, error, isLoaded, isLoadedDetails, details, regions, regionId, hasData, data } = this.state;



        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (showLoading) {
            return <div>Loading...</div>;
        } else {
            return (




                < div >


                    <div>
                        <input type='image' height='35px' onClick onClick={this.onClickHandler} src='https://cdn.travelport.com/mp3de74868bfa647c9b5a04aeb642948fc/MP3de74868-bfa6-47c9-b5a0-4aeb642948fc_general_thumbnail_192988.jpg' />
                        {/*<input type='button' value='Send' onClick={this.onClickHandler} src='https://cdn.travelport.com/mp3de74868bfa647c9b5a04aeb642948fc/MP3de74868-bfa6-47c9-b5a0-4aeb642948fc_general_thumbnail_192988.jpg' /> */}
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



                    {
                        (isLoaded && !isLoadedDetails) &&

                        <div style={{ display: isLoadedDetails ? "none" : "block" }}>
                            <h3>Loading details..</h3>
                        </div>
                    }

                    {
                        isLoadedDetails &&
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

                    {
                        hasData &&

                        <div style={{ display: !hasData ? "none" : "block" }}>
                            {/*
                            <Tabs>
                                {data.map(region => (

                                    <Tabs.Tab id={region.regionid} label={region.regionid}>
                                        <Tabs.TabPanel>
                                            <div dangerouslySetInnerHTML={{ __html: region.trend.description }} />
                                        </Tabs.TabPanel>
                                    </Tabs.Tab>
                                ))}
                            </Tabs>
                            */}

                            <div>

                                <Tabs>
                                    {data.map(region => (
                                        <div label={region.regionid}>
                                            <div dangerouslySetInnerHTML={{ __html: region.trend.description }} />
                                        </div>
                                    ))}

                                </Tabs>
                            </div>


                        </div>





                    }
                </div >
            );
        }

    }
}

export default Covid;