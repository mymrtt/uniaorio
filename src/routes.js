// Libs
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Components
import HumanitarianMap from './screens/HumanitarianMap';
import Grid from './screens/Grid';
// import Statistics from './screens/Statistics';

const Routes = () => (
	<BrowserRouter>
		<Switch>
			<Route exact path='/' component={HumanitarianMap} />
      <Route path='/statistics' component={Grid} />
			{/* <Route path='/statistics' component={Statistics} /> */}
		</Switch>
	</BrowserRouter>
);

export default Routes;
