import React, { Component } from 'react';
import Modal from 'react-modal';
import { render } from "react-dom"

import { Header } from "./components/Header"
import { Content } from "./components/Content"

render([<Header />,<Content />], document.getElementById('App'))
