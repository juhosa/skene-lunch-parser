import React from "react"

const Food = props => {
  return (
    <>
      <h3>Ruoka: {props.name}</h3>
      <ul>
        {props.osat.map(o => {
          return (
            <li style={{ listStyle: "none" }} key={o}>
              {o}
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default Food
