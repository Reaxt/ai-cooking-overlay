import "./style.css"

import { client } from "./rpc.ts"
import { Donation } from "../server/types.ts"
import { confetti } from "tsparticles-confetti"
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

const donationsToProcess: Donation[] = []
let isProcessingDonos = false

client.webhook.subscribe(undefined, {
  onData(webhook) {
    if (webhook.donation != null) {
      addDonation(webhook.donation)
    }
  },
})
const donationAmountText = document.querySelector(".donationAmount")

const donoTest: Donation = {
  id: "moeww",
  donator: "mamnko",
  amount: 20,
  message: "heheoho",
  full: false,
  reward: {
    id: "kjf",
    name: "shcoker",
    description: "eho",
    cost: 20,
  },
  rewardText: "yep",
  target: null,
  poll: null,
}
document.onclick = (x) => {
  addDonation(donoTest)
}

function addDonation(donation: Donation) {
  donationsToProcess.push(donation)
  if (!isProcessingDonos) {
    processDonos()
  }
}
async function processDonos() {
  isProcessingDonos = true
  const donationToProcess = donationsToProcess.shift()
  if (donationToProcess == undefined) {
    isProcessingDonos = false
    return
  }
  await donationNotifiation(donationToProcess)
  await delay(1000)
  const msg = new SpeechSynthesisUtterance(donationToProcess.message!)
  msg.onend = async (x) => {
    const container = document.querySelector(".Notifications")!
    container.classList.remove("slideinClass")
    await delay(1000)
    container.classList.add("slideoutClass")
    if (donationsToProcess.length > 0) {
      processDonos()
    } else {
      isProcessingDonos = false
    }
  }
  speechSynthesis.speak(msg)
}
async function donationNotifiation(donation: Donation) {
  const donationAmountText = document.querySelector(".donationAmount")
  const donatorName = document.querySelector(".donorName")
  const donationMessage = document.querySelector(".Notifications p")
  const reward = document.querySelector(".rewardText")
  const container = document.querySelector(".Notifications")
  if (donationAmountText != null) {
    donationAmountText.textContent = donation.amount.toString()
  }
  if (donatorName != null) {
    donatorName.textContent = donation.donator
  }
  if (donationMessage != null && donation.message != null) {
    donationMessage.textContent = donation.message
  }
  if (reward != null && donation.reward != null) {
    reward.textContent = donation.reward.name
  }
  let pos = { x: 0, y: 0 }
  if (container != null) {
    container.classList.remove("slideoutClass")
    container.classList.add("slideinClass")
    await delay(125)
    const rect = container.getBoundingClientRect()
    const root = document.body.getBoundingClientRect()
    console.log(`${rect.x} ${rect.y} `)
    pos = {
      x: (rect.x + rect.width / 2) / root.width,
      y: (rect.y + rect.height * 0.15) / root.height,
    }
  }

  console.log(pos)
  confetti({
    spread: 200,
    ticks: 200,
    gravity: 1,
    decay: 0.94,
    startVelocity: 10,
    particleCount: 100,
    scalar: 5,
    shapes: ["image"],
    origin: pos,
    shapeOptions: {
      image: [
        {
          src: "https://particles.js.org/images/fruits/apple.png",
          width: 100,
          height: 100,
        },
        {
          src: "https://particles.js.org/images/fruits/avocado.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://particles.js.org/images/fruits/banana.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://particles.js.org/images/fruits/berries.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://particles.js.org/images/fruits/cherry.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://particles.js.org/images/fruits/grapes.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://particles.js.org/images/fruits/lemon.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://particles.js.org/images/fruits/orange.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://particles.js.org/images/fruits/peach.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://particles.js.org/images/fruits/pear.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://particles.js.org/images/fruits/pepper.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://particles.js.org/images/fruits/plum.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://particles.js.org/images/fruits/star.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://particles.js.org/images/fruits/strawberry.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://particles.js.org/images/fruits/watermelon.png",
          width: 32,
          height: 32,
        },
        {
          src: "https://particles.js.org/images/fruits/watermelon_slice.png",
          width: 32,
          height: 32,
        },
      ],
    },
  })
  return
}
