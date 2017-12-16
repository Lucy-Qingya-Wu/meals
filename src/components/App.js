import React, { Component } from 'react'
import {connect} from "react-redux"
import {addRecipe, removeFromCalendar} from '../actions'
class App extends Component {

  render() {
  	console.log(this.props)
    return (
	    <div>
	    	Hello World
	    </div>
    )
  }
}
const mapStateToProps = (calendar) => {

	const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
	return {
		calendar : days.map((day)=>({

			day,
			meals : Object.keys(calendar[day]).reduce((meals, meal) => {

				meals[meal] = calendar[day][meal] ? calendar[day][meal] : null

				return meals

			}, {})

		}))
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		addRecipe : (data) => dispatch(addRecipe(data)),
		removeFromCalendar : (data) => dispatch(removeFromCalendar(data))
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
