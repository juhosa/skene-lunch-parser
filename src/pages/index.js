import React, { useEffect, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import Food from "../components/Food"

import moment from "moment"
import "moment/locale/fi"

import styled from "styled-components"

const Button = styled.button`
  background-color: #d6dde4;
  border-radius: 4px;
  margin: 15px;
  padding-left: 15px;
  padding-right: 15px;
`

const STORAGE_KEY = "skeneparser-preferred-kitchenid"

moment.locale("fi")

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query MyQuery {
      allJuvenesLunch {
        nodes {
          restaurantId
          id
          KitchenName
          MealOptions {
            MenuItems {
              Name
            }
          }
          MenuDateISO
        }
      }
    }
  `)

  const [ruokat, setRuokat] = useState([])
  const [msg, setMsg] = useState("")
  const [restaurant, setRestaurant] = useState()
  const [menuDate, setMenuDate] = useState()

  useEffect(() => {
    // Check if preferred (the last searched) kitchenid is found on local storage
    // if not, default to 46 (skene)
    let kitchenid = localStorage.getItem(STORAGE_KEY)
    // the `+kitchenid` casts the string in to an int
    kitchenid = kitchenid !== null ? +kitchenid : 46
    loadFood(kitchenid)
  }, [])

  const loadFood = kitchenid => {
    localStorage.setItem(STORAGE_KEY, kitchenid)
    setRuokat([])
    setMsg("")
    let food = null
    for (let res of data.allJuvenesLunch.nodes) {
      if (res.restaurantId === kitchenid) {
        food = res.MealOptions
        setMenuDate(res.MenuDateISO)
        break
      }
    }

    if (food === null || food[0].MenuItems.length === 0) {
      setMsg(`${kitchenid === 46 ? "Skene" : "Kanali"} ei ruokatietoja!`)
      return
    }

    let tmpRuokat = []

    for (let f of food) {
      let d = { name: "", osat: [] }
      d.name = f.MenuItems[0].Name
      d.osat = f.MenuItems.slice(1).map(x => x.Name)
      tmpRuokat.push(d)
    }
    setRestaurant(kitchenid === 46 ? "Skene" : "Kanali")

    setRuokat(tmpRuokat)
  }

  return (
    <Layout>
      <SEO title="Home" />
      <Button onClick={() => loadFood(47)}>Lataa Kanalin ruoka</Button>
      <Button onClick={() => loadFood(46)}>Lataa Skenen ruoka</Button>
      {msg !== "" && <h2>{msg}</h2>}
      {ruokat.length > 0 && (
        <h2>
          {restaurant} - {moment(menuDate).format("dddd D.M.")}
        </h2>
      )}
      {ruokat.length > 0 &&
        ruokat.map((r, i) => {
          return <Food name={r.name} osat={r.osat} key={r.name + "_" + i} />
        })}
    </Layout>
  )
}

export default IndexPage
