//import { ipcRenderer as ipc } from 'electron';
import React, { Component } from 'react';
import Modal from 'react-modal';
import {render} from "react-dom"

import Head from "./head/index.jsx"
import Form from "./form/index.jsx"

Modal.setAppElement('#App');

render([<Head/>, <Form />], document.getElementById('App'))