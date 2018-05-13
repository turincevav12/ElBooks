import React, { Component } from "react";
import { ipcRenderer } from 'electron';
import { render } from "react-dom"
import styles from "./index.css"

export class Content extends Component{
    render(){
        return(
            <div id='form'>
            </div>
        )
    }
}