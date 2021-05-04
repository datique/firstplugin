const pnrStateReducer = (state = 'NONE', action) => {
    switch (action.type) {
        case 'OPENED':
            return "OPENED";

        case "CLOSED":
            return "CLOSED";

        default:
            return "NONE";
    }

}

export default pnrStateReducer;