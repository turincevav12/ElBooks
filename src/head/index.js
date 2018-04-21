import React,{ Component } from "react";
import { render } from "react-dom";
import "./index.css"
import "../fontawesome-free-5.0.10/web-fonts-with-css/css/fontawesome-all.css"

class Head extends Component {
    render() {
        return(
            <div className="head">
                <div id="icon" onClick={IconClick}>
                    <i class="fas fa-book fa-2x"></i>
                    <span id="icon-text">ElBook</span>
                </div>

                <div id="close" onClick={CloseWindow}>
                    <i class="far fa-times-circle fa-2x"></i>
                </div>
            </div>  
        )
    }    
}

function IconClick(){
    
}

function CloseWindow(){
    alert('Close')
}


export default Head 