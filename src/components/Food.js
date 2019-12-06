import React from "react"

const Food = props => {
  return (
    <>
      <h3>Ruoka: {props.name}</h3>
      <ul>
        {props.osat.map((o, i) => {
          return (
            <li style={{ listStyle: "none" }} key={o + "_" + i}>
              {o}
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default Food
