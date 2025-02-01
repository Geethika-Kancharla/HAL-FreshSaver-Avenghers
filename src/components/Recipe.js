import React from 'react'

const Recipe = ({ title, calories, image }) => {
    return (
        <div className='shadow-md p-5 px-9 '>
            <h1 className='font-bold text-xl text-center pb-4'>{title}</h1>
            <p className='text-lg text-center m-2'>Calories: {calories}</p>
            <img src={image} alt='' />
        </div>
    )
}

export default Recipe