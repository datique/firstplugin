import React from 'react';
import Tabs from "./Tabs";

//import './Tabs.css'
//import icon from '/plugins/template-plugin-hello-world/hello/images/icon.jpg'


//require('../main.css')

class Covid extends React.Component {


    constructor({ props, storeHelper, selectorsHelper, diHelper, uiHelper }) {
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
            regionId: 'test',
            firstLoad: true,
            hasPnr: false,
            pnrOpened: false,
            windowOpened: false
        };


        var pnr = diHelper.get('PNR');
        console.log("PNR:" + pnr)


        const { POSComponent } = uiHelper;

        this._uiHelper = uiHelper;

        this._storeHelper = storeHelper;
        this._selectorsHelper = selectorsHelper;
        this._diHelper = diHelper;

        console.log("storeHelper:" + storeHelper);

        const hasPnrOpened = selectorsHelper.make('pnrOpened');
        console.log("PNR Opened:" + hasPnrOpened()); // 5

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
                        showLoading: false,

                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        showLoading: false,
                        error,


                    });
                }
            )
    }

    getRegion(regionId) {
        this.setState({ isLoadedDetails: false, firstLoad: false });

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
        this.setState({ isLoadedDetails: false });

        fetch("http://localhost:8081/regions/" + regionIds)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);

                    this.setState({
                        hasData: true,
                        data: result,
                        isLoadedDetails: true
                    });
                },
                (error) => {
                    this.setState({
                        hasData: false,
                        error,
                        isLoadedDetails: true
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

    onCloseWindowHandler = (event) => {
        this.setState({ windowOpened: false });

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
            this.setState({ hasPnr: true, windowOpened: true });
        }
        else {
            this.setState({ hasPnr: false, windowOpened: true });
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
            this.setState({ hasPnr: true });
        }
    }





    render() {

        const { POSComponent } = this._uiHelper;
        const { windowOpened, pnrLoaded, hasPnr, firstLoad, showLoading, error, isLoaded, isLoadedDetails, details, regions, regionId, hasData, data } = this.state;

        const test = this._diHelper.get('PNR');

        console.log("tst:" + test);
        console.log('windowOpened:' + windowOpened)

        const s = this._storeHelper.getState();

        const pnrState = s.plugins.pnrState || {};




        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (showLoading) {
            return <div>Loading...</div>;
        } else {
            return (

                <div>
                    <div>
                        {!windowOpened &&
                            <input type='image' height='35px' onClick={this.onClickHandler} src='https://cdn.travelport.com/mp3de74868bfa647c9b5a04aeb642948fc/MP3de74868-bfa6-47c9-b5a0-4aeb642948fc_general_thumbnail_192988.jpg' />
                        }
                        {windowOpened &&
                            <input type='button' value='Close' onClick={this.onCloseWindowHandler} style={{ float: 'right' }} />
                        }
                    </div>


                    {/*
                        windowOpened &&
                        <div>
                            <input type='button' value='Close' onClick={this.onCloseWindowHandler} style={{ float: 'right' }} />
                        </div>
                        */
                    }
                    {
                        windowOpened && !hasPnr &&
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
                    }


                    {
                        (!firstLoad && !isLoadedDetails) &&

                        <div style={{ display: isLoadedDetails ? "none" : "block" }}>
                            <h3>Loading details..</h3>
                        </div>
                    }

                    {
                        windowOpened && !hasPnr && isLoadedDetails &&
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
                        hasData && windowOpened &&

                        <div style={{ display: !hasData ? "none" : "block" }}>



                            <div>

                                <div style={{ height: '300px', overflow: 'scroll' }}>
                                    {
                                        <POSComponent componentName="Tabs">
                                            {data.map((region) => (
                                                <POSComponent componentName="Tabs.Tab" id={region.regionid} label={region.regionid} >
                                                    <POSComponent componentName="Tabs.TabPanel">
                                                        <h1>{region.regionid} ({region.trend.value}%)</h1>
                                                        <div dangerouslySetInnerHTML={{ __html: region.trend.description }} />

                                                        {region.data.map(d => (
                                                            <div>
                                                                <h2>{d.title}</h2>
                                                                <div dangerouslySetInnerHTML={{ __html: d.description }} />
                                                            </div>

                                                        ))}
                                                    </POSComponent>
                                                </POSComponent>
                                            ))}
                                        </POSComponent>



                                    }
                                </div>

                                {/*        
                                <Tabs>
                                    {data.map(region => (
                                        <div label={region.regionid}>
                                            <h1>{region.regionid} ({region.trend.value}%)</h1>
                                            <div dangerouslySetInnerHTML={{ __html: region.trend.description }} />

                                            {region.data.map(d => (
                                                <div>
                                                    <h2>{d.title}</h2>
                                                    <div dangerouslySetInnerHTML={{ __html: d.description }} />
                                                </div>

                                            ))}
                                        </div>
                                    ))}

                                </Tabs>
                                */
                                }

                            </div>


                        </div>





                    }
                </div >
            );
        }

    }
}

export default Covid;