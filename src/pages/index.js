import React, { useEffect, useState } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import Food from "../components/Food"

import moment from "moment"

import styled from "styled-components"

const Button = styled.button`
  background-color: #d6dde4;
  border-radius: 4px;
  margin: 15px;
  padding-left: 15px;
  padding-right: 15px;
`

const IndexPage = () => {
  const [ruokat, setRuokat] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState("")
  const [restaurant, setRestaurant] = useState()

  useEffect(() => {
    loadFood(46)
  }, [])

  const loadFood = kitchenid => {
    setLoading(true)
    setRestaurant(kitchenid === 46 ? "Skene" : "Kanali")
    let week = moment().week()
    let day = moment().day()
    // console.log({ week }, { day })
    // console.log("painettu")
    // Porin Skenen kitchenid on 46
    // Rauman Kanalin kitchenid on 47
    fetch(
      `https://www.juvenes.fi/DesktopModules/Talents.LunchMenu/LunchMenuServices.asmx/GetMenuByWeekday?KitchenId=${kitchenid}&MenuTypeId=60&Week=${week}&Weekday=${day}&lang=%27fi%27&format=json`
    )
      .then(r => {
        r.json().then(j => {
          let parsed = JSON.parse(j["d"])
          let itemit = parsed["MealOptions"].map(x => x["MenuItems"])
          let lol = []
          for (let ite of itemit) {
            let d = { name: "", osat: [] }
            let nimi_saatu = false
            for (let kte of ite) {
              let name = kte["Name"]
              if (name === "") {
                continue
              }
              if (!nimi_saatu) {
                d.name = name
                nimi_saatu = true
              } else {
                d.osat.push(name)
              }
            }
            lol.push(d)
          }
          if (lol.length === 0) {
            setMsg(`${kitchenid === 46 ? "Skene" : "Kanali"} ei ruokatietoja!`)
            setRuokat([])
            setLoading(false)
          } else {
            setRuokat([...ruokat, lol])
            setMsg("")
            setLoading(false)
          }
        })
      })
      .catch(e => {
        console.log(e)
      })
  }
  return (
    <Layout>
      <SEO title="Home" />
      <Button onClick={() => loadFood(47)}>Lataa Kanalin ruoka</Button>
      <Button onClick={() => loadFood(46)}>Lataa Skenen ruoka</Button>
      {loading && <h2>ladataan...</h2>}
      {msg !== "" && <h2>{msg}</h2>}
      {!loading && ruokat.length > 0 && <h2>{restaurant}</h2>}
      {!loading &&
        ruokat.length > 0 &&
        ruokat[0].map(r => {
          return <Food name={r.name} osat={r.osat} key={r.name} />
        })}
    </Layout>
  )
}

export default IndexPage
