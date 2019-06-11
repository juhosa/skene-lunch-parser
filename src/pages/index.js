import React, { useEffect, useState } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import Food from "../components/Food"

import moment from "moment"

const IndexPage = () => {
  const [ruokat, setRuokat] = useState([])

  useEffect(() => {
    btnClick()
  }, [])

  const btnClick = () => {
    let week = moment().week()
    let day = moment().day()
    // console.log({ week }, { day })
    // console.log("painettu")
    fetch(
      `https://www.juvenes.fi/DesktopModules/Talents.LunchMenu/LunchMenuServices.asmx/GetMenuByWeekday?KitchenId=46&MenuTypeId=60&Week=${week}&Weekday=${day}&lang=%27fi%27&format=json`
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
          setRuokat([...ruokat, lol])
        })
      })
      .catch(e => {
        console.log(e)
      })
  }
  return (
    <Layout>
      <SEO title="Home" />
      <button onClick={btnClick}>Hae ruoat</button>
      {ruokat.length > 0 &&
        ruokat[0].map(r => {
          return <Food name={r.name} osat={r.osat} key={r.name} />
        })}
    </Layout>
  )
}

export default IndexPage
