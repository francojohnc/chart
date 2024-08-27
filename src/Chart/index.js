import React from 'react';
import Bar from "./bar";
import RadarChart from "./radar";
import Doughnut from "./doughnut";
import Line from "./line";
import Pie from "./pie";
import Polar from "./polar";



function Chart() {

    return (
        <>
            <div style={{display:"flex"}}>
                <Bar/>
                <Line/>
                <Pie/>
            </div>
            <div style={{display: "flex"}}>
                <Doughnut/>
                <Polar/>
                <RadarChart/>
            </div>
        </>

    );
}

export default Chart;
