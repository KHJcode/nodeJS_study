import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from '../../../_actions/user_action';
import { response } from 'express';

export default function (SpecificComponent, option, adminRoute = null) {
    const dispatch = useDispatch();

    function AuthenticationCheck(props) {
        useEffect(() => {
            dispatch(auth()).then(response => {
                console.log(response);
            });
        }, [])
    }

    return AuthenticationCheck;
}