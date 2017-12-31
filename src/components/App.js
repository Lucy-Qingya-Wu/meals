import React, { Component } from 'react'
import {connect} from "react-redux"
import {addRecipe, removeFromCalendar} from '../actions'
import {capitalize} from '../utils/helpers'
import CalendarIcon from 'react-icons/lib/fa/calendar-plus-o'
import Modal from 'react-modal'
import ArrowRightIcon from 'react-icons/lib/fa/arrow-circle-right'
import Loading from 'react-loading'
import { fetchRecipes } from '../utils/api'
import FoodList from './FoodList'
import ShoppingList from './ShoppingList'

class App extends Component {

  constructor(props){
  	super(props)
  	this.state={
  		foodModalOpen:false,
  		meal:null,
  		day:null,
  		food:null,
  		loadingFood:false,
  		ingredientsModalOpen: false

  	}
  }

  componentWillMount() {
	Modal.setAppElement('body');
  }

  openFoodModal = ({meal, day}) => {
  	this.setState(()=>({
  		foodModalOpen: true,
  		meal,
  		day
  	}))
  }

  closeFoodModal = () => {
  	this.setState(()=>({
  		foodModalOpen: false,
  		meal:null,
  		day:null
  	}))
  }

  searchFood = (e) => {
  	if (!this.input.value){
  		return
  	}
  	e.preventDefault()

  	this.setState(()=>({
  		loadingFood:true
  	}))

  	fetchRecipes(this.input.value).then((food)=>{
  		this.setState(()=>({food, loadingFood:false}))

  	})

  }

  openIngredientsModal = () => this.setState({ingredientsModalOpen: true})
  closeIngredientsModal = () => this.setState({ingredientsModalOpen: false})
  generateShoppingList = () => {
  	return this.props.calendar.reduce((result, {meals})=>{
  		const {breakfast, lunch, dinner} = meals
  		console.log("meals", meals)
  		breakfast && result.push(breakfast)
  		lunch && result.push(lunch)
  		dinner && result.push(dinner)
  		return result
  	}, [])
  	.reduce((final, {ingredientLines})=>final.concat(ingredientLines), [])


  }


  render() {


  	const {foodModalOpen, loadingFood, food, ingredientsModalOpen} = this.state

  	const {calendar, removeFromCalendar, addRecipe} = this.props
  	console.log("calendar", calendar)

  	const mealOrder = ['breakfast', 'lunch', 'dinner']

    return (
	    <div className='container'>
	    	<div className='nav'>
	    		<h1 className='header'>Meals</h1>
	    		<button
	    			className='ShoppingList'
	    			onClick={this.openIngredientsModal}
	    		>
	    		Shopping List
	    		</button>
	    	</div>

	        <ul className='meal-types'>
	          {mealOrder.map((mealType) => (
	            <li key={mealType} className='subheader'>
	              {capitalize(mealType)}
	            </li>
	          ))}
	        </ul>
	        <div className='calendar'>
		    	<div className='days'>
		    		 {calendar.map(({ day }) => <h3 key={day} className='subheader'>{capitalize(day)}</h3>)}
		    	</div>

		    	<div className='icon-grid'>

		    			{calendar.map(({day, meals})=>(

		    				<ul key={day}>

		    					{mealOrder.map((meal)=>(
		    						<li key={meal} className='meal'>

		    							{meals[meal]?
		    								  <div className='food-item'>
		    									<img src={meals[meal].image} alt={meals[meal].label}/>
		    									<button onClick={()=>removeFromCalendar({meal, day})}>Clear</button>
		    								  </div>
		    								: <button onClick={()=>this.openFoodModal({meal, day})} className='icon-btn'>
		    									<CalendarIcon size={30} />
		    								  </button>
		    							}


		    						</li>
		    					))}

		    				</ul>

		    			))}

		    	</div>
		    </div>

		    <Modal
		    	className='modal'
		    	overlayClassName='overlay'
		    	isOpen={foodModalOpen}
		    	onRequestClose={this.closeFoodModal}
		    	contentLabel='Modal'
		    >
			    <div>
			    	{loadingFood === true ?
			    		<Loading delay={200}
			    		         type='spin'
			    		         color='#222'
			    		         className='loading'
			    		/>
			    	    :<div>
			    	    	<h3 className='subheader'>
			    	    		Find a meal for {capitalize(this.state.day)} {this.state.meal}.
			    	    	</h3>
			    	    	<div className='search'>
			    	    		<input
			    	    			className='food-input'
			    	    			type='text'
			    	    			placeholder='Search Food'
			    	    			ref={(input)=>this.input=input}
			    	    		/>
			    	    		<button className='icon-btn' onClick={this.searchFood}>
			    	    			<ArrowRightIcon size={30}/>
			    	    		</button>
			    	    	</div>
			    	    	{food !== null && (

			    	    		<FoodList

			    	    			food={food}
			    	    			onSelect={(recipe)=>{
			    	    				addRecipe({recipe, day: this.state.day, meal: this.state.meal})
			    	    				this.closeFoodModal()
			    	    			}}/>)
			    	        }

			    	    </div>}
			    </div>

		    </Modal>
		    <Modal
		    	className='modal'
		    	overlayClassName='overlay'
		    	isOpen={ingredientsModalOpen}
		    	onRequestClose={this.closeIngredientsModal}
		    	contentLabel='Modal'
		    >
		    	{ingredientsModalOpen && <ShoppingList list={this.generateShoppingList()} />}
		    </Modal>
	    </div>)
  }
}
const mapStateToProps = ({food, calendar}) => {

	const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
	return {
		calendar : days.map((day)=>({

			day,

			meals : Object.keys(calendar[day]).reduce((meals, meal) => {

				meals[meal] = calendar[day][meal] ? food[calendar[day][meal]] : null

				return meals

			}, {})

		}))
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		addRecipe: (data) => dispatch(addRecipe(data)),
		removeFromCalendar: (data) => dispatch(removeFromCalendar(data))
	}
}

// We established previously that there is no way to directly interact with the store.
// We can either retrieve data by obtaining its current state, or change its state by
// dispatching an action (we only have access to the top and bottom component of the redux
// flow diagram shown previously).

// This is precisely what connect does. Consider this piece of code, which uses connect
// to map the stores state and dispatch to the props of a component

export default connect(mapStateToProps, mapDispatchToProps)(App)
