import {configureStore} from '@reduxjs/toolkit'
import userReducer  from './userSlice'
import statReducer from './statSlice'

const appStore = configureStore({
    reducer:{
        user:userReducer,
        stats:statReducer
    }
})

export default appStore