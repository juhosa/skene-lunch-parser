const moment = require("moment")
const axios = require("axios")

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  options
) => {
  const restaurants = [{ id: 46, name: "Skene" }, { id: 47, name: "Kanali" }]
  let week = moment().week()
  let day = moment().day()

  for (let res of restaurants) {
    const data = await axios(
      `https://www.juvenes.fi/DesktopModules/Talents.LunchMenu/LunchMenuServices.asmx/GetMenuByWeekday?KitchenId=${res.id}&MenuTypeId=60&Week=${week}&Weekday=${day}&lang=%27fi%27&format=json`
    ).catch(err => {
      console.error(err)
    })
    const d = JSON.parse(data.data.d)
    const node = {
      ...d,
      restaurantId: res.id,
      id: createNodeId(`JuvenesLunch-${res.id}`),
      internal: {
        type: "JuvenesLunch",
        contentDigest: createContentDigest(data.data.d),
      },
    }
    actions.createNode(node)
  }
}
