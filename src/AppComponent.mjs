import React from 'react';
import { BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

class App extends React.Component{

    constructor(props){
        super(props);
        this.state={apiResponse:""}
    }
    callAPI()
    {
        fetch("http://localhost:9000/api")
        .then(res=>res.text())
        .then(res=>this.setState({apiResponse:res}));
    }

    componentWillUnmount()
    {
        this.callAPI();
    }

    render()
    {
        return(
            <div>
                <p>{this.state.apiResponse}</p>
            </div>
        // <div className="ui container">
        // <BrowserRouter>
        //     <div>
        //     <MainPage/>
        //     <Switch>
        //         <Route exact path="/category/livenews"  component={MainPage} />
        //         {/* <Route exact path="/category/:categoryname"  component={CategoryPage} /> */}
        //     </Switch>
        //     </div>
        // </BrowserRouter>
        // </div>
        )
    }
  
};
